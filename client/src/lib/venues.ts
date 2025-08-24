import { type Venue } from "@shared/schema";

export const categorizeVenue = (price: number): "High" | "Middle" | "Standard" => {
  if (price >= 500000) return "High";
  if (price >= 200000) return "Middle";
  return "Standard";
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(price);
};

export const getImageUrl = (id?: string) => {
  // Generate a deterministic number from the string ID for consistent image results
  const numericId = id ? Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0) : Math.random() * 1000;
  return `https://source.unsplash.com/800x600/?wedding,venue,hall&sig=${numericId}`;
};
