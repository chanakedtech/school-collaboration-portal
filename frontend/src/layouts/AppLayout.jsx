import { LogOut, Settings, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";

const roleAccent = {
  student: "#3b82f6",
  teacher: "#10b981",
  class_teacher: "#8b5cf6",
  parent: "#f59e0b",
  school_admin: "#ef4444",
  platform_admin: "#f4a261",
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const accent = roleAccent[user?.role] || "#1d6157";

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">{user?.school_name || "School Collaboration Portal"}</p>
          </div>

          <div className="topbar-actions" ref={ref}>
            {!open && (
              <button
                className="topbar-avatar"
                style={{ background: accent }}
                onClick={() => setOpen(true)}
                aria-label="Account menu"
              >
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </button>
            )}

            {open && (
              <div className="topbar-dropdown">
                <div className="topbar-dropdown-header">
                  <span className="topbar-dropdown-name">{user?.first_name} {user?.last_name}</span>
                  <span className="topbar-dropdown-email">{user?.email}</span>
                </div>
                <div className="topbar-dropdown-divider" />
                <Link to="/profile" className="topbar-dropdown-item" onClick={() => setOpen(false)}>
                  <UserCircle size={15} /> Profile
                </Link>
                <Link to="/settings" className="topbar-dropdown-item" onClick={() => setOpen(false)}>
                  <Settings size={15} /> Settings
                </Link>
                <div className="topbar-dropdown-divider" />
                <button className="topbar-dropdown-item topbar-dropdown-item--danger" onClick={logout}>
                  <LogOut size={15} /> Log out
                </button>
              </div>
            )}
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

