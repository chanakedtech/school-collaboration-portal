import DashboardCard from "../../components/DashboardCard.jsx";
import { roles } from "../../auth/roles";

const cardsByRole = {
  student: [
    ["Assignments", "5", "View assigned work"],
    ["Subjects", "4", "Current class subjects"],
    ["Announcements", "5", "Latest school updates"],
  ],
  teacher: [
    ["Subjects", "2", "Assigned teaching load"],
    ["Assignments", "5", "Created this term"],
    ["Submissions", "12", "Awaiting review"],
  ],
  class_teacher: [
    ["Students", "35", "Assigned class"],
    ["Parents", "28", "Linked contacts"],
    ["Announcements", "3", "Class updates"],
  ],
  parent: [
    ["Children", "2", "Linked learners"],
    ["Assignments", "7", "Open child tasks"],
    ["Reports", "4", "Recent performance records"],
  ],
  school_admin: [
    ["Users", "42", "School accounts"],
    ["Classes", "8", "Active classrooms"],
    ["Subjects", "16", "Assigned subjects"],
  ],
  platform_admin: [
    ["Schools", "1", "Active institutions"],
    ["Users", "48", "Across platform"],
    ["Health", "Good", "Training environment"],
  ],
};

export default function Dashboard({ role }) {
  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">{roles[role]}</p>
        <h2>Dashboard</h2>
      </div>
      <div className="dashboard-grid">
        {cardsByRole[role].map(([title, value, caption]) => (
          <DashboardCard key={title} title={title} value={value} caption={caption} />
        ))}
      </div>
    </section>
  );
}

