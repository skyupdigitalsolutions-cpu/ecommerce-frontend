import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="cmyk-strip">
        <span className="k-c" /><span className="k-m" /><span className="k-y" /><span className="k-k" />
      </div>
      <nav className="nav-inner">
        <Link to="/" className="brand">
          <span className="regmark"><span /></span>
          <span className="brand-name">Impres<b>·</b>sion</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Shop</Link>
          {user && <Link to="/designs" className="nav-link">Design</Link>}
          {user && <Link to="/orders" className="nav-link">Orders</Link>}
          {user?.role === "admin" && <Link to="/admin" className="nav-link">Admin</Link>}
          <Link to="/cart" className="nav-link nav-cart">
            Cart
            {count > 0 && <span className="badge">{count}</span>}
          </Link>
          {user ? (
            <button className="btn btn-outline btn-sm" onClick={onLogout}>
              Sign out
            </button>
          ) : (
            <Link to="/login" className="btn btn-ink btn-sm">Sign in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
