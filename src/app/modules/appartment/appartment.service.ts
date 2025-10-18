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
  const queryBuilder = new QueryBuilder(Apartment.find(), query)
    .search(["apartmentName", "location", "completionDate"])
    .filter()
    .sort()
    .paginate()
    .fields();

  if (query.apartmentName) {
    const regex = new RegExp(query.apartmentName, "i");
    queryBuilder.modelQuery = queryBuilder.modelQuery.find({
      // @ts-ignore
      apartmentName: regex,
    });
  }

  const result = await queryBuilder.modelQuery;
  const paginationInfo = await queryBuilder.getPaginationInfo();

  return {
    data: result || [],
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
  // Fetch the current apartment
  const currentApartment = await Apartment.findById(id);
  if (!currentApartment) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Apartment not found");
  }

  // Now update the apartment
  const result = await Apartment.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update apartment");
  }
  return result;
};

// list of locations and property types dynamically
const getLocationPropertyTypeSalesCompanyCompletionYearFromDB = async () => {
  const result = await Apartment.find();
  if (!result) {
    return [];
  }
  const locationsSet = new Set<string>();
  const salesCompanySet = new Set<string>();
  const commissionSet = new Set<number>();

  for (const apartment of result) {
    if (apartment.location) {
      // @ts-ignore
      locationsSet.add(apartment.location);
    }
    if (apartment.salesCompany) {
      // @ts-ignore
      salesCompanySet.add(apartment.salesCompany);
    }
    if (apartment.commission) {
      const commissionValue = parseFloat(apartment.commission);
      if (!isNaN(commissionValue)) commissionSet.add(commissionValue);
    }
  }

  // Convert sets to arrays
  const locationsArray = Array.from(locationsSet);
  const salesCompaniesArray = Array.from(salesCompanySet);
  const commitionArray = Array.from(commissionSet)
    .sort((a, b) => a - b)
    .map(String);

  const othersIndex = salesCompaniesArray.indexOf("Others");
  if (othersIndex !== -1) {
    salesCompaniesArray.splice(othersIndex, 1);
    salesCompaniesArray.push("Others");
  }

  return {
    locations: locationsArray,
    salesCompanies: salesCompaniesArray,
    commition: commitionArray,
  };
};

// All Apartment location
const getAllApartmentLocationFromDB = async () => {
  const result = await Apartment.find().select(
    "latitude longitude apartmentName location "
  );
  if (!result) {
    return [];
  }
  return result;
};

export const apartmentService = {
  createApartmentIntoDB,
  getAllApartmentFromDB,
  getSingleApartment,
  deleteApartmentFromDB,
  updateApartmentDetailsFromDB,
  getLocationPropertyTypeSalesCompanyCompletionYearFromDB,
  getAllApartmentLocationFromDB,
};
