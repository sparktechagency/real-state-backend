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
//     commission,
//     seaViewBoolean,
//     page = 1,
//     limit = 10,
//   } = query;
//   // --- FloorPlan Filter ---
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

//   // --- Apartment Filter ---
//   const apartmentFilter: any = {};

//   // Helper to normalize comma-separated or array values
//   const normalizeFilter = (fieldValue: string | string[] | undefined): any => {
//     if (!fieldValue) return undefined;

//     if (Array.isArray(fieldValue)) {
//       return { $in: fieldValue };
//     }

//     if (typeof fieldValue === "string" && fieldValue.includes(",")) {
//       return { $in: fieldValue.split(",").map((v) => v.trim()) };
//     }

//     return fieldValue;
//   };

//   const propertyTypeFilter = normalizeFilter(propertyType);
//   const locationFilter = normalizeFilter(location);
//   const salesCompanyFilter = normalizeFilter(salesCompany);
//   if (seaViewBoolean !== undefined) {
//     apartmentFilter.seaViewBoolean =
//       seaViewBoolean === "true" || seaViewBoolean === true;
//   }

//   if (propertyTypeFilter) apartmentFilter.propertyType = propertyTypeFilter;
//   if (locationFilter) apartmentFilter.location = locationFilter;
//   if (salesCompanyFilter) apartmentFilter.salesCompany = salesCompanyFilter;

//   // Commission Filter (fixed)
//   if (commission) {
//     if (typeof commission === "string" && commission.includes(",")) {
//       apartmentFilter.commission = {
//         $in: commission.split(",").map((v) => v.trim()),
//       };
//     } else {
//       apartmentFilter.commission = commission.trim();
//     }
//   }

//   // Completion date filter (handle multiple)
//   if (completionDate) {
//     if (typeof completionDate === "string" && completionDate.includes(",")) {
//       apartmentFilter.CompletionDate = {
//         $in: completionDate.split(",").map((v) => v.trim()),
//       };
//     } else {
//       apartmentFilter.CompletionDate = completionDate;
//     }
//   }

//   if (apartmentName) {
//     apartmentFilter.apartmentName = {
//       $regex: apartmentName,
//       $options: "i",
//     };
//   }

//   // Only filter by apartments that have matching floor plans
//   if (apartmentIdSet.size > 0) {
//     apartmentFilter._id = { $in: Array.from(apartmentIdSet) };
//   } else {
//     return {
//       pagination: { total: 0, page, limit, totalPage: 0 },
//       apartments: [],
//     };
//   }

//   // --- Pagination ---
//   const total = await Apartment.countDocuments(apartmentFilter);
//   const totalPage = Math.ceil(total / Number(limit));
//   const apartments = await Apartment.find(apartmentFilter)
//     .skip((Number(page) - 1) * Number(limit))
//     .limit(Number(limit))
//     .lean();

//   // --- Combine with floorPlans ---
//   const apartmentMap = new Map();
//   for (const apartment of apartments) {
//     const floorPlans = matchingFloorPlans.filter(
//       (f) => f.apartmentId?.toString() === apartment._id.toString()
//     );

//     apartmentMap.set(apartment._id.toString(), {
//       ...apartment,
//       floorPlans,
//     });
//   }

//   return {
//     pagination: {
//       total,
//       page: Number(page),
//       limit: Number(limit),
//       totalPage,
//     },

//     apartments: Array.from(apartmentMap.values())?.map((apartment: any) => ({
//       _id: apartment._id,
//       apartmentName: apartment.apartmentName,
//       apartmentImage: apartment.apartmentImage,
//       completionDate: apartment.CompletionDate,
//       commission: apartment.commission,
//       seaViewBoolean: apartment.seaViewBoolean,
//       floorPlans: apartment.floorPlans.map((plan: any) => ({
//         floorPlan: plan.floorPlan,
//         price: plan.price,
//       })),
//     })),
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
    commission,
    seaViewBoolean,
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

  const normalizeFilter = (fieldValue: string | string[] | undefined): any => {
    if (!fieldValue) return undefined;
    if (Array.isArray(fieldValue)) return { $in: fieldValue };
    if (typeof fieldValue === "string" && fieldValue.includes(",")) {
      return { $in: fieldValue.split(",").map((v) => v.trim()) };
    }
    return fieldValue;
  };

  const propertyTypeFilter = normalizeFilter(propertyType);
  const locationFilter = normalizeFilter(location);
  const salesCompanyFilter = normalizeFilter(salesCompany);

  if (seaViewBoolean !== undefined) {
    apartmentFilter.seaViewBoolean =
      seaViewBoolean === "true" || seaViewBoolean === true;
  }

  if (propertyTypeFilter) apartmentFilter.propertyType = propertyTypeFilter;
  if (locationFilter) apartmentFilter.location = locationFilter;
  if (salesCompanyFilter) apartmentFilter.salesCompany = salesCompanyFilter;

  if (commission) {
    if (typeof commission === "string" && commission.includes(",")) {
      apartmentFilter.commission = {
        $in: commission.split(",").map((v) => v.trim()),
      };
    } else {
      apartmentFilter.commission = commission.trim();
    }
  }

  if (completionDate) {
    if (typeof completionDate === "string" && completionDate.includes(",")) {
      apartmentFilter.CompletionDate = {
        $in: completionDate.split(",").map((v) => v.trim()),
      };
    } else {
      apartmentFilter.CompletionDate = completionDate;
    }
  }

  if (apartmentName) {
    apartmentFilter.apartmentName = {
      $regex: apartmentName,
      $options: "i",
    };
  }

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

  // --- Combine with floorPlans & add sortPrice ---
  const apartmentMap = new Map();
  for (const apartment of apartments) {
    const floorPlans = matchingFloorPlans
      .filter((f) => f.apartmentId?.toString() === apartment._id.toString())
      .sort((a, b) => a.price - b.price); // lowest price first

    const sortPrice = floorPlans.length > 0 ? floorPlans[0].price : null;

    apartmentMap.set(apartment._id.toString(), {
      ...apartment,
      sortPrice,
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
      commission: apartment.commission,
      seaViewBoolean: apartment.seaViewBoolean,
      sortPrice: apartment.sortPrice,
      floorPlans: apartment.floorPlans.map((plan: any) => ({
        floorPlan: plan.floorPlan,
        price: plan.price,
      })),
    })),
  };
};

// getAllflooreplan base on apartment id without pagination it's for map
const getAllFloorePlanBaseOnApartmentId = async (
  query: Record<string, any>
) => {
  const {
    apartmentName,
    location,
    CompletionDate,
    priceMin,
    priceMax,
    propertyType,
    seaViewBoolean,
    commission,
    salesCompany,
    ...filters
  } = query;

  let mongoQuery: any = {};
  const apartmentMatch: any = {};

  // ---------------------------
  // TEXT FILTERS
  // ---------------------------

  if (apartmentName) {
    apartmentMatch.apartmentName = { $regex: apartmentName, $options: "i" };
  }

  if (location) {
    let arr: string[] = [];

    if (Array.isArray(location)) arr = location;
    else if (typeof location === "string" && location.includes(","))
      arr = location.split(",");
    else arr = [location];

    const cleaned = arr.map((l) => l.trim()).filter(Boolean);

    if (cleaned.length > 0) {
      apartmentMatch.location = {
        $in: cleaned.map((loc) => new RegExp(loc, "i")),
      };
    }
  }

  if (salesCompany) {
    let arr: string[] = [];

    if (Array.isArray(salesCompany)) arr = salesCompany;
    else if (typeof salesCompany === "string" && salesCompany.includes(","))
      arr = salesCompany.split(",");
    else arr = [salesCompany];

    const cleaned = arr.map((s) => s.trim()).filter(Boolean);

    if (cleaned.length > 0) {
      apartmentMatch.salesCompany = { $in: cleaned };
    }
  }

  // ---------------------------
  // COMPLETION DATE
  // ---------------------------

  if (CompletionDate) {
    let arr: string[] = [];

    if (Array.isArray(CompletionDate)) arr = CompletionDate;
    else if (typeof CompletionDate === "string" && CompletionDate.includes(","))
      arr = CompletionDate.split(",");
    else arr = [CompletionDate];

    const years = arr.map(Number).filter((y) => !isNaN(y));
    if (years.length > 0) {
      apartmentMatch.CompletionDate = { $in: years };
    }
  }

  // ---------------------------
  // MULTI PROPERTY TYPE
  // ---------------------------

  if (propertyType) {
    let arr: string[] = [];

    if (Array.isArray(propertyType)) arr = propertyType;
    else if (typeof propertyType === "string" && propertyType.includes(","))
      arr = propertyType.split(",");
    else arr = [propertyType];

    const cleaned = arr.map((p) => p.trim()).filter(Boolean);

    if (cleaned.length > 0) {
      apartmentMatch.propertyType = { $in: cleaned };
    }
  }

  // ---------------------------
  // OTHER FILTERS
  // ---------------------------

  if (seaViewBoolean !== undefined) {
    apartmentMatch.seaViewBoolean = seaViewBoolean === "true";
  }

  if (commission) {
    let arr = [];

    if (Array.isArray(commission)) arr = commission;
    else if (typeof commission === "string" && commission.includes(","))
      arr = commission.split(",");
    else arr = [commission];

    const nums = arr.map(Number).filter((n) => !isNaN(n));

    if (nums.length > 0) {
      apartmentMatch.commission = { $in: nums };
    }
  }

  // ---------------------------
  // PRICE RANGE
  // ---------------------------

  if (priceMin || priceMax) {
    mongoQuery.price = {};
    if (priceMin) mongoQuery.price.$gte = Number(priceMin);
    if (priceMax) mongoQuery.price.$lte = Number(priceMax);
  }

  // ---------------------------
  // MATCH APARTMENTS
  // ---------------------------

  let apartmentIds: string[] = [];

  if (Object.keys(apartmentMatch).length > 0) {
    const apartments = await Apartment.find(apartmentMatch).select("_id");
    apartmentIds = apartments.map((a) => a._id.toString());

    if (apartmentIds.length === 0) {
      return { apartments: [] };
    }

    mongoQuery.apartmentId = { $in: apartmentIds };
  }

  mongoQuery.apartmentId = mongoQuery.apartmentId
    ? { ...mongoQuery.apartmentId, $ne: null }
    : { $ne: null };

  // ---------------------------
  // MAIN QUERY
  // ---------------------------

  const qb = new QueryBuilder(FloorPlan.find(mongoQuery), filters)
    .filter()
    .fields()
    .populate(["apartmentId"], {
      apartmentName: 1,
      apartmentImage: 1,
      location: 1,
      CompletionDate: 1,
      commission: 1,
      seaViewBoolean: 1,
      propertyType: 1,
      // ❌ floorPlans intentionally excluded
    });

  let result = await qb.modelQuery.lean();
  result = result.filter((fp: any) => fp.apartmentId !== null);

  // ---------------------------
  // GROUP BY APARTMENT
  // ---------------------------

  const grouped = new Map();

  result.forEach((fp: any) => {
    const aptId = fp.apartmentId._id.toString();

    if (!grouped.has(aptId)) {
      grouped.set(aptId, {
        ...fp.apartmentId,
        _prices: [],
      });
    }

    grouped.get(aptId)._prices.push(fp.price);
  });

  // ---------------------------
  // REMOVE floorPlans + ADD sortPrice
  // ---------------------------

  const finalResult = Array.from(grouped.values()).map((apt: any) => {
    const sortPrice = Math.min(...apt._prices);

    delete apt._prices; // ❌ delete temp field

    return {
      ...apt,
      sortPrice,
    };
  });

  return { apartments: finalResult };
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
