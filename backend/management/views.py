from rest_framework import viewsets, permissions, generics
from .models import Department
from .serializers import DepartmentSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by('id')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.DjangoModelPermissions]
    search_fields = ['name']

