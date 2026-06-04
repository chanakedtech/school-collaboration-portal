from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsPlatformAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "platform_admin"


class IsSchoolAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "school_admin"


class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["teacher", "class_teacher"]


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "student"


class IsParent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "parent"


class IsPlatformOrSchoolAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["platform_admin", "school_admin"]


class SchoolScopedPermission(BasePermission):
    """
    Read: any authenticated user.
    Write: school_admin, teacher, class_teacher only.
    Object-level: platform_admin bypasses; others must share the same school.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.role in ["platform_admin", "school_admin", "teacher", "class_teacher"]

    def has_object_permission(self, request, view, obj):
        if request.user.role == "platform_admin":
            return True
        school = _resolve_school(obj)
        return school is not None and request.user.school_id == school.id


class AssignmentPermission(BasePermission):
    """
    Read: authenticated users (queryset already scopes what they see).
    Create: teachers and class_teachers only.
    Update/Delete: only the teacher who owns the assignment, or platform_admin.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        if view.action == "create":
            return request.user.role in ["teacher", "class_teacher"]
        return True  # object-level handles update/delete

    def has_object_permission(self, request, view, obj):
        if request.user.role == "platform_admin":
            return True
        if request.method in SAFE_METHODS:
            return True
        return obj.teacher_id == request.user.id


class SubmissionPermission(BasePermission):
    """
    Create: students only (one submission per assignment enforced by model).
    Read: student sees own; teacher sees submissions for their assignments;
          parent sees their children's; school_admin sees school-wide; platform_admin sees all.
    Update/Delete: not allowed (use the grade action instead).
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if view.action == "create":
            return request.user.role == "student"
        if view.action in ["update", "partial_update", "destroy"]:
            return False
        return True

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role == "platform_admin":
            return True
        if user.role == "student":
            return obj.student_id == user.id
        if user.role in ["teacher", "class_teacher"]:
            return obj.assignment.teacher_id == user.id
        if user.role == "school_admin":
            return obj.assignment.subject.school_id == user.school_id
        if user.role == "parent":
            child_ids = user.parent_profile.children.values_list("user_id", flat=True)
            return obj.student_id in child_ids
        return False


class GradePermission(BasePermission):
    """Only teachers who own the assignment can grade its submissions."""

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["teacher", "class_teacher"]

    def has_object_permission(self, request, view, obj):
        return obj.assignment.teacher_id == request.user.id


class AnnouncementPermission(BasePermission):
    """
    Read: authenticated users (queryset scopes by target_role and school).
    Create: school_admin and class_teacher only.
    Update/Delete: only the creator, school_admin of same school, or platform_admin.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        if view.action == "create":
            return request.user.role in ["platform_admin", "school_admin", "class_teacher"]
        return True

    def has_object_permission(self, request, view, obj):
        if request.user.role == "platform_admin":
            return True
        if request.method in SAFE_METHODS:
            return True
        if request.user.role == "school_admin":
            return obj.school_id == request.user.school_id
        return obj.created_by_id == request.user.id


class UserManagementPermission(BasePermission):
    """
    List/Retrieve: authenticated (queryset already scopes visibility).
    Create: school_admin (within their school) or platform_admin.
    Update: school_admin for same-school users, or platform_admin.
    Delete: platform_admin only.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        if view.action == "create":
            return request.user.role in ["platform_admin", "school_admin"]
        if view.action == "destroy":
            return request.user.role == "platform_admin"
        return request.user.role in ["platform_admin", "school_admin"]

    def has_object_permission(self, request, view, obj):
        if request.user.role == "platform_admin":
            return True
        if request.method in SAFE_METHODS:
            return True
        if request.user.role == "school_admin":
            return obj.school_id == request.user.school_id
        return obj.id == request.user.id


def _resolve_school(obj):
    """Walk common FK paths to find the school for an object."""
    if hasattr(obj, "school"):
        return obj.school
    if hasattr(obj, "subject"):
        return getattr(obj.subject, "school", None)
    return None

