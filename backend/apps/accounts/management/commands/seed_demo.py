from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.core.models import Announcement, Assignment, ClassRoom, ParentProfile, School, StudentProfile, Subject

User = get_user_model()
PASSWORD = "Password123!"


class Command(BaseCommand):
    help = "Create demo data for local training and onboarding."

    def handle(self, *args, **options):
        school, _ = School.objects.get_or_create(
            email="info@demo.school",
            defaults={
                "name": "Chanak Academy Demo School",
                "address": "Kampala, Uganda",
                "phone": "+256700000000",
            },
        )

        platform_admin = self.user("platform.admin@demo.school", "Platform", "Admin", "platform_admin", None, True)
        school_admin = self.user("school.admin@demo.school", "School", "Admin", "school_admin", school, True)
        teacher_one = self.user("teacher.one@demo.school", "Sabira", "Teacher", "teacher", school)
        teacher_two = self.user("teacher.two@demo.school", "Habibu", "Teacher", "teacher", school)
        class_teacher = self.user("class.teacher@demo.school", "Class", "Teacher", "class_teacher", school)

        senior_one, _ = ClassRoom.objects.get_or_create(school=school, name="Senior One", defaults={"class_teacher": class_teacher})
        senior_two, _ = ClassRoom.objects.get_or_create(school=school, name="Senior Two", defaults={"class_teacher": teacher_two})

        students = []
        for index in range(1, 6):
            student_user = self.user(
                f"student.{index}@demo.school",
                f"Student{index}",
                "Demo",
                "student",
                school,
            )
            profile, _ = StudentProfile.objects.get_or_create(
                user=student_user,
                defaults={
                    "classroom": senior_one if index <= 3 else senior_two,
                    "admission_number": f"ADM-2026-{index:03d}",
                },
            )
            students.append(profile)

        for index in range(1, 4):
            parent_user = self.user(f"parent.{index}@demo.school", f"Parent{index}", "Demo", "parent", school)
            parent_profile, _ = ParentProfile.objects.get_or_create(user=parent_user)
            parent_profile.children.set(students[index - 1 : index + 1])

        math, _ = Subject.objects.get_or_create(school=school, code="MATH-S1", defaults={"name": "Mathematics", "teacher": teacher_one, "classroom": senior_one})
        eng, _ = Subject.objects.get_or_create(school=school, code="ENG-S1", defaults={"name": "English", "teacher": class_teacher, "classroom": senior_one})
        sci, _ = Subject.objects.get_or_create(school=school, code="SCI-S2", defaults={"name": "Science", "teacher": teacher_two, "classroom": senior_two})
        hist, _ = Subject.objects.get_or_create(school=school, code="HIST-S2", defaults={"name": "History", "teacher": teacher_one, "classroom": senior_two})

        for index, subject in enumerate([math, eng, sci, hist, math], start=1):
            Assignment.objects.get_or_create(
                title=f"Demo Assignment {index}",
                subject=subject,
                defaults={
                    "description": "Complete the task and submit your response before the due date.",
                    "teacher": subject.teacher,
                    "due_date": timezone.now() + timedelta(days=index + 3),
                },
            )

        for index in range(1, 6):
            Announcement.objects.get_or_create(
                title=f"Demo Announcement {index}",
                school=school,
                defaults={
                    "message": "This is a sample announcement for training.",
                    "created_by": school_admin if index == 1 else teacher_one,
                    "target_role": "" if index == 1 else "student",
                },
            )

        self.stdout.write(self.style.SUCCESS("Demo data created. Default password: Password123!"))

    def user(self, email, first_name, last_name, role, school, staff=False):
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "role": role,
                "school": school,
                "is_staff": staff,
                "is_superuser": role == "platform_admin",
            },
        )
        if created:
            user.set_password(PASSWORD)
            user.save()
        return user

