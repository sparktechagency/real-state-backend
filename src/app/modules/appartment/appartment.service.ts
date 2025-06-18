import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IApartment } from "./appartment.interface";
import { Apartment } from "./appartment.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createApartmentIntoDB = async (payload: IApartment) => {
  const result = await Apartment.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, "Can't create Apartment");
  }
  return result;
};

const getAllApartmentFromDB = async (query: Record<string, any>) => {
  // Create the QueryBuilder instance with both the model query and the query parameters
  console.log("query", query);
  const queryBuilder = new QueryBuilder(Apartment.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  // Get the results using the modelQuery from QueryBuilder
  const result = await queryBuilder.modelQuery;

  // Get pagination information
  const paginationInfo = await queryBuilder.getPaginationInfo();

  if (!result) {
    return {
      data: [],
      meta: paginationInfo,
    };
  }

  // Return both data and pagination metadata
  return {
    data: result,
    meta: paginationInfo,
  };
};

const getSingleApartment = async (id: string) => {
  const result = await Apartment.findOne({ _id: id });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Have no Apartment");
  }
  return result;
};

const deleteApartmentFromDB = async (id: string) => {
  const result = await Apartment.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Successfully delete apartment data"
    );
  }
  return result;
};

const updateApartmentDetailsFromDB = async (
  id: string,
  payload: IApartment
) => {
  const result = await Apartment.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update apartment");
  }
  return result;
};



export const apartmentService = {
  createApartmentIntoDB,
  getAllApartmentFromDB,
  getSingleApartment,
  deleteApartmentFromDB,
  updateApartmentDetailsFromDB
};
