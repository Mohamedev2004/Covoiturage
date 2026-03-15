from django.urls import path
from .views import BookingCreateView, MyBookingsView

urlpatterns = [
    path("bookings", BookingCreateView.as_view(), name="booking-create"),
    path("my-bookings", MyBookingsView.as_view(), name="my-bookings"),
]