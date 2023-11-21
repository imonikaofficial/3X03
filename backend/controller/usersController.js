const asyncHandler = require("express-async-handler");

const getUser = asyncHandler(async (req, res, next, GetUserByFilter) => {
  /*
    Endpoint: /api/users/getOne
    Method: GET
    Route: Get a user by id
    Returns: User object
    */
  try{
      const userId = req.id;
    //console.log(userId);
    const userResponse = await GetUserByFilter({ _id: userId });
    //console.log(userResponse);
    if (userResponse.status == 500) {
      res.status(userResponse.status).json(userResponse);
      return;
    }
    res.status(userResponse.status).json(userResponse);
  } catch (error) {
    //console.log("get user error");
    next(error);
  };
});

const createNewUser = asyncHandler(async (req, res, VerifyJsonRequest, checkUserExistence, createUserAccountHelper, validateUserInfo, sendVerificationEmail, generateNewObjectId) => {
  /*
    Endpoint: /api/users/addUser
    Method: POST
    Route: Create a new user
    Returns: User object
    */
   console.log("createUserAccount");

  // verify headers
  const headerResponse = VerifyJsonRequest(req, [
    "username",
    "password",
    "email",
    "dob",
    "firstname",
    "lastname",
    "address",
    "postal",
    "country",
    "phone",
    "roles",
  ]);
  

  if (headerResponse.status == 400) {
    res.status(headerResponse.status).json(headerResponse.result);
    return;
  }

  // get user info
  let userInfo = req.body;
  console.log(userInfo)
  // validate user info
  console.log("Validating user info")
  const userInfoValidation = validateUserInfo(userInfo);

  if (userInfoValidation.status == 400) {
    res.status(userInfoValidation.status).json(userInfoValidation.result);
    return;
  }
  //console.log(userInfoValidation.result);

  console.log("Checking user existence")
  // check if user already exists
  const foundUserResponse = await checkUserExistence(
    { email: userInfoValidation.result.email }
  );
  //console.log(foundUserResponse);
  if (foundUserResponse.status == 200) {
    res.status(400).json({
      status: 400,
      result: "Email already exists",
    });
    return;
  }

  const userId = generateNewObjectId();
  userInfoValidation.result._id = userId;
  // create user account
  console.log("Creating user account")
  const accountCreationResponse = await createUserAccountHelper(
    userInfoValidation.result
  );

  if (accountCreationResponse.status == 500) {
    res.status(accountCreationResponse.status).json(accountCreationResponse);
    return;
  }
  console.log("Sending verification email")
  // Send verification email
  sendVerificationEmail(userInfoValidation.result, res);
});

const updateUser = asyncHandler(async (req, res, checkUserExistence, ValidateUserPassword, VerifyUserPassword, HashFunction, UpdateUserAccount) => {
  /*
        Endpoint: /api/users/updateUser
        Method: PUT
        Route: Update a user
        Returns: User object
        */
  // verify headers

  if (!req.id) {
    res
      .status(400)
      .json({ status: 400, result: "Missing fields in request body." });
  }

  // find user
  const foundUserResponse = await checkUserExistence({ _id: req.id });
  console.log("found user response", foundUserResponse);
  if (foundUserResponse.status !== 200) {
    res.status(400).json({
      status: 400,
      result: "User not found",
    });
    return;
  }
  const foundUser = foundUserResponse.result;
  console.log("found User", foundUser);
  console.log("request body", req.body);
  // Handle password update separately
  if (req.body.password) {
    const newPassword = req.body.password;
    // Validate the new password
    const passwordValidationResponse = await ValidateUserPassword(newPassword);

    if (passwordValidationResponse.status === 400) {
      return res
        .status(passwordValidationResponse.status)
        .json(passwordValidationResponse.result);
    }
    console.log("newPassword after Validation: ", newPassword);
    console.log("foundUserPassword: ", foundUser.password);
    // verify old password
    const verifyPasswordResponse = await VerifyUserPassword(
      newPassword,
      foundUser.password
    );
    if (verifyPasswordResponse == true) {
      res.status(400).json("Old password is the same as new password");
      return;
    }
    console.log("newPassword Verification: ", newPassword);
    req.body.password = await HashFunction(newPassword);
  }

  // update user account
  const accountUpdateResponse = await UpdateUserAccount(foundUser, req.body);
  console.log("Account updated successfully");
  res.status(accountUpdateResponse.status).json(accountUpdateResponse);
});

const getNumberOfUsers = asyncHandler(async (req, res, GetNumberOfUsers) => {
  /*
    Endpoint: /api/users/get-number
    Method: GET
    Route: Get number of users
    Returns: Number of users
    */
  const numberOfUsers = await GetNumberOfUsers();
  res.status(200).json({ result: numberOfUsers });
});


module.exports = {
  createNewUser,
  updateUser,
  getUser,
  getNumberOfUsers,
};
