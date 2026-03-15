from rest_framework import generics, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError

from .filters import RideFilter
from .models import Ride
from .serializers import RideSerializer


class RidePagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = "page_size"
    max_page_size = 100
    page_query_param = "page"

    def paginate_queryset(self, queryset, request, view=None):
        page_size = self.get_page_size(request)
        if not page_size:
            return None
        paginator = self.django_paginator_class(queryset, page_size)
        page_number = request.query_params.get(self.page_query_param, 1)
        try:
            self.page = paginator.page(page_number)
        except Exception:
            self.page = paginator.page(paginator.num_pages)
        if paginator.num_pages > 1 and self.template is not None:
            self.display_page_controls = True
        self.request = request
        return list(self.page)


class RideListCreateView(generics.ListCreateAPIView):
    serializer_class = RideSerializer
    filterset_class = RideFilter
    pagination_class = RidePagination

    def get_queryset(self):
        queryset = Ride.objects.filter(available_seats__gt=0)
        from_q = self.request.query_params.get("from")
        to_q = self.request.query_params.get("to")
        date_q = self.request.query_params.get("date")

        if from_q:
            queryset = queryset.filter(departure_city__icontains=from_q)
        if to_q:
            queryset = queryset.filter(destination_city__icontains=to_q)
        if date_q:
            queryset = queryset.filter(departure_time__date=date_q)

        return queryset.order_by("departure_time")

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        seats = serializer.validated_data.get("available_seats", 0)
        if seats < 1:
            raise ValidationError({"available_seats": "Must be at least 1"})
        serializer.save(driver=self.request.user)


class RideDetailView(generics.RetrieveAPIView):
    queryset = Ride.objects.all()
    serializer_class = RideSerializer
    permission_classes = [permissions.AllowAny]


class MyRidesView(generics.ListAPIView):
    serializer_class = RideSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Ride.objects.filter(driver=self.request.user)
