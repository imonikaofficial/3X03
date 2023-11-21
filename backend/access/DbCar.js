const { CarSchema } = require("../models/carModel");
const asyncHandler = require("express-async-handler");

const GetAllCarInfo = asyncHandler(async (req, res) => {
  const carsData = await CarSchema.find({});
  if (carsData.length === 0) {
    return { status: 500, result: "No car data found" };
  }
  return { status: 200, result: carsData };
});

const GetCarById = asyncHandler(async (id) => {
  const carData = await CarSchema.findById(id);
  if (!carData) {
    return { status: 500, result: "Car does not exist in our records" };
  }
  return { status: 200, result: carData };
});

const UpdateCar = asyncHandler(async (oldData, newData) => {
  try {
    // Update car information
    const carUpdateResponse = await CarSchema.updateOne(
      { _id: oldData._id.toString() },
      newData
    );
    if (carUpdateResponse) {
      return { status: 200, result: "Car details updated successfully" };
    }
    return { status: 500, result: "Car details update failed" };
  } catch (err) {
    return { status: 500, result: "Network Error" };
  }
});

const AddCar = asyncHandler(async (newData) => {
  try {
    // Add car information
    const carAddResponse = await CarSchema.create(newData);
    if (carAddResponse) {
      return { status: 200, result: "Car details added successfully" };
    }
    return { status: 500, result: "Car details add failed" };
  } catch (err) {
    return { status: 500, result: "Network Error" };
  }
});

module.exports = { GetAllCarInfo, GetCarById, UpdateCar, AddCar };
