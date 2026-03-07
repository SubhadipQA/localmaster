import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

//Routes
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import providerRoutes from "./routes/provider.js";
import bookingRoutes from "./routes/booking.js";
import reviewRoutes from "./routes/review.js";
import contactRoutes from "./routes/contact.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "LocalMaster API running ✅" });
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`LocalMaster API running on port ${PORT}`);
});