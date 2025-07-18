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

// const getAllFlans = async (query: Record<string, any>) => {
//   const {
//     priceMin,
//     priceMax,
//     propertyType,
//     location,
//     salesCompany,
//     completionDate,
//     apartmentName,
//     page = 1,
//     limit = 10,
//   } = query;



//   const matchFloorPlan: any = {};
//   if (priceMin || priceMax) {
//     matchFloorPlan.price = {};
//     if (priceMin) matchFloorPlan.price.$gte = Number(priceMin);
//     if (priceMax) matchFloorPlan.price.$lte = Number(priceMax);
//   }


//   const matchingFloorPlans = await FloorPlan.find(matchFloorPlan).lean();

//   const apartmentIdSet = new Set(
//     matchingFloorPlans.map((f) => f.apartmentId?.toString())
//   );
//   const apartmentFilter: any = {};
//   if (propertyType) apartmentFilter.propertyType = propertyType;
//   if (location) apartmentFilter.location = location;
//   if (salesCompany) apartmentFilter.salesCompany = salesCompany;
//   if (completionDate) apartmentFilter.completionDate = Number(completionDate);
//   if (apartmentName)
//     apartmentFilter.apartmentName = { $regex: apartmentName, $options: "i" };

//   if (apartmentIdSet.size > 0) {
//     apartmentFilter._id = { $in: Array.from(apartmentIdSet) };
//   } else {
//     return {
//       pagination: { total: 0, page, limit, totalPage: 0 },
//       apartments: [],
//     };
//   }


//   const total = await Apartment.countDocuments(apartmentFilter);
//   const totalPage = Math.ceil(total / Number(limit));
//   const apartments = await Apartment.find(apartmentFilter)
//     .skip((Number(page) - 1) * Number(limit))
//     .limit(Number(limit))
//     .lean();

//   const apartmentMap = new Map();
//   for (const apartment of apartments) {
//     const floorPlans = matchingFloorPlans.filter(
//       (f) => f.apartmentId?.toString() === apartment._id.toString()
//     );
//     const phases = await Phase.find({ apartment: apartment._id }).lean();
//     apartmentMap.set(apartment._id.toString(), {
//       ...apartment,
//       floorPlans,
//       phases
//     });
//   }

//   return {
//     pagination: {
//       total,
//       page: Number(page),
//       limit: Number(limit),
//       totalPage,
//     },
//     apartments: Array.from(apartmentMap.values()),
//   };
// };

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

    if (typeof fieldValue === 'string' && fieldValue.includes(',')) {
      return { $in: fieldValue.split(',').map((v) => v.trim()) };
    }

    return fieldValue;
  };

  const propertyTypeFilter = normalizeFilter(propertyType);
  const locationFilter = normalizeFilter(location);
  const salesCompanyFilter = normalizeFilter(salesCompany);

  if (propertyTypeFilter) apartmentFilter.propertyType = propertyTypeFilter;
  if (locationFilter) apartmentFilter.location = locationFilter;
  if (salesCompanyFilter) apartmentFilter.salesCompany = salesCompanyFilter;

  if (completionDate) {
    apartmentFilter.completionDate = Number(completionDate);
  }

  if (apartmentName) {
    apartmentFilter.apartmentName = {
      $regex: apartmentName,
      $options: 'i',
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

  // --- Combine with floorPlans & phases ---
  const apartmentMap = new Map();
  for (const apartment of apartments) {
    const floorPlans = matchingFloorPlans.filter(
      (f) => f.apartmentId?.toString() === apartment._id.toString()
    );
    const phases = await Phase.find({ apartment: apartment._id }).lean();

    apartmentMap.set(apartment._id.toString(), {
      ...apartment,
      floorPlans,
      phases,
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

const getFloorPlansByApartmentId = async (
  apartmentId: string,
  query: Record<string, any>
) => {
  const apartment = await Apartment.findById(apartmentId).lean();
  if (!apartment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Apartment not found");
  }

  // --- FloorPlan Query ---
  const floorPlanQueryBuilder = new QueryBuilder(
    FloorPlan.find({ apartmentId }),
    query
  );
  floorPlanQueryBuilder.sort().paginate().fields();
  const floorPlans = await floorPlanQueryBuilder.modelQuery.lean();
  const floorPlanPagination = await floorPlanQueryBuilder.getPaginationInfo();

  // --- Phase Query ---
  const phaseQueryBuilder = new QueryBuilder(
    Phase.find({ apartment: apartmentId }),
    query
  );
  phaseQueryBuilder.sort().paginate().fields();
  const phases = await phaseQueryBuilder.modelQuery.lean();
  const phasePagination = await phaseQueryBuilder.getPaginationInfo();

  return {
    ...apartment,
    phases,
    phasePagination,
    floorPlans,
    floorPlanPagination,
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


const deleteFloorPlanFromDB = async (id: string) => {
  const result = await FloorPlan.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete floor plan")
  } 
  return result;
}


// * Export function
export const FloorPlanService = {
  createFloorPlan,
  getAllFlans,
  getFloorPlansByApartmentId,
  getLocationPropertyTypeSalesCompanyCompletionYearFromDB,
  updateFloorPlanFromDB,
  deleteFloorPlanFromDB
};
