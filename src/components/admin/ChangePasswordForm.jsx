import React, { useState } from "react";
import { RiCheckLine } from "react-icons/ri";
import { adminApi, saveAdminSession } from "../../utils/adminApi";

// Current + new + confirm password. Used on the first-login screen (temporary password) and in the
// "Change password" window. On success the server returns a fresh token, which replaces the old one.
const ChangePasswordForm = ({ onDone, currentLabel = "Current password", submitLabel = "Update password", autoFocus = false }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const rules = [
    { ok: next.length >= 8, label: "8+ characters" },
    { ok: /[A-Za-z]/.test(next), label: "a letter" },
    { ok: /[0-9]/.test(next), label: "a number" },
  ];

  const edit = (setter) => (e) => {
    setter(e.target.value);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!rules.every((r) => r.ok)) return setError("The new password needs at least 8 characters, a letter and a number.");
    if (next !== confirm) return setError("The two new passwords don't match.");
    if (next === current) return setError("Choose a password different from the current one.");

    setBusy(true);
    const result = await adminApi("/auth/change-password", { method: "POST", body: { currentPassword: current, newPassword: next } });
    setBusy(false);
    if (!result.ok) return setError(result.error);

    saveAdminSession(result.data.token, result.data.admin);
    onDone(result.data.admin);
  };

  const type = show ? "text" : "password";

  return (
    <form onSubmit={submit} className="pw-form">
      <div className="form-group">
        <label htmlFor="pw-current">{currentLabel}</label>
        <input id="pw-current" type={type} required autoFocus={autoFocus} autoComplete="current-password" value={current} onChange={edit(setCurrent)} />
      </div>
      <div className="form-group">
        <label htmlFor="pw-new">New password</label>
        <input id="pw-new" type={type} required autoComplete="new-password" value={next} onChange={edit(setNext)} />
        <ul className="pw-rules" aria-label="Password requirements">
          {rules.map((r) => (
            <li key={r.label} className={r.ok ? "ok" : ""}>
              <RiCheckLine aria-hidden="true" /> {r.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="form-group">
        <label htmlFor="pw-confirm">Confirm new password</label>
        <input id="pw-confirm" type={type} required autoComplete="new-password" value={confirm} onChange={edit(setConfirm)} />
      </div>

      <label className="pw-show">
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show passwords
      </label>

      {error && (
        <div className="pw-error" role="alert">
          {error}
        </div>
      )}

      <button type="submit" className="btn-primary pw-submit" disabled={busy} aria-busy={busy}>
        <span>{busy ? "SAVING…" : submitLabel}</span>
      </button>
    </form>
  );
};

export default ChangePasswordForm;
