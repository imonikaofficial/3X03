import { GenerateHeader, GetResponse } from "../../../shared/APIBase";

export const StaffPasswordUpdate = async (oldPw, newPw) => {
  return GetResponse(
    "/api/staff/change-pw",
    GenerateHeader({ old: oldPw, new: newPw })
  );
};

export const StaffInfoGetOne = async () => {
  return GetResponse("/api/staff/get", GenerateHeader());
};
