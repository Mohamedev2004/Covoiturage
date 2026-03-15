import { api } from "./client";
import type { Booking } from "@/types";

export async function createBooking(payload: { ride: number; seats_reserved: number }) {
  const { data } = await api.post<Booking>("/bookings", payload);
  return data;
}

export async function getMyBookings() {
  const { data } = await api.get<Booking[]>("/my-bookings");
  return data;
}