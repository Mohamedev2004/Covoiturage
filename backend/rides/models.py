from django.conf import settings
from django.db import models


class Ride(models.Model):
    driver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="rides")
    departure_city = models.CharField(max_length=100)
    destination_city = models.CharField(max_length=100)
    departure_time = models.DateTimeField()
    available_seats = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    car_model = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["departure_time"]

    def __str__(self) -> str:
        return f"{self.departure_city} -> {self.destination_city}"