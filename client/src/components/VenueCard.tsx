import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type IVenue } from "@shared/schema";
import { categorizeVenue, formatPrice } from "@/lib/venues";
import { getVenueCoverImage } from "@/lib/venueImages";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface VenueCardProps {
  venue: IVenue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const category = categorizeVenue(Number(venue.price));
  const venueId = typeof venue._id === 'object' ? venue._id.toString() : venue._id;
  
  if (!venueId) {
    console.error('Invalid venue ID:', venue);
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden bg-card border-2 hover:border-primary/50 transition-all duration-300">
        <div className="relative aspect-[16/9] w-full overflow-hidden group">
          <motion.img 
            src={getVenueCoverImage(venue.name)} 
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              console.error(`Failed to load image for venue "${venue.name}" (${venueId})`);
              e.currentTarget.src = '/default-venue.jpg';
            }}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold line-clamp-1 tracking-tight">{venue.name}</h3>
            <Badge 
              variant={category === "High" ? "destructive" : category === "Middle" ? "default" : "secondary"}
              className="ml-2 font-medium"
            >
              {category}
            </Badge>
          </div>
          <div className="flex flex-col gap-3">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users2 className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Capacity: {venue.capacity} guests</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground line-clamp-1">{venue.address}</span>
            </motion.div>
          </div>
          <div className="mt-4">
            <span className="text-lg font-bold text-primary">{formatPrice(Number(venue.price))}</span>
            <span className="text-sm text-muted-foreground ml-1">per event</span>
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Link 
            href={`/venue/${venueId}`} 
            className="w-full"
          >
            <Button 
              className="w-full font-medium transition-all duration-300 hover:shadow-lg"
              variant={venue.email ? "default" : "secondary"}
              size="lg"
            >
              {venue.email ? 'Book Now' : 'View Details'}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
