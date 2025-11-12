import { Schema } from "mongoose";

export const AuthProviderSchema = new Schema({
  platform: {
    type: String,
    required: true,
    enum: ['discord', 'local'],
  },
  id: {
    type: String,
    required: true,
  },
  email: { type: String },
  passwordHash: { type: String },
  refreshToken: { type: String },
  accessToken: { type: String },
}, { _id: false });