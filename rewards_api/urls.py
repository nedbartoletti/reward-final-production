from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from . import views

# Create schema view for API documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Rewards API",
        default_version='v1',
        description="API for managing app download rewards",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@rewards.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'admin/apps', views.AdminAndroidAppViewSet, basename='admin-apps')
router.register(r'apps', views.UserAndroidAppViewSet, basename='user-apps')
router.register(r'admin/tasks', views.AdminTaskCompletionViewSet, basename='admin-tasks')
router.register(r'tasks', views.UserTaskCompletionViewSet, basename='user-tasks')

urlpatterns = [
    # API documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Authentication endpoints
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API endpoints
    path('', include(router.urls)),
]
