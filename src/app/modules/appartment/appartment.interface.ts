type IContact = {
  phone: string;
  email: string;
  companyName: string;
};


export type IApartment = {
  apartmentImage: string[];
  apartmentName: string;
  commission: string;
  paymentPlanPDF: string;
  qualitySpecificationPDF: string[];
  contact: IContact;
  features: string[];
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
  | "Fuengirola"
  | "Malaga"
  | "La Alcaidesa"
  | "Rincon de la Victoria"
  | "Toree del Mar";

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
  CompletionDate: Date;
  pricePdf: string;
};
