import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine class names with Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check if the device is mobile
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
}

// Format date
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Check if a phone number is a landline number
export const isLandlineNumber = (phoneNumber: string): boolean => {
  // Remove any spaces, dashes, or other separators
  const cleanNumber = phoneNumber.replace(/[\s-]/g, '');
  
  // Check if it starts with area codes for major cities in Pakistan
  // e.g., 021 (Karachi), 042 (Lahore), 051 (Islamabad/Rawalpindi)
  const landlinePattern = /^(021|042|051|091|041|022|061|071|081|052|053|062|064|044|046|068|055|057)/;
  
  return landlinePattern.test(cleanNumber);
};

// List of venues that should not show the payment screen
const NO_PAYMENT_VENUES = [
  "Unique Wedding Hall",
  "Galaxy Event Hall",
  "Al-Madina Marriage Hall",
  "Rehman Banquet Hall",
  "monal marquee peshawar"
];

export const isPaymentDisabled = (venueName: string): boolean => {
  return NO_PAYMENT_VENUES.some(
    venue => venueName.toLowerCase() === venue.toLowerCase()
  );
};
