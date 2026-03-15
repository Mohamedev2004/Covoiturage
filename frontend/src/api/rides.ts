import { api } from "./client";
import type { Ride, Paginated } from "@/types";

export async function getRides(params?: { from?: string; to?: string; date?: string; page?: number; page_size?: number }) {
  const { data } = await api.get<Paginated<Ride>>("/rides", { params });
  return data;
}

export async function getRide(id: string) {
  const { data } = await api.get<Ride>(`/rides/${id}`);
  return data;
}

export async function createRide(payload: {
  departure_city: string;
  destination_city: string;
  departure_time: string;
  available_seats: number;
  price: number;
  car_model: string;
  description: string;
}) {
  const { data } = await api.post<Ride>("/rides", payload);
  return data;
}

export async function getMyRides() {
  const { data } = await api.get<Ride[]>("/my-rides");
  return data;
}
