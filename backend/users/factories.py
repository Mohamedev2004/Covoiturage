import factory
from django.contrib.auth import get_user_model
from faker import Faker

fake = Faker()
User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("email",)

    name = factory.Faker("name")
    email = factory.LazyAttribute(lambda _: fake.unique.email())
    phone_number = factory.Faker("phone_number")
    profile_picture = None
    is_staff = False
    is_superuser = False
    is_active = True

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        pwd = extracted or "Password123!"
        self.set_password(pwd)
        if create:
            self.save()

