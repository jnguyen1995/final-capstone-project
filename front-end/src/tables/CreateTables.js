import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Button } from "@mui/material";

function CreateTables() {
  const initialFormData = {
    table_name: "",
    capacity: "",
  };

  const history = useHistory();
  const [formData, setFormData] = useState({ ...initialFormData });
  const [tableErrors, setTableErrors] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleNumberInput = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: Number(e.target.value),
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const abortController = new AbortController();
    try {
      await createTable(formData, abortController.signal);
      history.push(`/dashboard`);
      setFormData({ ...initialFormData });
    } catch (err) {
      console.log(err.message);
      setTableErrors(err);
    }

    return () => abortController.abort();
  }
  return (
    <div>
      <h2>Create a Table</h2>
      <ErrorAlert error={tableErrors} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_name">Table Name</label>
          <input
            type="text"
            name="table_name"
            className="form-control"
            id="table_name"
            placeholder="Table  Name"
            value={formData.table_name}
            onChange={handleChange}
            required
          />
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            name="capacity"
            className="form-control"
            id="capacity"
            placeholder="1"
            value={formData.capacity}
            onChange={handleNumberInput}
            required
          />
        </div>
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
}

export default CreateTables;
