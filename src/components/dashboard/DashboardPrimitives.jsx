import { FileText, Plus } from "lucide-react";

export function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <small>Live shared state</small>
    </div>
  );
}

export function MissionCard({ mission, blockers, onOpen }) {
  return (
    <button className="mission-row" onClick={() => onOpen(mission)}>
      <div className="mission-info">
        <strong>{mission.title}</strong>
        <span>
          {mission.client} · {mission.location} · {mission.date}{" "}
          {mission.startTime || mission.time || ""}
        </span>
      </div>
      <span
        className={`status-pill ${blockers.length ? "status-warning" : "status-success"}`}
      >
        {blockers.length
          ? `${blockers.length} blocker${blockers.length > 1 ? "s" : ""}`
          : mission.status}
      </span>
      <span className="mission-open-label">Open mission workspace →</span>
    </button>
  );
}

export function Empty({ text }) {
  return <div className="empty-state">{text}</div>;
}

export function DocumentIcon() {
  return <FileText aria-hidden="true" />;
}

export function AddIcon() {
  return <Plus aria-hidden="true" />;
}
