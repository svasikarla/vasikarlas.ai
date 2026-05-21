'use server';

export async function getVercelProjects() {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) {
    console.warn('VERCEL_API_TOKEN is not set. Returning empty list.');
    return { projects: [] };
  }

  try {
    const teamId = process.env.VERCEL_TEAM_ID;
    const url = new URL('https://api.vercel.com/v9/projects');
    if (teamId) {
      url.searchParams.append('teamId', teamId);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`
      },
      // Revalidate every 60 seconds to avoid spamming the API
      next: { revalidate: 60 } 
    });

    if (!res.ok) {
      console.error(`Failed to fetch Vercel projects: ${res.status} ${res.statusText}`);
      return { error: `Vercel API Error: ${res.status}` };
    }

    const data = await res.json();
    return { projects: data.projects || [] };
  } catch (error) {
    console.error('Error fetching Vercel projects:', error);
    return { error: error.message };
  }
}
