from django.contrib import admin
from .models import Ride


@admin.register(Ride)
class RideAdmin(admin.ModelAdmin):
    list_display = ("id", "driver", "departure_city", "destination_city", "departure_time", "available_seats", "price")
    list_filter = ("departure_city", "destination_city")
    search_fields = ("departure_city", "destination_city", "driver__email")