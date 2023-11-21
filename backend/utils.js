const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,64}$/; // check if password length is a complex 8-64 characters password
const crypto = require("crypto");

function VerifyJsonRequest(request_json, args = []) {
  console.log(request_json.body)
  for (let arg of args) {
    if (!(arg in request_json.body)) {
      return { status: 400, result: "Missing fields in request body." };
    }
  }
  return { status: 200 };
}

function generateNewObjectId() {
  // Function for generating a new ObjectId
  return new mongoose.Types.ObjectId();
}

function validateRequest(req, requiredFields=[]) {
  // Function for validating received req
  const headerResponse = VerifyJsonRequest(req, requiredFields);
  return {status: headerResponse.status, result: headerResponse.result};
}


async function ValidateUserPassword(pw) {
  /*
      Purpose: Validate user password
      Arguments: password
      Returns:  object
      */
  const password = pw;

  let hasErrors = false;
  let error = "";
  let pwnedPassword = false;

  //   simple validation
  if (password == null || password == undefined || password == "") {
    hasErrors = true;
    error = "Password is empty";
  }
  // check if password length is 8-64 characters
  else if (!PasswordRegex.test(password)) {
    hasErrors = true;
    error =
      "Password must be a complex password consisting of 8-64 characters";
  }
  
  try {
    const passwordHash = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(pw));
    const passwordHashString = Array.from(new Uint8Array(passwordHash)).map(b => b.toString(16).padStart(2, '0')).join('');
    const prefix = passwordHashString.substring(0, 5);
    const suffix = passwordHashString.substring(5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const hashes = await response.text();
    const found = hashes.split('\r\n').find(h => h.startsWith(suffix.toUpperCase()));

    if (found == undefined || found == null || found == "" || found == "undefined") {
      console.log("The password hasn't been found in any data breaches.");
      pwnedPassword = false;
      
    } else {
      console.log(`The password has been exposed ${found.split(':')[1]} times.`);
      pwnedPassword = true;
    }
  } catch (error) {
    console.error('An error occurred while checking the password:', error);
  }

    // Use the function with the password to check
  if (pwnedPassword == true) {
    hasErrors = true;
    error = "Password unsafe!";
  }


  if (hasErrors) {
    return { status: 400, result: error };
  }

  console.log(pw);
  return { status: 200, result: password };
}

async function VerifyUserPassword(pw, oldPw) {
  console.log("comparing password", pw, oldPw)
  // check if password is the same as old password
  if (await bcrypt.compare(pw, oldPw)) {
    return true;
  }
  return false;
}



const HashFunction = async (input) => {
  return bcrypt.hash(input, 10);
};


function generateRandomPassword(length) {
  // Define the characters that can be used in the password
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Initialize an empty password string
  let password = "";

  // Generate random bytes
  const randomBytes = crypto.randomBytes(length);

  // Iterate through the random bytes and convert them to characters from the character set
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes.readUInt8(i) % characters.length;
    password += characters.charAt(randomIndex);
  }

  return password;
}

function SanitizeInputString(inputString, maxLength = 255) {
  console.log("inside input string function ", inputString)
  // Remove leading and trailing whitespace
  let sanitizedString = inputString.trim();
  // sanitizedString  = DOMPurify.sanitize(sanitizedString);
  console.log("Sanitizing input string", sanitizedString)
  // Escape characters that could be used for MongoDB injection
  sanitizedString = sanitizedString.replace(/[$.]/g, "");
  console.log("Sanitizing 2")
  // Prevent NoSQL injection by disallowing certain characters
  const disallowedChars = /[\$\\'\"]/g;
  if (disallowedChars.test(sanitizedString)) {
    return { status: 400, result: `Input contains disallowed characters` };
  }
  console.log("Checking length")
  // Check and limit the string length
  if (sanitizedString.length > maxLength) {
    return {
      status: 400,
      result: `Input exceeds the maximum length of ${maxLength} charactersMissing fields in request body.`,
    };
  }
  console.log("Santiizing complete")
  return { status: 200, result: sanitizedString };
}

function isValidDate(dateString) {
  // Use a regular expression to validate the "YYYY-MM-DD" format
  const dateFormatPattern = /^\d{4}-\d{2}-\d{2}$/;

  // Check if the date string matches the pattern
  return dateFormatPattern.test(dateString);
}

function SanitizeEmail(email) {
  // Trim leading and trailing whitespace
  email = email.trim();

  // Normalize the email address to lowercase
  email = email.toLowerCase();

  // Use a regular expression to validate the email format
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(email)) {
    return { status: 400, result: `Invalid email format` };
  }

  return { status: 200, result: email };
}

module.exports = {
  VerifyJsonRequest,
  generateNewObjectId,
  validateRequest,
  ValidateUserPassword,
  generateRandomPassword,
  VerifyUserPassword,
  HashFunction,
  SanitizeInputString,
  SanitizeEmail,
  PasswordRegex,
  isValidDate,
};