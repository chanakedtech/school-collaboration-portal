from django.conf import settings
from django.db import models


class School(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=32, blank=True)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ClassRoom(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="classes")
    name = models.CharField(max_length=100)
    class_teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="classrooms_led")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("school", "name")

    def __str__(self):
        return f"{self.name} - {self.school.name}"


class Subject(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="subjects")
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=32)
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="subjects")
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE, related_name="subjects")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("school", "code")

    def __str__(self):
        return self.name


class StudentProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_profile")
    classroom = models.ForeignKey(ClassRoom, on_delete=models.SET_NULL, null=True, blank=True, related_name="students")
    admission_number = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.user.get_full_name()


class ParentProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="parent_profile")
    children = models.ManyToManyField(StudentProfile, related_name="parents", blank=True)

    def __str__(self):
        return self.user.get_full_name()


class Assignment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="assignments")
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="assignments")
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name="submissions")
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="submissions")
    answer_text = models.TextField()
    grade = models.CharField(max_length=16, blank=True)
    feedback = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("assignment", "student")

    def __str__(self):
        return f"{self.student} - {self.assignment}"


class Announcement(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="announcements")
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE, null=True, blank=True, related_name="announcements")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True, blank=True, related_name="announcements")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="announcements")
    target_role = models.CharField(max_length=32, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

