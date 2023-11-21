import { GenerateHeader, GetResponse } from "../../../shared/APIBase";

export const StaffInfoGetAll = async () => {
  return GetResponse("/api/staff/", GenerateHeader());
};

export const StaffInfoRegister = async (firstname, lastname, email, phone) => {
  console.log(firstname, lastname, email, phone);
  return GetResponse(
    "/api/staff/add",
    GenerateHeader({
      email: email,
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      roles: "staff",
    })
  );
};

export const StaffInfoDelete = async (id) => {
  return GetResponse("/api/staff/delete", GenerateHeader({ id: id }));
};

export const ChangePassword = async (email) => {
  return GetResponse("/api/staff/reset-pw", GenerateHeader({ email: email }));
};
