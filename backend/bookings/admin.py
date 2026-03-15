from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "ride", "seats_reserved", "status", "created_at")
    list_filter = ("status",)