import { USER_ROLES } from "../../../enums/user";
import { Apartment } from "../appartment/appartment.model";
import { Subscription } from "../subscription/subscription.model";
import { User } from "../user/user.model";

const totalAgency = async () => {
  const result = await User.countDocuments();
  const apartment = await Apartment.countDocuments();
  const totalIncome = await Subscription.find();
  const totalPrice = totalIncome.reduce((acc, curr) => acc + curr?.price, 0);
  if (!result) {
    return 0;
  }
  return { result, apartment, totalPrice };
};

// total agency base on month
const totalAgencyByMonth = async () => {
  const currentYear = new Date().getFullYear();

  const result = await User.aggregate([
    {
      $match: {
        role: USER_ROLES.AGENCY,
        createdAt: {
          $gte: new Date(currentYear, 0, 1),
          $lte: new Date(currentYear, 11, 31),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        count: 1,
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  const monthsData = Array.from({ length: 12 }, (_, i) => {
    const monthData = result.find((item) => item.month === i + 1);
    return {
      month: new Date(2000, i).toLocaleString("default", { month: "long" }),
      count: monthData ? monthData.count : 0,
    };
  });

  return monthsData;
};

// Total Subscriber
const totalSubscriber = async () => {
  const result = await Subscription.find().populate("user").populate("package");
  if (!result) {
    return 0;
  }
  return result;
};

// get single subscriber
const getSingleSubscriber = async (id: string) => {
  const result = await Subscription.findById(id)
    .populate("user")
    .populate("package");
  if (!result) {
    return 0;
  }
  return result;
};

// delete subscriber
const deleteSubscriber = async (id: string) => {
  const result = await Subscription.findByIdAndDelete(id);
  if (!result) {
    return 0;
  }
  return result;
};

export const DashboardService = {
  totalAgency,
  totalAgencyByMonth,
  totalSubscriber,
  getSingleSubscriber,
  deleteSubscriber,
};
