import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings } from "@/api/bookings";
import { getMyRides } from "@/api/rides";
import type { Booking, Ride } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useDashboardContext } from "@/App";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PlaceholderPattern } from "@/components/placeholder-pattern";

export function DashboardPage() {
  const { toast } = useToast();
  const [rides, setRides] = useState<Ride[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { setBreadcrumb } = useDashboardContext();

  useEffect(() => {
    setBreadcrumb(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink active>My Trips</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }, [setBreadcrumb]);

  const loadData = async () => {
    setLoading(true);

    const [ridesResult, bookingsResult] = await Promise.allSettled([getMyRides(), getMyBookings()]);

    if (ridesResult.status === "fulfilled") {
      setRides(ridesResult.value);
    } else {
      setRides([]);
      toast("Could not load your rides");
    }

    if (bookingsResult.status === "fulfilled") {
      setBookings(bookingsResult.value);
    } else {
      setBookings([]);
      toast("Could not load your bookings");
    }

    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
        <Button variant="outline" size="sm" onClick={() => void loadData()} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <Tabs defaultValue="rides" className="w-full flex-1 flex flex-col gap-4">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="rides">My Rides</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="rides" className="mt-0 flex-1">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => <Card key={i} className="h-32 animate-pulse" />)}
            </div>
          ) : rides.length === 0 ? (
            <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-center">
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
              <div className="relative z-10 flex flex-col items-center justify-center py-10 text-center">
                <p className="text-muted-foreground mb-4">You haven't created any rides yet.</p>
                <Link to="/create-ride">
                  <Button variant="outline">Create your first ride</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rides.map((ride) => (
                <Card key={ride.id} className="overflow-hidden transition-all hover:shadow-md border-sidebar-border/70">
                  <CardContent className="p-0">
                    <div className="flex h-full">
                      <div className="w-1.5 bg-primary" />
                      <div className="flex-1 p-5">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-bold text-lg">
                            {ride.departure_city} → {ride.destination_city}
                          </p>
                          <Badge variant="secondary" className="bg-sidebar-accent text-sidebar-accent-foreground">{ride.price} MAD</Badge>
                        </div>
                        <div className="space-y-1.5 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                            {formatDate(ride.departure_time)}
                          </p>
                          <p className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="3"/></svg>
                            {ride.available_seats} seats remaining
                          </p>
                        </div>
                        <div className="mt-5 flex justify-end">
                          <Link to={`/rides/${ride.id}`}>
                            <Button size="sm" variant="ghost" className="hover:bg-sidebar-accent">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="mt-0 flex-1">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => <Card key={i} className="h-32 animate-pulse" />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-center">
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
              <div className="relative z-10 flex flex-col items-center justify-center py-10 text-center">
                <p className="text-muted-foreground mb-4">You haven't booked any rides yet.</p>
                <Link to="/rides">
                  <Button variant="outline">Find a ride</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden transition-all hover:shadow-md border-sidebar-border/70">
                  <CardContent className="p-0">
                    <div className="flex h-full">
                      <div className={`w-1.5 ${booking.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <div className="flex-1 p-5">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-bold text-lg">{booking.ride_summary.route}</p>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className={booking.status === 'confirmed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="space-y-1.5 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                            {formatDate(booking.ride_summary.departure_time)}
                          </p>
                          <p className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="19" cy="11" r="3"/></svg>
                            {booking.seats_reserved} seats reserved
                          </p>
                        </div>
                        <div className="mt-5 flex justify-end">
                          <Link to={`/rides/${booking.ride}`}>
                            <Button size="sm" variant="ghost" className="hover:bg-sidebar-accent">View Ride</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}