import { PROJECTS } from '@/data/projects';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vasikarlas-ai.vercel.app';

export default function sitemap() {
  const staticRoutes = [
    '',
    '/about',
    '/work',
    '/projects',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const projectRoutes = PROJECTS.map((project) => ({
    url: `${SITE_URL}/work/${project.id}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly',
    priority: project.flagship ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
