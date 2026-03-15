from rest_framework import serializers
from .models import Ride


class RideSerializer(serializers.ModelSerializer):
    driver_name = serializers.CharField(source="driver.name", read_only=True)
    driver_phone = serializers.CharField(source="driver.phone_number", read_only=True)
    driver_profile_picture = serializers.ImageField(source="driver.profile_picture", read_only=True)

    class Meta:
        model = Ride
        fields = [
            "id",
            "driver",
            "driver_name",
            "driver_phone",
            "driver_profile_picture",
            "departure_city",
            "destination_city",
            "departure_time",
            "available_seats",
            "price",
            "car_model",
            "description",
            "created_at",
        ]
        read_only_fields = ["driver", "created_at"]