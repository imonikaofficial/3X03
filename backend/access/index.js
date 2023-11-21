const { CreateUserAccount, GetUserByFilter } = require("./DbUser");
const { GetAllCarInfo } = require("./DbCar");
const { AddTransaction, GetAllTransactionsByUserId } = require("./DbTrans");
const {
  GetStaffByFilter,
  AddStaffAccount,
  UpdateStaffAccount,
  GetStaffPassword,
} = require("./DbStaff");
const {
  GetAllLicenses,
  GetLicenseById,
  UpdateLicense,
  GetLicenseByFilter,
} = require("./DbLicense");

module.exports = {
  CreateUserAccount,
  GetUserByFilter,
  GetAllCarInfo,
  AddTransaction,
  GetAllTransactionsByUserId,
  GetAllLicenses,
  GetLicenseById,
  UpdateLicense,
  GetStaffByFilter,
  GetLicenseByFilter,
  AddStaffAccount,
  UpdateStaffAccount,
  GetStaffPassword,
};
