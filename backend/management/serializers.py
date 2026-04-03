from rest_framework import serializers
from .models import Department
from rest_framework.validators import UniqueValidator

class DepartmentSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        max_length=150,
        validators=[UniqueValidator(
            queryset=Department.objects.all(),
            message="Department with this name already exists."
        )]
    )

    class Meta:
        model = Department
        fields = '__all__'