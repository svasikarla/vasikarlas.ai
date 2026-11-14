import 'server-only';
import { PROJECTS } from '@/data/projects';

/* Enriches the known projects with their latest production deploy date from
   the Vercel API. It never adds projects: what appears on the site is decided
   by src/data/projects.js alone. Without VERCEL_API_TOKEN (or on any API
   error) the static `shipped` values are used unchanged. */

function toYearMonth(ms) {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

async function fetchShipDates() {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) return {};

  const url = new URL('https://api.vercel.com/v9/projects');
  url.searchParams.set('limit', '100');
  if (process.env.VERCEL_TEAM_ID) url.searchParams.set('teamId', process.env.VERCEL_TEAM_ID);

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return {};
    const data = await res.json();
    const dates = {};
    for (const vp of data.projects || []) {
      const prod =
        vp.targets?.production ||
        (vp.latestDeployments || []).find((d) => d.target === 'production');
      if (prod?.readyState === 'READY' && prod.createdAt) {
        dates[vp.name] = toYearMonth(prod.createdAt);
      }
    }
    return dates;
  } catch {
    return {};
  }
}

/** PROJECTS with `shipped` refreshed from Vercel where available. */
export async function getProjects() {
  const dates = await fetchShipDates();
  return PROJECTS.map((p) => {
    const live = p.vercel ? dates[p.vercel] : null;
    // Only ever move the date forward; a failed or rolled-back deploy must not hide real history.
    return live && (!p.shipped || live > p.shipped) ? { ...p, shipped: live } : p;
  });
}
