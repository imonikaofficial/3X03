import { GenerateHeader, GetResponse } from "../../../shared/APIBase";

export const UserLogin = async (email, password) => {
  return GetResponse(
    "/api/auth/",
    GenerateHeader({
      email: email,
      password: password,
    })
  );
};

export const UserResendOTP = async (id) => {
  return GetResponse(
    "/api/auth/resend-otp",
    GenerateHeader({
      id: id,
    })
  );
};

export const UserOTP = async (id, otp) => {
  return GetResponse(
    "/api/auth/verify-otp",
    GenerateHeader({
      userId: id,
      otp: otp,
    })
  );
};

export const RefreshToken = async () => {
  return GetResponse("/api/auth/refresh", GenerateHeader());
};

export const UserLogout = async () => {
  return GetResponse("/api/auth/logout", GenerateHeader({}));
};

export const AdminRegister = async (email, code, password) => {
  return GetResponse(
    "/api/auth/admin-register",
    GenerateHeader({
      email: email,
      code: code,
      password: password,
    })
  );
};
