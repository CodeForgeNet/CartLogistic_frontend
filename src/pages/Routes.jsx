// src/pages/Routes.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getRoutes, createRoute, updateRoute, deleteRoute } from "../api";

export default function Routes() {
  const [routes, setRoutes] = useState([]);
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

  // Load routes data
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await getRoutes();
      setRoutes(response.data);
    } catch (err) {
      console.error("Error fetching routes:", err);
      setError("Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Convert values to numbers
      data.distanceKm = Number(data.distanceKm);
      data.baseTimeMinutes = Number(data.baseTimeMinutes);

      if (editing) {
        // Update existing route
        await updateRoute(editing._id, data);
        setRoutes(
          routes.map((r) => (r._id === editing._id ? { ...r, ...data } : r))
        );
        setEditing(null);
      } else {
        // Create new route
        const response = await createRoute(data);
        setRoutes([...routes, response.data]);
      }

      // Reset form
      reset();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving route:", err);
      setError(err.response?.data?.error || "Failed to save route");
    }
  };

  const handleEdit = (route) => {
    setEditing(route);
    reset(route);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;

    try {
      await deleteRoute(id);
      setRoutes(routes.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting route:", err);
      setError(err.response?.data?.error || "Failed to delete route");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    reset();
    setShowForm(false);
  };

  if (loading && routes.length === 0)
    return <div className="loading">Loading routes...</div>;

  return (
    <div className="routes-page">
      <h1>Manage Routes</h1>

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
          Add New Route
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editing ? "Edit Route" : "Add New Route"}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="routeId">Route ID</label>
              <input
                id="routeId"
                type="text"
                {...register("routeId", { required: "Route ID is required" })}
                disabled={editing} // Don't allow changing route ID when editing
              />
              {errors.routeId && (
                <span className="error">{errors.routeId.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="distanceKm">Distance (km)</label>
              <input
                id="distanceKm"
                type="number"
                step="0.1"
                {...register("distanceKm", {
                  required: "Distance is required",
                  min: { value: 0.1, message: "Distance must be positive" },
                })}
              />
              {errors.distanceKm && (
                <span className="error">{errors.distanceKm.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="trafficLevel">Traffic Level</label>
              <select
                id="trafficLevel"
                {...register("trafficLevel", {
                  required: "Traffic level is required",
                })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {errors.trafficLevel && (
                <span className="error">{errors.trafficLevel.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="baseTimeMinutes">Base Time (minutes)</label>
              <input
                id="baseTimeMinutes"
                type="number"
                {...register("baseTimeMinutes", {
                  required: "Base time is required",
                  min: { value: 1, message: "Base time must be positive" },
                })}
              />
              {errors.baseTimeMinutes && (
                <span className="error">{errors.baseTimeMinutes.message}</span>
              )}
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

      <div className="routes-list">
        <table>
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Distance (km)</th>
              <th>Traffic Level</th>
              <th>Base Time (min)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">
                  No routes found
                </td>
              </tr>
            ) : (
              routes.map((route) => (
                <tr key={route._id}>
                  <td>{route.routeId}</td>
                  <td>{route.distanceKm}</td>
                  <td>
                    <span
                      className={`traffic-${route.trafficLevel.toLowerCase()}`}
                    >
                      {route.trafficLevel}
                    </span>
                  </td>
                  <td>{route.baseTimeMinutes}</td>
                  <td className="actions">
                    <button
                      className="button edit-button"
                      onClick={() => handleEdit(route)}
                    >
                      Edit
                    </button>
                    <button
                      className="button delete-button"
                      onClick={() => handleDelete(route._id)}
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
