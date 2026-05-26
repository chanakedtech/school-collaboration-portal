from datetime import timedelta

from django.utils import timezone

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.core.models import Announcement, Assignment, ClassRoom, School, Subject, Submission

User = get_user_model()


def make_user(email, role, school=None):
    """Bypass the default UserManager which still expects a username arg."""
    local = email.split("@")[0]
    parts = local.split(".")
    user = User(
        email=email,
        first_name=parts[0].capitalize(),
        last_name=parts[1].capitalize() if len(parts) > 1 else "User",
        role=role,
        school=school,
    )
    user.set_password("pass")
    user.save()
    return user


class SchoolIsolationTestCase(TestCase):
    """Test that users from one school cannot access data from another school."""

    def setUp(self):
        # Create two schools
        self.school_a = School.objects.create(name="School A", email="schoola@test.com")
        self.school_b = School.objects.create(name="School B", email="schoolb@test.com")

        # School A users
        self.admin_a = make_user("admin.a@test.com", "school_admin", self.school_a)
        self.teacher_a = make_user("teacher.a@test.com", "teacher", self.school_a)
        self.student_a = make_user("student.a@test.com", "student", self.school_a)

        # School B users
        self.admin_b = make_user("admin.b@test.com", "school_admin", self.school_b)
        self.teacher_b = make_user("teacher.b@test.com", "teacher", self.school_b)
        self.student_b = make_user("student.b@test.com", "student", self.school_b)

        # Platform admin
        self.platform_admin = make_user("platform@test.com", "platform_admin")

        # School A resources
        self.class_a = ClassRoom.objects.create(school=self.school_a, name="Class A1")
        self.subject_a = Subject.objects.create(
            school=self.school_a,
            name="Math A",
            code="MATH-A",
            teacher=self.teacher_a,
            classroom=self.class_a,
        )
        self.assignment_a = Assignment.objects.create(
            title="Assignment A",
            description="Test",
            subject=self.subject_a,
            teacher=self.teacher_a,
            due_date=timezone.now() + timedelta(days=7),
        )
        self.announcement_a = Announcement.objects.create(
            title="Announcement A",
            message="Test",
            school=self.school_a,
            created_by=self.admin_a,
        )

        # School B resources
        self.class_b = ClassRoom.objects.create(school=self.school_b, name="Class B1")
        self.subject_b = Subject.objects.create(
            school=self.school_b,
            name="Math B",
            code="MATH-B",
            teacher=self.teacher_b,
            classroom=self.class_b,
        )
        self.assignment_b = Assignment.objects.create(
            title="Assignment B",
            description="Test",
            subject=self.subject_b,
            teacher=self.teacher_b,
            due_date=timezone.now() + timedelta(days=7),
        )
        self.announcement_b = Announcement.objects.create(
            title="Announcement B",
            message="Test",
            school=self.school_b,
            created_by=self.admin_b,
        )

        self.client = APIClient()

    def test_users_cannot_see_other_school_users(self):
        """School admin A cannot see users from school B."""
        self.client.force_authenticate(user=self.admin_a)
        response = self.client.get("/api/users/")
        self.assertEqual(response.status_code, 200)
        user_ids = [u["id"] for u in response.data]
        self.assertIn(self.admin_a.id, user_ids)
        self.assertIn(self.teacher_a.id, user_ids)
        self.assertIn(self.student_a.id, user_ids)
        self.assertNotIn(self.admin_b.id, user_ids)
        self.assertNotIn(self.teacher_b.id, user_ids)
        self.assertNotIn(self.student_b.id, user_ids)

    def test_users_cannot_update_other_school_users(self):
        """School admin A cannot update users from school B."""
        self.client.force_authenticate(user=self.admin_a)
        response = self.client.patch(
            f"/api/users/{self.teacher_b.id}/", {"first_name": "Hacked"}
        )
        self.assertEqual(response.status_code, 404)

    def test_classes_are_school_isolated(self):
        """Teacher A cannot see classes from school B."""
        self.client.force_authenticate(user=self.teacher_a)
        response = self.client.get("/api/classes/")
        self.assertEqual(response.status_code, 200)
        class_ids = [c["id"] for c in response.data]
        self.assertIn(self.class_a.id, class_ids)
        self.assertNotIn(self.class_b.id, class_ids)

    def test_subjects_are_school_isolated(self):
        """Teacher A cannot see subjects from school B."""
        self.client.force_authenticate(user=self.teacher_a)
        response = self.client.get("/api/subjects/")
        self.assertEqual(response.status_code, 200)
        subject_ids = [s["id"] for s in response.data]
        self.assertIn(self.subject_a.id, subject_ids)
        self.assertNotIn(self.subject_b.id, subject_ids)

    def test_assignments_are_school_isolated(self):
        """Teacher A cannot see assignments from school B."""
        self.client.force_authenticate(user=self.teacher_a)
        response = self.client.get("/api/assignments/")
        self.assertEqual(response.status_code, 200)
        assignment_ids = [a["id"] for a in response.data]
        self.assertIn(self.assignment_a.id, assignment_ids)
        self.assertNotIn(self.assignment_b.id, assignment_ids)

    def test_teacher_cannot_update_other_school_assignment(self):
        """Teacher A cannot update assignment from school B."""
        self.client.force_authenticate(user=self.teacher_a)
        response = self.client.patch(
            f"/api/assignments/{self.assignment_b.id}/", {"title": "Hacked"}
        )
        self.assertEqual(response.status_code, 404)

    def test_teacher_cannot_delete_other_school_assignment(self):
        """Teacher A cannot delete assignment from school B."""
        self.client.force_authenticate(user=self.teacher_a)
        response = self.client.delete(f"/api/assignments/{self.assignment_b.id}/")
        self.assertEqual(response.status_code, 404)

    def test_announcements_are_school_isolated(self):
        """Admin A cannot see announcements from school B."""
        self.client.force_authenticate(user=self.admin_a)
        response = self.client.get("/api/announcements/")
        self.assertEqual(response.status_code, 200)
        announcement_ids = [a["id"] for a in response.data]
        self.assertIn(self.announcement_a.id, announcement_ids)
        self.assertNotIn(self.announcement_b.id, announcement_ids)

    def test_admin_cannot_update_other_school_announcement(self):
        """Admin A cannot update announcement from school B."""
        self.client.force_authenticate(user=self.admin_a)
        response = self.client.patch(
            f"/api/announcements/{self.announcement_b.id}/", {"title": "Hacked"}
        )
        self.assertEqual(response.status_code, 404)

    def test_platform_admin_sees_all_schools(self):
        """Platform admin can see resources from all schools."""
        self.client.force_authenticate(user=self.platform_admin)

        # Users
        response = self.client.get("/api/users/")
        user_ids = [u["id"] for u in response.data]
        self.assertIn(self.admin_a.id, user_ids)
        self.assertIn(self.admin_b.id, user_ids)

        # Classes
        response = self.client.get("/api/classes/")
        class_ids = [c["id"] for c in response.data]
        self.assertIn(self.class_a.id, class_ids)
        self.assertIn(self.class_b.id, class_ids)

        # Assignments
        response = self.client.get("/api/assignments/")
        assignment_ids = [a["id"] for a in response.data]
        self.assertIn(self.assignment_a.id, assignment_ids)
        self.assertIn(self.assignment_b.id, assignment_ids)

    def test_student_cannot_see_other_school_assignments(self):
        """Student A cannot see assignments from school B."""
        self.client.force_authenticate(user=self.student_a)
        response = self.client.get("/api/assignments/")
        self.assertEqual(response.status_code, 200)
        assignment_ids = [a["id"] for a in response.data]
        self.assertNotIn(self.assignment_b.id, assignment_ids)

    def test_cross_school_submission_blocked(self):
        """Student A cannot submit to assignment from school B."""
        self.client.force_authenticate(user=self.student_a)
        response = self.client.post(
            "/api/submissions/",
            {
                "assignment": self.assignment_b.id,
                "answer_text": "Attempt to cross-submit",
            },
        )
        # Should fail because queryset filters out assignment_b
        self.assertIn(response.status_code, [400, 404])


class RolePermissionTestCase(TestCase):
    """Test role-based permissions are enforced correctly."""

    def setUp(self):
        self.school = School.objects.create(name="Test School", email="test@school.com")
        self.admin = make_user("admin@test.com", "school_admin", self.school)
        self.teacher = make_user("teacher@test.com", "teacher", self.school)
        self.student = make_user("student@test.com", "student", self.school)
        self.parent = make_user("parent@test.com", "parent", self.school)

        self.classroom = ClassRoom.objects.create(school=self.school, name="Class 1")
        self.subject = Subject.objects.create(
            school=self.school,
            name="Math",
            code="MATH",
            teacher=self.teacher,
            classroom=self.classroom,
        )
        self.assignment = Assignment.objects.create(
            title="Test Assignment",
            description="Test",
            subject=self.subject,
            teacher=self.teacher,
            due_date=timezone.now() + timedelta(days=7),
        )

        self.client = APIClient()

    def test_student_cannot_create_assignment(self):
        """Students cannot create assignments."""
        self.client.force_authenticate(user=self.student)
        response = self.client.post(
            "/api/assignments/",
            {
                "title": "Hack",
                "description": "Test",
                "subject": self.subject.id,
                "due_date": (timezone.now() + timedelta(days=1)).isoformat(),
            },
        )
        self.assertEqual(response.status_code, 403)

    def test_parent_cannot_create_announcement(self):
        """Parents cannot create announcements."""
        self.client.force_authenticate(user=self.parent)
        response = self.client.post(
            "/api/announcements/",
            {"title": "Test", "message": "Test", "school": self.school.id},
        )
        self.assertEqual(response.status_code, 403)

    def test_student_cannot_delete_submission(self):
        """Students cannot delete submissions."""
        submission = Submission.objects.create(
            assignment=self.assignment, student=self.student, answer_text="My answer"
        )
        self.client.force_authenticate(user=self.student)
        response = self.client.delete(f"/api/submissions/{submission.id}/")
        self.assertEqual(response.status_code, 403)

    def test_teacher_can_create_assignment(self):
        """Teachers can create assignments."""
        self.client.force_authenticate(user=self.teacher)
        response = self.client.post(
            "/api/assignments/",
            {
                "title": "New Assignment",
                "description": "Test",
                "subject": self.subject.id,
                "due_date": (timezone.now() + timedelta(days=1)).strftime("%Y-%m-%dT%H:%M:%SZ"),
            },
        )
        self.assertEqual(response.status_code, 201)

    def test_teacher_cannot_delete_other_teacher_assignment(self):
        """Teacher cannot delete another teacher's assignment."""
        other_teacher = make_user("other@test.com", "teacher", self.school)
        other_assignment = Assignment.objects.create(
            title="Other Assignment",
            description="Test",
            subject=self.subject,
            teacher=other_teacher,
            due_date=timezone.now() + timedelta(days=7),
        )
        self.client.force_authenticate(user=self.teacher)
        response = self.client.delete(f"/api/assignments/{other_assignment.id}/")
        # 403 if object is visible but forbidden; 404 if queryset hides it
        self.assertIn(response.status_code, [403, 404])

    def test_admin_can_create_announcement(self):
        """School admin can create announcements."""
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            "/api/announcements/",
            {"title": "Test", "message": "Test", "school": self.school.id},
        )
        self.assertEqual(response.status_code, 201)

    def test_student_can_create_submission(self):
        """Students can create submissions."""
        self.client.force_authenticate(user=self.student)
        response = self.client.post(
            "/api/submissions/",
            {"assignment": self.assignment.id, "answer_text": "My answer"},
        )
        self.assertEqual(response.status_code, 201)

    def test_teacher_can_grade_own_assignment_submission(self):
        """Teacher can grade submissions for their own assignments."""
        submission = Submission.objects.create(
            assignment=self.assignment, student=self.student, answer_text="Answer"
        )
        self.client.force_authenticate(user=self.teacher)
        response = self.client.patch(
            f"/api/submissions/{submission.id}/grade/", {"grade": "A"}
        )
        self.assertEqual(response.status_code, 200)

    def test_teacher_cannot_grade_other_teacher_assignment_submission(self):
        """Teacher cannot grade submissions for another teacher's assignments."""
        other_teacher = make_user("other2@test.com", "teacher", self.school)
        other_assignment = Assignment.objects.create(
            title="Other Assignment",
            description="Test",
            subject=self.subject,
            teacher=other_teacher,
            due_date=timezone.now() + timedelta(days=7),
        )
        submission = Submission.objects.create(
            assignment=other_assignment, student=self.student, answer_text="Answer"
        )
        self.client.force_authenticate(user=self.teacher)
        response = self.client.patch(
            f"/api/submissions/{submission.id}/grade/", {"grade": "A"}
        )
        # 403 if object is visible but forbidden; 404 if queryset hides it
        self.assertIn(response.status_code, [403, 404])
