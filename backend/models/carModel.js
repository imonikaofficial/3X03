const mongoose = require("mongoose");

const car = new mongoose.Schema(
  {
    carMake: {
      required: true,
      type: String,
    },
    carStyle: {
      required: true,
      type: String,
    },
    carModel: {
      required: true,
      type: String,
    },
    carDescription: {
      required: true,
      type: String,
    },
    carSeats: {
      required: true,
      type: String,
    },
    carFuelType: {
      required: true,
      type: String,
    },
    carBootSpace: {
      required: true,
      type: String,
    },
    carRentalPrice: {
      required: true,
      type: Number,
    },
    carStatus: {
      default: "Active",
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    carLastUpdateUserId: {
      required: true,
      type: String,
    },
  },
  { collection: "carinfos", timestamps: true }
);

const carSchema = mongoose.model("carinfos", car);

module.exports = { CarSchema: carSchema };
