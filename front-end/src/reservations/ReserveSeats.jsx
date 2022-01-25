import React, {useEffect, useState} from "react";
import {listTables, updateTable} from "../utils/api";
import {Button} from "@mui/material";
import {useHistory, useParams} from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

const ReserveSeats = () => {
    const [tables, setTables] = useState([]);
    const [errors, setErrors] = useState(null);
    const [selectValue, setSelectValue] = useState("");
    const {reservationId} = useParams();
    const history = useHistory();
    
    function loadTables() {
    const abortController = new AbortController();
    setErrors(null);
    listTables(abortController.signal).then(setTables).catch(setErrors);
    return () => abortController.abort();
    }

    useEffect(loadTables, []);

    function changeHandler(e) {
        setSelectValue({ [e.target.name]: e.target.value });
      }
    

    const handleSubmit = (e) => {
        const abortController = new AbortController()
        e.preventDefault();
        updateTable(reservationId, Number(selectValue.table_id), abortController.signal)
          .then(() => history.push("/dashboard"))
          .catch(setErrors);
    
        return () => abortController.abort()
      };
      return (
        <div>
          <h1 className="text-center create-header">Seat a Reservation</h1>
          <ErrorAlert error={errors} />
    
          <form onSubmit={handleSubmit} className="text-center">
            <p>Table name - Table capacity</p>
            {tables && (
              <div className="form-group">
                <select name="table_id" required onChange={changeHandler} className="seat-select">
                  <option value=""></option>
                  {tables.map((table) => (
                    <option value={table.table_id} key={table.table_id}>
                      {table.table_name} - {table.capacity}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Button
              className="cancel-btn"
              variant="contained"
              color="error"
              sx={{ mr: 1 }}
              onClick={history.goBack}
            >
              Cancel
            </Button>
            <Button type="submit" className="submit-btn" variant="contained">
              Submit
            </Button>
          </form>
        </div>
      );
    };
    
    export default ReserveSeats;