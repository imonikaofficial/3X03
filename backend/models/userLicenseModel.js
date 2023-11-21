const mongoose = require("mongoose");

const licenseModel = new mongoose.Schema(
  {
    front: {

      image: {
        type: String,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
    },
    back: {
      image: {
        type: String,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },

    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userInfos",
      required: true,
    },
    isVerified: {
      type: String,
      default: "Pending",
    },
  },

  {
    collection: "license",
    bufferCommands: false,
    autoCreate: false,
    timestamps: true,
  }
);

const licenseSchema = mongoose.model("license", licenseModel);
module.exports = { LicenseSchema: licenseSchema };
