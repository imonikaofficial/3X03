const asyncHandler = require("express-async-handler");

const verified = asyncHandler(async (req, res, next, redirectFrontEnd) => {
  redirectFrontEnd(res);
});

const login = asyncHandler(
  async (
    req,
    res,
    next,
    SanitizeEmail,
    checkUserExistence,
    isUserActive,
    VerifyUserPassword,
    sendOTPVerificationEmail
  ) => {
    const { email, password } = req.body;
    console.log("req.body: ", req.body)
    if (!email || !password) {
      res
        .status(400)
        .json({ status: 400, result: "Missing email or password" });
      return;
    }
    console.log("sanitizing email: ", email)
    const sanitizedEmailResponse = SanitizeEmail(email);
    if (sanitizedEmailResponse.status == 400) {
      res.status(sanitizedEmailResponse.status).json(sanitizedEmailResponse);
      return;
    }
    const sanitizedEmail = sanitizedEmailResponse.result;

    console.log("checking user existence of user with email: ", sanitizedEmail)
    const foundUserResponse = await checkUserExistence({ email: sanitizedEmail });
    if (foundUserResponse.status == 500) {
      res.status(400).json({ status: 400, result: "User not found" });
      return;
    }
    
    const foundUser = foundUserResponse.result;

    console.log("checking user active")
    if (isUserActive(foundUser.active) == false) {
      res.status(401).json({
        status: 401,
        result: "Unauthorized access. Please contact admin",
      });
    }

    console.log("verifying password")
    const verifiedPasswordStatus = await VerifyUserPassword(
      password,
      foundUser.password
    );
    if (verifiedPasswordStatus == false) {
      res
        .status(400)
        .json({ status: 400, result: "Incorrect login information" });
      return;
    }
    console.log("foundUser: ", foundUser);
    const responseEmail = sendOTPVerificationEmail(foundUser);
    if (responseEmail.status == 500) {
      res.status(responseEmail.status).json(responseEmail);
      return;
    }

    res.status(200).json({ status: 200, result: {_id: foundUser._id, message: "OTP sent"} });
  }
);

const resendOTP = asyncHandler(
  async (
    req,
    res,
    next,
    checkUserExistence,
    isUserActive,
    sendOTPVerificationEmail
  ) => {
    const { id } = req.body;

    console.log("checking user existence of user with id: ", id)

    const foundUserResponse = await checkUserExistence({ _id: id });
    if (foundUserResponse.status !== 200) {
      console.log({ status: 400, result: "User not found" })
      res.status(400).json({ status: 400, result: "User not found" });
      return;
    }
    console.log("foundUserResponse: ", foundUserResponse)
    const foundUser = foundUserResponse.result;


    if (isUserActive(foundUser.active) == false) {
      res.status(401).json({
        status: 401,
        result: "Unauthorized access. Please contact admin",
      });
    }
    console.log("status activity: ", isUserActive(foundUser.active))
    const responseEmail = sendOTPVerificationEmail(foundUser);
    if (responseEmail.status == 500) {
      res.status(responseEmail.status).json(responseEmail);
      return;
    }

    res.status(200).json({ status: 200, result: {_id: foundUser._id, message: "OTP sent"} });
  }
);

const refresh = asyncHandler(
  async (req, res, next, verifyRefreshToken, generateAccessToken) => {
    const cookies = req.cookies;
    if (!cookies.jwt) {
      return res
        .status(401)
        .json({ status: 401, result: "Unauthorized access" });
    }
    try {
      const refreshToken = cookies.jwt;
      const user = await verifyRefreshToken(refreshToken);

      const accessTokenResult = await generateAccessToken(user.id);
      if (accessTokenResult.status === 500) {
        return res.status(500).json(accessTokenResult.result);
      }
      res.cookie("token", accessTokenResult.result, {
        httpOnly: process.env.NODE_ENV === "development" ? false : true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      });
      return res
        .status(200)
        .json({
          status: 200,
          result: { message: "Token successfully refreshed" },
        });
    } catch (err) {
      console.log(err);
      return res.status(403).json({ status: 403, result: "Forbidden" });
    }
  }
);

const logout = (req, res, next, clearCookies) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    res.status(401).json({ status: 401, result: "Unauthorized access" });
    return;
  }
  clearCookies(res);
  res.status(200).json({ status: 200, result: "Logged out successfully" });
};

const verifyEmail = asyncHandler(
  async (
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
    handleUpdateUserAccountError,
  ) => {
    let { userId, uniqueString } = req.params;
    console.log("req.params: ", req.params);

    // check if user has registered
    const foundUserResponse = await GetUserByFilter({ _id: userId });

    // user not found
    if (foundUserResponse.status == 500) {
      handleUserNotFoundError(res, "Unauthorized access. Please contact admin");
      return;
    }

    const foundUser = foundUserResponse.result;

    // check if account already previously verified
    if (foundUser.emailVerified == true) {
      handleVerificationSuccess(
        res,
        "Account has already been verified. Please login"
      );
      return;
    }

    // Handle User Verification Error
    const foundUserVerificationResponse = await FindUserVerification({
      _id: foundUser._id,
    });

    if (foundUserVerificationResponse.status == 500) {
      handleUserVerificationError(
        res,
        "Account doesn't exist or has already been verified. Please contact admin"
      );
      return;
    }

    const foundUserVerification = foundUserVerificationResponse.result;

    // validate verification code
    const validationResponse = await validateEmailVerification(
      foundUser,
      foundUserVerification,
      uniqueString
    );

    if (validationResponse.status == 401) {
      handleValidationFailure(res, "Validation failed. Please contact admin");
      return;
    }

    // Handle Update User Account Error
    const updateResponse = await UpdateUserAccount(foundUser, {
      emailVerified: true,
    });
    if (updateResponse.status == 500) {
      handleUpdateUserAccountError(
        res,
        "Error updating account. Please contact admin"
      );
      return;
    }

    // Handle Verification Success
    handleVerificationSuccess(res, "Account verified successfully");
  }
);

// TODO change password still WIP
const verifyEmailStaff = asyncHandler(
  async (
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
  ) => {
    let { userId, uniqueString } = req.params;
    console.log("req.params: ", req.params);
    const foundUserResponse = await GetUserByFilter({ _id: userId });
    if (foundUserResponse.status == 500) {
      handleUserNotFoundError(res, "Unauthorized access. Please contact admin");
      return;
    }
    const foundUser = foundUserResponse.result;

    // check if account already previously verified
    if (foundUser.emailVerified == true) {
      handleVerificationSuccess(
        res,
        "Account has already been verified. Please login"
      );
      return;
    }

    // Handle User Verification Error
    const foundUserVerificationResponse = await FindUserVerification({
      _id: foundUser._id,
    });
    if (foundUserVerificationResponse.status == 500) {
      handleUserVerificationError(
        res,
        "Account doesn't exist or has already been verified. Please contact hotline"
      );
      return;
    }

    const foundUserVerification = foundUserVerificationResponse.result;

    const validationResponse = await validateEmailVerification(
      foundUser,
      foundUserVerification,
      uniqueString
    );
    if (validationResponse.status == 401) {
      handleValidationFailure(res, "Validation failed. Please contact admin");
      return;
    }

    console.log("validationResponse: ", validationResponse)
    console.log("foundUser: ", foundUser)
    console.log("Deleting verification record")
    // delete verification record
    const deleteResponse = await DeleteUserVerification({ _id: foundUser._id });
    console.log("DeleteUserVerification:" , deleteResponse)
    if (deleteResponse.status == 500) {
      handleUpdateUserAccountError(
        res,
        "Error verifying account. Please contact admin"
      );
      return;
    }
    // update user account
    const updateResponse = await UpdateUserAccount(foundUser, {
      emailVerified: true,
    });
    if (updateResponse.status == 500) {
      handleUpdateUserAccountError(
        res,
        "Error when completing verification. Please contact admin"
      );
      return;
    }

    // Handle Verification Success
    handleVerificationSuccess(res, "Account verified successfully");
  }
);

const verifyOTP = asyncHandler(
  async (
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
  ) => {
    // verify headers
    console.log(req.body);
    const headerResponse = VerifyJsonRequest(req, ["userId", "otp"]);
    if (headerResponse.status == 400) {
      res.status(headerResponse.status).json(headerResponse);
      return;
    }

    const { userId, otp } = req.body;
    // check if user exists
    const foundUserResponse = await GetUserByFilter({ _id: userId });
    if (foundUserResponse.status == 500) {
      res.status(foundUserResponse.status).json(foundUserResponse);
      return;
    }
    const foundUser = foundUserResponse.result;

    // check if account active
    if (!foundUser.active) {
      res.status(401).json({
        status: 401,
        result: "Unauthorized access. Please contact admin",
      });
      return;
    }

    // check if otp exists
    const foundOTPResponse = await FindOTPVerification({ userId: userId });
    if (foundOTPResponse.status == 500) {
      res.status(foundOTPResponse.status).json(foundOTPResponse);
      return;
    }
    const foundOTP = foundOTPResponse.result;

    // check if otp is correct
    const isOTPCorrect = await VerifyCode(otp, foundOTP.otp);
    if (!isOTPCorrect) {
      res.status(401).json({
        status: 401,
        result: "Unauthorized access. Please contact admin",
      });
      return;
    }

    // check if otp is expired
    const currentTimestamp = getCurrentTimeInSeconds(); // Current time in seconds
    const date = new Date(foundOTP.expires);
    const secondsFoundOTP = Math.floor(date.getTime() / 1000);
    if (currentTimestamp > secondsFoundOTP) {
      res.status(401).json({
        status: 401,
        result: "Unauthorized access. Please contact admin",
      });
      return;
    }

    // delete otp record
    const deleteResponse = await DeleteOTPVerification({ userId: userId });
    if (deleteResponse.status == 500) {
      res.status(deleteResponse.status).json(deleteResponse);
      return;
    }
    // Generate tokens and set cookies
    const tokenResult = generateTokensAndSetCookies(res, foundUser);

    if (tokenResult.status !== 200) {
      res.status(tokenResult.status).json(tokenResult);
      return;
    }

    res.status(200).json({
      status: 200,
      result: { message: "OTP successfully verified" },
    });
  }
);

const adminRegister = asyncHandler(
  async (
    req,
    res,
    next,
    VerifyJsonRequest,
    createUserAccountHelper,
    SanitizeEmail,
    GetUserByFilter,
    ValidateUserPassword
  ) => {
    //check if username, code, password exists
    const headerResponse = VerifyJsonRequest(req, [
      "email",
      "code",
      "password",
    ]);
    if (headerResponse.status == 400) {
      res.status(headerResponse.status).json(headerResponse);
      return;
    }

    const { email, code, password } = req.body;

    if (
      email == null ||
      email == undefined ||
      email == "" ||
      code == null ||
      code == undefined ||
      code == "" ||
      password == null ||
      password == undefined ||
      password == ""
    ) {
      res
        .status(400)
        .json({ status: 400, result: "Missing email, code or password" });
      return;
    }

    // check if email is valid
    const sanitizedEmailResponse = SanitizeEmail(email);
    if (sanitizedEmailResponse.status == 400) {
      res.status(sanitizedEmailResponse.status).json(sanitizedEmailResponse);
      return;
    }

    // check if code is correct
    if (code != process.env.ADMIN_TOKEN_SECRET) {
      res.status(401).json({
        status: 401,
        result: "Unauthorized registration.",
      });
      return;
    }

    // check if an account already exists
    const foundUserResponse = await GetUserByFilter({
      roles: {
        $elemMatch: {
          $eq: "admin",
        },
      },
    });

    if (foundUserResponse.status == 200) {
      res.status(401).json({
        status: 401,
        result: "Registration refused",
      });
      return;
    }

    // validate password
    const passwordValidationResponse = await ValidateUserPassword(password);
    if (passwordValidationResponse.status == 400) {
      res
        .status(passwordValidationResponse.status)
        .json(passwordValidationResponse);
        return
    }
    //create user
    const accountCreationResponse = await createUserAccountHelper({
      email,
      password,
      roles: ["admin"],
      emailVerified: true,
      firstname: "admin",
      lastname: "admin",
      username: "admin",
    });

    if (accountCreationResponse.status == 500) {
      res.status(accountCreationResponse.status).json(accountCreationResponse);
      return;
    }
    res.status(200).json(accountCreationResponse);
  }
);

module.exports = {
  login,
  refresh,
  logout,
  verifyEmail,
  verifyEmailStaff,
  verified,
  verifyOTP,
  resendOTP,
  adminRegister,
};
