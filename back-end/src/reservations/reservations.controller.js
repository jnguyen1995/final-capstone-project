/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const reservation_date = req.query.date;
  if (reservation_date) {
    const data = await service.listResByDate(reservation_date);
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
    // }
  }
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

const dateValid = (reservation_date) => {
  let regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!reservation_date.match(regEx)) return false; // Invalid format
  const d = new Date(reservation_date);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === reservation_date;
};

function validateForm(req, res, next) {
  const { data } = req.body;
  if (!data) return next({ status: 400, message: "Data is missing" });
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      return next({
        status: 400,
        message: `Reservation must include a ${field}`,
      });
    }
  });

  if (!Number.isInteger(data.people)) {
    next({
      status: 400,
      message: "people must be a number",
    });
  }

  const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
  const timeFormat = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

  if (!data.reservation_date.match(dateFormat)) {
    return next({
      status: 400,
      message: `the reservation_date must be a valid date in the format 'YYYY-MM-DD'`,
    });
  }

  if (!data.reservation_time.match(timeFormat)) {
    return next({
      status: 400,
      message: `the reservation_time must be a valid date in the format '12:30'`,
    });
  }

  const invalidDate = 2;
  const submitDate = new Date(
    data.reservation_date + " " + data.reservation_time
  );
  const dayAsNum = submitDate.getUTCDay();

  if (dayAsNum === invalidDate) {
    return next({
      status: 400,
      message: `The restaurant is closed on Tuesdays. Please select a different day.`,
    });
  }

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const today = year + "-" + month + "-" + day;
  if (data.reservation_date < today) {
    return next({
      status: 400,
      message: `Reservations can only be made for dates and times in the future.`,
    });
  }

  if (data.reservation_time <= "10:29:59") {
    next({
      status: 400,
      message: "The restaurant does not open until 10:30 A.M.",
    });
  } else {
    if (data.reservation_time >= "21:30:00") {
      next({
        status: 400,
        message: `The restaurant closes at 10:30 P.M. Please schedule your reservation at least one hour before close.`,
      });
    }
  }

  next();
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [validateForm, asyncErrorBoundary(create)],
};
