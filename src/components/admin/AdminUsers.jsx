import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line, RiFileCopyLine, RiKey2Line, RiUserAddLine } from "react-icons/ri";
import { adminApi } from "../../utils/adminApi";

// Super admin only: who can sign in to the CMS. New admins get a temporary password and must
// choose their own the first time they log in.

const when = (date) => (date ? new Date(date).toLocaleString() : "Never");

// Shown once after adding an admin or resetting a password.
const Credentials = ({ creds, onClose }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`Email: ${creds.email}\nTemporary password: ${creds.password}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="au-creds" role="status">
      <strong>{creds.title}</strong>
      <dl>
        <dt>Email</dt>
        <dd>{creds.email}</dd>
        <dt>Temporary password</dt>
        <dd><code>{creds.password}</code></dd>
      </dl>
      <p>
        Share these with them privately. They will be asked to choose their own password when they log in. This
        password is not shown again.
      </p>
      <div className="au-creds__actions">
        <button type="button" className="pe-btn" onClick={copy}>
          <RiFileCopyLine /> {copied ? "Copied" : "Copy details"}
        </button>
        <button type="button" className="pe-btn" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
};

const AdminUsers = ({ me, showToast }) => {
  const [admins, setAdmins] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState({ email: "", name: "", password: "" });
  const [formError, setFormError] = useState("");
  const [adding, setAdding] = useState(false);
  const [creds, setCreds] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let alive = true;
    adminApi("/auth/admins").then((r) => {
      if (!alive) return;
      if (r.ok) setAdmins(r.data.admins);
      else setLoadError(r.error);
    });
    return () => {
      alive = false;
    };
  }, []);

  const add = async (e) => {
    e.preventDefault();
    if (adding) return;
    setAdding(true);
    setFormError("");
    const result = await adminApi("/auth/admins", { method: "POST", body: form });
    setAdding(false);
    if (!result.ok) return setFormError(result.error);
    setAdmins((list) => [...(list || []), result.data.admin]);
    setCreds({ title: "Admin added", email: result.data.admin.email, password: result.data.temporaryPassword });
    setForm({ email: "", name: "", password: "" });
    showToast(`${result.data.admin.email} can now log in.`);
  };

  const reset = async (admin) => {
    if (!window.confirm(`Give ${admin.email} a new temporary password? They will be signed out and must choose a new password at their next login.`)) return;
    setBusyId(admin.id);
    const result = await adminApi(`/auth/admins/${admin.id}/reset-password`, { method: "POST" });
    setBusyId(null);
    if (!result.ok) return showToast(result.error);
    setAdmins((list) => list.map((a) => (a.id === admin.id ? result.data.admin : a)));
    setCreds({ title: "Password reset", email: admin.email, password: result.data.temporaryPassword });
  };

  const remove = async (admin) => {
    if (!window.confirm(`Remove ${admin.email}? They lose access to the CMS immediately.`)) return;
    setBusyId(admin.id);
    const result = await adminApi(`/auth/admins/${admin.id}`, { method: "DELETE" });
    setBusyId(null);
    if (!result.ok) return showToast(result.error);
    setAdmins((list) => list.filter((a) => a.id !== admin.id));
    showToast(`${admin.email} removed.`);
  };

  return (
    <div className="au">
      <form className="au-add glass-panel" onSubmit={add}>
        <h3><RiUserAddLine /> Add an admin</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="au-email">Email *</label>
            <input
              id="au-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setFormError("");
              }}
              placeholder="name@company.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="au-name">Name</label>
            <input id="au-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Optional" />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="au-password">Temporary password</label>
          <input
            id="au-password"
            type="text"
            autoComplete="off"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setFormError("");
            }}
            placeholder="Leave empty to generate a secure one"
          />
        </div>
        {formError && <div className="pw-error" role="alert">{formError}</div>}
        <button type="submit" className="btn-primary au-add__btn" disabled={adding} aria-busy={adding}>
          <RiUserAddLine /> {adding ? "ADDING…" : "ADD ADMIN"}
        </button>
      </form>

      {creds && <Credentials creds={creds} onClose={() => setCreds(null)} />}

      <div className="au-list glass-panel">
        <h3>Admins with access</h3>
        {!admins && !loadError && <p className="au-muted">Loading…</p>}
        {loadError && <div className="pw-error" role="alert">{loadError}</div>}
        {admins && (
          <ul>
            {admins.map((a) => {
              const isMe = a.id === me?.id;
              const isSuper = a.role === "superadmin";
              return (
                <li key={a.id} className="au-row">
                  <div className="au-row__who">
                    <strong>{a.name || a.email}</strong>
                    {a.name && <span>{a.email}</span>}
                  </div>
                  <div className="au-row__tags">
                    <span className={`au-tag ${isSuper ? "is-super" : ""}`}>{isSuper ? "Super admin" : "Admin"}</span>
                    {a.mustChangePassword && <span className="au-tag is-pending">Must set password</span>}
                    {isMe && <span className="au-tag">You</span>}
                  </div>
                  <div className="au-row__meta">
                    <span>Last login: {when(a.lastLoginAt)}</span>
                    {a.createdBy && <span>Added by {a.createdBy}</span>}
                  </div>
                  <div className="au-row__actions">
                    {!isSuper && (
                      <>
                        <button type="button" className="pe-btn" onClick={() => reset(a)} disabled={busyId === a.id}>
                          <RiKey2Line /> Reset password
                        </button>
                        <button type="button" className="pe-btn danger" onClick={() => remove(a)} disabled={busyId === a.id}>
                          <RiDeleteBin6Line /> Remove
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
