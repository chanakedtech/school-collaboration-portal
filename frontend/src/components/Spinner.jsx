export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="spinner-wrap" role="status" aria-label={label}>
      <span className="spinner" />
    </div>
  );
}
