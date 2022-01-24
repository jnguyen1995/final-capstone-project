import React, { useState } from "react";
import { Button } from "@mui/material";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router";
import { cancelReservation } from "../utils/api";

const ListOfReservations = ({ reservation }) => {
  const [errors, setErrors] = useState(false);
  const history = useHistory();
  async function handleCancel(reservationId) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await cancelReservation(reservationId);
        history.go();
      } catch (err) {
        setErrors(err);
      }
    }
  }

  return (
    <>
      {reservation.status !== "finished" && (
        <tr>
          <td>{reservation.reservation_id}</td>
          <td>{reservation.first_name}</td>
          <td>{reservation.last_name}</td>
          <td>{reservation.mobile_number}</td>
          <td>{reservation.reservation_date}</td>
          <td>{reservation.reservation_time}</td>
          <td>{reservation.people}</td>
          <td data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </td>
          {reservation.status === "booked" ? (
            <td data-reservation-id-status={reservation.reservation_id}>
              <Button
                href={`/reservations/${reservation.reservation_id}/seat`}
                variant="contained"
                color="secondary"
                sx={{ mr: 1 }}
              >
                Seat
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mr: 1 }}
                href={`/reservations/${reservation.reservation_id}/edit`}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mr: 1 }}
                onClick={() => {
                  handleCancel(reservation.reservation_id);
                }}
                data-reservation-id-cancel={`${reservation.reservation_id}`}
              >
                Cancel
              </Button>
            </td>
          ) : null}
        </tr>
      )}
    </>
  );
};

export default ListOfReservations;
