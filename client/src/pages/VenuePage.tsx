import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VenueCard } from "@/components/VenueCard";
import { VenueFilters } from "@/components/VenueFilters";
import { type Venue } from "@shared/schema";
import { categorizeVenue } from "@/lib/venues";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/api-config";

export default function VenuePage() {
  const [capacity, setCapacity] = useState([0, 3000]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: venues, isLoading, error } = useQuery<Venue[]>({
    queryKey: [API_ENDPOINTS.VENUES],
    queryFn: async () => {
      console.log('🔄 Frontend: Starting venues fetch...');
      console.log('🌐 Frontend: Fetching from URL:', API_ENDPOINTS.VENUES);
      
      const response = await fetch(API_ENDPOINTS.VENUES);
      console.log('📡 Frontend: Response status:', response.status);
      console.log('📡 Frontend: Response ok:', response.ok);
      
      if (!response.ok) {
        console.error('❌ Frontend: Fetch failed with status:', response.status);
        throw new Error(response.statusText || "Failed to fetch venues");
      }
      
      const data = await response.json();
      console.log('📊 Frontend: Received venues data:', data);
      console.log('📊 Frontend: Number of venues:', data?.length || 0);
      
      return data;
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
  }) || [];

  console.log('🔍 Frontend: Filtered venues count:', filteredVenues.length);
  console.log('🔍 Frontend: Search query:', searchQuery);
  console.log('🔍 Frontend: Filters - capacity:', capacity, 'price:', priceRange, 'category:', category);

  console.log('🎯 Frontend: VenuePage render - isLoading:', isLoading, 'venues:', venues?.length || 0, 'error:', error);

  if (isLoading) {
    console.log('⏳ Frontend: Showing loading state');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    console.error('💥 Frontend: Error in venues query:', error);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Venues</h2>
          <p className="text-gray-600">{error.message}</p>
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
                {console.log('🎨 Frontend: About to render venues, count:', filteredVenues?.length)}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVenues?.map((venue, index) => {
                    console.log(`🏛️ Frontend: Rendering venue ${index + 1}:`, venue.name, 'ID:', venue.id);
                    return <VenueCard key={venue.id} venue={venue} />;
                  })}
                </div>

                {filteredVenues?.length === 0 && (
                  <div className="text-center py-12">
                    {console.log('❌ Frontend: Showing no venues message')}
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
