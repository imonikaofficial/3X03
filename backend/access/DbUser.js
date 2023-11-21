const { UserInfoSchema } = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const {
  LicenseSchema: VerifyImgSchema,
} = require("../models/userLicenseModel");

const GetNumberOfUsers = asyncHandler(async () => {
  const numberOfUsers = await UserInfoSchema.countDocuments().lean();
  return numberOfUsers;
});

const CreateUserAccount = asyncHandler(async (data) => {
  /*
    Purpose: Communicate with the database to create a new user account
    Returns: object with status and result

    */
  // console.log("Attempting to create account");
  // console.log(data);
  // create user data
  const dbResponse = await UserInfoSchema.create(data);
  if (dbResponse) {
    console.log("Account created successfully");
    return { status: 200, result: "Account created successfully" };
  } else {
    console.log("Account creation failed");
    return { status: 500, result: "Account creation failed" };
  }
});

const UploadLicenseImg = asyncHandler(async (data) => {
  // create user data
  const dbResponse = await VerifyImgSchema.create(data);
  if (dbResponse) {
    return { status: 200, result: "Images added successfully" };
  }
  return { status: 500, result: "Images failed to add" };
});

const GetUserByFilter = asyncHandler(async (filter) => {
  console.log(filter);
  const userData = await UserInfoSchema.find(filter).lean();
  if (!userData?.length) {
    return { status: 500, result: "No users found" };
  }
  if (userData?.length > 1) {
    return { status: 500, result: "Duplicate users found" };
  }
  return { status: 200, result: userData[0] };
});

const UpdateUserAccount = asyncHandler(async (oldData, newData) => {
  /*
    Purpose: Communicate with the database to update a user account
    Returns: object with status and result

    */

  // fields to update
  const filter = {
    _id: oldData._id.toString(),
  };
  const update = {
    username: newData.username || oldData.username,
    password: newData.password || oldData.password,
    dob: newData.dob || oldData.dob,
    firstname: newData.firstname || oldData.firstname,
    lastname: newData.lastname || oldData.lastname,
    address: newData.address || oldData.address,
    postal: newData.postal || oldData.postal,
    country: newData.country || oldData.country,
    phone: newData.phone || oldData.phone,
    active: newData.active !== undefined ? newData.active : oldData.active,
    emailVerified: newData.emailVerified || oldData.emailVerified,
  };
  const opts = { new: true };
  console.log(newData);
  console.log(oldData);
  // update user data
  const userObj = await UserInfoSchema.findByIdAndUpdate(filter, update, opts)
    .lean()
    .exec();

  if (userObj) {
    return { status: 200, result: "Account updated successfully" };
  } else {
    return { status: 500, result: "Account failed to update" };
  }
});

module.exports = {
  CreateUserAccount,
  GetUserByFilter,
  UpdateUserAccount,
  UploadLicenseImg,
  GetNumberOfUsers,
};
