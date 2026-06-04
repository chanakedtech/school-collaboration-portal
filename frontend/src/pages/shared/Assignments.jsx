import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import Spinner from "../../components/Spinner.jsx";

const BLANK = { title: "", description: "", due_date: "", subject: "" };

function SubmitForm({ assignmentId, onSubmitted }) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await api.post("/submissions/", { assignment: assignmentId, answer_text: text });
      onSubmitted(data);
    } catch (err) {
      const d = err.response?.data;
      setError(d ? Object.values(d).flat().join(" ") : "Could not submit.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="submit-form" onSubmit={handleSubmit}>
      {error && <div className="error-box">{error}</div>}
      <textarea
        className="submit-textarea"
        rows={3}
        placeholder="Write your answer…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <button className="btn-primary btn-sm" disabled={saving}>
        {saving ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}

export default function Assignments() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";
  const canWrite = ["teacher", "class_teacher"].includes(user?.role);

  const [items, setItems] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [submissions, setSubmissions] = useState({}); // { [assignmentId]: submission }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(BLANK);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({}); // { [assignmentId]: bool }

  useEffect(() => {
    if (!user) return;

    const requests = [
      api.get("/assignments/"),
      canWrite ? api.get("/subjects/") : Promise.resolve({ data: [] }),
      isStudent ? api.get("/submissions/") : Promise.resolve({ data: [] }),
    ];

    Promise.all(requests)
      .then(([a, s, sub]) => {
        setItems(Array.isArray(a.data) ? a.data : []);
        setSubjects(Array.isArray(s.data) ? s.data : []);
        if (isStudent) {
          const map = {};
          (Array.isArray(sub.data) ? sub.data : []).forEach((s) => {
            map[s.assignment] = s;
          });
          setSubmissions(map);
        }
      })
      .catch(() => setError("Could not load assignments."))
      .finally(() => setLoading(false));
  }, [user]);

  function updateField(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const { data } = await api.post("/assignments/", form);
      setItems((prev) => [data, ...prev]);
      setForm(BLANK);
      setShowForm(false);
    } catch (err) {
      const d = err.response?.data;
      setFormError(d ? Object.values(d).flat().join(" ") : "Could not create assignment.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await api.delete(`/assignments/${id}/`);
      setItems((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError("Could not delete assignment.");
    }
  }

  function handleSubmitted(assignmentId, submission) {
    setSubmissions((prev) => ({ ...prev, [assignmentId]: submission }));
    setExpanded((prev) => ({ ...prev, [assignmentId]: false }));
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>Assignments</h2>
        </div>
        {canWrite && (
          <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "+ New Assignment"}
          </button>
        )}
      </div>

      {canWrite && showForm && (
        <form className="resource-form" onSubmit={handleCreate}>
          {formError && <div className="error-box">{formError}</div>}
          <label>
            Title
            <input name="title" value={form.title} onChange={updateField} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={updateField} rows={3} />
          </label>
          <div className="form-row">
            <label>
              Due date
              <input name="due_date" type="date" value={form.due_date} onChange={updateField} required />
            </label>
            <label>
              Subject
              <select name="subject" value={form.subject} onChange={updateField} required>
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </label>
          </div>
          <button className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Create Assignment"}</button>
        </form>
      )}

      {loading && <Spinner />}
      {error && <div className="error-box">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <EmptyState icon="📋" message="No assignments yet." />
      )}
      {!loading && !error && items.length > 0 && (
        <ul className="resource-list">
          {items.map((item) => {
            const existing = submissions[item.id];
            const isOpen = expanded[item.id];

            return (
              <li key={item.id} className="resource-item">
                <div className="resource-item-main">
                  <span className="resource-item-title">{item.title}</span>
                  <span className="resource-item-meta">Due: {item.due_date ? item.due_date.slice(0, 10) : "—"}</span>
                </div>
                <p className="resource-item-body">{item.description}</p>

                {isStudent && (
                  <div className="submission-footer">
                    {existing ? (
                      <span className="score-badge">
                        {existing.grade ? `Grade: ${existing.grade}` : "Submitted — awaiting grade"}
                      </span>
                    ) : (
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => setExpanded((prev) => ({ ...prev, [item.id]: !isOpen }))}
                      >
                        {isOpen ? "Cancel" : "Submit Answer"}
                      </button>
                    )}
                  </div>
                )}

                {isStudent && !existing && isOpen && (
                  <SubmitForm
                    assignmentId={item.id}
                    onSubmitted={(sub) => handleSubmitted(item.id, sub)}
                  />
                )}

                {canWrite && (
                  <button className="btn-icon-danger" onClick={() => handleDelete(item.id)} title="Delete">
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
