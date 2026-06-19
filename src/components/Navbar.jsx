import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand" aria-label="Go to dashboard home">
        Go Business
      </Link>

      <nav aria-label="Primary" className="navbar-nav">
            <Link to="/">Home</Link>
            </nav>

            <div className="navbar-actions">
            <button type="button" className="btn-try-free">
                Try for free
            </button>
            <button type="button" className="navbar-logout" onClick={handleLogout}>
                Log out
            </button>
            </div>
    </header>
  );
}

export default Navbar;