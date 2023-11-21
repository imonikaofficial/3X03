const mongoose = require("mongoose");

const emailVerificationModel = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    uniqueString: {
      type: String,
    },
    expires: {
      type: Date,
    },
  },
  {
    collection: "userEmailAuth",
    bufferCommands: false,
    autoCreate: false,
    timestamps: true,
  }
);

const emailVerificationSchema = mongoose.model(
  "userEmailAuth",
  emailVerificationModel
);

module.exports = { EmailVerificationSchema: emailVerificationSchema };
