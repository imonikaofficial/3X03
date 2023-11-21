import { GenerateHeader, GetResponse } from "../../../shared/APIBase";

export const CarInfoGetAll = async () => {
  return GetResponse("/api/cars/getAll", GenerateHeader());
};

export const CarInfoGetById = async (id) => {
  return GetResponse(`/api/cars/getById/`, GenerateHeader({ id: id }));
};
