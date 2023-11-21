const router = require("express").Router();
const licenseController = require("../controller/licenseController");
const RBAC = require("../middleware/RBAC");
const verifyJWT = require("../middleware/verifyJWT");

const {
  encryptUpload,
  encryptAndStoreMiddleware,
} = require("../middleware/encryption"); // Import the middleware
router
  .route("/")
  .get(verifyJWT, RBAC(["staff"]), licenseController.getAllLicenses);

router
  .route("/:id")
  .get(verifyJWT, RBAC(["staff"]), licenseController.getLicenseById);

router
  .route("/update")
  .post(verifyJWT, RBAC(["staff"]), licenseController.updateLicense);

router
  .route("/upload")
  .post(
    verifyJWT,
    RBAC(["user"]),
    encryptUpload.array("files", 2),
    encryptAndStoreMiddleware,
    licenseController.addLicense
  );

router
  .route("/download/:id/:align")
  .get(verifyJWT, RBAC(["staff"]), licenseController.getLicenseImageById);

module.exports = router;
