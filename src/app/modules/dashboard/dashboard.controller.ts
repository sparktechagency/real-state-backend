import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DashboardService } from "./dashboard.service";

const getDashboardStatistic = catchAsync(async (req, res) => {
  const result = await DashboardService.totalAgency();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard data fetched successfully",
    data: result,
  });
});

// agency base on month
const getAgencyBaseOnMonth = catchAsync(async (req, res) => {
  const result = await DashboardService.totalAgencyByMonth();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard data fetched successfully",
    data: result,
  });
});

// total Subscriber
const getTotalSubscriber = catchAsync(async (req, res) => {
  const result = await DashboardService.totalSubscriber();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard data fetched successfully",
    data: result,
  });
});

// single subscriber
const getSingleSubscriber = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DashboardService.getSingleSubscriber(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard data fetched successfully",
    data: result,
  });
});

const deleteSubscriber = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DashboardService.deleteSubscriber(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Dashboard data fetched successfully",
    data: result,
  });
});

export const DashboardController = {
  getDashboardStatistic,
  getAgencyBaseOnMonth,
  getTotalSubscriber,
  getSingleSubscriber,
  deleteSubscriber,
};
