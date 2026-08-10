const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },

    destination: {
      type: String,
      required: true,
    },

    travelers: {
      type: Number,
      required: true,
      min: 1,
    },

    package: {
      type: String,
      required: true,
      enum: ["standard", "comfort", "premium"],
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    pricePerPerson: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    specialRequest: {
    type: String,
    default: '',
    trim: true
    },

    status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
    },

    departureId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
    },

  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Booking', bookingSchema);