import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import { IFloorPlan } from "./floorePlan.interface";
import { FloorPlan } from "./floorePlan.model";
import { Apartment } from "../appartment/appartment.model";
import { Phase } from "../phase/phase.model";
import { IPhase } from "../phase/phase.interface";
import QueryBuilder from "../../builder/QueryBuilder";

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
    CompletionDate,
    apartmentName,
    commission,
    page = 1,
    limit = 10,
  } = query;

  // --- FloorPlan Filter ---
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

  // --- Apartment Filter ---
  const apartmentFilter: any = {};

  // 🟢 Helper to normalize comma-separated or array values
  const normalizeFilter = (fieldValue: string | string[] | undefined): any => {
    if (!fieldValue) return undefined;

    if (Array.isArray(fieldValue)) {
      return { $in: fieldValue };
    }

    if (typeof fieldValue === "string" && fieldValue.includes(",")) {
      return { $in: fieldValue.split(",").map((v) => v.trim()) };
    }

    return fieldValue;
  };

  const propertyTypeFilter = normalizeFilter(propertyType);
  const locationFilter = normalizeFilter(location);
  const salesCompanyFilter = normalizeFilter(salesCompany);

  if (propertyTypeFilter) apartmentFilter.propertyType = propertyTypeFilter;
  if (locationFilter) apartmentFilter.location = locationFilter;
  if (salesCompanyFilter) apartmentFilter.salesCompany = salesCompanyFilter;

  if (commission) {
    const commissionValue = isNaN(Number(commission))
      ? commission
      : Number(commission);

    apartmentFilter.commission = commissionValue;
  }

  if (CompletionDate) {
    apartmentFilter.CompletionDate = CompletionDate;
  }

  if (apartmentName) {
    apartmentFilter.apartmentName = {
      $regex: apartmentName,
      $options: "i",
    };
  }

  // Only filter by apartments that have matching floor plans
  if (apartmentIdSet.size > 0) {
    apartmentFilter._id = { $in: Array.from(apartmentIdSet) };
  } else {
    return {
      pagination: { total: 0, page, limit, totalPage: 0 },
      apartments: [],
    };
  }

  // --- Pagination ---
  const total = await Apartment.countDocuments(apartmentFilter);
  const totalPage = Math.ceil(total / Number(limit));
  const apartments = await Apartment.find(apartmentFilter)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean();

  // --- Combine with floorPlans ---
  const apartmentMap = new Map();
  for (const apartment of apartments) {
    const floorPlans = matchingFloorPlans.filter(
      (f) => f.apartmentId?.toString() === apartment._id.toString()
    );

    apartmentMap.set(apartment._id.toString(), {
      ...apartment,
      floorPlans,
    });
  }

  return {
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPage,
    },

    apartments: Array.from(apartmentMap.values()).map((apartment: any) => ({
      _id: apartment._id,
      apartmentName: apartment.apartmentName,
      apartmentImage: apartment.apartmentImage,
      completionDate: apartment.CompletionDate,
      commission: apartment.commission, // 🟢 Include it in response if needed
      floorPlans: apartment.floorPlans.map((plan: any) => ({
        floorPlan: plan.floorPlan,
        price: plan.price,
      })),
    })),
  };
};

// getAllflooreplan base on apartment id without pagination it's for map
const getAllFloorePlanBaseOnApartmentId = async () => {
  const allApartment = await Apartment.find()
    .select(
      "apartmentName latitude longitude apartmentImage location completionDate"
    )
    .lean();

  const apartmentMap = new Map(
    allApartment.map((apt) => [apt._id.toString(), apt])
  );

  const allFloorPlans = await FloorPlan.find()
    .select("apartmentId price apartmentImage")
    .lean();

  if (!allFloorPlans || allFloorPlans.length === 0) {
    return [];
  }

  const minPriceMap = new Map();

  for (const floor of allFloorPlans) {
    const key = floor.apartmentId?.toString();
    const apt = apartmentMap.get(key);

    // ✅ Skip floor plans with missing apartment data
    if (!key || !apt || !apt.apartmentName || !apt.latitude || !apt.longitude) {
      continue;
    }

    if (!minPriceMap.has(key) || floor.price < minPriceMap.get(key).price) {
      minPriceMap.set(key, floor);
    }
  }

  const result = Array.from(minPriceMap.entries()).map(([key, floor]) => {
    const apt = apartmentMap.get(key);
    return {
      ...floor,
      apartmentName: apt?.apartmentName,
      latitude: apt?.latitude,
      longitude: apt?.longitude,
      apartmentImage: apt?.apartmentImage,
      location: apt?.location,
      completionDate: apt?.CompletionDate,
    };
  });

  if (result.length === 0) {
    return [];
  }

  return result;
};

const getFloorPlansByApartmentId = async (
  apartmentId: string,
  query: Record<string, any>
) => {
  const apartment = await Apartment.findById(apartmentId).lean();
  if (!apartment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Apartment not found");
  }

  const { floorPage = "1", floorLimit = "10", ...restQuery } = query;

  const parsedFloorPage = parseInt(floorPage, 10);
  const parsedFloorLimit = parseInt(floorLimit, 10);

  // --- FLOOR PLAN PAGINATION ---
  const floorQueryBuilder = new QueryBuilder(
    FloorPlan.find({ apartmentId: apartmentId }),
    {
      ...restQuery,
      page: parsedFloorPage,
      limit: parsedFloorLimit,
    }
  );

  floorQueryBuilder.sort().paginate().fields();
  const floorData = await floorQueryBuilder.modelQuery.lean();
  const floorMeta = await floorQueryBuilder.getPaginationInfo();

  // --- PHASE PAGINATION ---
  const phaseQueryBuilder = new QueryBuilder(
    Phase.find({ apartment: apartmentId }),
    {
      ...restQuery,
    }
  );

  phaseQueryBuilder.sort().paginate().fields();
  const phaseData = await phaseQueryBuilder.modelQuery.lean();

  return {
    apartment,
    floorPlans: {
      data: floorData,
      meta: floorMeta,
    },
    phases: {
      data: phaseData,
    },
  };
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
  // @ts-ignore
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
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update floor plan");
  }
  return result;
};

const deleteFloorPlanFromDB = async (id: string) => {
  const result = await FloorPlan.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete floor plan");
  }
  return result;
};

// get all floor plans with pagination using apartmentId
const getFloorePlanFromDBUsingApartmentId = async (
  id: string,
  query: Record<string, any>
) => {
  const floorQueryBuilder = new QueryBuilder(
    FloorPlan.find({ apartmentId: id }),
    query
  );

  floorQueryBuilder.sort().paginate().fields();
  const floorData = await floorQueryBuilder.modelQuery.lean();
  const floorMeta = await floorQueryBuilder.getPaginationInfo();

  return {
    meta: floorMeta,
    data: floorData,
  };
};

// get all phase using apartmentId
const getPhaseFromDBUsingApartmentId = async (
  id: string,
  query: Record<string, any>
) => {
  const phaseQueryBuilder = new QueryBuilder(
    Phase.find({ apartment: id }),
    query
  );

  phaseQueryBuilder.sort().paginate().fields();
  const phaseData = await phaseQueryBuilder.modelQuery.lean();
  const phaseMeta = await phaseQueryBuilder.getPaginationInfo();

  return {
    meta: phaseMeta,
    data: phaseData,
  };
};

// * Export function
export const FloorPlanService = {
  createFloorPlan,
  getAllFlans,
  getFloorPlansByApartmentId,
  getLocationPropertyTypeSalesCompanyCompletionYearFromDB,
  updateFloorPlanFromDB,
  deleteFloorPlanFromDB,
  getFloorePlanFromDBUsingApartmentId,
  getPhaseFromDBUsingApartmentId,
  getAllFloorePlanBaseOnApartmentId,
};
