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
    qualitySpecificationPDF: [{ type: String, required: true }],
    contact: { type: contactSchema, required: true },
    features: { type: [String], required: true },
    seaView: { type: [String], required: true },
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
        "Higueron",
        "Benahavis",
      ],
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
      enum: [
        "Aedas",
        "AssetFolio",
        "Azul",
        "Bromley Estate",
        "BySales",
        "Dream Exclusives",
        "GILMAR",
        "Insur",
        "Invest Home",
        "Magnum",
        "MXM",
        "Nvoga",
        "OneEden",
        "Prime Invest",
        "Real De La Quinta",
        "RH Prive Estates",
        "Rosso Inmobiliaria",
        "Taylor Wimpey",
        "Tuscany Group",
        "TM",
        "Capre Homes",
        "UrbinCasa",
        "Turnkey",
        "Others",
        "Asset Folio",
      ],
    },
    CompletionDate: {
      type: String,
      required: true,
    },
    pricePdf: { type: String, required: true },
    relevantLink: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Apartment = model<IApartment>("Apartment", ApartmentSchema);
