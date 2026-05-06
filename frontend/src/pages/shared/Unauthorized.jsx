export default function Unauthorized() {
  return (
    <main className="screen-message">
      <h1>Unauthorized</h1>
      <p>Your role does not have access to this page.</p>
      <a href="/">Go back to your dashboard</a>
    </main>
  );
}

