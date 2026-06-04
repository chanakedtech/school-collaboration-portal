from rest_framework import decorators, generics, permissions, response, status, viewsets

from apps.accounts.permissions import (
    AnnouncementPermission,
    AssignmentPermission,
    GradePermission,
    IsPlatformAdmin,
    IsParent,
    SchoolScopedPermission,
    SubmissionPermission,
)

from .models import Announcement, Assignment, ClassRoom, School, Subject, Submission
from .serializers import (
    AnnouncementSerializer,
    AssignmentSerializer,
    ChildDetailSerializer,
    ClassRoomSerializer,
    GradeSubmissionSerializer,
    SchoolSerializer,
    SubjectSerializer,
    SubmissionSerializer,
)


class SchoolViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolSerializer
    queryset = School.objects.all()
    permission_classes = [IsPlatformAdmin]


class SchoolScopedViewSet(viewsets.ModelViewSet):
    permission_classes = [SchoolScopedPermission]

    def school_queryset(self, queryset):
        user = self.request.user
        if user.role == "platform_admin":
            return queryset
        return queryset.filter(school=user.school)


class ClassRoomViewSet(SchoolScopedViewSet):
    serializer_class = ClassRoomSerializer

    def get_queryset(self):
        return self.school_queryset(ClassRoom.objects.select_related("school", "class_teacher"))


class SubjectViewSet(SchoolScopedViewSet):
    serializer_class = SubjectSerializer

    def get_queryset(self):
        queryset = Subject.objects.select_related("school", "teacher", "classroom")
        return self.school_queryset(queryset)


class AssignmentViewSet(SchoolScopedViewSet):
    serializer_class = AssignmentSerializer
    permission_classes = [AssignmentPermission]

    def get_queryset(self):
        queryset = Assignment.objects.select_related("subject", "subject__school", "teacher")
        user = self.request.user
        if user.role in ["teacher", "class_teacher"]:
            queryset = queryset.filter(teacher=user)
        if user.role == "student" and hasattr(user, "student_profile"):
            queryset = queryset.filter(subject__classroom=user.student_profile.classroom)
        if user.role == "parent" and hasattr(user, "parent_profile"):
            classrooms = user.parent_profile.children.values_list("classroom_id", flat=True)
            queryset = queryset.filter(subject__classroom_id__in=classrooms)
        if user.role != "platform_admin":
            queryset = queryset.filter(subject__school=user.school)
        return queryset

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class SubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = SubmissionSerializer
    permission_classes = [SubmissionPermission]

    def get_queryset(self):
        queryset = Submission.objects.select_related("assignment", "assignment__subject", "student")
        user = self.request.user
        if user.role == "student":
            return queryset.filter(student=user)
        if user.role in ["teacher", "class_teacher"]:
            return queryset.filter(assignment__teacher=user)
        if user.role == "parent" and hasattr(user, "parent_profile"):
            child_users = user.parent_profile.children.values_list("user_id", flat=True)
            return queryset.filter(student_id__in=child_users)
        if user.role == "school_admin":
            return queryset.filter(assignment__subject__school=user.school)
        if user.role == "platform_admin":
            return queryset
        return queryset.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @decorators.action(detail=True, methods=["patch"], permission_classes=[GradePermission], serializer_class=GradeSubmissionSerializer)
    def grade(self, request, pk=None):
        submission = self.get_object()
        serializer = GradeSubmissionSerializer(submission, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response(SubmissionSerializer(submission).data)


class ParentChildrenView(generics.ListAPIView):
    serializer_class = ChildDetailSerializer
    permission_classes = [IsParent]

    def get_queryset(self):
        from apps.core.models import StudentProfile
        parent_profile = getattr(self.request.user, "parent_profile", None)
        if not parent_profile:
            return StudentProfile.objects.none()
        return parent_profile.children.select_related("user", "classroom").all()


class AnnouncementViewSet(SchoolScopedViewSet):
    serializer_class = AnnouncementSerializer
    permission_classes = [AnnouncementPermission]

    def get_queryset(self):
        queryset = Announcement.objects.select_related("school", "classroom", "subject", "created_by")
        user = self.request.user
        if user.role not in ["platform_admin", "school_admin"]:
            queryset = queryset.filter(target_role__in=["", user.role])
        return self.school_queryset(queryset)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

