const express = require("express");
const Destination = require("../models/Destination");
const protectAdmin = require("../middleware/authMiddleware");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

// =========================================================
// CLOUDINARY IMAGE UPLOAD
// =========================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "voyage-adventures/destinations",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 1600,
        height: 1000,
        crop: "limit",
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WebP images are allowed."));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// =========================================================
// GET ALL DESTINATIONS
// Public
// =========================================================

router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });

    res.json(destinations);
  } catch (error) {
    console.error("Failed to fetch destinations:", error.message);

    res.status(500).json({
      message: "Failed to fetch destinations",
    });
  }
});

// =========================================================
// GET SINGLE DESTINATION
// Public
// =========================================================

router.get("/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    res.json(destination);
  } catch (error) {
    console.error("Failed to fetch destination:", error.message);

    res.status(500).json({
      message: "Failed to fetch destination",
    });
  }
});

// =========================================================
// ADD DESTINATION
// Admin only
// =========================================================

router.post("/", protectAdmin, upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      location,
      rating,
      price,
      bestTime,
      type,
      description,
      highlights,
    } = req.body;

    if (
      !name ||
      !location ||
      !price ||
      !rating ||
      !bestTime ||
      !type ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill in all required destination fields.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Destination image is required.",
      });
    }

    let parsedHighlights = [];

    if (highlights) {
      parsedHighlights = highlights
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    const destination = await Destination.create({
      name,

      location,

      image: req.file.path,

      rating: Number(rating),

      price: Number(price),

      bestTime,

      type,

      description,

      highlights: parsedHighlights,

      departures: [],
    });

    res.status(201).json({
      message: "Destination added successfully",

      destination,
    });
  } catch (error) {
    console.error("Failed to add destination:", error);

    // Remove uploaded image if saving failed

    res.status(400).json({
      message: error.message || "Failed to add destination",
    });
  }
});

// =========================================================
// UPDATE DESTINATION
// Admin only
// =========================================================

router.put("/:id", protectAdmin, upload.single("image"), async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    const {
      name,
      location,
      rating,
      price,
      bestTime,
      type,
      description,
      highlights,
    } = req.body;

    if (name !== undefined) destination.name = name;

    if (location !== undefined) destination.location = location;

    if (rating !== undefined) destination.rating = Number(rating);

    if (price !== undefined) destination.price = Number(price);

    if (bestTime !== undefined) destination.bestTime = bestTime;

    if (type !== undefined) destination.type = type;

    if (description !== undefined) destination.description = description;

    if (highlights !== undefined) {
      destination.highlights = highlights
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    // Only replace the image if
    // admin selected a new one.

    if (req.file) {
      destination.image = req.file.path;
    }

    await destination.save();

    res.json({
      message: "Destination updated successfully",

      destination,
    });
  } catch (error) {
    console.error("Failed to update destination:", error.message);

    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }

    res.status(400).json({
      message: error.message || "Failed to update destination",
    });
  }
});

// =========================================================
// DELETE DESTINATION
// Admin only
// =========================================================

router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found",
      });
    }

    res.json({
      message: "Destination deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete destination:", error.message);

    res.status(500).json({
      message: "Failed to delete destination",
    });
  }
});

// =========================================================
// ADD DEPARTURE
// Admin only
// =========================================================

router.post("/:id/departures", protectAdmin, async (req, res) => {
  try {
    const { startDate, endDate, totalSeats } = req.body;

    if (!startDate || !endDate || !totalSeats) {
      return res.status(400).json({
        message: "Start date, end date and total seats are required.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const seats = Number(totalSeats);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Invalid departure dates.",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        message: "End date must be after the start date.",
      });
    }

    if (!Number.isInteger(seats) || seats < 1) {
      return res.status(400).json({
        message: "Total seats must be at least 1.",
      });
    }

    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found.",
      });
    }

    destination.departures.push({
      startDate: start,

      endDate: end,

      totalSeats: seats,

      bookedSeats: 0,
    });

    await destination.save();

    const newDeparture =
      destination.departures[destination.departures.length - 1];

    res.status(201).json({
      message: "Departure added successfully",

      departure: newDeparture,
    });
  } catch (error) {
    console.error("Failed to add departure:", error.message);

    res.status(500).json({
      message: "Failed to add departure",
    });
  }
});

// =========================================================
// UPDATE DEPARTURE
// Admin only
// =========================================================

router.put("/:id/departures/:departureId", protectAdmin, async (req, res) => {
  try {
    const { startDate, endDate, totalSeats } = req.body;

    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        message: "Destination not found.",
      });
    }

    const departure = destination.departures.id(req.params.departureId);

    if (!departure) {
      return res.status(404).json({
        message: "Departure not found.",
      });
    }

    const start = new Date(startDate);

    const end = new Date(endDate);

    const seats = Number(totalSeats);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Invalid departure dates.",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        message: "End date must be after the start date.",
      });
    }

    if (!Number.isInteger(seats) || seats < 1) {
      return res.status(400).json({
        message: "Total seats must be at least 1.",
      });
    }

    // Never allow admin to reduce capacity
    // below seats already booked.

    if (seats < departure.bookedSeats) {
      return res.status(400).json({
        message: `You cannot set total seats below the ${departure.bookedSeats} seats already booked.`,
      });
    }

    departure.startDate = start;

    departure.endDate = end;

    departure.totalSeats = seats;

    await destination.save();

    res.json({
      message: "Departure updated successfully",

      departure,
    });
  } catch (error) {
    console.error("Failed to update departure:", error.message);

    res.status(500).json({
      message: "Failed to update departure",
    });
  }
});

// =========================================================
// DELETE DEPARTURE
// Admin only
// =========================================================

router.delete(
  "/:id/departures/:departureId",
  protectAdmin,
  async (req, res) => {
    try {
      const destination = await Destination.findById(req.params.id);

      if (!destination) {
        return res.status(404).json({
          message: "Destination not found.",
        });
      }

      const departure = destination.departures.id(req.params.departureId);

      if (!departure) {
        return res.status(404).json({
          message: "Departure not found.",
        });
      }

      // Do not allow a departure with
      // existing bookings to be deleted.

      if (departure.bookedSeats > 0) {
        return res.status(400).json({
          message: `This departure has ${departure.bookedSeats} booked seat(s) and cannot be deleted.`,
        });
      }

      departure.deleteOne();

      await destination.save();

      res.json({
        message: "Departure deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete departure:", error.message);

      res.status(500).json({
        message: "Failed to delete departure",
      });
    }
  },
);

module.exports = router;
