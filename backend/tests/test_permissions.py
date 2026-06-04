from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.core.models import Assignment, ClassRoom, School, Subject

User = get_user_model()


def make_school(name="School A", email="a@school.test"):
    return School.objects.create(name=name, email=email, address="Kampala")


def make_user(email, role, school=None):
    user = User.objects.create(
        email=email,
        first_name="Test",
        last_name="User",
        role=role,
        school=school,
    )
    user.set_password("TestPass123!")
    user.save()
    return user


class PlatformAdminSchoolAccessTest(APITestCase):
    def setUp(self):
        self.school_a = make_school("School A", "a@school.test")
        self.school_b = make_school("School B", "b@school.test")
        self.admin = make_user("platform@test.com", "platform_admin")
        self.client.force_authenticate(self.admin)

    def test_platform_admin_can_list_all_schools(self):
        response = self.client.get(reverse("school-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_platform_admin_can_create_school(self):
        response = self.client.post(reverse("school-list"), {
            "name": "New School",
            "email": "new@school.test",
            "address": "Entebbe",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class SchoolAdminUserIsolationTest(APITestCase):
    def setUp(self):
        self.school_a = make_school("School A", "a@school.test")
        self.school_b = make_school("School B", "b@school.test")
        self.admin_a = make_user("admin.a@test.com", "school_admin", self.school_a)
        make_user("teacher.a@test.com", "teacher", self.school_a)
        make_user("teacher.b@test.com", "teacher", self.school_b)
        self.client.force_authenticate(self.admin_a)

    def test_school_admin_sees_only_own_school_users(self):
        response = self.client.get(reverse("user-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        emails = [u["email"] for u in response.data]
        self.assertIn("teacher.a@test.com", emails)
        self.assertNotIn("teacher.b@test.com", emails)

    def test_school_admin_cannot_access_schools_endpoint(self):
        response = self.client.get(reverse("school-list"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TeacherAssignmentAccessTest(APITestCase):
    def setUp(self):
        self.school = make_school()
        self.teacher_a = make_user("teacher.a@test.com", "teacher", self.school)
        self.teacher_b = make_user("teacher.b@test.com", "teacher", self.school)
        self.classroom = ClassRoom.objects.create(school=self.school, name="S1")
        self.subject = Subject.objects.create(
            school=self.school, name="Math", code="MATH-T",
            teacher=self.teacher_a, classroom=self.classroom,
        )
        self.assignment = Assignment.objects.create(
            title="Test Assignment",
            description="Do this.",
            subject=self.subject,
            teacher=self.teacher_a,
            due_date="2099-01-01T00:00:00Z",
        )
        # Give teacher_b a subject in the same school so school_queryset resolves
        Subject.objects.create(
            school=self.school, name="English", code="ENG-T",
            teacher=self.teacher_b, classroom=self.classroom,
        )

    def test_teacher_sees_own_assignments(self):
        self.client.force_authenticate(self.teacher_a)
        response = self.client.get(reverse("assignment-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_teacher_cannot_see_other_teacher_assignments(self):
        self.client.force_authenticate(self.teacher_b)
        response = self.client.get(reverse("assignment-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
