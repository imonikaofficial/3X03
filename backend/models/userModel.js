const mongoose = require("mongoose");
const { generateNewObjectId } = require("../utils");
const userInfo = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: generateNewObjectId(), // Set default value to a new ObjectId
      required: true,
    },
    firstname: {
      required: true,
      type: String,
    },
    lastname: {
      required: true,
      type: String,
    },
    username: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
    password: {
      type: String,
      default: null,
    },
    dob: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    postal: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
    },
    roles: [
      {
        type: String,
        default: "user",
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "userInfos",
    bufferCommands: false,
    autoCreate: false,
    timestamps: true,
  }
);

const userInfoSchema = mongoose.model("userInfos", userInfo);

module.exports = { UserInfoSchema: userInfoSchema };
