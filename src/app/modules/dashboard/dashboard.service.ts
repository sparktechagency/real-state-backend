import { Apartment } from "../appartment/appartment.model";
import { User } from "../user/user.model";

const totalAgency = async () => {
  const result = await User.countDocuments();
  const apartment = await Apartment.countDocuments();
  // const totalIncome = await
  if (!result) {
    return 0;
  }
  return result;
};
