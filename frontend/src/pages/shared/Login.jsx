import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../auth/AuthContext.jsx";
import { dashboardByRole } from "../../auth/roles";

export default function Login() {
  const [email, setEmail] = useState("platform.admin@demo.school");
  const [password, setPassword] = useState("Password123!");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(email, password);
      navigate(dashboardByRole[user.role] || "/profile");
    } catch {
      setError("Login failed. Check your email, password, and that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-brand-panel">
        <div className="brand-logo"><GraduationCap size={28} /> SchoolPortal</div>
        <p className="brand-tagline">
          A collaborative platform connecting students, teachers, parents, and administrators in one place.
        </p>
      </div>

      <div className="auth-form-panel">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>Sign in</h1>
          </div>

          {error && <div className="error-box">{error}</div>}

          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required autoComplete="email" />
          </label>

          <label>
            Password
            <div className="input-wrap">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
              />
              <button type="button" className="toggle-pw" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>

          <p className="auth-footer">
            No account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
