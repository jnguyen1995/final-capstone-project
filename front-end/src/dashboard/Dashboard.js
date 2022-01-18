import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { Button } from "@mui/material";
import "./Dashboard.css";
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
  const history = useHistory();
  const [date, setDate] = useState(query.get("date") || today());
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const rows = reservations.map(
    ({
      reservation_id,
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    }) => (
      <tr>
        <td>{reservation_id}</td>
        <td>{first_name}</td>
        <td>{last_name}</td>
        <td>{mobile_number}</td>
        <td>{reservation_date}</td>
        <td>{reservation_time}</td>
        <td>{people}</td>
      </tr>
    )
  );

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
      <table class="table mt-3">
        <thead class="thead-dark">
          <tr>
            <th>Reservation ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>People</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </main>
  );
}

export default Dashboard;
