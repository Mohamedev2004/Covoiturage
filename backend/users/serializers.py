from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "name", "email", "password", "phone_number", "profile_picture"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        email = validated_data.get("email")
        user = User(**validated_data)
        user.username = email
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "phone_number", "profile_picture"]
        read_only_fields = ["email"]