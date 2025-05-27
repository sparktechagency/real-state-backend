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
  qualitySpecificationPDF: string[];
  contact: IContact;
  features: IFeatures;
  latitude: Number;
  longitude: Number;
  propertyType: "Apartment" | "Villa" | "Townhouse";
  location:
    | "Malaga"
    | "Estepona"
    | "Mijas"
    | "Casares"
    | "Manilva"
    | "Sotogrande"
    | "Marbella"
    | "Benalmadena"
    | "Fuengirola";
  salesCompany:
    | "Magnum"
    | "Azul"
    | "OneEden"
    | "Aedas"
    | "BromleyEstates"
    | "MXM"
    | "PrimeInvest"
    | "ON3"
    | "GILMAR"
    | "RossoInmobilaria"
    | "Nvoga"
    | "TaylorWimpey"
    | "TuscanyGroup"
    | "RHPriveEstates"
    | "DreamExclusive";
  CompletionDate: number;
};
