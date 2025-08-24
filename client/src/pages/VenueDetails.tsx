import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Types } from "mongoose";
import { type IVenue } from "@shared/schema";
import { BookingForm } from "@/components/BookingForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categorizeVenue, formatPrice } from "@/lib/venues";
import { getVenueImages } from "@/lib/venueImages";
import { isPaymentDisabled } from "@/lib/utils";
import { Phone, Mail, MapPin, Users, Info, CheckCircle2, ChevronLeft, ChevronRight, Clock, ClipboardList, CreditCard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useState } from "react";

export default function VenueDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: venue, isLoading, error } = useQuery<IVenue>({
    queryKey: ["venue", id],
    queryFn: async () => {
      try {
        if (!id) throw new Error("Venue ID is required");
        
        console.log('Fetching venue with ID:', id);
        const response = await fetch(`/api/venues/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Venue not found");
          }
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch venue details: ${response.statusText || 'Unknown error'}`);
        }
        
        const data = await response.json();
        console.log('Received venue data:', data);
        
        if (!data || !data._id) {
          throw new Error("Invalid venue data received");
        }
        
        // Ensure we have string ID
        return {
          ...data,
          _id: typeof data._id === 'object' ? data._id.toString() : data._id
        };
      } catch (error) {
        console.error('Error fetching venue:', error);
        throw error;
      }
    },
    retry: 1,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="mb-6">{error instanceof Error ? error.message : 'Venue not found'}</p>
            <Button onClick={() => setLocation("/")} variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Venues
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!venue) {
    return <div className="flex justify-center items-center min-h-screen">Venue not found</div>;
  }

  const category = categorizeVenue(Number(venue.price));
  const images = getVenueImages(venue?.name || '');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button onClick={() => setLocation("/")} variant="outline" className="mb-4">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Venues
          </Button>
          <h1 className="text-3xl font-bold">{venue?.name}</h1>
        </div>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="relative rounded-lg overflow-hidden">
                <Carousel className="w-full">
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={index} className="relative">
                        <div className="aspect-[16/9] w-full relative">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(`Failed to load image: ${image.src}`);
                              e.currentTarget.src = '/default-venue.jpg';
                            }}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
                  <div className="flex items-center gap-2 mb-6">
                    <Badge variant={category === "High" ? "destructive" : category === "Middle" ? "default" : "secondary"} className="text-sm">
                      {category} Class
                    </Badge>
                    <span className="text-2xl font-semibold text-primary">
                      {formatPrice(Number(venue.price))}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer">
                      <Phone className="h-5 w-5 text-primary" />
                      <div className="flex flex-col">
                        <a 
                          href={`tel:${venue.phone.replace(/[^\d]/g, '')}`} 
                          className="text-primary hover:underline font-semibold cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${venue.phone.replace(/[^\d]/g, '')}`;
                          }}
                        >
                          {venue.phone}
                        </a>
                        <span className="text-sm text-muted-foreground">Click to call</span>
                      </div>
                    </div>
                    
                    {venue.email && (
                      <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
                        <Mail className="h-5 w-5 text-primary" />
                        <a 
                          href={`mailto:${venue.email}`} 
                          className="text-primary hover:underline cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {venue.email}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{venue.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Booking Tips</h2>
                  </div>
                  {venue.email ? (
                    <div className="space-y-4">
                      <Alert>
                        <Mail className="h-4 w-4" />
                        <AlertTitle>Email Booking</AlertTitle>
                        <AlertDescription>
                          Send us an email with your event details and preferred dates. We'll get back to you with availability and next steps.
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertTitle>Response Time</AlertTitle>
                        <AlertDescription>
                          We typically respond to email inquiries within 24 hours during business days.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Alert>
                        <Phone className="h-4 w-4" />
                        <AlertTitle>Direct Contact Only</AlertTitle>
                        <AlertDescription>
                          Please call the venue directly during business hours to discuss availability and booking requirements.
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <ClipboardList className="h-4 w-4" />
                        <AlertTitle>Booking Process</AlertTitle>
                        <AlertDescription>
                          When you call, our team will discuss your requirements, check availability, and guide you through the booking process.
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertTitle>Business Hours</AlertTitle>
                        <AlertDescription>
                          For the best response, please make your calls during regular business hours. This ensures you can speak directly with our booking team.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold mb-6">Book This Venue</h2>
                    {venue.email ? (
                      <BookingForm venue={venue} />
                    ) : (
                      <Alert>
                        <Phone className="h-4 w-4" />
                        <AlertTitle>Direct Contact</AlertTitle>
                        <AlertDescription className="space-y-4">
                          <p>This venue accepts direct phone calls for bookings.</p>
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <Phone className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">{venue.phone}</span>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Payment Options</h3>
                      <div className="space-y-4">
                        {!isPaymentDisabled(venue.name) ? (
                          <>
                            <Button
                              className="w-full bg-[#4caf50] hover:bg-[#43a047] text-white"
                              onClick={() => setLocation(`/venue/${venue._id}/payment`)}
                            >
                              <CreditCard className="mr-2 h-4 w-4" />
                              Pay with EasyPaisa or JazzCash
                            </Button>
                            <p className="text-sm text-muted-foreground text-center">
                              Secure payment directly to the venue's account
                            </p>
                          </>
                        ) : (
                          <Alert>
                            <Phone className="h-4 w-4" />
                            <AlertTitle>Direct Payment Only</AlertTitle>
                            <AlertDescription className="space-y-4">
                              <p>This venue requires direct payment. Please contact them to discuss payment options.</p>
                              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                                <Phone className="h-5 w-5 text-primary" />
                                <span className="text-lg font-semibold">{venue.phone}</span>
                              </div>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Location</h2>
                  </div>
                  <div className="w-full h-[300px] rounded-lg overflow-hidden relative group">
                    <div 
                      className="absolute inset-0 z-10 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={() => setLocation(`/venue/${venue._id}/map`)}
                    >
                      <Button variant="secondary" className="pointer-events-none">
                        View Map
                      </Button>
                    </div>
                    {/* Overlay to prevent interactions with map controls */}
                    <div 
                      className="absolute inset-0" 
                      style={{ 
                        zIndex: 2,
                        cursor: 'pointer',
                        background: 'transparent',
                        pointerEvents: 'auto'
                      }}
                      onClick={() => setLocation(`/venue/${venue._id}/map`)}
                    />
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ 
                        border: 0,
                        pointerEvents: 'none',
                        backgroundColor: 'white'
                      }}
                      src={`https://www.google.com/maps?q=${encodeURIComponent(venue.address)}&output=embed`}
                    ></iframe>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {venue.address}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
