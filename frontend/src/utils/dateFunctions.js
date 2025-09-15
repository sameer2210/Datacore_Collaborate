import moment from "moment";

export const convertDateToDaysAgo = (date) => {
  const today = moment();
  const dateMoment = moment(date); // Convert the input date to a moment object

  const daysAgo = today.diff(dateMoment, "days");

  if (daysAgo === 0) {
    // If the difference is 0 days, return the time in "hh:mm A" format
    return dateMoment.format("hh:mm A");
  }

  // Otherwise, return the number of days ago
  return `${daysAgo} days ago`;
};

export const convertDateToDDMMYYYY = (date) => {
  return moment(date).format("DD/MM/YYYY");
};
