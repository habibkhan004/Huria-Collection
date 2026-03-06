import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Mail, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { C } from "../theme/colors";
import { logoutAdmin } from "./fakeAuth";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200";

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: C.cream }}>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 md:w-64 p-4 md:p-6
          flex flex-col items-stretch justify-between gap-4
          transform transition-transform duration-200
          bg-white
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ borderRight: `1px solid ${C.creamDark}` }}
      >
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-black tracking-widest uppercase"
              style={{ color: C.pinkDark }}
            >
              Admin Panel
            </h2>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="md:hidden inline-flex items-center justify-center rounded-lg p-1.5 border"
              style={{ borderColor: C.creamDark, color: C.textMid }}
            >
              <X size={16} />
            </button>
          </div>

          <nav className="flex md:flex-col gap-2 md:space-y-2">
            <NavLink
              to="dashboard"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "shadow-md" : ""}`
              }
              style={({ isActive }) => ({
                background: isActive ? C.pinkPale : "transparent",
                color: isActive ? C.pinkDark : C.text,
              })}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>

            <NavLink
              to="products/add"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "shadow-md" : ""}`
              }
              style={({ isActive }) => ({
                background: isActive ? C.pinkPale : "transparent",
                color: isActive ? C.pinkDark : C.text,
              })}
            >
              <Package size={18} />
              Add Product
            </NavLink>

            <NavLink
              to="products/manage"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "shadow-md" : ""}`
              }
              style={({ isActive }) => ({
                background: isActive ? C.pinkPale : "transparent",
                color: isActive ? C.pinkDark : C.text,
              })}
            >
              <Package size={18} />
              Manage Products
            </NavLink>

            <NavLink
              to="orders"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "shadow-md" : ""}`
              }
              style={({ isActive }) => ({
                background: isActive ? C.pinkPale : "transparent",
                color: isActive ? C.pinkDark : C.text,
              })}
            >
              <ShoppingCart size={18} />
              Orders
            </NavLink>

            <NavLink
              to="reports"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "shadow-md" : ""}`
              }
              style={({ isActive }) => ({
                background: isActive ? C.pinkPale : "transparent",
                color: isActive ? C.pinkDark : C.text,
              })}
            >
              <BarChart3 size={18} />
              Reports
            </NavLink>

            <NavLink
              to="contact-form"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "shadow-md" : ""}`
              }
              style={({ isActive }) => ({
                background: isActive ? C.pinkPale : "transparent",
                color: isActive ? C.pinkDark : C.text,
              })}
            >
              <Mail size={18} />
              Contact Us Form
            </NavLink>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{
            background: C.pink,
            color: C.white,
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-10">
        {/* Mobile top bar with hamburger */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center rounded-lg p-2 border text-sm font-semibold"
            style={{ borderColor: C.creamDark, color: C.text }}
          >
            <Menu size={18} />
          </button>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.textMid }}>
            Admin Panel
          </span>
        </div>

        {/* Backdrop for mobile sidebar */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <Outlet />
      </main>
    </div>
  );
}