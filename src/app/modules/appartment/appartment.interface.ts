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
  seaView: string[];
  latitude: Number;
  longitude: Number;
  propertyType: "Apartment" | "Villa" | "Townhouse";
  apartmentImagesPdf: string;
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
  | "Toree del Mar"
  | "Higueron";
  updatedDate?: Date;
  salesCompany:
  | "Magnum"
  | "Azul"
  | "TM"
  | "Asset Folio"
  | "One Eden"
  | "Aedas"
  | "Bromley Estate"
  | "MXM"
  | "Prime Invest"
  | "ON3"
  | "GILMAR"
  | "Rosso Inmobiliaria"
  | "Nvoga"
  | "Taylor Wimpey"
  | "Tuscany Group"
  | "RH Prive Estates"
  | "Dream Exclusives"
  // new items added
  | "Insur"
  | "BySales"
  | "Invest Home"
  | "Real De La Quinta"
  | "Capre Homes"
  | "UrbinCasa"
  | "Others";

  CompletionDate: string;
  pricePdf: string;
};
