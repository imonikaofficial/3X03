const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader =
    req.headers.authorization ||
    req.headers.Authorization ||
    req.headers["authorization"] ||
    req.headers["Authorization"];

  console.log("authHeader", authHeader);
  console.log("req body", req.body);
  if (!authHeader?.startsWith("Bearer ")) {
    console.log("Unauthorized");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    console.log(user.UserInfo.verified);
    if (user.UserInfo.verified === false) {
      res
        .status(403)
        .json({
          status: 403,
          result: "Unverified. Please verify your email first",
        });
      return;
    }

    req.id = user.UserInfo.id;
    req.roles = user.UserInfo.roles;
    console.log("verified", req.id)

    next();
  });
};

module.exports = verifyJWT;
