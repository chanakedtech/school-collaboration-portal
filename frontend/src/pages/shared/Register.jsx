import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext.jsx";
import { dashboardByRole } from "../../auth/roles";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register/", form);
      const user = await login(form.email, form.password);
      navigate(dashboardByRole[user.role] || "/");
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(" ") : "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Training account</p>
        <h1>Register</h1>
        {error && <div className="error-box">{error}</div>}
        <label>
          First name
          <input name="first_name" value={form.first_name} onChange={updateField} required />
        </label>
        <label>
          Last name
          <input name="last_name" value={form.last_name} onChange={updateField} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} required />
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
          <input name="password" type="password" value={form.password} onChange={updateField} required />
        </label>
        <button disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>
        <a href="/login">Back to login</a>
      </form>
    </main>
  );
}

