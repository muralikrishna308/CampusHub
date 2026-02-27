const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  registrationEndDate: {
    type: Date,
    required: true
  },
  ticketPrice: {
    type: Number,
    default: null   // null means FREE
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Other'
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);