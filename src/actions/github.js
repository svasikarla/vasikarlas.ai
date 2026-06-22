'use server';

/* Real GitHub activity for the /work console — replaces the previously
   hardcoded telemetry feed. Public data needs no auth, but a GITHUB_TOKEN
   (optional) lifts the rate limit from 60 to 5,000 requests/hour. */

const USER = 'svasikarla';

function ghHeaders() {
  const h = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

function timeAgo(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function shortRepo(name) {
  return name.includes('/') ? name.split('/')[1] : name;
}

function describeEvent(ev) {
  const repo = shortRepo(ev.repo.name);
  const p = ev.payload || {};
  switch (ev.type) {
    case 'PushEvent': {
      const n = p.size ?? p.distinct_size ?? (p.commits ? p.commits.length : 1);
      const msg = p.commits && p.commits.length ? p.commits[p.commits.length - 1].message.split('\n')[0] : null;
      return { kind: 'push', label: `${n} commit${n === 1 ? '' : 's'} → ${repo}`, detail: msg };
    }
    case 'PullRequestEvent':
      return { kind: 'pr', label: `${p.action || 'updated'} PR → ${repo}`, detail: p.pull_request?.title || null };
    case 'CreateEvent':
      return { kind: 'create', label: `created ${p.ref_type || 'ref'}${p.ref ? ` ${p.ref}` : ''} → ${repo}`, detail: null };
    case 'DeleteEvent':
      return { kind: 'delete', label: `deleted ${p.ref_type || 'ref'} → ${repo}`, detail: null };
    case 'IssuesEvent':
      return { kind: 'issue', label: `${p.action || 'updated'} issue → ${repo}`, detail: p.issue?.title || null };
    case 'WatchEvent':
      return { kind: 'star', label: `starred ${repo}`, detail: null };
    default:
      return { kind: 'event', label: `${ev.type.replace('Event', '')} → ${repo}`, detail: null };
  }
}

export async function getGithubData() {
  try {
    const [eventsRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`, {
        headers: ghHeaders(),
        next: { revalidate: 300 },
      }),
      fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, {
        headers: ghHeaders(),
        next: { revalidate: 600 },
      }),
    ]);

    if (!eventsRes.ok || !reposRes.ok) {
      return { error: `GitHub API ${eventsRes.status}/${reposRes.status}` };
    }

    const rawEvents = await eventsRes.json();
    const repos = await reposRes.json();

    const events = rawEvents.slice(0, 6).map((ev) => ({
      id: ev.id,
      time: timeAgo(ev.created_at),
      ...describeEvent(ev),
    }));

    // Language breakdown across public repos
    const counts = {};
    for (const r of repos) if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const languages = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, n]) => ({ name, count: n, pct: Math.round((n / total) * 100) }));

    return {
      events,
      languages,
      repoCount: repos.length,
      lastActive: rawEvents.length ? timeAgo(rawEvents[0].created_at) : null,
    };
  } catch (err) {
    console.error('getGithubData failed:', err?.message || err);
    return { error: 'failed' };
  }
}
