import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

export default function AssignmentCreatePage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    due_date: "",
  });

  useEffect(() => {
    api.get("/subjects/").then(({ data }) => setSubjects(data));
  }, []);

  function validate() {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required.";
    if (!form.description.trim()) errors.description = "Description is required.";
    if (!form.subject) errors.subject = "Subject is required.";
    if (!form.due_date) errors.due_date = "Due date is required.";
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      await api.post("/assignments/", form);
      navigate("/teacher/assignments");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create assignment.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Teacher</p>
        <h2>Create Assignment</h2>
      </div>

      {error && <div className="error-box">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} />
          {fieldErrors.title && <div className="error-box">{fieldErrors.title}</div>}
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" rows={4} value={form.description} onChange={handleChange} />
          {fieldErrors.description && <div className="error-box">{fieldErrors.description}</div>}
        </div>

        <div>
          <label>Subject</label>
          <select name="subject" value={form.subject} onChange={handleChange}>
            <option value="">-- Select subject --</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {fieldErrors.subject && <div className="error-box">{fieldErrors.subject}</div>}
        </div>

        <div>
          <label>Due Date</label>
          <input type="datetime-local" name="due_date" value={form.due_date} onChange={handleChange} />
          {fieldErrors.due_date && <div className="error-box">{fieldErrors.due_date}</div>}
        </div>

        <button type="submit" disabled={submitting} style={{ marginTop: "1rem" }}>
          {submitting ? "Creating..." : "Create Assignment"}
        </button>
      </form>
    </section>
  );
}
