from django.urls import path
from .views import MyRidesView, RideDetailView, RideListCreateView

urlpatterns = [
    path("rides", RideListCreateView.as_view(), name="ride-list-create"),
    path("rides/<int:pk>", RideDetailView.as_view(), name="ride-detail"),
    path("my-rides", MyRidesView.as_view(), name="my-rides"),
]