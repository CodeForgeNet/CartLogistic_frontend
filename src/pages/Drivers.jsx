// src/pages/Drivers.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getDrivers, createDriver, updateDriver, deleteDriver } from "../api";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Load drivers data
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await getDrivers();
      setDrivers(response.data);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editing) {
        // Update existing driver
        await updateDriver(editing._id, data);
        setDrivers(
          drivers.map((d) => (d._id === editing._id ? { ...d, ...data } : d))
        );
        setEditing(null);
      } else {
        // Create new driver
        const response = await createDriver(data);
        setDrivers([...drivers, response.data]);
      }

      // Reset form
      reset();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving driver:", err);
      setError(err.response?.data?.error || "Failed to save driver");
    }
  };

  const handleEdit = (driver) => {
    setEditing(driver);
    reset(driver);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await deleteDriver(id);
      setDrivers(drivers.filter((d) => d._id !== id));
    } catch (err) {
      console.error("Error deleting driver:", err);
      setError(err.response?.data?.error || "Failed to delete driver");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    reset();
    setShowForm(false);
  };

  if (loading && drivers.length === 0)
    return <div className="loading">Loading drivers...</div>;

  return (
    <div className="drivers-page">
      <h1>Manage Drivers</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="actions">
        <button
          className="button add-button"
          onClick={() => {
            setEditing(null);
            reset();
            setShowForm(true);
          }}
        >
          Add New Driver
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editing ? "Edit Driver" : "Add New Driver"}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="error">{errors.name.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" {...register("email")} />
            </div>

            <div className="form-group">
              <label htmlFor="currentShiftHours">Current Shift Hours</label>
              <input
                id="currentShiftHours"
                type="number"
                step="0.5"
                {...register("currentShiftHours", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
              {errors.currentShiftHours && (
                <span className="error">
                  {errors.currentShiftHours.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="isActive">Active</label>
              <input id="isActive" type="checkbox" {...register("isActive")} />
            </div>

            <div className="form-group">
              <label>Past 7 Day Hours (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. 7,8,6,7,8,6"
                {...register("past7DayHoursInput")}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="button save-button">
                {editing ? "Update" : "Save"}
              </button>
              <button
                type="button"
                className="button cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="drivers-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Shift Hours</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">
                  No drivers found
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver._id}>
                  <td>{driver.name}</td>
                  <td>{driver.email || "-"}</td>
                  <td>{driver.currentShiftHours}</td>
                  <td>
                    <span
                      className={
                        driver.isActive ? "status-active" : "status-inactive"
                      }
                    >
                      {driver.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="button edit-button"
                      onClick={() => handleEdit(driver)}
                    >
                      Edit
                    </button>
                    <button
                      className="button delete-button"
                      onClick={() => handleDelete(driver._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
