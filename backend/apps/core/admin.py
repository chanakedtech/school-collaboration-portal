from django.contrib import admin

from .models import Announcement, Assignment, ClassRoom, ParentProfile, School, StudentProfile, Subject, Submission

admin.site.register(School)
admin.site.register(ClassRoom)
admin.site.register(Subject)
admin.site.register(StudentProfile)
admin.site.register(ParentProfile)
admin.site.register(Assignment)
admin.site.register(Submission)
admin.site.register(Announcement)

