from rest_framework import serializers

from .models import Announcement, Assignment, ClassRoom, ParentProfile, School, StudentProfile, Subject, Submission


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = "__all__"


class ClassRoomSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source="school.name", read_only=True)
    class_teacher_name = serializers.CharField(source="class_teacher.get_full_name", read_only=True)

    class Meta:
        model = ClassRoom
        fields = "__all__"


class SubjectSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source="school.name", read_only=True)
    teacher_name = serializers.CharField(source="teacher.get_full_name", read_only=True)
    classroom_name = serializers.CharField(source="classroom.name", read_only=True)

    class Meta:
        model = Subject
        fields = "__all__"


class StudentProfileSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = StudentProfile
        fields = "__all__"


class ParentProfileSerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = ParentProfile
        fields = "__all__"


class AssignmentSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    teacher_name = serializers.CharField(source="teacher.get_full_name", read_only=True)

    class Meta:
        model = Assignment
        fields = "__all__"


class SubmissionSerializer(serializers.ModelSerializer):
    assignment_title = serializers.CharField(source="assignment.title", read_only=True)
    student_name = serializers.CharField(source="student.get_full_name", read_only=True)

    class Meta:
        model = Submission
        fields = "__all__"
        read_only_fields = ["student", "submitted_at"]


class GradeSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ["grade", "feedback"]


class AnnouncementSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)

    class Meta:
        model = Announcement
        fields = "__all__"
        read_only_fields = ["created_by", "created_at"]

