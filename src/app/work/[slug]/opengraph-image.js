import { ImageResponse } from 'next/og';
import { PROJECTS } from '@/data/projects';

export const alt = 'Vasikarla · AI case study';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const STATUS = {
  live: { label: 'LIVE', color: '#4ade80' },
  beta: { label: 'BETA', color: '#fbbf24' },
  wip: { label: 'WIP', color: '#60a5fa' },
  archived: { label: 'ARCHIVED', color: '#9a9aa6' },
};

export default async function Image({ params }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.id === slug);

  const name = project?.name || 'Vasikarla · AI';
  const tagline = project?.tagline || 'AI Product Engineer';
  const stack = (project?.stack || []).slice(0, 5);
  const status = STATUS[project?.status] || STATUS.live;
  const nameSize = name.length > 13 ? 68 : 86;

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
            'radial-gradient(1100px 500px at 80% -10%, rgba(139,124,255,0.18), transparent 60%)',
          fontFamily: 'sans-serif',
          color: '#f5f5f7',
        }}
      >
        {/* Top: brand + status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#8b7cff' }} />
            <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '2px', color: '#cfcfe0' }}>
              VASIKARLA · AI
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: status.color,
              border: `1px solid ${status.color}`,
              borderRadius: '999px',
              padding: '8px 20px',
            }}
          >
            {status.label}
          </div>
        </div>

        {/* Middle: name + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: `${nameSize}px`, fontWeight: 800, lineHeight: 1.05, color: '#ffffff' }}>
            {name}
          </div>
          <div style={{ fontSize: '34px', lineHeight: 1.3, color: '#a7a7b4', maxWidth: '900px' }}>
            {tagline}
          </div>
        </div>

        {/* Bottom: stack chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {stack.map((s) => (
            <div
              key={s}
              style={{
                display: 'flex',
                fontSize: '22px',
                color: '#c8c8d4',
                backgroundColor: '#1a1a22',
                border: '1px solid #2c2c36',
                borderRadius: '8px',
                padding: '8px 18px',
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
