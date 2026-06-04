import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";

export default function SubmitAssignmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get(`/assignments/${id}/`)
      .then(({ data }) => setAssignment(data))
      .catch(() => setError("Could not load assignment."));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/submissions/", { assignment: id, answer_text: answerText });
      setSuccess(true);
      setTimeout(() => navigate("/student/assignments"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Submission failed. You may have already submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Student</p>
        <h2>{assignment ? assignment.title : "Loading assignment..."}</h2>
      </div>

      {assignment && (
        <p style={{ marginBottom: "1rem" }}>{assignment.description}</p>
      )}

      {error && <div className="error-box">{error}</div>}
      {success && <div className="empty-state">Submitted! Redirecting...</div>}

      {!success && (
        <form onSubmit={handleSubmit}>
          <textarea
            rows={6}
            placeholder="Write your answer here..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </section>
  );
}
