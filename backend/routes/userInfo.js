const router = require("express").Router();
const usersController = require("../controller/usersController");
const RBAC = require("../middleware/RBAC");
const verifyJWT = require("../middleware/verifyJWT");
const {
  VerifyJsonRequest,
  generateNewObjectId,
  ValidateUserPassword,
  VerifyUserPassword,
  HashFunction,
} = require("../utils");

const {
  UpdateUserAccount,
  GetUserByFilter,
  GetNumberOfUsers,
} = require("../access/DbUser");

const {
  checkUserExistence,
  createUserAccountHelper,
  validateUserInfo,
  sendVerificationEmail,
} = require("../services/userServices");

router.get("/getOne", verifyJWT, RBAC(["user"]), (req, res, next) => {
  usersController.getUser(req, res, next, GetUserByFilter);
});

router.post("/add", (req, res) => {
  usersController.createNewUser(
    req,
    res,
    VerifyJsonRequest,
    checkUserExistence,
    createUserAccountHelper,
    validateUserInfo,
    sendVerificationEmail,
    generateNewObjectId
  );
});

router.post("/update", verifyJWT, RBAC(["user"]), (req, res) => {
  usersController.updateUser(
    req,
    res,
    checkUserExistence,
    ValidateUserPassword,
    VerifyUserPassword,
    HashFunction,
    UpdateUserAccount
  );
});

router.get("/get-number", (req, res) => {
  usersController.getNumberOfUsers(req, res, GetNumberOfUsers);
});

module.exports = router;
