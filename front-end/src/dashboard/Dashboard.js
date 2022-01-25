import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { Button } from "@mui/material";
import "./Dashboard.css";
import ListTables from "../tables/ListTables";
import ListOfReservations from "../reservations/ListOfReservations";
//new comment to allow redeploy

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  //{JSON.stringify(reservations)}
  const query = useQuery();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const history = useHistory();
  const [date, setDate] = useState(query.get("date") || today());
  useEffect(loadDashboard, [date]);

  useEffect(loadTables, []);
  useEffect(() => {
    history.push(`dashboard?date=${date}`);
  }, [date, history]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setReservationsError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // async function handleFinish(tableId) {
  //   if (
  //     window.confirm(
  //       "Is this table ready to seat new guests?  This cannot be undone."
  //     )
  //   ) {
  //     try {
  //       await clearTable(tableId);
  //       history.go();
  //     } catch (err) {
  //       setReservationsError(err);
  //     }
  //   }
  // }

  const rows = reservations.map((reservation) => (
    <ListOfReservations
      key={reservation.reservation_id}
      reservation={reservation}
    ></ListOfReservations>
  ));

  const tableRows = tables.map((table) => (
    <ListTables key={table.table_id} table={table}></ListTables>
  ));

  function handleToday() {
    history.push(`dashboard?date=${date}`);
  }

  function handlePrev() {
    setDate(previous(date));
    history.push(`dashboard?date=${previous(date)}`);
  }

  function handleNext() {
    setDate(next(date));
    history.push(`dashboard?date=${next(date)}`);
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mr: 1 }}
        onClick={() => handlePrev(date)}
      >
        Previous
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mr: 1 }}
        onClick={() => {
          setDate(today());
          handleToday(date);
        }}
      >
        Today
      </Button>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mr: 1 }}
        onClick={() => handleNext(date)}
      >
        Next
      </Button>
      <ErrorAlert error={reservationsError} />
      <table className="table mt-3">
        <thead className="thead-dark">
          <tr>
            <th>Reservation ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>People</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <h3 className="text-left dashboard-section-header">Tables</h3>
      {tables && (
        <div className="tables-container">
          <table className="table mt-3">
            <thead className="thead-dark">
              <tr>
                <th>Table Name</th>
                <th>Capacity</th>
                <th>Table ID</th>
                <th>Reservation ID</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
