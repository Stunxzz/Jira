from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import GroupViewSet, PermissionViewSet

router = DefaultRouter()
router.register(r'groups', GroupViewSet, basename='group')
router.register(r'permissions', PermissionViewSet, basename='permission')

urlpatterns = [
    path('', include(router.urls)),
]