type IContact = {
  phone: string;
  email: string;
  location: string;
};
type IFeatures = {
  category: string;
  generalAmenites: string;
  connectivity: string;
  ecoFriendly: string;
  parking: string;
  receational: string;
  accessiblity: string;
  nearbyFacilities: string;
};

export type IApartment = {
  apartmentImage: string[];
  apartmentName: string;
  commission: number;
  paymentPlanImage: string;
  price: number;
  qualitySpecificationImage: string[];
  contact: IContact;
  features: IFeatures;
};
