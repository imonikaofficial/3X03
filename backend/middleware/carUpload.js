const multer = require("multer");
const { promises: fsPromises, constants } = require("fs");
const uuid = require("uuid");
const fs = require("fs");
const uploadDirectory = "uploads/cars/";
// Set up a storage engine for multer to save encrypted files
const carImgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname; // Get the original filename
    const fileExtension = originalname.split(".").pop(); // Get the file extension
    const uniqueString = uuid.v4();
    // Specify the specific name with the original extension
    const uniqueName = `${uniqueString}.${fileExtension}`;
    console.log(fileExtension);
    try {
      // Check for invalid file extensions here
      const allowedExtensions = ["jpg", "jpeg", "png"];
      if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
        return cb("Invalid file extension", null);
      }
      req.body.image = uniqueName;
      req.body.contentType = file.mimetype;

      // If the extension is valid, use the specific filename
      cb(null, uniqueName);
    } catch {
      console.log("error");
    }
  },
});

// Create a multer instance for handling file uploads and encryption
const uploadCar = multer({ storage: carImgStorage });

module.exports = uploadCar;
