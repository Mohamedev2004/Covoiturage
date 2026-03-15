from django.db import transaction
from rest_framework import serializers
from .models import Booking
from rides.models import Ride


class BookingSerializer(serializers.ModelSerializer):
    ride_summary = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "user", "ride", "ride_summary", "seats_reserved", "status", "created_at"]
        read_only_fields = ["id", "user", "status", "created_at"]

    def get_ride_summary(self, obj):
        return {
            "id": obj.ride.id,
            "route": f"{obj.ride.departure_city} -> {obj.ride.destination_city}",
            "departure_time": obj.ride.departure_time,
            "price": str(obj.ride.price),
        }

    def validate_seats_reserved(self, value):
        if value < 1:
            raise serializers.ValidationError("You must reserve at least one seat")
        return value

    @transaction.atomic
    def create(self, validated_data):
        user = self.context["request"].user
        seats_reserved = validated_data["seats_reserved"]
        ride = Ride.objects.select_for_update().get(pk=validated_data["ride"].id)

        if ride.driver_id == user.id:
            raise serializers.ValidationError("You cannot reserve your own ride")

        if seats_reserved > ride.available_seats:
            raise serializers.ValidationError("Not enough seats available")

        ride.available_seats -= seats_reserved
        ride.save(update_fields=["available_seats"])

        return Booking.objects.create(user=user, ride=ride, seats_reserved=seats_reserved)