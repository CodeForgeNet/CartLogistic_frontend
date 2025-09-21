// src/pages/Orders.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  getRoutes,
} from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
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

  // Load orders data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both orders and routes
      const [ordersRes, routesRes] = await Promise.all([
        getOrders(),
        getRoutes(),
      ]);
      setOrders(ordersRes.data);
      setRoutes(routesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Convert values
      data.valueRs = Number(data.valueRs);

      if (editing) {
        // Update existing order
        await updateOrder(editing._id, data);
        setOrders(
          orders.map((o) => (o._id === editing._id ? { ...o, ...data } : o))
        );
        setEditing(null);
      } else {
        // Create new order
        const response = await createOrder(data);
        setOrders([...orders, response.data]);
      }

      // Reset form
      reset();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving order:", err);
      setError(err.response?.data?.error || "Failed to save order");
    }
  };

  const handleEdit = (order) => {
    setEditing(order);
    reset(order);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteOrder(id);
      setOrders(orders.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
      setError(err.response?.data?.error || "Failed to delete order");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    reset();
    setShowForm(false);
  };

  if (loading && orders.length === 0)
    return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <h1>Manage Orders</h1>

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
          Add New Order
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editing ? "Edit Order" : "Add New Order"}</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="orderId">Order ID</label>
              <input
                id="orderId"
                type="text"
                {...register("orderId", { required: "Order ID is required" })}
                disabled={editing} // Don't allow changing order ID when editing
              />
              {errors.orderId && (
                <span className="error">{errors.orderId.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="valueRs">Value (₹)</label>
              <input
                id="valueRs"
                type="number"
                {...register("valueRs", {
                  required: "Value is required",
                  min: { value: 1, message: "Value must be positive" },
                })}
              />
              {errors.valueRs && (
                <span className="error">{errors.valueRs.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="assignedRouteId">Assigned Route</label>
              <select
                id="assignedRouteId"
                {...register("assignedRouteId", {
                  required: "Route is required",
                })}
              >
                <option value="">Select a route</option>
                {routes.map((route) => (
                  <option key={route._id} value={route.routeId}>
                    {route.routeId} ({route.distanceKm} km, {route.trafficLevel}{" "}
                    traffic)
                  </option>
                ))}
              </select>
              {errors.assignedRouteId && (
                <span className="error">{errors.assignedRouteId.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" {...register("status")}>
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
              </select>
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

      <div className="orders-list">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Value (₹)</th>
              <th>Route</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderId}</td>
                  <td>{order.valueRs}</td>
                  <td>{order.assignedRouteId}</td>
                  <td>
                    <span className={`status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="button edit-button"
                      onClick={() => handleEdit(order)}
                    >
                      Edit
                    </button>
                    <button
                      className="button delete-button"
                      onClick={() => handleDelete(order._id)}
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
