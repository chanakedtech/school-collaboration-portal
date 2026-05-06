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
        <p className="eyebrow">School Collaboration Portal</p>
        <h1>Sign in</h1>
        {error && <div className="error-box">{error}</div>}
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </label>
        <button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        <a href="/register">Create a training account</a>
      </form>
    </main>
  );
}

