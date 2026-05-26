export default function EmptyState({ icon = "📭", message = "No records found." }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon}</span>
      <p>{message}</p>
    </div>
  );
}
