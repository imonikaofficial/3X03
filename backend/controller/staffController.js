const asyncHandler = require("express-async-handler");

const get = asyncHandler(async (req, res, next, GetStaffByFilter) => {
  /*
    Endpoint: /api/staff/
    Method: GET
    Route: Get all active staff
    Returns: Array of user objects
    */
  const allAccountsResponse = await GetStaffByFilter({
    active: true,
  });
  if (allAccountsResponse.status == 500) {
    res.status(allAccountsResponse.status).json(allAccountsResponse);
    return;
  }
  const allAccounts = allAccountsResponse.result;
  const staff = allAccounts.filter((account) =>
    account.roles.includes("staff")
  );

  res.status(200).json({ status: 200, result: staff });
});

const getById = asyncHandler(async (req, res, next, GetStaffByFilter) => {
  /*
    Endpoint: /api/staff/get
    Method: GET
    Route: Get a staff by id
    Returns: Staff object
    */
  const id = req.id;
  const staffResponse = await GetStaffByFilter({ _id: id });
  if (staffResponse.status == 500) {
    res.status(staffResponse.status).json(staffResponse);
    return;
  }
  const staff = staffResponse.result;
  res.status(200).json({ status: 200, result: staff });
});

const add = asyncHandler(
  async (
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
  ) => {
    /*
      Endpoint: /api/staff/add
      Method: POST
      Route: Create a new user
      Returns: User object
      */
    console.log("Creating staff account");
    // verify headers
    const headerResponse = VerifyJsonRequest(req, [
      "email",
      "firstname",
      "lastname",
      "phone",
    ]);

    if (headerResponse.status == 400) {
      res.status(headerResponse.status).json(headerResponse.result);
      return;
    }
    // add fields into body
    req.body["_id"] = generateNewObjectId();
    req.body["roles"] = ["staff"];
    req.body["username"] = req.body["email"].split("@")[0];

    const userInfo = req.body;

    // check if user already exists
    const foundUserResponse = await checkUserExistence({
      email: userInfo.email,
    });
    if (foundUserResponse.status == 200) {
      res.status(400).json({
        status: 400,
        result: "Email already exists",
      });
      return;
    }

    // validate user info
    const userInfoValidation = validateStaffInfo(userInfo);

    if (userInfoValidation.status == 400) {
      res.status(userInfoValidation.status).json(userInfoValidation.result);
      return;
    }
    const user = userInfoValidation.result;

    // generate pw
    const generatedPw = generateRandomPassword(12);
    user["password"] = await HashFunction(generatedPw);

    // create user account
    const accountCreationResponse = await AddStaffAccount(user);
    if (accountCreationResponse.status == 500) {
      res.status(accountCreationResponse.status).json(accountCreationResponse);
      return;
    }

    sendVerificationEmail(user, generatedPw, res);
  }
);

// const update = asyncHandler(async (req, res) => {});

const resetPassword = asyncHandler(
  async (
    req,
    res,
    VerifyJsonRequest,
    sendPasswordResetEmail,
    checkUserExistence,
    HashFunction,
    UpdateStaffAccount,
    generateRandomPassword
  ) => {
    /*
    Endpoint: /api/staff/reset-pw
    Method: POST
    Route: Reset a staff's password
    Returns: Staff object
    */
    //reset password
    console.log("Resetting password");
    // verify headers
    const headerResponse = VerifyJsonRequest(req, ["email"]);
    if (headerResponse.status == 400) {
      res.status(headerResponse.status).json(headerResponse.result);
      return;
    }

    const email = req.body.email;

    // find user
    const staffResponse = await checkUserExistence({ email: email });
    if (staffResponse.status == 500) {
      res.status(staffResponse.status).json(staffResponse.result);
      return;
    }

    const user = staffResponse.result;
    console.log(user);

    // generate new password
    const generatedPw = generateRandomPassword(12);

    // hash password
    const hashedPassword = await HashFunction(generatedPw);

    // update user account
    const accountUpdateResponse = await UpdateStaffAccount(
      { _id: user._id.toString() },
      {
        password: hashedPassword,
      }
    );
    if (accountUpdateResponse.status == 500) {
      res.status(accountUpdateResponse.status).json(accountUpdateResponse);
      return;
    }

    // send verification email
    sendPasswordResetEmail(user, generatedPw, res);
  }
);

const changePassword = asyncHandler(
  async (
    req,
    res,
    VerifyJsonRequest,
    checkUserExistence,
    ValidateUserPassword,
    HashFunction,
    VerifyUserPassword,
    UpdateStaffAccount
  ) => {
    /*

    Endpoint: /api/staff/change-pw
    Method: Post
    Route: Update a staff's password
    Returns: Staff object
    */
    // verify headers
    const headerResponse = VerifyJsonRequest(req, ["old", "new"]);
    if (headerResponse.status == 400) {
      res.status(headerResponse.status).json(headerResponse.result);
      return;
    }

    const userId = req.id;
    const oldPassword = req.body.old;
    const newPassword = req.body.new;

    // find user
    const userResponse = await checkUserExistence({ _id: userId });
    if (userResponse.status == 500) {
      res.status(userResponse.status).json(userResponse.result);
      return;
    }
    const user = userResponse.result;

    // get old password
    const oldPw = user.password;

    // check if user keyed old password is same as new password
    if (oldPassword == newPassword) {
      res.status(400).json("New password cannot be the same as old password");
      return;
    }

    // verify old password in db with new password
    const verifyPasswordResponse = await VerifyUserPassword(newPassword, oldPw);
    if (verifyPasswordResponse == true) {
      res.status(400).json("Old password is the same as new password");
      return;
    }

    // validate new password
    const passwordValidationResponse = await ValidateUserPassword(newPassword);

    if (passwordValidationResponse.status == 400) {
      res
        .status(passwordValidationResponse.status)
        .json(passwordValidationResponse.result);
      return;
    }

    // hash password
    const hashedPassword = await HashFunction(newPassword);
    // update user account
    const accountUpdateResponse = await UpdateStaffAccount(
      { _id: userId },
      {
        password: hashedPassword,
      }
    );

    res.status(accountUpdateResponse.status).json(accountUpdateResponse);
  }
);

const remove = asyncHandler(
  async (
    req,
    res,
    next,
    VerifyJsonRequest,
    checkUserExistence,
    UpdateStaffAccount
  ) => {
    /*
        Endpoint: /api/staff/delete
        Method: DELETE
        Route: Delete a staff
        Returns: Staff object
        */
    // verify headers
    const headerResponse = VerifyJsonRequest(req, ["id"]);
    if (headerResponse.status == 400) {
      res.status(headerResponse.status).json(headerResponse.result);
      return;
    }

    const userId = req.body.id;
    // find user
    const userResponse = await checkUserExistence({ _id: userId });
    if (userResponse.status == 500) {
      res.status(userResponse.status).json(userResponse.result);
      return;
    }
    const user = userResponse.result;

    // delete user account
    const accountDeleteResponse = await UpdateStaffAccount(
      { _id: user._id.toString() },
      {
        active: false,
      }
    );
    res.status(accountDeleteResponse.status).json(accountDeleteResponse);
  }
);

module.exports = {
  get,
  getById,
  add,
  // update,
  resetPassword,
  changePassword,
  remove,
};
