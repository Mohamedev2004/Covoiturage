from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Ride",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("departure_city", models.CharField(max_length=100)),
                ("destination_city", models.CharField(max_length=100)),
                ("departure_time", models.DateTimeField()),
                ("available_seats", models.PositiveIntegerField()),
                ("price", models.DecimalField(decimal_places=2, max_digits=8)),
                ("car_model", models.CharField(max_length=120)),
                ("description", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "driver",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="rides", to=settings.AUTH_USER_MODEL),
                ),
            ],
            options={
                "ordering": ["departure_time"],
            },
        ),
    ]