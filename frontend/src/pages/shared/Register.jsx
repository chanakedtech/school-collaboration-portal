import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

import api from "../../api/client";

export default function Register() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", role: "student" });
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await api.post("/auth/register/", form);
      setMessage("Account created! You can now sign in.");
    } catch {
      setError("Registration failed. Please check your details and try again.");
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
            <p className="eyebrow">Training account</p>
            <h1>Create account</h1>
          </div>

          {message && <div className="success-box">{message}</div>}
          {error && <div className="error-box">{error}</div>}

          <label>
            First name
            <input name="first_name" value={form.first_name} onChange={updateField} required autoComplete="given-name" />
          </label>

          <label>
            Last name
            <input name="last_name" value={form.last_name} onChange={updateField} required autoComplete="family-name" />
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" />
          </label>

          <label>
            Role
            <select name="role" value={form.role} onChange={updateField}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="class_teacher">Class Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </label>

          <label>
            Password
            <div className="input-wrap">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={updateField}
                required
                autoComplete="new-password"
              />
              <button type="button" className="toggle-pw" onClick={() => setShowPw((v) => !v)} aria-label="Toggle password">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button type="submit" disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
