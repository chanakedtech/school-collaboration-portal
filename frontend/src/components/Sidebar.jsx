import { Bell, BookOpen, Building2, ClipboardList, GraduationCap, Home, School, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../auth/AuthContext.jsx";
import { roles } from "../auth/roles";

const navByRole = {
  student: [
    ["Dashboard", "/student/dashboard", Home],
    ["Assignments", "/student/assignments", ClipboardList],
    ["Announcements", "/student/announcements", Bell],
  ],
  teacher: [
    ["Dashboard", "/teacher/dashboard", Home],
    ["Subjects", "/teacher/subjects", BookOpen],
    ["Assignments", "/teacher/assignments", ClipboardList],
    ["Submissions", "/teacher/submissions", GraduationCap],
  ],
  class_teacher: [
    ["Dashboard", "/class-teacher/dashboard", Home],
    ["Students", "/class-teacher/students", Users],
    ["Parents", "/class-teacher/parents", Users],
    ["Announcements", "/class-teacher/announcements", Bell],
  ],
  parent: [
    ["Dashboard", "/parent/dashboard", Home],
    ["Children", "/parent/children", Users],
    ["Performance", "/parent/child-performance", GraduationCap],
    ["Announcements", "/parent/announcements", Bell],
  ],
  school_admin: [
    ["Dashboard", "/school-admin/dashboard", Home],
    ["Users", "/school-admin/users", Users],
    ["Classes", "/school-admin/classes", School],
    ["Subjects", "/school-admin/subjects", BookOpen],
    ["Announcements", "/school-admin/announcements", Bell],
  ],
  platform_admin: [
    ["Dashboard", "/platform-admin/dashboard", Home],
    ["Schools", "/platform-admin/schools", Building2],
    ["Users", "/platform-admin/users", Users],
    ["Stats", "/platform-admin/stats", GraduationCap],
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const items = navByRole[user?.role] || [];

  return (
    <aside className="sidebar">
      <div className="brand">
        <School size={24} />
        <span>School Portal</span>
      </div>
      <p className="role-pill">{roles[user?.role] || "User"}</p>
      <nav>
        {items.map(([label, href, Icon]) => (
          <NavLink key={href} to={href} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

