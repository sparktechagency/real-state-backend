import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IFloorPlan } from "./floorePlan.interface";
import { FloorPlan } from "./floorePlan.model";
import { Apartment } from "../appartment/appartment.model";
import { Phase } from "../phase/phase.model";

const createFloorPlan = async (payload: IFloorPlan): Promise<IFloorPlan> => {
  const result = await FloorPlan.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create floor plan");
  }
  return result;
};

const getAllFlans = async (query: Record<string, any>) => {
  const {
    priceMin,
    priceMax,
    propertyType,
    location,
    salesCompany,
    completionDate,
    apartmentName,
    page = 1,
    limit = 10,
  } = query;



  const matchFloorPlan: any = {};
  if (priceMin || priceMax) {
    matchFloorPlan.price = {};
    if (priceMin) matchFloorPlan.price.$gte = Number(priceMin);
    if (priceMax) matchFloorPlan.price.$lte = Number(priceMax);
  }


  const matchingFloorPlans = await FloorPlan.find(matchFloorPlan).lean();

  const apartmentIdSet = new Set(
    matchingFloorPlans.map((f) => f.apartmentId?.toString())
  );
  const apartmentFilter: any = {};
  if (propertyType) apartmentFilter.propertyType = propertyType;
  if (location) apartmentFilter.location = location;
  if (salesCompany) apartmentFilter.salesCompany = salesCompany;
  if (completionDate) apartmentFilter.completionDate = Number(completionDate);
  if (apartmentName)
    apartmentFilter.apartmentName = { $regex: apartmentName, $options: "i" };

  if (apartmentIdSet.size > 0) {
    apartmentFilter._id = { $in: Array.from(apartmentIdSet) };
  } else {
    return {
      pagination: { total: 0, page, limit, totalPage: 0 },
      apartments: [],
    };
  }


  const total = await Apartment.countDocuments(apartmentFilter);
  const totalPage = Math.ceil(total / Number(limit));
  const apartments = await Apartment.find(apartmentFilter)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean();

  const apartmentMap = new Map();
  for (const apartment of apartments) {
    const floorPlans = matchingFloorPlans.filter(
      (f) => f.apartmentId?.toString() === apartment._id.toString()
    );
    const phases = await Phase.find({ apartment: apartment._id }).lean();
    apartmentMap.set(apartment._id.toString(), {
      ...apartment,
      floorPlans,
      phases
    });
  }

  return {
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPage,
    },
    apartments: Array.from(apartmentMap.values()),
  };
};


const getFloorPlansByApartmentId = async (apartmentId: string): Promise<IFloorPlan[]> => {
  const result = await FloorPlan.find({ apartmentId }).populate("apartmentId")
  if (!result.length) {
    throw new ApiError(StatusCodes.NOT_FOUND, "No floor plans found for this apartment");
  }
  return result;
};
// * get all location / property type / sales company/ completion year
const getLocationPropertyTypeSalesCompanyCompletionYearFromDB = async () => {
  const apartments = await Apartment.find(
    {},
    "apartmentName location propertyType price"
  );

  const apartmentNames = apartments.map((a) => a.apartmentName);
  const locations = apartments.map((a) => a.location);
  const propertyTypes = apartments.map((a) => a.propertyType);
  const prices = apartments.map((a) => a.price);

  return {
    apartmentNames,
    locations,
    propertyTypes,
    prices,
  };
};


const updateFloorPlanFromDB = async (id: string, payload: IFloorPlan) => {
  const result = await FloorPlan.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update floor plan")
  }
  return result;
}

// * Export function
export const FloorPlanService = {
  createFloorPlan,
  getAllFlans,
  getFloorPlansByApartmentId,
  getLocationPropertyTypeSalesCompanyCompletionYearFromDB,
  updateFloorPlanFromDB
};
