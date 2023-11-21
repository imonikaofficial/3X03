const router = require("express").Router();

// split up route handling
router.use("/users", require("./userInfo"));
router.use("/staff", require("./staffInfoRoute"));
router.use("/cars", require("./carRoute"));
router.use("/auth", require("./authRoute"));
router.use("/trans", require("./transRoute"));
router.use("/license", require("./licenseRoute"));

module.exports = router;
