const asyncHandler = require("express-async-handler");

const getAllTransByUserId = asyncHandler(
  async (req, res, GetAllTransactionsByUserId) => {
    /*

    Endpoint: /api/transactions/
    Method: GET
    Route: Get all transactions by user id
    Returns: Array of transactions
    */
    // verify headers
    const userId = req.id;

    const transactionResponse = await GetAllTransactionsByUserId(userId);
    if (transactionResponse.status == 500) {
      res.status(transactionResponse.status).json(transactionResponse);
      return;
    }
    res.status(transactionResponse.status).json(transactionResponse);
  }
);

const addTransaction = asyncHandler(
  async (
    req,
    res,
    VerifyJsonRequest,
    isValidDate,
    isLicenseVerified,
    AddTransaction
  ) => {
    /*
    Endpoint: /api/transactions/add
    Method: POST
    Route: Add a new transaction
    Returns: Transaction success object message
    */
    console.log(req.body);
    const userId = req.id
    // verify headers
    const { status, result } = VerifyJsonRequest(req, [
      "carId",
      "transactionStartDate",
      "transactionEndDate",
      "transactionAmount",
    ]);
    if (status !== 200) {
      res.status(400).json({ status: 400, result: result });
      return;
    }

    const {
      carId,
      transactionStartDate,
      transactionEndDate,
      transactionAmount,
    } = req.body;

    const startDateResponse = isValidDate(transactionStartDate);
    const endDateResponse = isValidDate(transactionEndDate);
    if (startDateResponse == false || endDateResponse == false) {
      res.status(400).json({ status: 400, result: "Invalid date format" });
      return;
    }

    // check if license verified
    const isLicenseVerifiedResponse = await isLicenseVerified(userId);
    console.log("license Response" ,isLicenseVerifiedResponse);
    if (!isLicenseVerifiedResponse || isLicenseVerifiedResponse == false) {
      res.status(400).json({ status: 400, result: "License not verified" });
      return;
    }

    const transactionResponse = await AddTransaction(
      carId,
      req.id,
      transactionStartDate,
      transactionEndDate,
      transactionAmount
    );
    if (transactionResponse.status == 500) {
      res.status(transactionResponse.status).json(transactionResponse);
      return;
    }
    res.status(transactionResponse.status).json(transactionResponse);
  }
);

module.exports = { addTransaction, getAllTransByUserId };
