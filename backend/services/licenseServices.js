const { GetLicenseByFilter } = require("../access/DbLicense");

const isLicenseVerified = async (id) => {
  try {
    const licenseResponse = await GetLicenseByFilter({ uploader: id });
    console.log(licenseResponse)
    if (licenseResponse.status == 500) {
      return null;
    }
    const license = licenseResponse.result;
    return license.isVerified;
  } catch (error) {
    console.error("Error verifying license:", error);
    return { status: 500, message: "Internal Server Error" };
  }
};

module.exports = { isLicenseVerified };
