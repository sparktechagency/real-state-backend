type IContact = {
  phone: string;
  email: string;
  location: string;
};

export type IApartment = {
  image: string[];
  apartmentName: string;
  commission: number;
  paymentPlan: string;
  price: number;
  qualitySpecification: string[];
  contact: IContact;
};
