import { model, Schema } from "mongoose";
import { IApartment } from "./appartment.interface";

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
    price: { type: Number, required: true },
    qualitySpecificationPDF: [{ type: String, required: true }],
    contact: { type: contactSchema, required: true },
    features: { type: [String], required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    propertyType: {
      type: String,
      required: true,
      enum: ["Apartment", "Villa", "Townhouse"],
    },
    location: {
      type: String,
      required: true,
      enum: [
        "Malaga",
        "Estepona",
        "Mijas",
        "Casares",
        "Manilva",
        "Sotogrande",
        "Marbella",
        "Benalmadena",
        "Fuengirola",
        "Malaga",
        "La Alcaidesa",
        "Rincon de la Victoria",
        "Toree del Mar",
      ],
    },
    salesCompany: {
      type: String,
      required: true,
      enum: [
        "Magnum",
        "Azul",
        "OneEden",
        "Aedas",
        "BromleyEstates",
        "MXM",
        "PrimeInvest",
        "ON3",
        "GILMAR",
        "RossoInmobilaria",
        "Nvoga",
        "TaylorWimpey",
        "TuscanyGroup",
        "RHPriveEstates",
        "DreamExclusive",
      ],
    },
    CompletionDate: {
      type: Date,
      required: true,
    },
    pricePdf: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Apartment = model<IApartment>("Apartment", ApartmentSchema);
