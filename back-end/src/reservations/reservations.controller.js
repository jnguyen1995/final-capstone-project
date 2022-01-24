/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const reservation_date = req.query.date;
  const mobile_number = req.query.mobile_number;
  if (reservation_date) {
    const data = await service.listResByDate(reservation_date);
    res.json({ data });
  } else if (mobile_number) {
    const data = await service.search(mobile_number);
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

async function read(req, res) {
  const { reservation } = res.locals;
  const data = await service.read(reservation.reservation_id);
  res.status(200).json({ data });
}

async function update(req, res) {
  const { reservation_id } = res.locals.reservation;

  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  const data = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data });
}

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `No reservation found for id '${reservationId}'.`,
    });
  }
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
        message: `The restaurant closes at 9:30 P.M. Please schedule your reservation at least one hour before close.`,
      });
    }
  }

  next();
}

function checkBooked(req, res, next) {
  const { status } = req.body.data;
  if (status) {
    if (status !== "booked") {
      next({
        status: 400,
        message: `A new reservation cannot have a status of ${status}`,
      });
    }
  }
  next();
}

function checkStatus(req, res, next) {
  const { status } = req.body.data;
  const validStatuses = ["booked", "seated", "finished", "cancelled"];
  if (!validStatuses.includes(status)) {
    return next({
      status: 400,
      message: `The status property must be either ${validStatuses.join(
        ", "
      )}.  You entered '${status}'`,
    });
  }
  next();
}

function validateFinish(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: `Reservation status is currently finished and cannot be updated`,
    });
  }
  next();
}

function hasData(req, res, next) {
  const data = req.body.data;
  if (!data) {
    next({
      status: 400,
      message: `Request is missing 'data'.`,
    });
  } else {
    next();
  }
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasData, checkBooked, validateForm, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExists),
    checkBooked,
    validateForm,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    checkStatus,
    validateFinish,
    asyncErrorBoundary(updateStatus),
  ],
};
