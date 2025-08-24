import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import HomePage from "@/pages/HomePage";
import VenuePage from "@/pages/VenuePage";
import VenueDetails from "@/pages/VenueDetails";
import VenueMap from "@/pages/VenueMap";
import VenueDirections from "@/pages/VenueDirections";
import AuthPage from "@/pages/AuthPage";
import AboutPage from "@/pages/AboutPage";
import FeedbackPage from "@/pages/FeedbackPage";
import PaymentScreen from "@/pages/PaymentScreen";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/venues" component={VenuePage} />
      <Route path="/venue/:id" component={VenueDetails} />
      <Route path="/venue/:id/map" component={VenueMap} />
      <Route path="/venue/:id/directions" component={VenueDirections} />
      <Route path="/venue/:id/payment" component={PaymentScreen} />
      <Route path="/about" component={AboutPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/feedback" component={FeedbackPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Router />
          </main>
        </div>
        <ToastProvider>
          <Toaster />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
