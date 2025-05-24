import { Model } from "mongoose"; 

export type IPackage = { 
  title: String; 
  description: String[]; 
  price: Number; 
  duration: "1 month" | "1 year"; 
  paymentType: "Monthly" | "Yearly"; 
  paymentLink?: string; 
  status: "Active" | "Delete"; 
}; 

export type PackageModel = Model<IPackage, Record<string, unknown>>;
