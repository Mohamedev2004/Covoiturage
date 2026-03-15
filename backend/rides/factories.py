import random
from decimal import Decimal
import factory
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from faker import Faker

from .models import Ride

fake = Faker()
User = get_user_model()

DEFAULT_CITIES = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Tangier",
    "Fes",
    "Agadir",
    "Meknes",
    "Oujda",
    "Kenitra",
    "Tetouan",
    "Safi",
    "El Jadida",
    "Mohammedia",
    "Beni Mellal",
    "Nador",
    "Khouribga",
    "Settat",
    "Temara",
]

CAR_MODELS = [
    "Dacia Duster",
    "Renault Clio",
    "Peugeot 208",
    "Hyundai i10",
    "Toyota Yaris",
    "Volkswagen Polo",
    "Kia Picanto",
    "Skoda Octavia",
]


class RideFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Ride

    @factory.lazy_attribute
    def driver(self):
        # Pick a random existing user as driver
        user_ids = list(User.objects.values_list("id", flat=True))
        if not user_ids:
            raise RuntimeError("No users found to assign as drivers. Seed users first.")
        return User.objects.get(id=random.choice(user_ids))

    @factory.lazy_attribute
    def departure_city(self):
        return random.choice(DEFAULT_CITIES)

    @factory.lazy_attribute
    def destination_city(self):
        # ensure different from departure
        choices = [c for c in DEFAULT_CITIES if c != self.departure_city]
        return random.choice(choices)

    @factory.lazy_attribute
    def departure_time(self):
        # timezone-aware future datetime within next 30 days
        days = random.randint(1, 30)
        hours = random.randint(0, 23)
        minutes = random.randint(0, 59)
        return timezone.now() + timedelta(days=days, hours=hours, minutes=minutes)

    available_seats = factory.LazyFunction(lambda: random.randint(1, 5))

    @factory.lazy_attribute
    def price(self):
        value = Decimal(random.uniform(20, 300)).quantize(Decimal("0.01"))
        return value

    car_model = factory.LazyFunction(lambda: random.choice(CAR_MODELS))
    description = factory.Faker("sentence", nb_words=12)
