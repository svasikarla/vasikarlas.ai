import { STATUS_LABELS } from '@/data/projects';

export default function StatusPill({ status }) {
  return (
    <span className={`pill ${status}`}>
      <span className="d" aria-hidden="true" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}
