
from rest_framework.validators import UniqueValidator

from api.models import AppUser

from rest_framework import serializers
from django.contrib.auth.models import Group, Permission


class GroupSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        max_length=150,
        validators=[UniqueValidator(
            queryset=Group.objects.all(),
            message="Group with this name already exists."
        )]
    )
    # Поле за показване на имената на правата
    permissions_display = serializers.SerializerMethodField(read_only=True)

    # Поле за създаване/ъпдейт на правата
    permissions = serializers.PrimaryKeyRelatedField(
        queryset=Permission.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = Group
        fields = ["id", "name", "permissions", "permissions_display"]

    def get_permissions_display(self, obj):
        return [perm.name for perm in obj.permissions.all()]

    def create(self, validated_data):
        perms = validated_data.pop('permissions', [])
        group = Group.objects.create(**validated_data)
        if perms:
            group.permissions.set(perms)
        return group

    def update(self, instance, validated_data):
        perms = validated_data.pop('permissions', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if perms is not None:
            instance.permissions.set(perms)
        instance.save()
        return instance


class AddUserToGroupSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=AppUser.objects.all()
    )

    def save(self, **kwargs):
        group = self.context['group']
        user = self.validated_data['user']
        group.user_set.add(user)
        return user


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "name", "codename"]