"use client";

import { useState, FormEvent } from "react";

type Submission = {
  id: string;
  fullName: string;
  dob: string;
  address: string;
  phone: string;
  country: string;
  city: string;
  nextOfKin: string;
  photo: string;
  signature: string;
  submittedAt: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      setSubmissions(data.submissions || []);
      setAuthed(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  if (!authed) {
    return (
      <div className="container">
        <div className="floral-corner top-left" />
        <div className="card login-card">
          <h1>Admin access</h1>
          <p className="subtitle">Enter the admin password to view KYC submissions.</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Checking…" : "View submissions"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <div className="floral-corner top-left" />
      <div className="admin-header">
        <div>
          <h1>KYC submissions</h1>
          <p className="subtitle" style={{ marginBottom: 0 }}>
            {submissions.length} record{submissions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setAuthed(false);
            setPassword("");
            setSubmissions([]);
          }}
        >
          Log out
        </button>
      </div>

      {submissions.length === 0 ? (
        <div className="card empty-state">
          <p>No submissions yet.</p>
        </div>
      ) : (
        <div className="submission-list">
          {submissions.map((s) => (
            <div key={s.id} className="submission-card">
              <h3>{s.fullName}</h3>
              <p className="meta">Submitted {formatDate(s.submittedAt)}</p>

              <dl className="detail-grid">
                <div>
                  <dt>Date of birth</dt>
                  <dd>{s.dob}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{s.phone}</dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>{s.address}</dd>
                </div>
                <div>
                  <dt>City</dt>
                  <dd>{s.city}</dd>
                </div>
                <div>
                  <dt>Country</dt>
                  <dd>{s.country}</dd>
                </div>
                <div>
                  <dt>Next of kin</dt>
                  <dd>{s.nextOfKin}</dd>
                </div>
              </dl>

              <div className="media-row">
                <div className="media-item">
                  <p>Photo</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.photo} alt={`Photo of ${s.fullName}`} />
                </div>
                <div className="media-item">
                  <p>Signature</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.signature} alt={`Signature of ${s.fullName}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
