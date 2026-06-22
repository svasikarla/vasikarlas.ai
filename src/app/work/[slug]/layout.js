import { PROJECTS } from '@/data/projects';

// Server component (no 'use client') so it can export generateMetadata —
// the colocated opengraph-image.js auto-supplies the social card for this route.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);

  if (!project) {
    return { title: 'Project not found — Vasikarla · AI' };
  }

  const title = `${project.name} — ${project.tagline}`;
  const description =
    project.caseStudy?.problem?.slice(0, 200) || project.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/work/${project.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function CaseStudyLayout({ children }) {
  return children;
}
