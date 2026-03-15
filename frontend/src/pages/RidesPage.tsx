import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getRides } from "@/api/rides";
import type { Ride } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { useDashboardContext } from "@/App";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DEFAULT_CITIES } from "@/lib/constants";
import { PlaceholderPattern } from "@/components/placeholder-pattern";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RidesPage() {
  const { toast } = useToast();
  const [rides, setRides] = useState<Ride[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const { setBreadcrumb } = useDashboardContext();
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [totalCount, setTotalCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setBreadcrumb(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink active>Search Rides</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }, [setBreadcrumb]);

  const cityOptions = useMemo(() => {
    const cities = new Set<string>(DEFAULT_CITIES);
    rides.forEach((ride) => {
      cities.add(ride.departure_city);
      cities.add(ride.destination_city);
    });
    return Array.from(cities).sort();
  }, [rides]);

  const fetchRides = async (filters?: { from?: string; to?: string; date?: string; page?: number; page_size?: number }) => {
    setLoading(true);
    try {
      const data = await getRides({ page, page_size: pageSize, ...filters });
      setRides(data.results);
      setTotalCount(data.count);
    } catch {
      toast("Could not fetch rides", "Check backend server and API URL");
      setRides([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fromQ = searchParams.get("from") ?? "";
    const toQ = searchParams.get("to") ?? "";
    const dateQ = searchParams.get("date") ?? "";
    const pageQ = Number(searchParams.get("page") ?? "1");
    setFrom(fromQ);
    setTo(toQ);
    setDate(dateQ);
    setPage(Number.isFinite(pageQ) && pageQ > 0 ? pageQ : 1);
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (date) params.date = date;
    params.page = String(page);
    setSearchParams(params);
    void fetchRides({ from: from || undefined, to: to || undefined, date: date || undefined, page, page_size: pageSize });
  }, [page, from, to, date]);

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    // fetching happens in effect
  };

  const resetSearch = async () => {
    setFrom("");
    setTo("");
    setDate("");
    setPage(1);
    // fetching happens in effect
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-medium tracking-tight">Search Rides</h1>
      </div>

      <Card className="border-none bg-sidebar-accent/50 shadow-none">
        <CardContent className="p-4">
          <form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" onSubmit={onSearch}>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">From</label>
              <Select value={from} onValueChange={(val) => setFrom(val ?? "")}>
                <SelectTrigger className="h-12 border-sidebar-border/70 bg-background font-medium">
                  <SelectValue placeholder="All departure cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All departure cities</SelectItem>
                  {cityOptions.map((city) => (
                    <SelectItem key={`from-${city}`} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">To</label>
              <Select value={to} onValueChange={(val) => setTo(val ?? "")}>
                <SelectTrigger className="h-12 border-sidebar-border/70 bg-background font-medium">
                  <SelectValue placeholder="All destination cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All destination cities</SelectItem>
                  {cityOptions.map((city) => (
                    <SelectItem key={`to-${city}`} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Date</label>
              <Calendar value={date} onChange={setDate} />
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1 h-10 shadow-sm">Search</Button>
              <Button type="button" variant="outline" size="icon" className="h-10 w-10" onClick={() => void resetSearch()} title="Reset filters">
                <span className="sr-only">Reset</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse border-sidebar-border/70">
              <CardContent className="h-48" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex-1">
          {rides.length === 0 ? (
            <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border flex items-center justify-center">
              <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
              <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="rounded-full bg-sidebar-accent p-6 mb-4">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">No rides found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-2">Try adjusting your filters or search for different cities to find more results.</p>
                <Button variant="link" className="mt-4" onClick={() => void resetSearch()}>Clear all filters</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rides.map((ride) => (
                  <Link key={ride.id} to={`/rides/${ride.id}`} className="group">
                    <Card className="h-full transition-all duration-300 hover:shadow-lg border-sidebar-border/70 hover:border-primary/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="font-bold text-primary bg-sidebar-accent px-2.5 py-0.5">
                            {ride.price} MAD
                          </Badge>
                          <Badge variant="outline" className="bg-green-50/50 text-green-700 border-green-200/50 text-[10px] uppercase tracking-wider font-bold">
                            {ride.available_seats} seats left
                          </Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                          {ride.departure_city} → {ride.destination_city}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <div className="text-sm text-muted-foreground">
                          <p className="flex items-center gap-2.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 text-primary/60"
                            >
                              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                              <line x1="16" x2="16" y1="2" y2="6" />
                              <line x1="8" x2="8" y1="2" y2="6" />
                              <line x1="3" x2="21" y1="10" y2="10" />
                            </svg>
                            <span className="font-medium">{formatDate(ride.departure_time)}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-sidebar-border/50">
                          <Avatar className="h-9 w-9 border border-sidebar-border">
                            <AvatarImage src={ride.driver_profile_picture ?? undefined} />
                            <AvatarFallback className="text-xs bg-sidebar-accent font-bold">
                              {ride.driver_name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold leading-none truncate">{ride.driver_name}</span>
                            <span className="text-xs text-muted-foreground truncate mt-1">{ride.car_model}</span>
                          </div>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= Math.ceil(totalCount / pageSize)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
