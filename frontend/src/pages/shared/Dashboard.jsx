import { Bell, BookOpen, ClipboardList, GraduationCap, LayoutDashboard, School, Users } from "lucide-react";

import { useAuth } from "../../auth/AuthContext.jsx";
import DashboardCard from "../../components/DashboardCard.jsx";
import { roles } from "../../auth/roles";

const roleAccent = {
  student: "#3b82f6",
  teacher: "#10b981",
  class_teacher: "#8b5cf6",
  parent: "#f59e0b",
  school_admin: "#ef4444",
  platform_admin: "#f4a261",
};

const cardsByRole = {
  student: [
    { title: "Assignments", value: "5", caption: "View assigned work", icon: ClipboardList, href: "/student/assignments" },
    { title: "Announcements", value: "5", caption: "Latest school updates", icon: Bell, href: "/student/announcements" },
    { title: "Subjects", value: "4", caption: "Current class subjects", icon: BookOpen },
  ],
  teacher: [
    { title: "Assignments", value: "5", caption: "Created this term", icon: ClipboardList, href: "/teacher/assignments" },
    { title: "Submissions", value: "12", caption: "Awaiting review", icon: GraduationCap, href: "/teacher/submissions" },
    { title: "Subjects", value: "2", caption: "Assigned teaching load", icon: BookOpen, href: "/teacher/subjects" },
  ],
  class_teacher: [
    { title: "Students", value: "35", caption: "Assigned class", icon: Users, href: "/class-teacher/students" },
    { title: "Parents", value: "28", caption: "Linked contacts", icon: Users, href: "/class-teacher/parents" },
    { title: "Announcements", value: "3", caption: "Class updates", icon: Bell, href: "/class-teacher/announcements" },
  ],
  parent: [
    { title: "Children", value: "2", caption: "Linked learners", icon: Users, href: "/parent/children" },
    { title: "Assignments", value: "7", caption: "Open child tasks", icon: ClipboardList, href: "/parent/children" },
    { title: "Announcements", value: "4", caption: "School updates", icon: Bell, href: "/parent/announcements" },
  ],
  school_admin: [
    { title: "Users", value: "42", caption: "School accounts", icon: Users, href: "/school-admin/users" },
    { title: "Classes", value: "8", caption: "Active classrooms", icon: School, href: "/school-admin/classes" },
    { title: "Subjects", value: "16", caption: "Assigned subjects", icon: BookOpen, href: "/school-admin/subjects" },
  ],
  platform_admin: [
    { title: "Schools", value: "1", caption: "Active institutions", icon: School, href: "/platform-admin/schools" },
    { title: "Users", value: "48", caption: "Across platform", icon: Users, href: "/platform-admin/users" },
    { title: "Health", value: "Good", caption: "Training environment", icon: LayoutDashboard },
  ],
};

export default function Dashboard({ role }) {
  const { user } = useAuth();
  const accent = roleAccent[role] || "#1d6157";
  const cards = cardsByRole[role] || [];

  return (
    <section>
      <div className="dashboard-welcome" style={{ borderLeftColor: accent }}>
        <div>
          <p className="eyebrow">{roles[role]}</p>
          <h2 className="dashboard-welcome-title">
            Welcome back{user?.first_name ? `, ${user.first_name}` : ""}
          </h2>
          <p className="dashboard-welcome-sub">Here's what's happening today.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} accent={accent} />
        ))}
      </div>
    </section>
  );
}
