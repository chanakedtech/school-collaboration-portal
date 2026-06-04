import { Bell, BookOpen, Building2, ChevronRight, ClipboardList, GraduationCap, Home, LogOut, Menu, School, Users, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.jsx";
import { roles } from "../auth/roles";

const navByRole = {
  student: [
    { label: "Overview", items: [["Dashboard", "/student/dashboard", Home]] },
    { label: "Learning", items: [
      ["Assignments", "/student/assignments", ClipboardList],
      ["Announcements", "/student/announcements", Bell],
    ]},
  ],
  teacher: [
    { label: "Overview", items: [["Dashboard", "/teacher/dashboard", Home]] },
    { label: "Teaching", items: [
      ["Subjects", "/teacher/subjects", BookOpen],
      ["Assignments", "/teacher/assignments", ClipboardList],
      ["Submissions", "/teacher/submissions", GraduationCap],
    ]},
  ],
  class_teacher: [
    { label: "Overview", items: [["Dashboard", "/class-teacher/dashboard", Home]] },
    { label: "My Class", items: [
      ["Students", "/class-teacher/students", Users],
      ["Parents", "/class-teacher/parents", Users],
      ["Announcements", "/class-teacher/announcements", Bell],
    ]},
  ],
  parent: [
    { label: "Overview", items: [["Dashboard", "/parent/dashboard", Home]] },
    { label: "My Children", items: [
      ["Children", "/parent/children", Users],
      ["Performance", "/parent/child-performance", GraduationCap],
      ["Announcements", "/parent/announcements", Bell],
    ]},
  ],
  school_admin: [
    { label: "Overview", items: [["Dashboard", "/school-admin/dashboard", Home]] },
    { label: "Manage", items: [
      ["Users", "/school-admin/users", Users],
      ["Classes", "/school-admin/classes", School],
      ["Subjects", "/school-admin/subjects", BookOpen],
    ]},
    { label: "Communication", items: [
      ["Announcements", "/school-admin/announcements", Bell],
    ]},
  ],
  platform_admin: [
    { label: "Overview", items: [["Dashboard", "/platform-admin/dashboard", Home]] },
    { label: "Platform", items: [
      ["Schools", "/platform-admin/schools", Building2],
      ["Users", "/platform-admin/users", Users],
      ["Stats", "/platform-admin/stats", GraduationCap],
    ]},
  ],
};

const roleAccent = {
  student: "#3b82f6",
  teacher: "#10b981",
  class_teacher: "#8b5cf6",
  parent: "#f59e0b",
  school_admin: "#ef4444",
  platform_admin: "#f4a261",
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const groups = navByRole[user?.role] || [];
  const accent = roleAccent[user?.role] || "#f4a261";

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu size={20} />
      </button>

      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside className={"sidebar" + (open ? " sidebar--open" : "")}>
        <div className="sidebar-header">
          <div className="brand">
            <School size={22} />
            <span>School Portal</span>
          </div>
          <button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <div className="role-pill" style={{ borderLeftColor: accent }}>
          <span className="role-dot" style={{ background: accent }} />
          {roles[user?.role] || "User"}
          {user?.school_name && <span className="sidebar-school">{user.school_name}</span>}
        </div>

        <nav className="sidebar-nav">
          {groups.map(({ label, items }) => (
            <div key={label} className="nav-group">
              <span className="nav-group-label">{label}</span>
              {items.map(([itemLabel, href, Icon]) => (
                <NavLink
                  key={href}
                  to={href}
                  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={17} />
                  <span>{itemLabel}</span>
                  <ChevronRight size={14} className="nav-chevron" />
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="sidebar-avatar" style={{ background: accent }}>
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </span>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.first_name} {user?.last_name}</span>
              <span className="sidebar-user-email">{user?.email}</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={logout} title="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}

