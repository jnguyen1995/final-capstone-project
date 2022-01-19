const tablesService = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await tablesService.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const { reservation_id } = req.body.data;
  const table_id = Number(req.params.table_id);
  const data = await tablesService.update(reservation_id, table_id);
  res.status(200).json({ data });
}

async function destroy(req, res) {
  const { table_id } = req.params;
  const { table } = res.locals;
  await tablesService.clearTable(table_id, table.reservation_id);
  res.status(200).json({});
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;

  const table = await tablesService.read(table_id);
  console.log(table);
  if (table) {
    res.locals.table = table;
    return next();
  } else {
    return next({
      status: 404,
      message: `No table found for id '${table_id}'.`,
    });
  }
}

function createValidation(req, res, next) {
  const data = req.body.data;
  if (!data) {
    next({
      status: 400,
      message: `Request is missing 'data'.`,
    });
  }
  if (!data.table_name || data.table_name.length <= 1) {
    return next({
      status: 400,
      message: "'table_name' length must be at least 2 characters long",
    });
  }
  if (data.capacity <= 0 || typeof data.capacity !== "number") {
    return next({
      status: 400,
      message: "'capacity' must be greater than 0",
    });
  }

  const requiredFields = ["table_name", "capacity"];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      return next({
        status: 400,
        message: `Reservation must include a ${field}`,
      });
    }
  });
  next();
}

const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

function hasOnlyValidProperties(req, res, next) {
  // iterate through keys in req.body
  const invalidFields = Object.keys(req.body.data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  // if there are any invalid fields
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    return next({
      status: 400,
      message: `A reservation_id is required`,
    });
  }
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `A reservation with the id ${reservation_id} was not found.`,
    });
  }
}

function hasData(req, res, next) {
  const data = req.body.data;
  if (!data) {
    next({
      status: 400,
      message: `Request is missing 'data'.`,
    });
  }
  next();
}

function updateValidation(req, res, next) {
  const occupied = res.locals.table.reservation_id;
  if (occupied) {
    return next({
      status: 400,
      message: `Table ${res.locals.table.table_id} is currently occupied. Please select another table.`,
    });
  }
  const { status } = res.locals.reservation;
  if (status === "seated") {
    return next({
      status: 400,
      message: `This reservation is already seated at a table!`,
    });
  }
  const people = res.locals.reservation.people;
  const capacity = res.locals.table.capacity;
  if (people > capacity) {
    return next({
      status: 400,
      message: `The party size is greater than the table capacity. Please select another table.`,
    });
  }

  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    createValidation,
    hasOnlyValidProperties,
    asyncErrorBoundary(create),
  ],
  update: [
    hasData,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    updateValidation,
    asyncErrorBoundary(update),
  ],
};
