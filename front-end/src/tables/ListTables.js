import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { listReservations, clearTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";

const ListTables = ({ table }) => {
  const [errors, setErrors] = useState(null);
  const history = useHistory();

  async function handleFinish(tableId) {
    if (
      window.confirm(
        "Is this table ready to seat new guests?  This cannot be undone."
      )
    ) {
      try {
        await clearTable(tableId);
        history.go();
      } catch (err) {
        setErrors(err);
      }
    }
  }

  return (
    <tr>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td>{table.table_id}</td>
      <td>{table.reservation_id}</td>
      <td data-table-id-status={table.table_id}>
        {table.reservation_id ? "Occupied" : "Free"}
      </td>
      {table.reservation_id && (
        <td>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mr: 1 }}
            data-table-id-finish={table.table_id}
            onClick={() => handleFinish(table.table_id)}
          >
            Finish
          </Button>
        </td>
      )}
    </tr>
  );
};

export default ListTables;
