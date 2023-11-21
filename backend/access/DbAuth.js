const {
  EmailVerificationSchema: UserVerificationSchema,
} = require("../models/userEmailAuthModel");
const asyncHandler = require("express-async-handler");
const { UserOTPSchema } = require("../models/userOTPModel");

const CreateEmailVerification = asyncHandler(async (data) => {
  const dbResponse = await UserVerificationSchema.create(data);
  if (dbResponse) {
    return { status: 200, result: dbResponse };
  }
  return { status: 500, result: "Error creating verification record" };
});

const FindUserVerification = asyncHandler(async (userId) => {
  const dbResponse = await UserVerificationSchema.findOne(userId).lean();
  if (dbResponse) {
    return { status: 200, result: dbResponse };
  }
  return { status: 500, result: "Error finding verification record" };
});

const UpdateUserVerification = asyncHandler(async (userId, data) => {
  const dbResponse = await UserVerificationSchema.updateOne(userId, {
    $set: data,
  });
  if (dbResponse) {
    return { status: 200, result: dbResponse };
  }
  return { status: 500, result: "Error updating verification record" };
});

const DeleteUserVerification = asyncHandler(async (userId) => {
  const dbResponse = await UserVerificationSchema.deleteOne(userId);
  if (dbResponse) {
    return { status: 200, result: dbResponse };
  }
  return { status: 500, result: "Error deleting verification record" };
});

const CreateOTPVerification = asyncHandler(async (data) => {
  const dbResponse = await UserOTPSchema.create(data);
  if (dbResponse) {
    return { status: 200, result: dbResponse };
  }
  return { status: 500, result: "Error creating verification record" };
});

const FindOTPVerification = asyncHandler(async (userId) => {
  const dbResponse = await UserOTPSchema.findOne(userId).lean();
  if (dbResponse) {
    return { status: 200, result: dbResponse };
  }
  return { status: 500, result: "Error finding verification record" };
});

const UpdateOTPVerification = asyncHandler(async (userId, data) => {
  const dbResponse = await UserOTPSchema.updateOne(userId, { $set: data });
  if (dbResponse) {
    return { status: 200, result: dbResponse };
  }
  return { status: 500, result: "Error updating verification record" };
});

const DeleteOTPVerification = asyncHandler(async (userId) => {
  const dbResponse = await UserOTPSchema.deleteOne(userId);
  if (dbResponse) {
    return { status: 200, result: dbResponse };
  }
  return { status: 500, result: "Error deleting verification record" };
});

module.exports = {
  CreateEmailVerification,
  FindUserVerification,
  UpdateUserVerification,
  DeleteUserVerification,
  CreateOTPVerification,
  FindOTPVerification,
  DeleteOTPVerification,
  UpdateOTPVerification,
};
