import { model, Schema } from "mongoose";
import { IApartment } from "./appartment.interface";
import { PropertyType } from "../../../enums/propertyType";
import { Location } from "../../../enums/location";
import { SalesCompany } from "../../../enums/salesCompany";

const contactSchema = new Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  companyName: { type: String, required: true },
});

const ApartmentSchema = new Schema<IApartment>(
  {
    apartmentImage: [{ type: String, required: true }],
    apartmentName: { type: String, required: true },
    commission: { type: String, required: true },
    paymentPlanPDF: { type: String, required: true },
    qualitySpecificationPDF: [{ type: String, required: true }],
    contact: { type: contactSchema, required: true },
    features: { type: [String], required: true },
    seaView: { type: [String], required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    propertyType: {
      type: String,
      required: true,
      enum: PropertyType,
    },
    location: {
      type: String,
      required: false,
      enum: Location,
    },
    locationTwo: {
      type: String,
      required: false,
    },
    updatedDate: {
      type: Date,
    },
    apartmentImagesPdf: {
      type: String,
      required: true,
    },
    salesCompany: {
      type: String,
      required: true,
      enum: SalesCompany,
    },
    CompletionDate: {
      type: [String],
      required: true,
    },
    seaViewBoolean: {
      type: Boolean,
      required: true,
      default: false,
    },
    pricePdf: { type: String, required: true },
    relevantLink: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Apartment = model<IApartment>("Apartment", ApartmentSchema);
