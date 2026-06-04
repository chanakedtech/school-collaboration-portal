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


class ChildSubmissionSerializer(serializers.ModelSerializer):
    assignment_title = serializers.CharField(source="assignment.title", read_only=True)

    class Meta:
        model = Submission
        fields = ["id", "assignment", "assignment_title", "answer_text", "grade", "feedback", "submitted_at"]


class ChildAssignmentSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    submission = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = ["id", "title", "description", "due_date", "subject", "subject_name", "submission"]

    def get_submission(self, obj):
        student_id = self.context.get("student_id")
        sub = obj.submissions.filter(student_id=student_id).first()
        return ChildSubmissionSerializer(sub).data if sub else None


class ChildDetailSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="user.get_full_name", read_only=True)
    classroom_name = serializers.CharField(source="classroom.name", read_only=True)
    assignments = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = ["id", "user", "student_name", "admission_number", "classroom", "classroom_name", "assignments"]

    def get_assignments(self, obj):
        assignments = Assignment.objects.filter(
            subject__classroom=obj.classroom
        ).select_related("subject").prefetch_related("submissions")
        return ChildAssignmentSerializer(assignments, many=True, context={"student_id": obj.user_id}).data


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

    def validate(self, attrs):
        request = self.context.get("request")
        if request:
            assignment = attrs.get("assignment")
            if assignment and hasattr(request.user, "school_id"):
                if assignment.subject.school_id != request.user.school_id:
                    raise serializers.ValidationError({"assignment": "Assignment does not belong to your school."})
            if assignment and Submission.objects.filter(assignment=assignment, student=request.user).exists():
                raise serializers.ValidationError({"assignment": "You have already submitted this assignment."})
        return attrs


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

