import { useState, useRef, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { type IVenue } from "@shared/schema";
import { ArrowLeft, Copy, Smartphone } from "lucide-react";
import {
  generateBookingReference,
  generateEasyPaisaLink,
  generateJazzCashLink,
  formatPrice,
  type PaymentDetails,
  type PaymentMethod
} from "@/lib/payment";
import { copyToClipboard, isMobile, isLandlineNumber, isPaymentDisabled } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export default function PaymentScreen() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [bookingReference] = useState(() => generateBookingReference(id || ""));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('easypaisa');

  const { data: venue, isLoading } = useQuery<IVenue>({
    queryKey: ["venue", id],
    queryFn: async () => {
      const response = await fetch(`/api/venues/${id}`);
      if (!response.ok) throw new Error("Failed to fetch venue");
      return response.json();
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (venue && isPaymentDisabled(venue.name)) {
      toast({
        title: "Direct Payment Required",
        description: "Please contact the venue directly to make a booking.",
        duration: 5000,
      });
      window.history.back();
    }
  }, [venue, toast]);

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast({
        title: `${label} copied!`,
        description: `You can now paste it in your ${paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} app`,
      });
    }
  };

  const paymentDetails: PaymentDetails = {
    venueId: id || "",
    venueName: venue?.name || "",
    amount: venue?.price ? Number(venue.price) : 0,
    mobileNumber: venue?.phone || "",
    bookingReference,
  };

  if (isLoading || !venue) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-4 h-4 bg-gray-900 rounded-full animate-ping"></div>
      </div>
    );
  }

  const paymentLink = paymentMethod === 'easypaisa' 
    ? generateEasyPaisaLink(paymentDetails)
    : generateJazzCashLink(paymentDetails);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Venue
          </Button>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold mb-2">Payment Details</h1>
            <p className="text-gray-600">
              Please complete your payment to confirm booking for {venue.name}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Booking Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Venue</p>
                    <p className="font-medium">{venue.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="font-medium">{formatPrice(Number(venue.price))}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Reference</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{bookingReference}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleCopy(bookingReference, "Reference")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <div className="flex gap-4 mb-6">
                    <Button
                      variant={paymentMethod === 'easypaisa' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('easypaisa')}
                      className="w-40"
                    >
                      EasyPaisa
                    </Button>
                    <Button
                      variant={paymentMethod === 'jazzcash' ? 'default' : 'outline'}
                      onClick={() => setPaymentMethod('jazzcash')}
                      className="w-40"
                    >
                      JazzCash
                    </Button>
                  </div>
                </div>

                {!isLandlineNumber(venue.phone) ? (
                  <div className="flex flex-col items-center gap-6 py-4">
                    <img 
                      src={paymentMethod === 'easypaisa' ? "/easypaisa-logo.png" : "/new-Jazzcash-logo.png"}
                      alt={paymentMethod === 'easypaisa' ? "EasyPaisa" : "JazzCash"}
                      className="h-16 w-auto object-contain mb-2"
                      style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                    />
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{venue.phone}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleCopy(venue.phone, "Phone number")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-600">
                    <p>Please contact the venue directly at</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <p className="font-medium">{venue.phone}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleCopy(venue.phone, "Phone number")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 mt-8">
                {!isLandlineNumber(venue.phone) && isMobile() ? (
                  <a
                    href={paymentLink}
                    className="w-full"
                  >
                    <Button
                      className={`w-full ${
                        paymentMethod === 'easypaisa' 
                          ? 'bg-[#4caf50] hover:bg-[#43a047]' 
                          : 'bg-[#e91e63] hover:bg-[#d81b60]'
                      } text-lg font-medium py-6 shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      <Smartphone className="mr-2 h-4 w-4" />
                      Open in {paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} App
                    </Button>
                  </a>
                ) : (
                  <Button
                    className="w-full text-lg font-medium py-6"
                    onClick={() => handleCopy(venue.phone, "Phone number")}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Number
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="w-full text-lg font-medium py-6"
                  onClick={() => handleCopy(bookingReference, "Reference ID")}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Reference ID
                </Button>
              </div>
            </Card>
          </motion.div>

          <div className="text-center text-sm text-gray-500">
            <p>After making the payment, please keep the transaction ID safe.</p>
            <p>Your booking will be confirmed once the payment is verified.</p>
          </div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-600">
              Having trouble? Contact venue support at{" "}
              <a 
                href={`tel:${venue.phone}`}
                className="text-primary hover:underline font-medium"
              >
                {venue.phone}
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
