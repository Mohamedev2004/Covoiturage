import { api } from "./client";
import type { User } from "@/types";

export type LoginResponse = {
  access: string;
  refresh: string;
};

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}) {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function logout(refresh: string) {
  await api.post("/auth/logout", { refresh });
}

export async function getProfile() {
  const { data } = await api.get<User>("/auth/profile");
  return data;
}

export async function updateProfile(payload: { name: string; phone_number: string }) {
  const { data } = await api.patch<User>("/auth/profile", payload);
  return data;
}