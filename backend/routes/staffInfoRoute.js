const router = require("express").Router();
const staffController = require("../controller/staffController");
const RBAC = require("../middleware/RBAC");
const verifyJWT = require("../middleware/verifyJWT");
const {
  GetStaffByFilter,
  AddStaffAccount,
  UpdateStaffAccount,
} = require("../access");
const {
  VerifyJsonRequest,
  ValidateUserPassword,
  VerifyUserPassword,
  generateNewObjectId,
  generateRandomPassword,
  HashFunction,
} = require("../utils");
const {
  validateStaffInfo,
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../services/staffServices");
const { checkUserExistence } = require("../services/userServices");

router.get("/", verifyJWT, RBAC(["admin"]), (req, res, next) => {
  staffController.get(req, res, next, GetStaffByFilter);
});

router.get("/get", verifyJWT, RBAC(["staff", "admin"]), (req, res, next) => {
  staffController.getById(req, res, next, GetStaffByFilter);
});

router.post("/add", verifyJWT, RBAC(["admin"]), (req, res) => {
  staffController.add(
    req,
    res,
    VerifyJsonRequest,
    generateNewObjectId,
    validateStaffInfo,
    HashFunction,
    generateRandomPassword,
    sendVerificationEmail,
    checkUserExistence,
    AddStaffAccount
  );
});

// router.post("/update", verifyJWT,  RBAC(["staff"]), (req,res)=>{
//   staffController.update(req,res)
// })

router.post("/reset-pw", verifyJWT, RBAC(["admin"]), (req, res) => {
  staffController.resetPassword(
    req,
    res,
    VerifyJsonRequest,
    sendPasswordResetEmail,
    checkUserExistence,
    HashFunction,
    UpdateStaffAccount,
    generateRandomPassword
  );
});

router.post("/change-pw", verifyJWT, RBAC(["staff", "admin"]), (req, res) => {
  staffController.changePassword(
    req,
    res,
    VerifyJsonRequest,
    checkUserExistence,
    ValidateUserPassword,
    HashFunction,
    VerifyUserPassword,
    UpdateStaffAccount
  );
});

router.post("/delete", verifyJWT, RBAC(["admin"]), (req, res, next) => {
  staffController.remove(
    req,
    res,
    next,
    VerifyJsonRequest,
    checkUserExistence,
    UpdateStaffAccount
  );
});

module.exports = router;
