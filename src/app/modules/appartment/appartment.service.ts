import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IApartment } from "./appartment.interface";
import { Apartment } from "./appartment.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Phase } from "../phase/phase.model";

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

  if (!payload.features) {
    payload.features = [];
  }
  if (!payload.seaView) {
    payload.seaView = [];
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
  // Fetch all apartments
  const apartments = await Apartment.find().lean();
  if (!apartments || apartments.length === 0) {
    return {
      locations: [],
      salesCompanies: [],
      commition: [],
      completion: [],
    };
  }

  // Use Sets to avoid duplicates
  const locationsSet = new Set<string>();
  const salesCompanySet = new Set<string>();
  const commissionSet = new Set<number>();

  // Extract data from apartments
  for (const apt of apartments) {
    if (apt.location) locationsSet.add(apt.location.trim());
    if (apt.salesCompany) salesCompanySet.add(apt.salesCompany.trim());

    if (apt.commission) {
      const val = parseFloat(apt.commission);
      if (!isNaN(val)) commissionSet.add(val);
    }
  }

  // Fetch phase completion years
  const phases = await Phase.find({ date: { $ne: null } }).lean();
  const completionYears = Array.from(
    new Set(phases.map((phase: any) => String(phase.date)))
  );

  // Convert sets to sorted arrays
  const locations = Array.from(locationsSet).sort();
  const salesCompanies = Array.from(salesCompanySet).sort((a, b) =>
    a.localeCompare(b)
  );
  const commition = Array.from(commissionSet)
    .sort((a, b) => a - b)
    .map(String);

  // Move "Others" to the end if present
  const othersIndex = salesCompanies.indexOf("Others");
  if (othersIndex !== -1) {
    salesCompanies.splice(othersIndex, 1);
    salesCompanies.push("Others");
  }

  return {
    locations,
    salesCompanies,
    commition,
    completion: completionYears,
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
