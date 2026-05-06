export default function DashboardCard({ title, value, caption }) {
  return (
    <article className="dashboard-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{caption}</p>
    </article>
  );
}

