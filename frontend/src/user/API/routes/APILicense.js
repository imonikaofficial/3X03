import { GenerateHeader, GetResponse } from "../../../shared/APIBase";

export const UploadLicense = async (formData) => {
  return GetResponse("/api/license/upload", GenerateHeader(formData, true));
};
