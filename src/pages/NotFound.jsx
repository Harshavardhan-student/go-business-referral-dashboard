import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/">← Back to dashboard</Link>
      </div>
    </div>
  );
}

export default NotFound;