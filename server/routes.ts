import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import mongoose from "mongoose";
import { type IVenue } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Venue routes
  app.get("/api/venues", async (_req, res) => {
    try {
      const venues = await storage.getVenues();
      // Ensure all IDs are strings in response
      const venuesWithStringIds = venues.map(venue => ({
        ...venue,
        _id: venue._id.toString()
      }));
      res.json(venuesWithStringIds);
    } catch (error) {
      console.error('Error fetching venues:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/venues/:id", async (req, res) => {
    try {
      const venueId = req.params.id;
      
      // Try to fetch venue
      const venue = await storage.getVenueById(venueId);

      if (!venue) {
        console.log('Venue not found:', venueId);
        return res.status(404).json({ message: "Venue not found" });
      }

      // Ensure ID is a string in response
      const venueData = {
        ...venue,
        _id: typeof venue._id === 'object' ? venue._id.toString() : venue._id
      };

      res.json(venueData);
    } catch (error) {
      console.error('Error fetching venue:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
