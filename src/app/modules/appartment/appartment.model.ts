import { model, Schema } from "mongoose";
import { IApartment } from "./appartment.interface";

const contactSchema = new Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
});

const featuresSchema = new Schema({
  category: { type: String, required: true },
  generalAmenites: { type: String, required: true },
  connectivity: { type: String, required: true },
  ecoFriendly: { type: String, required: true },
  parking: { type: String, required: true },
  receational: { type: String, required: true },
  accessiblity: { type: String, required: true },
  nearbyFacilities: { type: String, required: true },
});

const ApartmentSchema = new Schema<IApartment>({
  apartmentImage: [{ type: String, required: true }],
  apartmentName: { type: String, required: true },
  commission: { type: Number, required: true },
  paymentPlanImage: { type: String, required: true },
  price: { type: Number, required: true },
  qualitySpecificationPDF: [{ type: String, required: true }],
  contact: { type: contactSchema, required: true },
  features: { type: featuresSchema, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

export const Apartment = model<IApartment>("Apartment", ApartmentSchema);
