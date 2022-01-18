const knex = require("../db/connection");

const list = () => {
  //get todays date in yyyy-mm-dd format
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const today = year + "-" + month + "-" + day;
  //const test = "2020-12-30";

  return knex("reservations")
    .select("*")
    .where({ reservation_date: today })
    .orderBy("reservation_time");
};

const listResByDate = (reservation_date) => {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time");
};

const create = (reservation) => {
  return knex("reservations")
    .insert(reservation, "*")
    .then((res) => res[0]);
};

const dateValid = (reservation_date) => {
  let regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!reservation_date.match(regEx)) return false; // Invalid format
  const d = new Date(reservation_date);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === reservation_date;
};

module.exports = {
  list,
  listResByDate,
  create,
  dateValid,
};
