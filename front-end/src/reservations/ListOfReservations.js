import React, { useState } from "react";
import { Button } from "@mui/material";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router";

const ListOfReservations = ({ reservation }) => {
  const history = useHistory();
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
                onClick={() => {
                  history.push(
                    `/reservations/${reservation.reservation_id}/seat`
                  );
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mr: 1 }}
                onClick={() => {
                  history.push(
                    `/reservations/${reservation.reservation_id}/seat`
                  );
                }}
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
