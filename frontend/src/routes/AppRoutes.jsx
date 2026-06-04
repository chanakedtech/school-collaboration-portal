import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../layouts/AppLayout.jsx";
import Login from "../pages/shared/Login.jsx";
import Register from "../pages/shared/Register.jsx";
import Unauthorized from "../pages/shared/Unauthorized.jsx";
import Dashboard from "../pages/shared/Dashboard.jsx";
import ResourcePage from "../pages/shared/ResourcePage.jsx";
import Announcements from "../pages/shared/Announcements.jsx";
import Assignments from "../pages/shared/Assignments.jsx";
import Submissions from "../pages/shared/Submissions.jsx";
import ParentChildren from "../pages/shared/ParentChildren.jsx";
import { dashboardByRole } from "../auth/roles";
import { useAuth } from "../auth/AuthContext.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleBasedRoute from "./RoleBasedRoute.jsx";

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? dashboardByRole[user.role] : "/login"} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/profile" element={<ResourcePage title="Profile" resource="auth/me" />} />
          <Route path="/settings" element={<ResourcePage title="Settings" resource="auth/me" />} />

          <Route element={<RoleBasedRoute allowedRoles={["student"]} />}>
            <Route path="/student/dashboard" element={<Dashboard role="student" />} />
            <Route path="/student/assignments" element={<Assignments />} />
            <Route path="/student/announcements" element={<Announcements />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["teacher"]} />}>
            <Route path="/teacher/dashboard" element={<Dashboard role="teacher" />} />
            <Route path="/teacher/subjects" element={<ResourcePage title="Subjects" resource="subjects" />} />
            <Route path="/teacher/assignments" element={<Assignments />} />
            <Route path="/teacher/submissions" element={<Submissions />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["class_teacher"]} />}>
            <Route path="/class-teacher/dashboard" element={<Dashboard role="class_teacher" />} />
            <Route path="/class-teacher/students" element={<ResourcePage title="Students" resource="users" />} />
            <Route path="/class-teacher/parents" element={<ResourcePage title="Parents" resource="users" />} />
            <Route path="/class-teacher/announcements" element={<Announcements />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["parent"]} />}>
            <Route path="/parent/dashboard" element={<Dashboard role="parent" />} />
            <Route path="/parent/children" element={<ParentChildren />} />
            <Route path="/parent/child-performance" element={<Submissions />} />
            <Route path="/parent/announcements" element={<Announcements />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["school_admin"]} />}>
            <Route path="/school-admin/dashboard" element={<Dashboard role="school_admin" />} />
            <Route path="/school-admin/users" element={<ResourcePage title="Users" resource="users" />} />
            <Route path="/school-admin/classes" element={<ResourcePage title="Classes" resource="classes" />} />
            <Route path="/school-admin/subjects" element={<ResourcePage title="Subjects" resource="subjects" />} />
            <Route path="/school-admin/announcements" element={<Announcements />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={["platform_admin"]} />}>
            <Route path="/platform-admin/dashboard" element={<Dashboard role="platform_admin" />} />
            <Route path="/platform-admin/schools" element={<ResourcePage title="Schools" resource="schools" />} />
            <Route path="/platform-admin/users" element={<ResourcePage title="All Users" resource="users" />} />
            <Route path="/platform-admin/stats" element={<ResourcePage title="Platform Stats" resource="schools" />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

