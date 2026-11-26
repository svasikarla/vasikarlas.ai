import { ImageResponse } from 'next/og';
import { PROFILE, getPortfolioFacts } from '@/data/projects';

export const alt = 'Vasikarla · AI — AI Product Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  const facts = getPortfolioFacts();
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
            'radial-gradient(1100px 520px at 75% -10%, rgba(139,124,255,0.20), transparent 60%)',
          fontFamily: 'sans-serif',
          color: '#f5f5f7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#8b7cff' }} />
          <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '2px', color: '#cfcfe0' }}>
            VASIKARLA · AI
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '54px', fontWeight: 800, lineHeight: 1.12, color: '#ffffff', maxWidth: '1040px' }}>
            {PROFILE.headline}
          </div>
          <div style={{ fontSize: '30px', color: '#a7a7b4' }}>
            {`${PROFILE.role} · ${PROFILE.specializations.slice(0, 3).join(' · ')}`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '40px', fontSize: '24px', color: '#c8c8d4' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{facts.products}</span>
            <span>shipped products</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{facts.flagships}</span>
            <span>case studies</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
