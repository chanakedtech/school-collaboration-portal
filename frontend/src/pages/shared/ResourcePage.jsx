import { useEffect, useState } from "react";

import api from "../../api/client";
import DataTable from "../../components/DataTable.jsx";
import LoadingState from "../../components/LoadingState.jsx";

export default function ResourcePage({ title, resource }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRows() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get(`/${resource}/`);
        setRows(Array.isArray(data) ? data : [data]);
      } catch {
        setError("Could not load this resource. Check permissions and backend status.");
      } finally {
        setLoading(false);
      }
    }
    loadRows();
  }, [resource]);

  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Workspace</p>
        <h2>{title}</h2>
      </div>
      {loading && <LoadingState />}
      {error && <div className="error-box">{error}</div>}
      {!loading && !error && <DataTable rows={rows} />}
    </section>
  );
}

