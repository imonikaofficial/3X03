const mongoose = require("mongoose");
const transaction = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userInfos",
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carInfos",
      required: true,
    },
    transactionCompletionStatus: {
      required: true,
      type: Boolean,
      default: false,
    },
    transactionStartDate: {
      required: true,
      type: Date,
    },
    transactionEndDate: {
      required: true,
      type: Date,
    },

    transactionAmount: {
      required: true,
      type: Number,
    },
  },
  {
    collection: "transactions",
    bufferCommands: false,
    autoCreate: false,
    timestamps: true,
  }
);

const transactionSchema = mongoose.model("transactions", transaction);
module.exports = { TransactionSchema: transactionSchema };
