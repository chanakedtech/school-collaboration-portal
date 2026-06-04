export default function EmptyState({ message = "No records found yet." }) {
  return <div className="empty-state">{message}</div>;
}
