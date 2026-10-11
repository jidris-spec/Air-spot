import { useState } from "react";
import { X } from "lucide-react";

export function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PilotForm({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    availability: "Available",
  });
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    const result = onSave(form);
    if (result) setError(result);
  };
  return (
    <Modal title="Add pilot" onClose={onClose}>
      <form onSubmit={submit} className="form-grid">
        <label>
          Name
          <input
            autoFocus
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <small>Required</small>
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <small>Must be unique, case-insensitive</small>
        </label>
        <label>
          Availability
          <select
            value={form.availability}
            onChange={(e) => setForm({ ...form, availability: e.target.value })}
          >
            <option>Available</option>
            <option>Unavailable</option>
            <option>On mission</option>
          </select>
        </label>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button">Save pilot</button>
        </div>
      </form>
    </Modal>
  );
}

export function CredentialForm({ pilotId, onClose, onSave }) {
  const [form, setForm] = useState({
    kind: "certificate",
    name: "",
    expiryDate: "",
  });
  return (
    <Modal title="Record credential" onClose={onClose}>
      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(form);
        }}
      >
        <label>
          Record type
          <select
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value })}
          >
            <option value="certificate">Credential</option>
            <option value="insurance">Insurance</option>
          </select>
        </label>
        <label>
          Name or provider
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          Expiry date
          <input
            type="date"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          />
          <small>Leave blank to keep it visibly unassessed.</small>
        </label>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button">Save record</button>
        </div>
      </form>
    </Modal>
  );
}
