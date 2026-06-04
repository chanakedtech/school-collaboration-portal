import { useEffect, useState } from "react";

import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import Spinner from "../../components/Spinner.jsx";

export default function Submissions() {
  const { user } = useAuth();
  const canGrade = ["teacher", "class_teacher"].includes(user?.role);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [grading, setGrading] = useState({}); // { [id]: score string }
  const [gradeError, setGradeError] = useState("");

  useEffect(() => {
    api.get("/submissions/")
      .then(({ data }) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load submissions."))
      .finally(() => setLoading(false));
  }, []);

  async function handleGrade(id) {
    const grade = grading[id];
    if (!grade) return;
    setGradeError("");
    try {
      const { data } = await api.patch(`/submissions/${id}/grade/`, { grade });
      setItems((prev) => prev.map((s) => (s.id === id ? data : s)));
      setGrading((prev) => { const next = { ...prev }; delete next[id]; return next; });
    } catch (err) {
      const d = err.response?.data;
      setGradeError(d ? Object.values(d).flat().join(" ") : "Could not save grade.");
    }
  }

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Workspace</p>
        <h2>Submissions</h2>
      </div>

      {loading && <Spinner />}
      {error && <div className="error-box">{error}</div>}
      {gradeError && <div className="error-box">{gradeError}</div>}
      {!loading && !error && items.length === 0 && (
        <EmptyState icon="📝" message="No submissions yet." />
      )}
      {!loading && !error && items.length > 0 && (
        <ul className="resource-list">
          {items.map((item) => (
            <li key={item.id} className="resource-item">
              <div className="resource-item-main">
                <span className="resource-item-title">
                  {item.assignment_title || `Assignment #${item.assignment}`}
                </span>
                <span className="resource-item-meta">
                  {item.student_name || `Student #${item.student}`}
                </span>
              </div>
              <p className="resource-item-body submission-content">{item.answer_text}</p>
              <div className="submission-footer">
                {item.grade ? (
                  <span className="score-badge">Grade: {item.grade}</span>
                ) : canGrade ? (
                  <div className="grade-row">
                    <input
                      type="text"
                      placeholder="Grade"
                      className="grade-input"
                      value={grading[item.id] ?? ""}
                      onChange={(e) => setGrading((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    />
                    <button className="btn-primary btn-sm" onClick={() => handleGrade(item.id)}>
                      Save grade
                    </button>
                  </div>
                ) : (
                  <span className="score-badge score-badge--pending">Not graded</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
