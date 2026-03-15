import django_filters
from .models import Ride


class RideFilter(django_filters.FilterSet):
    from_city = django_filters.CharFilter(field_name="departure_city", lookup_expr="icontains")
    to_city = django_filters.CharFilter(field_name="destination_city", lookup_expr="icontains")
    date = django_filters.DateFilter(field_name="departure_time", lookup_expr="date")

    class Meta:
        model = Ride
        fields = ["from_city", "to_city", "date"]