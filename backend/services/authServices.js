const path = process.env.NODE_ENV === "development"?"http://localhost:3000" || "http://localhost" : "https://ict3x03yorm.pro";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../middleware/mailer");
const { HashFunction } = require("../utils");
const {GetUserByFilter} = require("../access/DbUser");

const {
  FindUserVerification,
  CreateEmailVerification,
  UpdateUserVerification,
  DeleteUserVerification,
  CreateOTPVerification,
  FindOTPVerification,
  DeleteOTPVerification,
  UpdateOTPVerification,
} = require("../access/DbAuth");

function getCurrentTimeInSeconds() {
  return Math.floor(Date.now() / 1000); // Current time in seconds
}

const redirectFrontEnd = (res) => {
   res.redirect(`${path}/auth`);
};

const handleUserNotFoundError = (res, message) => {
  res.redirect(`${path}/error?error=true&message=${message}&subTitle=Error`);
};

const handleUserVerificationError = (res, message) => {
  res.redirect(`${path}/error?error=true&message=${message}&subTitle=Error`);
};

const handleValidationFailure = (res, message) => {
  res.redirect(`${path}/error?error=true&message=${message}&subTitle=Error`);
};

const handleUpdateUserAccountError = (res, message) => {
  res.redirect(`${path}/error?error=true&message=${message}&subTitle=Error`);
};

const handleVerificationSuccess = (res, message) => {
  res.redirect(`${path}/success?error=false&subtitle=${message}`);
};

async function VerifyCode(code, encyptedCode) {
  if (await bcrypt.compare(code, encyptedCode)) {
    return true;
  }
  return false;
}

async function validateEmailVerification(
  foundUser,
  foundUserVerification,
  uniqueString
) {
  const errors = [];
  // check if account active
  if (foundUser.active == false) {
    errors.append("Account is inactive.");
  }
  // check if verification email code is correct
  const isCodeCorrect = await VerifyCode(
    uniqueString,
    foundUserVerification.uniqueString
  );
  if (!isCodeCorrect) {
    errors.append("Code is incorrect.");
  }

  // check if code is expired
  const currentTimestamp = getCurrentTimeInSeconds(); // Current time in seconds
  const date = new Date(foundUserVerification.expires);
  const secondsFoundUserVerification = Math.floor(date.getTime() / 1000);
  if (currentTimestamp > secondsFoundUserVerification) {
    errors.append("Code has expired.");
  }

  if (errors.length) {
    return { status: 401, result: errors };
  }
  return { status: 200, result: "Validation success" };
}

const generateTokensAndSetCookies = (res, userData) => {
  const { _id, roles, emailVerified } = userData;
  let tokensGeneratedSuccessfully = false;
  try {
    // generate token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: _id,
          roles: roles,
          verified: emailVerified,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15 min" }
    );

    const refreshToken = jwt.sign(
      {
        id: _id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1 day" }
    );

    // create cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //assessible by web server
      secure: true, // only accessible by https
      sameSite: "none", // cross-site cookie
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day cause why not?
    });

    // create cookie with access token
    res.cookie("token", accessToken, {
      httpOnly: process.env.NODE_ENV == "development" ? false : true, //assessible by web server development
      secure: true, // only accessible by https
      sameSite: "none", // cross-site cookie
      maxAge: 15 * 60 * 1000, // 15 minute cause why not?
    });

    tokensGeneratedSuccessfully = true; // Update the variable if successful
  } catch (error) {
    // Handle token generation errors here
    console.error("Token generation error:", error);
  }

  if (tokensGeneratedSuccessfully == true) {
    return {
      status: 200,
      result: "Tokens generated and cookies set successfully",
    };
  }

  return { status: 500, result: "Error generating tokens and setting cookies" };
};

const clearCookies = (res) => {
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });
  res.clearCookie("token", {
    httpOnly: process.env.NODE_ENV == "development" ? false : true,
    secure: true,
    sameSite: "none",
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

const generateAccessToken = async (userId) => {
  const foundUser = await GetUserByFilter({ _id: userId });
  if (foundUser.status === 500) {
    return { status: 500, result: foundUser };
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: userId,
        roles: foundUser.result.roles,
        verified: foundUser.result.emailVerified,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15 min" }
  );

  return { status: 200, result: accessToken };
};

const sendOTPVerificationEmail = async (req) => {
  const otp = generateRandomOTP();
  console.log("Req:", req)
  const { _id, email } = req;
  console.log(`Sending OTP to: ${_id}`)
  try {
    const hashedOTP = await HashFunction(otp);
    const result = await createOrUpdateOTP(_id, hashedOTP);
    await sendOTPByEmail(email, otp);

    return {
      status: 200,
      result: { _id, message: "OTP sent! Please check your email" },
    };
  } catch (error) {
    console.log(error);
    return { status: 500, result: "Error sending OTP" };
  }
};

const generateRandomOTP = () => `${Math.floor(1000 + Math.random() * 9000)}`;

const sendOTPByEmail = async (email, otp) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "OTP Verification",
      html: `<p>Enter OTP in the app: <b>${otp}</b></p><p>This OTP expires in 15 minutes</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });
};

const sendVerificationEmail = async (
  { user, mailOptions, uniqueString },
  res
) => {
  try {
    console.log(`Sending verification email to: ${user._id}`)
    // Hash the unique string
    const hashedUniqueString = await HashFunction(uniqueString);

    if (!hashedUniqueString) {
      throw new Error("Error hashing unique string");
    }

    const verifyObj = {
      _id: user._id,
      uniqueString: hashedUniqueString,
      expires: Date.now() + 21600000, // 6 hours
    };

    // Check if verification record exists
    const foundUserVerificationResponse = await FindUserVerification({
      _id: user._id,
    });

    if (foundUserVerificationResponse.status === 200) {
      // Update verification record
      const updateResponse = await UpdateUserVerification(
        { _id: user._id },
        verifyObj
      );
      if (updateResponse.status === 500) {
        return res.status(updateResponse.status).json(updateResponse);
      }
    } else {
      // Create a new verification record
      const verificationResponse = await CreateEmailVerification(verifyObj);
      if (verificationResponse.status === 500) {
        return res
          .status(verificationResponse.status)
          .json(verificationResponse);
      }
    }

    // Send email
    await sendEmail(mailOptions);

    res.status(200).json({ status: 200, result: "Verification email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, result: "Error sending email" });
  }
};

const createOrUpdateOTP = async (userId, hashedOTP) => {
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  const foundOTPResponse = await FindOTPVerification({ userId });

  if (foundOTPResponse.status === 200) {
    return UpdateOTPVerification({ userId }, { otp: hashedOTP, expires });
  } else {
    return CreateOTPVerification({ userId, otp: hashedOTP, expires });
  }
};

module.exports = {
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
  sendVerificationEmail,
  clearCookies
};
