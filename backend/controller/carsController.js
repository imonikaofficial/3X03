const {
  GetAllCarInfo,
  GetCarById,
  UpdateCar,
  AddCar,
} = require("../access/DbCar");
const { VerifyJsonRequest } = require("../utils");
const path = require("path");
const { promises: fsPromises, constants } = require("fs");
const fs = require("fs");
const getAllCars = async (req, res) => {
  /*
  Endpoint: /api/cars/getAll
  Method: GET
  Route: Get all cars
  Returns: Array of car objects
  */
  const allCarsResponse = await GetAllCarInfo();
  if (!allCarsResponse.status == 200) {
    res.status(allCarsResponse.status).json(allCarsResponse);
    return;
  }

  res.status(allCarsResponse.status).json(allCarsResponse);
};


const getCarById = async (req, res) => {
  /*
  Endpoint: /api/cars/getById
  Method: GET
  Route: Get car by id
  Returns: Car object
  */
  const id = req.body && req.body.id;
  if (!id) {
    res.status(400).json({ status: 400, result: "Missing id" });
    return;
  }

  const carResponse = await GetCarById(id);
  if (carResponse.status == 500) {
    res.status(carResponse.status).json(carResponse);
    return;
  }
  res.status(carResponse.status).json(carResponse);
};

const getCarImageByName = async (req, res) => {
  /*
  Endpoint: /api/cars/image/:name
  Method: GET
  Route: Get car image by name
  Returns: Car image
  */
  const name = req.params.name;
  const contentType = req.params.ct;
  if (!name || !contentType) {
    res.status(400).json({ status: 400, result: "Missing name" });
    return;
  }
  console.log(name, contentType);
  res.contentType(contentType);
  res.sendFile(path.join(__dirname, "../uploads", "/cars/", name));
};

const updateCar = async (req, res) => {
  /*
  Endpoint: /api/cars/update
  Method: POST
  Route: Update car by id
  Returns: Car object
  */
  if (!req.body.id) {
    res
      .status(400)
      .json({ status: 400, result: "Missing fields in request body." });
  }
  const id = req.body.id;

  // find car
  const carResponse = await GetCarById(id);
  if (carResponse.status == 500) {
    res.status(carResponse.status).json(carResponse);
    return;
  }
  let car = carResponse.result;

  // update car
  const updateResponse = await UpdateCar(car, req.body);
  if (updateResponse.status == 500) {
    res.status(updateResponse.status).json(updateResponse);
    return;
  }
  res.status(updateResponse.status).json(updateResponse);
};

const addCar = async (req, res) => {
  /*
  Endpoint: /api/cars/add
  Method: POST
  Route: Add car
  Returns: Car object
  */

  const headerResponse = VerifyJsonRequest(req, [
    "carMake",
    "carStyle",
    "carModel",
    "carDescription",
    "carSeats",
    "carFuelType",
    "carBootSpace",
    "carRentalPrice",
    "image",
    "contentType",
  ]);
  if (headerResponse.status == 400) {
    res.status(headerResponse.status).json(headerResponse);
    return;
  }

  // add user who created the car
  req.body.carLastUpdateUserId = req.id;

  const carResponse = await AddCar(req.body);
  if (carResponse.status == 500) {
    res.status(carResponse.status).json(carResponse);
    return;
  }
  res.status(carResponse.status).json(carResponse);
};

const deleteCar = async (req, res) => {
  /*
  Endpoint: /api/cars/delete
  Method: POST
  Route: Delete car by id
  Returns: Car object
  */
  const headerResponse = VerifyJsonRequest(req, ["id"]);
  if (headerResponse.status == 400) {
    res.status(headerResponse.status).json(headerResponse);
    return;
  }

  const id = req.body.id;
  const carResponse = await GetCarById(id);
  if (carResponse.status == 500) {
    res.status(carResponse.status).json(carResponse);
    return;
  }
  let car = carResponse.result;

  // delete car by updating car status to inactive
  const deleteResponse = await UpdateCar(car, { carStatus: "Inactive" });
  if (deleteResponse.status == 500) {
    res.status(deleteResponse.status).json(deleteResponse);
    return;
  }
  res.status(deleteResponse.status).json(deleteResponse);
};

module.exports = {
  getAllCars,
  getCarById,
  updateCar,
  addCar,
  deleteCar,
  getCarImageByName,
};
