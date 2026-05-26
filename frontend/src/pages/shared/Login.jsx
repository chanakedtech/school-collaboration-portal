import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext.jsx";
import { dashboardByRole } from "../../auth/roles";

export default function Login() {
  const [email, setEmail] = useState("platform.admin@demo.school");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(email, password);
      navigate(dashboardByRole[user.role] || "/profile");
    } catch {
      setError("Login failed. Check the email, password, and backend server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <span className="auth-brand-icon">🏫</span>
          <span className="auth-brand-name">SchoolPortal</span>
        </div>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>
        {error && <div className="error-box">{error}</div>}
        <label>
          Email address
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required autoComplete="current-password" />
        </label>
        <button disabled={loading}>
          {loading ? <span className="btn-loading"><span className="spinner spinner--sm" />Signing in…</span> : "Sign in"}
        </button>
        <p className="auth-footer">New here? <a href="/register">Create a training account</a></p>
      </form>
    </main>
  );
}

