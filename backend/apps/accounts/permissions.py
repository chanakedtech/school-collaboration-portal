from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsPlatformAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "platform_admin"


class SchoolScopedPermission(BasePermission):
    """
    Platform admins can access everything. School admins can manage their school.
    Other authenticated users get read access where the queryset permits it.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role == "platform_admin":
            return True
        if request.method in SAFE_METHODS:
            return True
        return request.user.role in ["school_admin", "teacher", "class_teacher"]

    def has_object_permission(self, request, view, obj):
        if request.user.role == "platform_admin":
            return True
        school = getattr(obj, "school", None)
        return school and request.user.school_id == school.id

