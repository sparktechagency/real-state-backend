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
  // QueryBuilder initialize
  const queryBuilder = new QueryBuilder(Apartment.find(), query)
    .search(["apartmentName", "location", "completionDate"])
    .filter()
    .sort()
    .paginate()
    .fields();

  // apartmentName regex search
  if (query.apartmentName) {
    const regex = new RegExp(query.apartmentName, "i");
    queryBuilder.modelQuery = queryBuilder.modelQuery.find({
      // @ts-ignore
      apartmentName: regex,
    });
  }

  // CompletionDate filter
  if (query.completionDate) {
    // Dhore nilam query.completionDate ekta string ba number hobe, ex: "2020"
    const years = Array.isArray(query.completionDate)
      ? query.completionDate
      : [query.completionDate];

    queryBuilder.modelQuery = queryBuilder.modelQuery.find({
      // @ts-ignore
      CompletionDate: { $in: years },
    });
  }

  // SalesCompany filter example (jodi thake)
  if (query.salesCompany) {
    queryBuilder.modelQuery = queryBuilder.modelQuery.find({
      // @ts-ignore
      salesCompany: query.salesCompany,
    });
  }

  // Execute query
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
  const apartments = await Apartment.find().lean();
  if (!apartments || apartments.length === 0) {
    return { locations: [], salesCompanies: [], commition: [], completion: [] };
  }

  const locationsSet = new Set<string>();
  const salesCompanyMap = new Map<string, string>();
  const commissionSet = new Set<number>();
  const completionSet = new Set<string>();

  for (const apt of apartments) {
    if (apt.location) locationsSet.add(apt.location.trim());

    if (apt.salesCompany) {
      const trimmed = apt.salesCompany.trim();
      const normalized = trimmed.replace(/\s+/g, "").toLowerCase();
      if (!salesCompanyMap.has(normalized)) {
        salesCompanyMap.set(normalized, trimmed);
      }
    }

    if (apt.commission) {
      const val = parseFloat(apt.commission);
      if (!isNaN(val)) commissionSet.add(val);
    }

    if (apt.CompletionDate && Array.isArray(apt.CompletionDate)) {
      apt.CompletionDate.forEach((year) => {
        if (year) completionSet.add(String(year).trim());
      });
    }
  }

  const locations = Array.from(locationsSet).sort();
  const salesCompanies = Array.from(salesCompanyMap.values()).sort((a, b) =>
    a.localeCompare(b)
  );

  const othersIndex = salesCompanies.indexOf("Others");
  if (othersIndex !== -1) {
    salesCompanies.splice(othersIndex, 1);
    salesCompanies.push("Others");
  }

  const commition = Array.from(commissionSet)
    .sort((a, b) => a - b)
    .map(String);

  const completion = Array.from(completionSet).sort();

  return {
    locations,
    salesCompanies,
    commition,
    completion,
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
