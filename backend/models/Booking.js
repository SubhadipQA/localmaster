import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "requested",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
        "rejected",
      ],
      default: "requested",
    },
    workNotes: {
      type: String,
      trim: true,
    },
    beforeImage: {
      type: String,
    },
    afterImage: {
      type: String,
    },
    cancelReason: {
      type: String,
      trim: true,
    },
    rejectedReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
