const router = require("express").Router();
const transController = require("../controller/transController");
const RBAC = require("../middleware/RBAC");
const verifyJWT = require("../middleware/verifyJWT");
const {
  AddTransaction,
  GetAllTransactionsByUserId,
} = require("../access/index");
const { VerifyJsonRequest, isValidDate } = require("../utils");
const { isLicenseVerified } = require("../services/licenseServices");

router.get("/", verifyJWT, RBAC(["user"]), (req, res) => {
  transController.getAllTransByUserId(req, res, GetAllTransactionsByUserId);
});

router.post("/add", verifyJWT, RBAC(["user"]), (req, res) => {
  transController.addTransaction(
    req,
    res,
    VerifyJsonRequest,
    isValidDate,
    isLicenseVerified,
    AddTransaction
  );
});

module.exports = router;
