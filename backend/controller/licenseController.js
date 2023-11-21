const asyncHandler = require("express-async-handler");
const {
  GetAllLicenses,
  GetLicenseById,
  UpdateLicense,
} = require("../access");

const { VerifyJsonRequest } = require("../utils");
const { AddLicense } = require("../access/DbLicense");
const { decrypt } = require("../middleware/encryption");
const getAllLicenses = asyncHandler(async (req, res) => {
  /*
  Endpoint: /api/license/get 
  Method: GET
  Route: Get all licenses
  Returns: Array of license objects
  */
  const allLicenseResponse = await GetAllLicenses();
  if (allLicenseResponse.status == 500) {
    res.status(allLicenseResponse.status).json(allLicenseResponse);
    return;
  }

  allLicenseResponse.result = allLicenseResponse.result.filter(
    (license) => license.userId !== null
  );

  res.status(allLicenseResponse.status).json(allLicenseResponse);
});

const getLicenseById = asyncHandler(async (req, res) => {
  /*
    Endpoint: /api/license/:id
    Method: GET
    Route: Get license by id
    Returns: License object
    */
  let { id } = req.params;
  console.log("id", id);
  if (!id) {
    res.status(400).json({ status: 400, result: "Missing id" });
    return;
  }

  const licenseResponse = await GetLicenseById(id);
  if (licenseResponse.status == 500) {
    res.status(licenseResponse.status).json(licenseResponse);
    return;
  }
  const license = licenseResponse.result;

  try {
    res.status(200).json({ status: 200, result: license });
  } catch (error) {
    console.error("Error decrypting file:", error);
    res.status(500).send("Error decrypting file");
  }

  // res.status(licenseResponse.status).json(licenseResponse);
});

const getLicenseImageById = asyncHandler(async (req, res) => {
  /*

  Endpoint: /api/license/image/:id
  Method: GET
  Route: Get license image by id
  Returns: License image

  */
  let { id, align } = req.params;
  console.log("download id", id);
  console.log("align:", align);
  if (!id) {
    res.status(400).json({ status: 400, result: "Missing id" });
    return;
  }

  const licenseResponse = await GetLicenseById(id);
  if (licenseResponse.status == 500) {
    res.status(licenseResponse.status).json(licenseResponse);
    return;
  }
  let license = licenseResponse.result;
  if (align == "front") {
    license = license._doc.front;
  } else if (align == "back") {
    license = license._doc.back;
  } else {
    res.status(400).json({ status: 400, result: "Invalid alignment" });
    return;
  }

  try {
    const image = await decrypt(license.image);
    console.log("Sending image");
    if (!image) {
      res.status(500).json({ status: 500, message: "Failed to decrypt image" });
      return;
    }
    res.contentType(license.contentType);
    res.send(image);
  } catch (error) {
    console.error("Error decrypting file:", error);
    res.status(500).send("Error decrypting file");
  }
});

const updateLicense = asyncHandler(async (req, res) => {
  console.log(req.body);
  const headerResponse = VerifyJsonRequest(req, ["_id", "isVerified"]);
  if (headerResponse.status == 400) {
    res.status(headerResponse.status).json(headerResponse);
    return;
  }

  const { _id, isVerified } = req.body;
  const licenseResponse = await GetLicenseById(_id);
  if (licenseResponse.status == 500) {
    res.status(licenseResponse.status).json(licenseResponse);
    return;
  }

  const license = licenseResponse.result;

  license.isVerified = isVerified;
  const updateResponse = await UpdateLicense(license, {
    isVerified: isVerified,
  });
  if (updateResponse.status == 500) {
    res.status(updateResponse.status).json(updateResponse);
    return;
  }

  res.status(updateResponse.status).json(updateResponse);
});


const addLicense = asyncHandler(async (req, res) => {
  const id = req.id;
  const files = req.encryptedFilePaths;
  console.log("id", id);
  console.log("files", files);
  if (files.length != 2) {
    res.status(400).json({ status: 400, message: "No files were uploaded" });
    return;
  }

  const uploadResponse = await AddLicense({
    uploader: id,
    front: {
      image: files[0].image,
      contentType: files[0].mimetype,
    },
    back: {
      image: files[1].image,
      contentType: files[1].mimetype,
    },
  });
  if (uploadResponse.status == 500) {
    res.status(uploadResponse.status).json(uploadResponse);
    return;
  }

  res.status(200).json({ status: 200, message: "Successfully uploaded files" });
});

module.exports = {
  addLicense,
  getAllLicenses,
  getLicenseById,
  updateLicense,
  getLicenseImageById,
};
