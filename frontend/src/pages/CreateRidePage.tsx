import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRide } from "@/api/rides";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useDashboardContext } from "@/App";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DEFAULT_CITIES } from "@/lib/constants";

export function CreateRidePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [departureCity, setDepartureCity] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [availableSeats, setAvailableSeats] = useState(1);
  const [price, setPrice] = useState(50);
  const [carModel, setCarModel] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { setBreadcrumb } = useDashboardContext();
  const cities = DEFAULT_CITIES;

  useEffect(() => {
    setBreadcrumb(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink active>Publish Ride</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }, [setBreadcrumb]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!departureCity || !destinationCity) {
      toast("Please select both cities");
      return;
    }

    setLoading(true);
    try {
      await createRide({
        departure_city: departureCity,
        destination_city: destinationCity,
        departure_time: new Date(departureTime).toISOString(),
        available_seats: availableSeats,
        price,
        car_model: carModel,
        description,
      });
      toast("Ride published");
      navigate("/dashboard");
    } catch {
      toast("Could not create ride", "Please check the form values");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Publish a Ride</h1>
        <p className="text-muted-foreground font-medium">Fill in the details below to share your journey with others.</p>
      </div>

      <Card className="border-sidebar-border/70 shadow-md">
        <CardContent className="p-8">
          <form className="space-y-10" onSubmit={onSubmit}>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Departure City</label>
                <Select value={departureCity} onValueChange={(val) => setDepartureCity(val ?? "")}>
                  <SelectTrigger className="h-12 border-sidebar-border/70 bg-background font-medium">
                    <SelectValue placeholder="Select departure city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select departure city</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={`from-${city}`} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Destination City</label>
                <Select value={destinationCity} onValueChange={(val) => setDestinationCity(val ?? "")}>
                  <SelectTrigger className="h-12 border-sidebar-border/70 bg-background font-medium">
                    <SelectValue placeholder="Select destination city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select destination city</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={`to-${city}`} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Departure Date & Time</label>
                <DateTimePicker value={departureTime} onChange={setDepartureTime} />
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Available Seats</label>
                <Input 
                  type="number" 
                  min={1} 
                  max={8}
                  value={availableSeats} 
                  onChange={(e) => setAvailableSeats(Number(e.target.value))} 
                  className="h-12 border-sidebar-border/70 font-bold text-lg"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Price per Seat (MAD)</label>
                <Input 
                  type="number" 
                  min={0} 
                  value={price} 
                  onChange={(e) => setPrice(Number(e.target.value))} 
                  className="h-12 border-sidebar-border/70 font-bold text-lg"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Car Model</label>
                <Input 
                  placeholder="e.g. Dacia Logan, Renault Clio..." 
                  value={carModel} 
                  onChange={(e) => setCarModel(e.target.value)} 
                  className="h-12 border-sidebar-border/70 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Description (Optional)</label>
              <Textarea 
                placeholder="Tell passengers about your car, luggage space, or rules..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[140px] resize-none border-sidebar-border/70 bg-background font-medium"
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-sidebar-border/50">
              <Button type="button" variant="ghost" className="px-6 font-bold hover:bg-sidebar-accent" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" size="lg" className="px-10 font-black shadow-xl shadow-primary/20" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </span>
                ) : "Publish Ride"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
