import { useEffect, useState } from "react";
import api from "../../api/client";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/announcements/")
      .then(({ data }) => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(() => setError("Could not load announcements. Check your permissions."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Workspace</p>
        <h2>Announcements</h2>
      </div>

      {loading && <div className="empty-state">Loading announcements...</div>}
      {error && <div className="error-box">{error}</div>}
      {!loading && !error && announcements.length === 0 && (
        <div className="empty-state">No announcements yet.</div>
      )}
      {!loading && !error && announcements.length > 0 && (
        <ul className="announcements-list">
          {announcements.map((item) => (
            <li key={item.id} className="announcement-item">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
