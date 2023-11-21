const { LicenseSchema } = require("../models/userLicenseModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const AddLicense = asyncHandler(async (license) => {
  const newLicense = new LicenseSchema(license);
  const licenseResponse = await newLicense.save();
  if (licenseResponse) {
    return { status: 200, result: "License added successfully" };
  }
  return { status: 500, result: "Failed to add license" };
});

const GetAllLicenses = asyncHandler(async () => {
  const allLicenses = await LicenseSchema.find()
    .populate({
      path: "uploader",
      select: "username email phone ", // Specify the fields you want
    })
    .exec();
  if (allLicenses == null) {
    return { status: 500, result: "Failed to get all licenses" };
  }
  return { status: 200, result: allLicenses };
});

const GetLicenseById = asyncHandler(async (id) => {
  const license = await LicenseSchema.findById(id)
    .populate({
      path: "uploader",
      select: "username email phone address firstname lastname postal dob ", // Specify the fields you want
    })
    .exec();
  if (license == null) {
    return { status: 500, result: "Failed to get license by id" };
  }
  return { status: 200, result: license };
});

const GetLicenseByFilter = asyncHandler(async (filter) => {
  const license = await LicenseSchema.find(filter).exec();
  if (license.length == 0) {
    return { status: 500, result: "Failed to get license by id" };
  }
  return { status: 200, result: license[0] };
});

const UpdateLicense = asyncHandler(async (oldData, newData) => {
  const licenseUpdateResponse = await LicenseSchema.updateOne(
    { _id: oldData._id.toString() },
    newData
  );
  if (licenseUpdateResponse) {
    return { status: 200, result: "License details updated successfully" };
  }
  return { status: 500, result: "License details update failed" };
});

module.exports = {
  AddLicense,
  GetAllLicenses,
  GetLicenseById,
  UpdateLicense,
  GetLicenseByFilter,
};
