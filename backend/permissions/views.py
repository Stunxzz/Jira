
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import Group, Permission

from .serializers import AddUserToGroupSerializer, GroupSerializer, PermissionSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().prefetch_related('permissions')
    serializer_class = GroupSerializer

    @action(detail=True, methods=['post'])
    def add_user(self, request, pk=None):
        group = self.get_object()
        serializer = AddUserToGroupSerializer(
            data=request.data,
            context={'group': group}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({'status': 'user added', 'user_id': user.id}, status=status.HTTP_200_OK)

class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer