import { GenerateHeader, GetResponse } from "../../../shared/APIBase";

export const UserInfoRegister = async (
  firstname,
  lastname,
  username,
  password,
  email,
  dob,
  address,
  postal,
  country,
  phone,
  roles,

) => {
  return GetResponse(
    "/api/users/add",
    GenerateHeader({
      username: username,
      password: password,
      email: email,
      dob: dob,
      firstname: firstname,
      lastname: lastname,
      address: address,
      postal: postal,
      country: country,
      phone: phone,
      roles: roles,
    })
  );
};

export const UserInfoUpdate = async (
  firstname = undefined,
  lastname = undefined,
  username = undefined,
  password = undefined,
  dob = undefined,
  address = undefined,
  postal = undefined,
  country = undefined,
  phone = undefined,
  active = true
) => {
  return GetResponse(
    "/api/users/update",
    GenerateHeader({
      username: username,
      password: password,
      dob: dob,
      firstname: firstname,
      lastname: lastname,
      address: address,
      postal: postal,
      country: country,
      phone: phone,
      active: active,
    })
  );
};

export const UserInfoGetOne = async () => {
  return GetResponse("/api/users/getOne", GenerateHeader());
};
