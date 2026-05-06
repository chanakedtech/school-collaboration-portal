from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.accounts.views import CurrentUserView, RegisterView, UserViewSet
from apps.core.views import (
    AnnouncementViewSet,
    AssignmentViewSet,
    ClassRoomViewSet,
    SchoolViewSet,
    SubjectViewSet,
    SubmissionViewSet,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("schools", SchoolViewSet, basename="school")
router.register("users", UserViewSet, basename="user")
router.register("classes", ClassRoomViewSet, basename="classroom")
router.register("subjects", SubjectViewSet, basename="subject")
router.register("assignments", AssignmentViewSet, basename="assignment")
router.register("submissions", SubmissionViewSet, basename="submission")
router.register("announcements", AnnouncementViewSet, basename="announcement")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", CurrentUserView.as_view(), name="current_user"),
    path("api/", include(router.urls)),
]

