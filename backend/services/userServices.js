const currentUrl = process.env.NODE_ENV ==="development"?"http://localhost:3000" || "http://localhost" : "https://ict3x03yorm.pro";
const uuid = require("uuid");
const AuthServices = require("../services/authServices");
const {
  UpdateUserAccount,
  UploadLicenseImg,
  GetUserByFilter,
  GetNumberOfUsers,
  CreateUserAccount,
} = require("../access/DbUser");
const {
  HashFunction,
  generateNewObjectId,
  SanitizeInputString,
  SanitizeEmail,
  PasswordRegex,
  isValidDate,
} = require("../utils");

const isUserActive = (status) => {
  if (!status || status == false) {
    return false;
  }
  return true;
};

const checkUserExistence = async (filter) => {
  const foundUserResponse = await GetUserByFilter(filter);
  console.log(foundUserResponse);
  return foundUserResponse;
};

const createUserAccountHelper = async (userInfo) => {
  try {
    // hash password
    const hashedPassword = await HashFunction(userInfo.password);
    userInfo.password = hashedPassword;

    const accountCreationResponse = await CreateUserAccount(userInfo);
    return accountCreationResponse;
  } catch(error) {
    console.error("Error creating user account:", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

const sendVerificationEmail = (user, res) => {
  const uniqueString = uuid.v4() + user._id;
  const verificationLink = `${currentUrl}/api/auth/verify-email/${user._id}/${uniqueString}?redirect=/frontend-url`;

  const mailOptions = {
    from: process.env.MAIL_ID,
    to: user.email,
    subject: "Account Verification",
    html: `<h2>Thank you for registering!</h2>
        <p>Please verify your account by clicking the link below. This link expires in 6 hours</p>
        <a href="${verificationLink}">Verify</a>`,
  };

  AuthServices.sendVerificationEmail(
    { user, mailOptions, uniqueString },
    res
  );
};

const validateUserInfo = (data) => {
  console.log("inside validateUserInfo")
  /*
        Purpose: Validate user info
        Arguments: username, password, email, dob
        Returns:  object
        */
  let username = data.username;
  let password = data.password;
  let email = data.email;
  let dob = data.dob;
  let firstname = data.firstname;
  let lastname = data.lastname;
  let address = data.address;
  let postal = data.postal;
  let country = data.country;
  let phone = data.phone;

  let hasErrors = false;
  const errors = [];
  //console.log("validateUserInfo");

  console.log("Validating username")
  // username validation
  if (username == null || username == undefined || username == "") {
    hasErrors = true;
    errors.push("Username is empty");
  }
  const sanitizeUsernameResponse = SanitizeInputString(username, 30);
  if (sanitizeUsernameResponse.status == 400) {
    hasErrors = true;
    errors.push(sanitizeUsernameResponse.result);
  }
  username = sanitizeUsernameResponse.result;
  console.log("Validating firstname")
  // firstname validation
  if (firstname == null || firstname == undefined || firstname == "") {
    hasErrors = true;
    errors.push("Firstname is empty");
  }
  const sanitizeFirstnameResponse = SanitizeInputString(firstname);
  if (sanitizeFirstnameResponse.status == 400) {
    hasErrors = true;
    errors.push(sanitizeFirstnameResponse.result);
  }
  firstname = sanitizeFirstnameResponse.result;

  console.log("Validating lastname")
  // lastname validation
  if (lastname == null || lastname == undefined || lastname == "") {
    hasErrors = true;
    errors.push("Lastname is empty");
  }
  const sanitizeLastnameResponse = SanitizeInputString(lastname);
  if (sanitizeLastnameResponse.status == 400) {
    hasErrors = true;
    errors.push(sanitizeLastnameResponse.result);
  }
  lastname = sanitizeLastnameResponse.result;
 console.log("Validating address")
  // address validation
  if (address == null || address == undefined || address == "") {
    hasErrors = true;
    errors.push("Address is empty");
  }
  const sanitizeAddressResponse = SanitizeInputString(address);
  if (sanitizeAddressResponse.status == 400) {
    hasErrors = true;
    errors.push(sanitizeAddressResponse.result);
  }
  address = sanitizeAddressResponse.result;
  console.log("Validating postal")
  // postal validation
  if (postal == null || postal == undefined || postal == "") {
    hasErrors = true;
    errors.push("Postal is empty");
  }
  const sanitizePostalResponse = SanitizeInputString(postal, 6);
  if (sanitizePostalResponse.status == 400) {
    hasErrors = true;
    errors.push(sanitizePostalResponse.result);
  }
  postal = sanitizePostalResponse.result;
  console.log("Validating country")
  // country validation
  if (country == null || country == undefined || country == "") {
    hasErrors = true;
    errors.push("Country is empty");
  }
  const sanitizeCountryResponse = SanitizeInputString(country);
  if (sanitizeCountryResponse.status == 400) {
    hasErrors = true;
    errors.push(sanitizeCountryResponse.result);
  }
  country = sanitizeCountryResponse.result;
  console.log("Validating phone")
  // phone validation

  function containsOnlyNumbers(input) {
    // Use a regular expression to check if the input consists of only digits
    return /^\d+$/.test(input);
  }

  if (phone == null || phone == undefined || phone == "" || !containsOnlyNumbers(phone) ) {
    hasErrors = true;
    errors.push("Phone is empty");
  }
  
  const sanitizePhoneResponse = SanitizeInputString(phone, 8);
  if (sanitizePhoneResponse.status == 400) {
    hasErrors = true;
    errors.push(sanitizePhoneResponse.result);
  }
  phone = sanitizePhoneResponse.result;
  console.log("Validating password")
  // password validation
  if (password == null || password == undefined || password == "") {
    hasErrors = true;
    errors.push("Password is empty");
  }
  // check if password length is 8-64 characters
  if (!PasswordRegex.test(password)) {
    hasErrors = true;
    errors.push(
      "Password must be 8-64 characters and cannot contain sequential characters"
    );
  }
  console.log("Validating email")
  // email validation
  if (email == null || email == undefined || email == "") {
    hasErrors = true;
    errors.push("Email is empty");
  }
  const sanitizeEmailResponse = SanitizeEmail(email);
  if (sanitizeEmailResponse.status == 400) {
    hasErrors = true;
    errors.push(sanitizeEmailResponse.result);
  }
  email = sanitizeEmailResponse.result;
  console.log("Validating dob")
  // dob validation
  if (dob == null || dob == undefined || dob == "") {
    hasErrors = true;
    errors.push("Date of birth is empty");
  }
  const sanitizeDobResponse = isValidDate(dob);
  if (sanitizeDobResponse == false) {
    hasErrors = true;
    errors.push("Invalid Date format");
  }
  dob = sanitizeDobResponse.result;

  console.log("validateUserInfo Completed");
  if (hasErrors) {
    return { status: 400, result: errors };
  }

  const userInfoValidation = data;

  return { status: 200, result: userInfoValidation };
};

module.exports = {
  isUserActive,
  checkUserExistence,
  createUserAccountHelper,
  validateUserInfo,
  sendVerificationEmail,
};
