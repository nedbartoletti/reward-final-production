from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import AndroidApp, TaskCompletion

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'profile_picture', 'points', 'first_name', 'last_name', 'role', 'is_staff', 'is_superuser')
        read_only_fields = ('points', 'role', 'is_staff', 'is_superuser')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class AndroidAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = AndroidApp
        fields = '__all__'

class TaskCompletionSerializer(serializers.ModelSerializer):
    app_name = serializers.CharField(source='app.name', read_only=True)
    points = serializers.IntegerField(source='app.points', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = TaskCompletion
        fields = ('id', 'user', 'app', 'app_name', 'points', 'username', 'screenshot', 
                 'status', 'completed_at', 'reviewed_at', 'review_notes')
        read_only_fields = ('user', 'status', 'reviewed_at', 'review_notes')
