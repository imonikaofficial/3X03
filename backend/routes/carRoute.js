const router = require("express").Router();
const carController = require("../controller/carsController");
const RBAC = require("../middleware/RBAC");
const uploadCar = require("../middleware/carUpload");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/getAll").get(carController.getAllCars);

router.route("/getById").post(carController.getCarById);

router.route("/image/:name/:ct").get(carController.getCarImageByName);

router
  .route("/update")
  .post(verifyJWT, RBAC(["staff"]), carController.updateCar);

router.route("/add").post(
  verifyJWT,
  RBAC(["staff"]),
  uploadCar.single("file", 1),

  carController.addCar
);

router
  .route("/delete")
  .post(verifyJWT, RBAC(["staff"]), carController.deleteCar);

module.exports = router;
