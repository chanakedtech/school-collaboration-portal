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
      <div className="auth-page-content">
        <h2>Welcome Back</h2>
        <p>Access your school collaboration portal to manage assignments, connect with students and parents, and streamline communication.</p>
      </div>
      <div className="auth-card-wrap">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">School Collaboration Portal</p>
            <h1>Sign in</h1>
          </div>

          {error && <div className="error-box">{error}</div>}

          <label>
            Email address
            <input 
              value={email} 
              onChange={(event) => setEmail(event.target.value)} 
              type="email" 
              placeholder="you@example.com"
              required 
              disabled={loading}
            />
          </label>

          <label>
            Password
            <input 
              value={password} 
              onChange={(event) => setPassword(event.target.value)} 
              type="password" 
              placeholder="••••••••"
              required 
              disabled={loading}
            />
          </label>

          <button disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <a href="/register">Don't have an account? Create one</a>
        </form>
      </div>
    </main>
  );
}

