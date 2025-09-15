
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String},
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    password: { type: String }, // hashed password
    otp: { type:String, },
    otpExpiresAt: Date,
    role: {
      type: String,
      enum: ['admin', 'user'], // restrict to these roles
      default: 'user'
    },
    source: { type: String }
  },
  { timestamps: true }
);

const User =  mongoose.model('User-admin', userSchema);

export default User;
