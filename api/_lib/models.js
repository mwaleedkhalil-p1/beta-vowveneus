import pkg from 'mongoose';
const { Schema, model, models } = pkg;

// Venue Schema
const venueSchema = new Schema({
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

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Export models (use existing model if already compiled)
export const Venue = models.Venue || model('Venue', venueSchema);
export const User = models.User || model('User', userSchema);