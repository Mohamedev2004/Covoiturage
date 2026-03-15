import random
from typing import Optional

from django.core.management.base import BaseCommand, CommandParser
from django.contrib.auth import get_user_model
from django.db import transaction

from faker import Faker

from users.factories import UserFactory
from rides.factories import RideFactory, DEFAULT_CITIES
from bookings.factories import BookingFactory
from rides.models import Ride
from bookings.models import Booking


fake = Faker()
User = get_user_model()


class Command(BaseCommand):
    help = "Seed the database with users, rides, and bookings."

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("--users", type=int, default=20, help="Number of users to create")
        parser.add_argument("--rides", type=int, default=40, help="Number of rides to create")
        parser.add_argument("--bookings", type=int, default=60, help="Number of bookings to create")
        parser.add_argument("--clear", action="store_true", help="Clear existing data before seeding")
        parser.add_argument("--seed", type=int, help="Random seed for reproducibility")

    def handle(self, *args, **options):
        if options.get("seed") is not None:
            seed_value = int(options["seed"])
            random.seed(seed_value)
            fake.seed_instance(seed_value)
            self.stdout.write(self.style.NOTICE(f"Using random seed {seed_value}"))

        if options["clear"]:
            self._clear_data()

        users_count: int = options["users"]
        rides_count: int = options["rides"]
        bookings_count: int = options["bookings"]

        self.stdout.write(self.style.NOTICE("Seeding users..."))
        self._seed_users(users_count)
        self.stdout.write(self.style.SUCCESS(f"Users total: {User.objects.count()}"))

        self.stdout.write(self.style.NOTICE("Seeding rides..."))
        self._seed_rides(rides_count)
        self.stdout.write(self.style.SUCCESS(f"Rides total: {Ride.objects.count()}"))

        self.stdout.write(self.style.NOTICE("Seeding bookings..."))
        self._seed_bookings(bookings_count)
        self.stdout.write(self.style.SUCCESS(f"Bookings total: {Booking.objects.count()}"))

        self.stdout.write(self.style.SUCCESS("Seeding complete."))
        self.stdout.write(self.style.NOTICE(f"Cities used: {', '.join(DEFAULT_CITIES[:6])} ..."))

    def _clear_data(self) -> None:
        self.stdout.write(self.style.WARNING("Clearing existing data..."))
        Booking.objects.all().delete()
        Ride.objects.all().delete()
        # Keep superusers; delete non-staff users to avoid wiping admin accounts accidentally
        User.objects.filter(is_superuser=False, is_staff=False).delete()
        self.stdout.write(self.style.SUCCESS("Data cleared."))

    @transaction.atomic
    def _seed_users(self, count: int) -> None:
        existing = User.objects.count()
        to_create = max(0, count - existing)
        for _ in range(to_create):
            UserFactory(password="Password123!")

    @transaction.atomic
    def _seed_rides(self, count: int) -> None:
        users = list(User.objects.all())
        if not users:
            raise RuntimeError("No users available. Seed users first.")
        created = 0
        attempts = 0
        while created < count and attempts < count * 3:
            try:
                RideFactory()
                created += 1
            except RuntimeError:
                # No users available as drivers; should not happen since we checked
                break
            finally:
                attempts += 1

    @transaction.atomic
    def _seed_bookings(self, count: int) -> None:
        users = list(User.objects.all())
        rides = list(Ride.objects.all())
        if not users or not rides:
            self.stdout.write(self.style.WARNING("Skipping bookings: users or rides missing"))
            return

        created = 0
        attempts = 0
        while created < count and attempts < count * 5:
            ride = random.choice(rides)
            if ride.available_seats <= 0:
                attempts += 1
                continue
            user = random.choice(users)
            if user.id == ride.driver_id:
                attempts += 1
                continue
            try:
                # Create with factory to ensure seats decrement logic
                BookingFactory(ride=ride, user=user)
                created += 1
            except Exception:
                # Ignore and continue trying
                pass
            finally:
                attempts += 1
