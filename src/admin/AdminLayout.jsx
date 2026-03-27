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
      
      {/* Sidebar Backdrop (Mobile only) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 inset-y-0 left-0 z-50
          w-72 md:w-64 h-screen p-6
          flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          bg-white shadow-xl md:shadow-none
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{ borderRight: `1px solid ${C.creamDark}` }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black tracking-widest uppercase" style={{ color: C.pinkDark }}>
              Admin Panel
            </h2>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: C.textMid, background: C.cream }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links - Stacked vertically always */}
          <nav className="flex flex-col gap-2 overflow-y-auto flex-1">
            {[
              { to: "dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
              { to: "products/add", icon: <Package size={18} />, label: "Add Product" },
              { to: "products/manage", icon: <Package size={18} />, label: "Manage Products" },
              { to: "orders", icon: <ShoppingCart size={18} />, label: "Orders" },
              { to: "reports", icon: <BarChart3 size={18} />, label: "Reports" },
              { to: "contact-form", icon: <Mail size={18} />, label: "Contact Us" },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `${linkBase} ${isActive ? "shadow-sm" : ""}`}
                style={({ isActive }) => ({
                  background: isActive ? C.pinkPale : "transparent",
                  color: isActive ? C.pinkDark : C.text,
                })}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Logout Button at bottom of sidebar */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-transform active:scale-95"
            style={{ background: C.pink, color: C.white }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white sticky top-0 z-30 border-b" style={{ borderColor: C.creamDark }}>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg"
            style={{ background: C.cream, color: C.text }}
          >
            <Menu size={24} />
          </button>
          <span className="font-black text-sm uppercase tracking-tighter" style={{ color: C.pinkDark }}>
            Admin
          </span>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Content Wrapper */}
        <div className="p-4 md:p-8 lg:p-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}