import { Schema, model, Document, Types } from 'mongoose';
import { z } from "zod";

// Interfaces for TypeScript
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface IVenue extends Document {
  _id: Types.ObjectId;
  name: string;
  capacity: number;
  additionalMetric?: number;
  phone: string;
  address: string;
  price: number;
  email?: string;
  ownerId?: Types.ObjectId;
  createdAt: Date;
}

// Mongoose Schemas
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const venueSchema = new Schema<IVenue>({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  additionalMetric: { type: Number },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  email: { type: String },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Zod Validation Schemas
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  name: z.string(),
  email: z.string().email()
});

export const loginUserSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const insertVenueSchema = z.object({
  name: z.string(),
  capacity: z.number(),
  additionalMetric: z.number().optional(),
  phone: z.string(),
  address: z.string(),
  price: z.number(),
  email: z.string().email().optional()
});

// Models
export const User = model<IUser>('User', userSchema);
export const Venue = model<IVenue>('Venue', venueSchema);

// Types for client-side use
export type User = IUser;
export type Venue = IVenue;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type InsertVenue = z.infer<typeof insertVenueSchema>;
