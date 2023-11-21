const { promises: fsPromises, constants } = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const encryptionKey = process.env.ENCRYPTION_KEY; // Replace encryption key
const fs = require("fs");
const path = require("path");

const uploadDirectory = "uploads/users/";

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Set up a storage engine for multer to save encrypted files
const encryptedStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname; // Get the original filename
    const fileExtension = originalname.split(".").pop(); // Get the file extension
    try {
      // Check for invalid file extensions here
      const allowedExtensions = ["jpg", "jpeg", "png"];
      if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
        return cb("Invalid file extension", null);
      }

      // If the extension is valid, use the specific filename
      cb(null, originalname); // Modify the filename for encrypted files
    } catch {
      console.log("error");
    }


  },
});

// Create a multer instance for handling file uploads and encryption
const encryptUpload = multer({ storage: encryptedStorage });

// Create a middleware for encrypting and storing uploaded files
const encryptAndStoreMiddleware = async (req, res, next) => {
  console.log("encryptAndStoreMiddleware is called");
  const uploadedFiles = req.files;

  console.log(uploadedFiles);

  // Check if files were uploaded
  if (!uploadedFiles) {
    return res.status(400).send({ message: "No files were uploaded" });
  }

  if (req.files) {
    req.encryptedFilePaths = []; // Create an array to store the paths of encrypted image files

    let anyInvalidFile = false; // Flag to track if any invalid file was encountered

    req.files.forEach((file) => {
      // Check if the file has an image extension (.jpg, .jpeg, .png)
      const allowedExtensions = [".jpg", ".jpeg", ".png"];
      const fileExtension = `.${file.originalname.split(".").pop()}`;

      if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
        // Handle non-image files by unlinking from the database

        console.log(`Removing non-image file: ${file.originalname}`);
        const inputFilePath = `${uploadDirectory}${file.originalname}`;
        fsPromises.unlink(inputFilePath).catch((err) => console.error(err));

        anyInvalidFile = true; // Set the flag to indicate an invalid file was encountered
      }
    });

    if (!anyInvalidFile) {
      // If no invalid files were found, proceed with processing the valid files
      req.encryptedFilePaths = []; // Create an array to store the paths of encrypted image files

      // Create an array of promises by using Array.map
      const encryptionPromises = req.files.map(async (file) => {
        const inputFilePath = `${uploadDirectory}${file.originalname}`;
        const randomString = uuidv4(); // Generate a random string
        const newOutputFilePath = `${uploadDirectory}${randomString}_${file.originalname}`;

        // Encrypt the file and save it with the new name
        await encryptFile(inputFilePath, newOutputFilePath);

        req.encryptedFilePaths.push({
          // image: newOutputFilePath,
          image: newOutputFilePath,
          mimetype: file.mimetype,
        }); // Add the path of the encrypted file to the array
        fsPromises.unlink(inputFilePath).catch((err) => console.error(err));
      });

      // Use Promise.all to await all encryption promises
      await Promise.all(encryptionPromises);
    } else {
      // If any invalid file was found
      // log a message
      console.log("Some files were invalid. Not proceeding with processing.");
    }
  }
  next();
};

// Encrypt the file and return a promise
const encryptFile = (inputFilePath, outputFilePath) => {
  return new Promise(async (resolve, reject) => {
    console.log("Attempting to encrypt file");

    const iv = crypto.randomBytes(16); // Generate a random initialization vector
    console.log(iv);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey, "hex"),
      iv
    );

    try {
      const inputBuffer = await fsPromises.readFile(inputFilePath);
      const encryptedData = Buffer.concat([
        iv, // Prefix the IV to the encrypted data
        cipher.update(inputBuffer),
        cipher.final(),
      ]);

      console.log(encryptedData.length);

      // Calculate the hash of the original image
      const originalImageHash = await calculateFileHash(inputFilePath);
      console.log("Hash of original image:", originalImageHash);

      // Save the encrypted data (with IV) and the hash in the output file
      // await fsPromises.writeFile(outputFilePath, iv);
      await fsPromises.writeFile(outputFilePath, encryptedData);
      // await fsPromises.appendFile(outputFilePath, originalImageHash);

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

//decrypt file
const decrypt = async (fileName) => {
  const imageName = fileName;
  const imagePath = path.join(__dirname, "..", imageName);

  try {
    // Read the encrypted image data from the file
    const encryptedImageData = await fs.promises.readFile(imagePath);
    // Extract the IV (first 16 bytes)
    const iv = encryptedImageData.slice(0, 16);
    // Extract the original image data (excluding the IV)
    const encryptedData = encryptedImageData.slice(16);

    // Decrypt the image using the IV
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(encryptionKey, "hex"),
      iv
    );
    const decryptedImageData = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return decryptedImageData;
  } catch (err) {
    console.error("Error serving decrypted image:", err);
    return null;
  }
};

// Calculate the SHA-256 hash of a file
async function calculateFileHash(filePath) {
  const fileData = await fsPromises.readFile(filePath);
  const hash = crypto.createHash("sha256");
  hash.update(fileData);
  return hash.digest("hex");
}

// Check if a file with the given path exists
const fileExistsInDestination = async (filePath) => {
  try {
    await fsPromises.access(filePath, constants.F_OK);
    return true; // File exists
  } catch (err) {
    return false; // File does not exist
  }
};

module.exports = { encryptUpload, encryptAndStoreMiddleware, decrypt };
