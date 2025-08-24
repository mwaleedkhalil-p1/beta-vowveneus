import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type IVenue } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Navigation, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/lib/api-config";

export default function VenueDirections() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'bicycling' | 'transit'>('driving');

  const { data: venue, isLoading, error } = useQuery<IVenue>({
    queryKey: ["venue", id],
    queryFn: async () => {
      if (!id) throw new Error("Venue ID is required");
      const response = await fetch(API_ENDPOINTS.VENUE_BY_ID(id));
      if (!response.ok) {
        throw new Error(response.statusText || "Failed to fetch venue details");
      }
      return response.json();
    },
    enabled: !!id,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        setLocationError(
          error.code === 1 
            ? "Please allow location access to get directions" 
            : "Error getting your location"
        );
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  if (isLoading || isLoadingLocation) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !venue) {
    return <div className="flex justify-center items-center min-h-screen">Error loading venue location</div>;
  }

  const getDirectionsUrl = () => {
    if (!userLocation) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&q=${encodeURIComponent(venue.address)}&zoom=15`;
    }

    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = encodeURIComponent(venue.address);
    
    return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&origin=${origin}&destination=${destination}&mode=${travelMode}&zoom=13`;
  };

  const openInGoogleMaps = () => {
    if (!userLocation) return;
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = encodeURIComponent(venue.address);
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelMode}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 bg-card border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation(`/venue/${id}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Venue
            </Button>
            <h1 className="text-xl font-semibold">{venue.name} - Directions</h1>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-1 rounded border bg-background"
              value={travelMode}
              onChange={(e) => setTravelMode(e.target.value as any)}
            >
              <option value="driving">Driving</option>
              <option value="walking">Walking</option>
              <option value="bicycling">Bike</option>
              <option value="transit">Transit</option>
            </select>
            {locationError ? (
              <Button 
                variant="outline"
                onClick={getCurrentLocation}
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Get Location
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={openInGoogleMaps}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open in Maps
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="w-full" style={{ height: "calc(100vh - 72px)" }}>
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ 
            border: 0,
            backgroundColor: 'white'
          }}
          src={getDirectionsUrl()}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
