import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/coupons", label: "Coupons" },
];

export default function AdminLayout() {
  return (
    <div className="admin-shell container">
      <aside className="admin-side">
        <p className="eyebrow" style={{ marginBottom: 12 }}>Admin</p>
        <nav className="admin-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
