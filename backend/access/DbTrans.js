const { TransactionSchema } = require("../models/transactionModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const GetAllTransactionsByUserId = asyncHandler(async (userId) => {
  const transactionData = await TransactionSchema.find({
    userId: new mongoose.Types.ObjectId(userId),
  });
  if (!transactionData) {
    return { status: 500, result: "Error fetching transactions" };
  }
  return { status: 200, result: transactionData };
});

const AddTransaction = asyncHandler(
  async (carId, userId, startDate, endDate, totalPrice) => {
    const transactionData = await TransactionSchema.create({
      carId: new mongoose.Types.ObjectId(carId),
      userId: new mongoose.Types.ObjectId(userId),
      transactionStartDate: startDate,
      transactionEndDate: endDate,
      transactionAmount: totalPrice,
    });
    if (!transactionData) {
      return { status: 500, result: "Error creating transaction" };
    }
    console.log("Transaction created successfully");
    return { status: 200, result: "Transaction created successfully" };
  }
);

module.exports = { AddTransaction,GetAllTransactionsByUserId };
