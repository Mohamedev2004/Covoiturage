import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createBooking } from "@/api/bookings";
import { getRide } from "@/api/rides";
import type { Ride } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { useDashboardContext } from "@/App";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export function RideDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [ride, setRide] = useState<Ride | null>(null);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const { setBreadcrumb } = useDashboardContext();

  useEffect(() => {
    setBreadcrumb(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/rides">Search Rides</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink active>Ride Details</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }, [setBreadcrumb]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRide(id);
        setRide(data);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const reserve = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!ride) {
      return;
    }

    setBooking(true);
    try {
      await createBooking({ ride: ride.id, seats_reserved: seats });
      toast("Booking confirmed");
      const updated = await getRide(id);
      setRide(updated);
    } catch {
      toast("Booking failed", "Check seat availability");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!ride) {
    return <p>Ride not found.</p>;
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-sidebar-border/70 shadow-md">
            <CardHeader className="bg-primary text-primary-foreground p-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold tracking-tight">
                  {ride.departure_city} → {ride.destination_city}
                </CardTitle>
                <Badge variant="secondary" className="bg-primary-foreground/10 text-primary-foreground border-none hover:bg-primary-foreground/20 px-4 py-1 text-lg font-bold">
                  {ride.price} MAD
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <div className="flex items-center justify-between border-b border-sidebar-border/50 pb-8">
                <div className="flex items-center gap-5">
                  <Avatar className="h-16 w-16 border-2 border-primary/10 shadow-sm">
                    <AvatarImage src={ride.driver_profile_picture ?? undefined} />
                    <AvatarFallback className="text-xl bg-sidebar-accent text-primary font-bold">
                      {ride.driver_name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl font-bold tracking-tight">{ride.driver_name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-primary/60"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      {ride.driver_phone}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="border-sidebar-border/70 hover:bg-sidebar-accent font-semibold">Contact Driver</Button>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-xl bg-primary/5 p-2.5 text-primary border border-primary/10 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Departure Time</p>
                      <p className="font-bold text-lg mt-0.5">{formatDate(ride.departure_time)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-xl bg-primary/5 p-2.5 text-primary border border-primary/10 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Car Model</p>
                      <p className="font-bold text-lg mt-0.5">{ride.car_model}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 rounded-xl bg-primary/5 p-2.5 text-primary border border-primary/10 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="3"/></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Available Seats</p>
                      <p className="font-bold text-lg mt-0.5">{ride.available_seats} seats remaining</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-sidebar-border/50">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Driver's Note</p>
                <div className="bg-sidebar-accent/30 rounded-xl p-6 border border-sidebar-border/50">
                  <p className="text-slate-700 leading-relaxed italic">
                    "{ride.description || "No description provided by the driver."}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6 border-sidebar-border/70 shadow-lg overflow-hidden">
            <CardHeader className="border-b border-sidebar-border/50 bg-slate-50/50">
              <CardTitle className="text-xl font-bold tracking-tight">Book your seat</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-muted-foreground ml-1">Number of seats</label>
                <Input
                  type="number"
                  min={1}
                  max={ride.available_seats}
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="text-xl h-14 font-bold border-sidebar-border/70 focus:ring-primary/20"
                />
              </div>
              <div className="pt-6 border-t border-sidebar-border/50 space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground font-medium">
                  <span>Price per seat</span>
                  <span className="text-foreground">{ride.price} MAD</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Total Price</span>
                  <span className="text-2xl font-black text-primary">{Number(ride.price) * seats} MAD</span>
                </div>
              </div>
              <Button 
                className="w-full h-14 text-lg font-black shadow-xl shadow-primary/20 transition-transform active:scale-[0.98]" 
                onClick={() => void reserve()}
                disabled={booking || ride.available_seats === 0}
              >
                {booking ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : ride.available_seats === 0 ? "Fully Booked" : "Confirm Booking"}
              </Button>
              {ride.available_seats === 0 && (
                <div className="bg-destructive/5 border border-destructive/10 rounded-lg p-3">
                  <p className="text-xs text-center text-destructive font-bold uppercase tracking-wider">No seats left for this ride</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}