import { User, Venue, type InsertUser, type InsertVenue, type IVenue, type IUser } from "@shared/schema";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/venue-booking';

export interface IStorage {
  getVenues(): Promise<IVenue[]>;
  getVenueById(id: string): Promise<IVenue | null>;
  getVenuesByOwnerId(ownerId: string): Promise<IVenue[]>;
  createVenue(insertVenue: InsertVenue & { ownerId: string }): Promise<IVenue>;
  updateVenue(id: string, venue: Partial<InsertVenue>): Promise<IVenue | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(insertUser: InsertUser): Promise<IUser>;
  getUser(id: string): Promise<IUser | null>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = MongoStore.create({
      mongoUrl: MONGODB_URI,
      ttl: 14 * 24 * 60 * 60 // 14 days
    });
  }

  async getVenues(): Promise<IVenue[]> {
    return await Venue.find().lean();
  }

  async getVenueById(id: string): Promise<IVenue | null> {
    try {
      const mongoId = mongoose.Types.ObjectId.isValid(id) 
        ? new mongoose.Types.ObjectId(id)
        : id;
      return await Venue.findById(mongoId).lean();
    } catch (error) {
      console.error('Error getting venue by ID:', error);
      return null;
    }
  }

  async getVenuesByOwnerId(ownerId: string): Promise<IVenue[]> {
    return await Venue.find({ ownerId: new mongoose.Types.ObjectId(ownerId) }).lean();
  }

  async createVenue(insertVenue: InsertVenue & { ownerId: string }): Promise<IVenue> {
    const venue = new Venue({
      ...insertVenue,
      ownerId: new mongoose.Types.ObjectId(insertVenue.ownerId)
    });
    return await venue.save();
  }

  async updateVenue(id: string, venue: Partial<InsertVenue>): Promise<IVenue | null> {
    return await Venue.findByIdAndUpdate(id, venue, { new: true }).lean();
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username }).lean();
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    const user = new User(insertUser);
    return await user.save();
  }

  async getUser(id: string): Promise<IUser | null> {
    return await User.findById(id).lean();
  }
}

export const storage = new DatabaseStorage();
