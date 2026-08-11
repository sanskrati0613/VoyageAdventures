require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const destinationRoutes = require("./routes/destinationRoutes");

const bookingRoutes = require("./routes/bookingRoutes");

const adminRoutes = require("./routes/adminRoutes");

const contactRoutes = require("./routes/contactRoutes");

const testimonialRoutes = require("./routes/testimonialRoutes");

const userRoutes = require("./routes/userRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// -----------------------------
// Database
// -----------------------------

connectDB();

// -----------------------------
// Middleware
// -----------------------------

app.use(cors());

app.use(express.json());

// -----------------------------
// Uploaded Images
// -----------------------------

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------
// API Routes
// -----------------------------

app.use("/api/destinations", destinationRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/testimonials", testimonialRoutes);

app.use("/api/users", userRoutes);

// -----------------------------
// Health Check
// -----------------------------

app.get("/", (req, res) => {
  res.json({
    message: "Voyage Adventures backend is running!",
  });
});

// -----------------------------
// Start Server
// -----------------------------

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
