import { GenerateHeader, GetResponse } from "../../../shared/APIBase";

export const CarInfoGetAll = async () => {
  return GetResponse("/api/cars/getAll", GenerateHeader());
};

export const CarInfoGetById = async (id) => {
  return GetResponse(`/api/cars/getById/`, GenerateHeader({ id: id }));
};

export const CarInfoAdd = async (formData) => {
  return GetResponse("/api/cars/add", GenerateHeader(formData, true));
};

export const CarInfoUpdate = async (
  id,
  carMake,
  carStyle,
  carModel,
  carDescription,
  carSeats,
  carFuelType,
  carBootSpace,
  carRentalPrice,
  carStatus,
  imageUrl
) => {
  return GetResponse(
    `/api/cars/update`,
    GenerateHeader({
      id,
      carMake,
      carStyle,
      carModel,
      carDescription,
      carSeats,
      carFuelType,
      carBootSpace,
      carRentalPrice,
      carStatus,
      imageUrl,
    })
  );
};

export const CarInfoDelete = async (id) => {
  return GetResponse(
    `/api/cars/delete`,
    GenerateHeader({
      id,
    })
  );
};
