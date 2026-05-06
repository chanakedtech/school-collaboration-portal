import { LogOut, Settings, UserCircle } from "lucide-react";
import { Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">{user?.school_name || "School Collaboration Portal"}</p>
            <h1>{user?.first_name ? `Welcome, ${user.first_name}` : "Welcome"}</h1>
          </div>
          <div className="topbar-actions">
            <a className="icon-link" href="/profile" title="Profile">
              <UserCircle size={20} />
            </a>
            <a className="icon-link" href="/settings" title="Settings">
              <Settings size={20} />
            </a>
            <button className="icon-button" onClick={logout} title="Log out">
              <LogOut size={20} />
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

