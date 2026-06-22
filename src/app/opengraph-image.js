import { ImageResponse } from 'next/og';
import { PROFILE } from '@/data/projects';

export const alt = 'Vasikarla · AI — AI Product Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
          <div style={{ fontSize: '66px', fontWeight: 800, lineHeight: 1.08, color: '#ffffff', maxWidth: '960px' }}>
            I build AI products that solve real business workflows.
          </div>
          <div style={{ fontSize: '30px', color: '#a7a7b4' }}>
            {`AI Product Engineer · ${PROFILE.specializations.slice(0, 4).join(' · ')}`}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '40px', fontSize: '24px', color: '#c8c8d4' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{PROFILE.stats.projects}</span>
            <span>shipped</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{PROFILE.stats.deploys}</span>
            <span>deploys</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{`${PROFILE.stats.uptime}%`}</span>
            <span>uptime</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
