from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from api.models import AppUser
from management.models import Department
from management.serializers import DepartmentSerializer
from permissions.serializers import GroupSerializer


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = AppUser
        fields = ["email", "first_name", "last_name", "password", "password2", "avatar"]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        avatar = validated_data.pop("avatar", None)
        password = validated_data.pop("password")
        user = AppUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(use_url=True)

    class Meta:
        model = AppUser
        fields = ["email", "first_name", "last_name", "avatar"]


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    # За display (read-only)
    groups = GroupSerializer(many=True, read_only=True)
    department = DepartmentSerializer(read_only=True)

    # За write/update
    groups_ids = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(), many=True, write_only=True, required=False
    )
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(), source="department", write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = AppUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
            "is_active",
            'avatar',
            "is_staff",
            "groups",
            "groups_ids",
            "department",
            "department_id"
        ]

    def create(self, validated_data):
        groups_data = validated_data.pop("groups_ids", [])
        department = validated_data.pop("department_id", None)
        password = validated_data.pop("password", None)

        user = AppUser(**validated_data)
        if department:
            user.department = department
        if password:
            user.set_password(password)
        user.save()
        user.groups.set(groups_data)
        return user

    def update(self, instance, validated_data):
        groups_data = validated_data.pop("groups_ids", None)
        department = validated_data.pop("department_id", None)
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if department is not None:
            instance.department = department
        if password:
            instance.set_password(password)
        instance.save()

        if groups_data is not None:
            instance.groups.set(groups_data)

        return instance
