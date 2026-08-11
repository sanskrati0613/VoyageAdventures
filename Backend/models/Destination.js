
const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: String,
      default: "Varies by departure",
    },

    bestTime: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    highlights: {
      type: [String],
      default: [],
    },

    departures: [
      {
        startDate: {
          type: Date,
          required: true,
        },

        endDate: {
          type: Date,
          required: true,
        },

        totalSeats: {
          type: Number,
          required: true,
          min: 1,
        },

        bookedSeats: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Destination", destinationSchema);
