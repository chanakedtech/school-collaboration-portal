import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext.jsx";
import { dashboardByRole } from "../../auth/roles";
import api from "../../api/client";

export default function Register() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", role: "student" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      // Register the user
      await api.post("/auth/register/", form);
      
      // Automatically log in the user
      const user = await login(form.email, form.password);
      
      // Navigate to dashboard based on role
      navigate(dashboardByRole[user.role] || "/profile");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-page-content">
        <h2>Join Us</h2>
        <p>Create your account to get started with the School Collaboration Portal. Sign up as a student, teacher, parent, or administrator.</p>
      </div>
      <div className="auth-card-wrap">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div>
            <p className="eyebrow">Create Account</p>
            <h1>Register</h1>
          </div>

          {error && <div className="error-box">{error}</div>}
          {message && <div className="success-box">{message}</div>}

          <label>
            First name
            <input 
              name="first_name" 
              value={form.first_name} 
              onChange={updateField} 
              placeholder="John"
              required 
              disabled={loading} 
            />
          </label>

          <label>
            Last name
            <input 
              name="last_name" 
              value={form.last_name} 
              onChange={updateField} 
              placeholder="Doe"
              required 
              disabled={loading} 
            />
          </label>

          <label>
            Email address
            <input 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={updateField} 
              placeholder="you@example.com"
              required 
              disabled={loading} 
            />
          </label>

          <label>
            Role
            <select name="role" value={form.role} onChange={updateField} disabled={loading}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="class_teacher">Class Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </label>

          <label>
            Password
            <input 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={updateField} 
              placeholder="••••••••"
              required 
              disabled={loading} 
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          <a href="/login">Already have an account? Sign in</a>
        </form>
      </div>
    </main>
  );
}

