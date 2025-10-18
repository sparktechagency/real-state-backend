import { PropertyType } from "../../../enums/propertyType";
import { SalesCompany } from "../../../enums/salesCompany";

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
  propertyType: PropertyType;
  apartmentImagesPdf: string;
  location: Location;
  updatedDate?: Date;
  salesCompany: SalesCompany;
  CompletionDate: string;
  pricePdf: string;
  relevantLink?: string;
};
