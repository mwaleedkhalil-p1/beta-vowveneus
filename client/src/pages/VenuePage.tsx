import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { VenueCard } from "@/components/VenueCard";
import { VenueFilters } from "@/components/VenueFilters";
import { type Venue } from "@shared/schema";
import { categorizeVenue } from "@/lib/venues";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/lib/api-config";

export default function VenuePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [capacity, setCapacity] = useState([0, 3000]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/auth');
    }
  }, [user, authLoading, setLocation]);

  const { data: venues, isLoading } = useQuery<Venue[]>({
    queryKey: [API_ENDPOINTS.VENUES],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.VENUES);
      if (!response.ok) {
        throw new Error(response.statusText || "Failed to fetch venues");
      }
      return response.json();
    },
  });

  const filteredVenues = venues?.filter((venue) => {
    const meetsCapacity =
      venue.capacity >= capacity[0] && venue.capacity <= capacity[1];
    const meetsPrice =
      Number(venue.price) >= priceRange[0] && Number(venue.price) <= priceRange[1];
    const meetsCategory =
      category === "all" || categorizeVenue(Number(venue.price)) === category;
    const meetsSearch = searchQuery
      ? venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return meetsCapacity && meetsPrice && meetsCategory && meetsSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full h-[400px] relative">
          <img 
            src="/banner.png" 
            alt="Venue Banner" 
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-white">
              Find Your Perfect Wedding Venue
            </h1>
            <p className="text-lg md:text-xl text-center text-white/90 mb-8">
              Discover and book the most beautiful wedding venues in your area
            </p>
            <div className="w-full max-w-2xl mx-auto relative">
              <div className="h-12 bg-white/95 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>Loading filters...</div>
              <div className="md:col-span-3">Loading venues...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-[400px] relative">
        <img 
          src="/banner.png" 
          alt="Venue Banner" 
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-white">
            Find Your Perfect Wedding Venue
          </h1>
          <p className="text-lg md:text-xl text-center text-white/90 mb-8">
            Discover and book the most beautiful wedding venues in your area
          </p>
          <div className="w-full max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search venues by name or location..."
              className="pl-10 h-12 bg-white/95 border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:sticky md:top-4 h-fit">
                <VenueFilters
                  capacity={capacity}
                  onCapacityChange={setCapacity}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  category={category}
                  onCategoryChange={setCategory}
                />
              </div>

              <div className="md:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVenues?.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>

                {filteredVenues?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">
                      No venues match your criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
