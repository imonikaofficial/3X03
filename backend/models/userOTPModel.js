const mongoose = require("mongoose");

const userOTP = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    otp: {
      type: String,
    },
    expires: {
      type: Date,
    },
  },
  {
    collection: "userOTP",
    bufferCommands: false,
    autoCreate: false,
    timestamps: true,
  }
);

const userOTPSchema = mongoose.model("userOTP", userOTP);

module.exports = { UserOTPSchema: userOTPSchema };
