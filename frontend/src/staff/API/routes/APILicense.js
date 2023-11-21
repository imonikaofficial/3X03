import { GenerateHeader, GetResponse } from "../../../shared/APIBase";

export const LicenseInfoGetAll = async () => {
  return GetResponse("/api/license/", GenerateHeader());
};

export const LicenseInfoGet = async (id) => {
  return GetResponse("/api/license/" + id, GenerateHeader());
};

export const LicenseUpdate = async (data) => {
  return GetResponse("/api/license/update", GenerateHeader(data));
};

export const LicenseDownload = async (id,align) => {
  return GetResponse(
    `/api/license/download/${id}/${align}`,
    GenerateHeader(undefined, false, true)
  );
};
