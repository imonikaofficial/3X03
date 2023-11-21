import { GenerateHeader, GetResponse } from "../../../shared/APIBase";

export const TransactionAdd = async (carId, startDate, endDate, totalPrice) => {
  return GetResponse(
    "/api/trans/add",
    GenerateHeader({
      carId: carId,
      transactionStartDate: startDate,
      transactionEndDate: endDate,
      transactionAmount: totalPrice,
    })
  );
};

export const TransactionGetAllByUserId = async () => {
  return GetResponse("/api/trans/", GenerateHeader());
};
