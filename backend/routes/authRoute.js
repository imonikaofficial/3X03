const router = require("express").Router();
const loginLimitter = require("../middleware/loginLimitter");
const authController = require("../controller/authController");

const { GetUserByFilter, UpdateUserAccount } = require("../access/DbUser");
const {
  FindUserVerification,
  DeleteUserVerification,
  FindOTPVerification,
  DeleteOTPVerification,
} = require("../access/DbAuth");
const {
  createUserAccountHelper,
  checkUserExistence,
  isUserActive,
} = require("../services/userServices");

const {
  redirectFrontEnd,
  handleUserNotFoundError,
  handleUserVerificationError,
  handleValidationFailure,
  handleUpdateUserAccountError,
  handleVerificationSuccess,
  validateEmailVerification,
  VerifyCode,
  generateTokensAndSetCookies,
  verifyRefreshToken,
  generateAccessToken,
  sendOTPVerificationEmail,
  getCurrentTimeInSeconds,
  clearCookies,
} = require("../services/authServices");

const {
  SanitizeEmail,
  VerifyUserPassword,
  VerifyJsonRequest,
  ValidateUserPassword,
} = require("../utils");

router.post("/", 
// loginLimitter, 
(req, res, next) => {
  authController.login(
    req,
    res,
    next,
    SanitizeEmail,
    checkUserExistence,
    isUserActive,
    VerifyUserPassword,
    sendOTPVerificationEmail
  );
});

router.get("/refresh", (req, res, next) => {
  authController.refresh(
    req,
    res,
    next,
    verifyRefreshToken,
    generateAccessToken
  );
});

router.post("/resend-otp", (req, res, next) => {
  authController.resendOTP(
    req,
    res,
    next,
    checkUserExistence,
    isUserActive,
    sendOTPVerificationEmail
  );
});

router.post("/logout", (req, res, next) => {
  authController.logout(req, res, next, clearCookies);
});

router.get("/verify-email/:userId/:uniqueString", (req, res, next) => {
  authController.verifyEmail(
    req,
    res,
    next,
    GetUserByFilter,
    handleUserNotFoundError,
    handleVerificationSuccess,
    FindUserVerification,
    handleUserVerificationError,
    validateEmailVerification,
    handleValidationFailure,
    UpdateUserAccount,
    handleUpdateUserAccountError
  );
});

router.get("/verify-email-staff/:userId/:uniqueString", (req, res, next) => {
  authController.verifyEmailStaff(
    req,
    res,
    next,
    GetUserByFilter,
    handleUserNotFoundError,
    FindUserVerification,
    handleUserVerificationError,
    validateEmailVerification,
    handleValidationFailure,
    UpdateUserAccount,
    handleUpdateUserAccountError,
    handleVerificationSuccess,
    DeleteUserVerification
  );
});

router.get("/verified", (req, res, next) => {
  authController.verified(req, res, next, redirectFrontEnd);
});

router.post("/verify-otp", (req, res, next) => {
  authController.verifyOTP(
    req,
    res,
    next,
    VerifyJsonRequest,
    GetUserByFilter,
    FindOTPVerification,
    VerifyCode,
    DeleteOTPVerification,
    generateTokensAndSetCookies,
    getCurrentTimeInSeconds
  );
});

router.post("/admin-register", (req, res, next) => {
  authController.adminRegister(
    req,
    res,
    next,
    VerifyJsonRequest,
    createUserAccountHelper,
    SanitizeEmail,
    GetUserByFilter,
    ValidateUserPassword
  );
});

module.exports = router;
