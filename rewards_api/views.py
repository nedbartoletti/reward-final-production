from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum
from .models import AndroidApp, TaskCompletion
from .serializers import (
    UserSerializer, UserRegistrationSerializer,
    AndroidAppSerializer, TaskCompletionSerializer
)
from django.contrib.auth import get_user_model

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer

    @action(detail=False, methods=['GET'])
    def profile(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def dashboard(self, request):
        user = request.user
        total_points = user.points
        completed_tasks = TaskCompletion.objects.filter(
            user=user, status='approved'
        ).count()
        pending_tasks = TaskCompletion.objects.filter(
            user=user, status='pending'
        ).count()

        return Response({
            'total_points': total_points,
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks
        })

class AdminAndroidAppViewSet(viewsets.ModelViewSet):
    queryset = AndroidApp.objects.all()
    serializer_class = AndroidAppSerializer
    permission_classes = [permissions.IsAdminUser]

class UserAndroidAppViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AndroidApp.objects.all()
    serializer_class = AndroidAppSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['POST'])
    def submit_completion(self, request, pk=None):
        app = self.get_object()
        
        # Check if task is already completed
        if TaskCompletion.objects.filter(user=request.user, app=app).exists():
            return Response(
                {'detail': 'You have already submitted this task.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = TaskCompletionSerializer(data={
            'app': app.id,
            'screenshot': request.data.get('screenshot')
        })
        
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminTaskCompletionViewSet(viewsets.ModelViewSet):
    queryset = TaskCompletion.objects.all()
    serializer_class = TaskCompletionSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=True, methods=['POST'])
    def review(self, request, pk=None):
        task = self.get_object()
        status = request.data.get('status')
        notes = request.data.get('notes', '')

        if status not in ['approved', 'rejected']:
            return Response(
                {'detail': 'Invalid status. Must be either approved or rejected.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        task.status = status
        task.review_notes = notes
        task.reviewed_at = timezone.now()

        if status == 'approved':
            task.user.points += task.app.points
            task.user.save()

        task.save()
        return Response(TaskCompletionSerializer(task).data)

class UserTaskCompletionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TaskCompletionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TaskCompletion.objects.filter(user=self.request.user)
