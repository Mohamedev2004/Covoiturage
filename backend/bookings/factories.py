import random
import factory
from django.contrib.auth import get_user_model
from faker import Faker

from .models import Booking
from rides.models import Ride

fake = Faker()
User = get_user_model()


class BookingFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Booking

    @factory.lazy_attribute
    def ride(self):
        ride_ids = list(Ride.objects.values_list("id", flat=True))
        if not ride_ids:
            raise RuntimeError("No rides found to create bookings. Seed rides first.")
        # prefer rides with available seats
        rides = list(Ride.objects.filter(available_seats__gt=0))
        if not rides:
            rides = list(Ride.objects.all())
        return random.choice(rides)

    @factory.lazy_attribute
    def user(self):
        user_ids = list(User.objects.values_list("id", flat=True))
        if not user_ids:
            raise RuntimeError("No users found to create bookings. Seed users first.")
        return User.objects.get(id=random.choice(user_ids))

    @factory.lazy_attribute
    def seats_reserved(self):
        # This will be adjusted in post_generation to ensure it fits available seats
        return random.randint(1, 3)

    status = Booking.STATUS_CONFIRMED

    @factory.post_generation
    def _adjust_seats(self, create, extracted, **kwargs):
        if not create:
            return
        # ensure not booking own ride
        if self.user_id == self.ride.driver_id:
            # pick another user
            other_users = User.objects.exclude(id=self.ride.driver_id)
            if other_users.exists():
                self.user = random.choice(list(other_users))
                self.save(update_fields=["user"])

        # cap seats to available and decrement
        if self.ride.available_seats < self.seats_reserved:
            self.seats_reserved = max(1, min(self.seats_reserved, self.ride.available_seats or 1))
            self.save(update_fields=["seats_reserved"])

        if self.ride.available_seats >= self.seats_reserved:
            self.ride.available_seats -= self.seats_reserved
            self.ride.save(update_fields=["available_seats"])

