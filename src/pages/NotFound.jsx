import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty">
      <h2>Page not found</h2>
      <p>That page didn't make it to press.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>Back to shop</Link>
    </div>
  );
}
