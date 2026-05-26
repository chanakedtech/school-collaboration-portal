import { useEffect, useState } from "react";

import api from "../../api/client";
import EmptyState from "../../components/EmptyState.jsx";
import Spinner from "../../components/Spinner.jsx";

export default function ParentChildren() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    api.get("/parent/children/")
      .then(({ data }) => setChildren(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load children."))
      .finally(() => setLoading(false));
  }, []);

  function toggle(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">My Children</p>
          <h2>Children</h2>
        </div>
      </div>

      {loading && <Spinner />}
      {error && <div className="error-box">{error}</div>}
      {!loading && !error && children.length === 0 && (
        <EmptyState icon="👨‍👩‍👧" message="No linked children found." />
      )}

      {!loading && !error && children.map((child) => (
        <div key={child.id} className="resource-item" style={{ marginBottom: "1rem" }}>
          <div className="resource-item-main">
            <span className="resource-item-title">{child.student_name}</span>
            <span className="resource-item-meta">
              {child.classroom_name} &middot; {child.admission_number}
            </span>
          </div>

          <button
            className="btn-primary btn-sm"
            style={{ marginTop: "0.5rem" }}
            onClick={() => toggle(child.id)}
          >
            {expanded[child.id] ? "Hide Assignments" : "View Assignments"}
          </button>

          {expanded[child.id] && (
            <ul className="resource-list" style={{ marginTop: "0.75rem" }}>
              {child.assignments.length === 0 && (
                <EmptyState icon="📋" message="No assignments for this child." />
              )}
              {child.assignments.map((a) => (
                <li key={a.id} className="resource-item">
                  <div className="resource-item-main">
                    <span className="resource-item-title">{a.title}</span>
                    <span className="resource-item-meta">
                      {a.subject_name} &middot; Due: {a.due_date ? a.due_date.slice(0, 10) : "—"}
                    </span>
                  </div>
                  <p className="resource-item-body">{a.description}</p>
                  <div className="submission-footer">
                    {a.submission ? (
                      <>
                        <span className="score-badge">
                          {a.submission.grade ? `Grade: ${a.submission.grade}` : "Submitted — not graded"}
                        </span>
                        {a.submission.feedback && (
                          <p className="resource-item-body" style={{ marginTop: "0.25rem" }}>
                            Feedback: {a.submission.feedback}
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="score-badge score-badge--pending">Not submitted</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
