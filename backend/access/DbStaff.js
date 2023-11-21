const { UserInfoSchema } = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const GetStaffByFilter = asyncHandler(async (filter) => {
  const userData = await UserInfoSchema.find(filter).select("-password").lean();
  if (!userData?.length) {
    return { status: 500, result: "No users found" };
  }
  return { status: 200, result: userData };
});

const GetStaffPassword = asyncHandler(async (filter) => {
  const userData = await UserInfoSchema.find(filter).select("password").lean();
  if (!userData?.length) {
    return { status: 500, result: "No users found" };
  }
  return { status: 200, result: userData };
});

const AddStaffAccount = asyncHandler(async (data) => {
  /*
      Purpose: Communicate with the database to create a new user account
      Returns: object with status and result
  
      */
  // create user data
  const dbResponse = await UserInfoSchema.create(data);
  if (dbResponse) {
    return { status: 200, result: "Account created successfully" };
  } else {
    return { status: 500, result: "Account creation failed" };
  }
});

const UpdateStaffAccount = asyncHandler(async (filter, data) => {
  /*
        Purpose: Communicate with the database to update a user account
        Returns: object with status and result
    
        */
  // update user data

  const dbResponse = await UserInfoSchema.updateOne(filter, {
    $set: data,
  });

  if (dbResponse.modifiedCount > 0) {
    return { status: 200, result: "Account updated successfully" };
  } else {
    return { status: 500, result: "Account not found or no changes were made" };
  }
});

module.exports = {
  GetStaffByFilter,
  AddStaffAccount,
  UpdateStaffAccount,
  GetStaffPassword,
};
