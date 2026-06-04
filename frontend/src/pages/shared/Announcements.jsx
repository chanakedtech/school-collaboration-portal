import { useEffect, useState } from "react";

import api from "../../api/client";
import EmptyState from "../../components/EmptyState.jsx";
import Spinner from "../../components/Spinner.jsx";

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/announcements/")
      .then(({ data }) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load announcements."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">School updates</p>
        <h2>Announcements</h2>
      </div>

      {loading && <Spinner />}
      {error && <div className="error-box">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <EmptyState icon="📢" message="No announcements yet." />
      )}
      {!loading && !error && items.length > 0 && (
        <ul className="announcement-list">
          {items.map((item) => (
            <li key={item.id} className="announcement-item">
              <div className="announcement-meta">
                <span className="announcement-title">{item.title}</span>
                {item.target_role && (
                  <span className="role-badge">{item.target_role.replace("_", " ")}</span>
                )}
              </div>
              <p className="announcement-body">{item.message}</p>
              <time className="announcement-date">
                {new Date(item.created_at).toLocaleDateString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
