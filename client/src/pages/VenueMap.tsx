import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type IVenue } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/lib/api-config";
import { ArrowLeft, Navigation, Search, ZoomIn, ZoomOut, MapPin } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function VenueMap() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [mapMode, setMapMode] = useState<'map' | 'satellite'>('map');
  const [zoom, setZoom] = useState(16);
  
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

  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <div className="w-4 h-4 bg-gray-900 rounded-full animate-ping"></div>
          <span className="text-lg">Loading...</span>
        </motion.div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error loading venue location</div>
      </div>
    );
  }

  const getMapUrl = () => {
    const params = new URLSearchParams({
      q: venue.address,
      output: 'embed',
      z: zoom.toString(),
      t: mapMode === 'satellite' ? 'k' : 'm'
    });
    return `https://www.google.com/maps?${params.toString()}`;
  };

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 overflow-x-auto">
              <Button 
                variant="ghost" 
                onClick={() => setLocation(`/venue/${id}`)}
                className="hover:scale-105 transition-transform"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Venue
              </Button>
              <h1 className="text-xl font-semibold whitespace-nowrap">{venue.name} - Location</h1>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(z => Math.min(z + 1, 21))}
                  className="w-9 h-9 p-0 hover:scale-110 transition-transform"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setZoom(z => Math.max(z - 1, 1))}
                  className="w-9 h-9 p-0 hover:scale-110 transition-transform"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapMode(m => m === 'map' ? 'satellite' : 'map')}
                className="flex items-center gap-2 hover:scale-105 transition-transform whitespace-nowrap"
              >
                <MapPin className="h-4 w-4" />
                {mapMode === 'map' ? 'Satellite' : 'Map'}
              </Button>
              <Button
                variant="default"
                onClick={() => setLocation(`/venue/${id}/directions`)}
                className="flex items-center gap-2 hover:scale-105 transition-transform whitespace-nowrap bg-gray-900 text-white hover:bg-gray-800"
              >
                <Navigation className="h-4 w-4" />
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="w-full relative"
        style={{ height: "calc(100vh - 85px)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div 
          className="absolute inset-0 z-10" 
          onClick={handleMapClick}
          style={{ pointerEvents: 'auto' }}
        />
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          sandbox="allow-scripts"
          style={{ 
            border: 0,
            backgroundColor: 'white',
            pointerEvents: 'none'
          }}
          src={getMapUrl()}
          allowFullScreen
          className="rounded-lg shadow-lg"
        ></iframe>
      </motion.div>
    </motion.div>
  );
}
