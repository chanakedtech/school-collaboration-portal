from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "platform_admin")
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = "student", "Student"
        TEACHER = "teacher", "Teacher"
        CLASS_TEACHER = "class_teacher", "Class Teacher"
        PARENT = "parent", "Parent"
        SCHOOL_ADMIN = "school_admin", "School Admin"
        PLATFORM_ADMIN = "platform_admin", "Platform Admin"

    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=32, choices=Roles.choices, default=Roles.STUDENT)
    school = models.ForeignKey("core.School", on_delete=models.SET_NULL, null=True, blank=True, related_name="users")
    phone_number = models.CharField(max_length=32, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"

