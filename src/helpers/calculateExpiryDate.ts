export const calculateExpiryDate = (
  startDate: string,
  duration: "1 month" | "1 year"
): string => {
  const date = new Date(startDate); // subscription start date

  if (duration === "1 month") {
    date.setMonth(date.getMonth() + 1); // add 1 month
  }

  if (duration === "1 year") {
    date.setFullYear(date.getFullYear() + 1); // add 1 year
  }

  return date.toISOString(); // standard ISO format
};
