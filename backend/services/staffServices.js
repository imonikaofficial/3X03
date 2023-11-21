const currentUrl = process.env.NODE_ENV ==="development"?"http://localhost:3000" || "http://localhost" : "https://ict3x03yorm.pro";
const uuid = require("uuid");
const AuthServices = require("../services/authServices");

const sendVerificationEmail = (user, generatedPw, res) => {
  const uniqueString = uuid.v4() + user._id;
  const verificationLink = `${currentUrl}/api/auth/verify-email-staff/${user._id}/${uniqueString}`;

  // mail options
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: user.email,
    subject: "Account Verification and Password Creation",
    html: `<h2>Thank you for registering!</h2>
          <p>Please verify your account and by clicking the link below. This link expires in 6 hours</p>
          <p>Contact administrator if any issues faced.</p>
          <p>Temporary password: <b>${generatedPw}</b></p>
          <a href="${verificationLink}">Verify and change password</a>`,
  };

  AuthServices.sendVerificationEmail(
    { user, mailOptions, uniqueString },
    res
  );
};

const sendPasswordResetEmail = (user, generatedPw, res) => {
  const uniqueString = uuid.v4() + user._id;
  const verificationLink = `${currentUrl}/api/auth/verify-email-staff/${user._id}/${uniqueString}`;

  // mail options
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: user.email,
    subject: "Password Reset",
    html: `<h2>Your password has been reset!</h2>
    <p>Please login with the temporary password below. This link expires in 6 hours</p>
    <p>Contact administrator if any issues faced.</p>
    <p>Temporary password: <b>${generatedPw}</b></p>
    <a href="${verificationLink}">Verify and change password</a>`,
  };

  AuthServices.sendVerificationEmail(
    {
      user: user,
      mailOptions: mailOptions,
      uniqueString: uniqueString,
    },
    res
  );
};

function validateStaffInfo(data) {
  const firstName = data.firstname;
  const lastName = data.lastname;
  const email = data.email;
  const phone = data.phone;

  let hasErrors = false;
  const errors = [];

  //   simple validation
  if (firstName == null || firstName == undefined || firstName == "") {
    hasErrors = true;
    errors.push("First name is empty");
  }
  if (lastName == null || lastName == undefined || lastName == "") {
    hasErrors = true;
    errors.push("Last name is empty");
  }
  if (phone == null || phone == undefined || phone == "") {
    hasErrors = true;
    errors.push("Phone is empty");
  }
  if (email == null || email == undefined || email == "") {
    hasErrors = true;
    errors.push("Email is empty");
  }
  // check if email is valid
  let re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    hasErrors = true;
    errors.push("Email is invalid");
  }

  if (hasErrors) {
    return { status: 400, result: errors };
  }

  const userInfoValidation = data;

  return { status: 200, result: userInfoValidation };
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  validateStaffInfo,
};
