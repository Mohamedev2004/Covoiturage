export type User = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  profile_picture?: string | null;
};

export type Ride = {
  id: number;
  driver: number;
  driver_name: string;
  driver_phone: string;
  driver_profile_picture?: string | null;
  departure_city: string;
  destination_city: string;
  departure_time: string;
  available_seats: number;
  price: string;
  car_model: string;
  description: string;
  created_at: string;
};

export type Booking = {
  id: number;
  user: number;
  ride: number;
  ride_summary: {
    id: number;
    route: string;
    departure_time: string;
    price: string;
  };
  seats_reserved: number;
  status: "confirmed" | "cancelled";
  created_at: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
