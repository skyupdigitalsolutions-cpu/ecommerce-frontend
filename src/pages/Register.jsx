import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { errMsg } from "../api/client";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card">
        <h1>Create account</h1>
        <p className="auth-sub">Start sending designs to press.</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field"><label>Name</label><input className="input" value={form.name} onChange={set("name")} required /></div>
          <div className="field"><label>Email</label><input className="input" type="email" value={form.email} onChange={set("email")} required /></div>
          <div className="field"><label>Password</label><input className="input" type="password" value={form.password} onChange={set("password")} required minLength={6} /></div>
          <div className="field"><label>Phone (optional)</label><input className="input" value={form.phone} onChange={set("phone")} /></div>
          <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
        </form>
        <p className="auth-alt">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
