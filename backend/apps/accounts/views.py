from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response

from .permissions import IsPlatformAdmin
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == "platform_admin":
            return User.objects.select_related("school").all()
        if user.role == "school_admin":
            return User.objects.select_related("school").filter(school=user.school)
        return User.objects.select_related("school").filter(id=user.id)

    def get_permissions(self):
        if self.action == "destroy":
            return [IsPlatformAdmin()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == "school_admin":
            serializer.save(school=user.school)
        else:
            serializer.save()

