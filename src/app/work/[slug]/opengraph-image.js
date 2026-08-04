import { ImageResponse } from 'next/og';
import { PROJECTS } from '@/data/projects';

export const alt = 'Vasikarla · AI | Case Study';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const project = PROJECTS.find((p) => p.id === slug);

  const title = project ? project.name : (slug ? slug.replace(/-/g, ' ').toUpperCase() : 'VASIKARLA · AI');
  const tagline = project ? project.tagline : 'AI Product Case Study & Architecture Breakdown';
  const category = project ? project.category : 'AI / Full Stack';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          backgroundColor: '#0c0c11',
          backgroundImage:
            'radial-gradient(1100px 520px at 75% -10%, rgba(139,124,255,0.22), transparent 60%)',
          fontFamily: 'sans-serif',
          color: '#f5f5f7',
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '2px', color: '#cfcfe0' }}>
              VASIKARLA · AI
            </span>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 600, color: '#8b7cff', backgroundColor: 'rgba(139,124,255,0.12)', padding: '6px 16px', borderRadius: '20px' }}>
            {category}
          </span>
        </div>

        {/* Dynamic Center Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h1 style={{ fontSize: '64px', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.1 }}>
            {title}
          </h1>
          <p style={{ fontSize: '28px', color: '#a7a7b4', margin: 0, maxWidth: '960px' }}>
            {tagline}
          </p>
        </div>

        {/* Footer Tagline */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: '28px',
          }}
        >
          <span style={{ fontSize: '20px', color: '#94a3b8' }}>
            Production AI Systems &amp; Case Studies
          </span>
          <span style={{ fontSize: '20px', fontWeight: 600, color: '#38bdf8' }}>
            vasikarlas-ai.vercel.app ↗
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
