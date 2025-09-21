// src/pages/Simulation.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { runSimulation } from "../api";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

// Register Chart.js components
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Simulation() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      numberOfDrivers: 5,
      routeStartTime: "09:00",
      maxHoursPerDriver: 8,
    },
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await runSimulation(data);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Simulation failed");
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for on-time vs late deliveries
  const prepareDeliveryChartData = () => {
    if (!result) return null;

    return {
      labels: ["On-time", "Late"],
      datasets: [
        {
          data: [
            result.kpis.onTimeDeliveries,
            result.kpis.totalDeliveries - result.kpis.onTimeDeliveries,
          ],
          backgroundColor: ["#4CAF50", "#F44336"],
          borderColor: ["#388E3C", "#D32F2F"],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare chart data for fuel cost breakdown
  const prepareFuelCostChartData = () => {
    if (!result) return null;

    const fuelData = result.kpis.fuelCostBreakdown;

    return {
      labels: Object.keys(fuelData),
      datasets: [
        {
          label: "Fuel Cost (Rs)",
          data: Object.values(fuelData),
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="simulation-page">
      <h1>Route Simulation</h1>

      <div className="simulation-form-container">
        <h2>Run New Simulation</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="numberOfDrivers">Number of Drivers</label>
            <input
              id="numberOfDrivers"
              type="number"
              {...register("numberOfDrivers", {
                required: "Required",
                min: { value: 1, message: "At least 1 driver required" },
              })}
            />
            {errors.numberOfDrivers && (
              <span className="error">{errors.numberOfDrivers.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="routeStartTime">Route Start Time</label>
            <input
              id="routeStartTime"
              type="text"
              {...register("routeStartTime", { required: "Required" })}
            />
            {errors.routeStartTime && (
              <span className="error">{errors.routeStartTime.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="maxHoursPerDriver">Max Hours Per Driver</label>
            <input
              id="maxHoursPerDriver"
              type="number"
              step="0.1"
              {...register("maxHoursPerDriver", {
                required: "Required",
                min: { value: 0.5, message: "At least 0.5 hours required" },
              })}
            />
            {errors.maxHoursPerDriver && (
              <span className="error">{errors.maxHoursPerDriver.message}</span>
            )}
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Running..." : "Run Simulation"}
          </button>
        </form>
      </div>

      {result && (
        <div className="simulation-results">
          <h2>Simulation Results</h2>

          <div className="kpi-cards">
            <div className="kpi-card">
              <h3>Total Profit</h3>
              <div className="kpi-value">
                ₹{result.kpis.totalProfit.toLocaleString()}
              </div>
            </div>

            <div className="kpi-card">
              <h3>Efficiency</h3>
              <div className="kpi-value">
                {result.kpis.efficiency.toFixed(2)}%
              </div>
            </div>

            <div className="kpi-card">
              <h3>Deliveries</h3>
              <div className="kpi-value">
                {result.kpis.onTimeDeliveries} / {result.kpis.totalDeliveries}
              </div>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart">
              <h3>Delivery Performance</h3>
              {prepareDeliveryChartData() && (
                <Pie data={prepareDeliveryChartData()} />
              )}
            </div>

            <div className="chart">
              <h3>Fuel Cost by Traffic Level</h3>
              {prepareFuelCostChartData() && (
                <Bar
                  data={prepareFuelCostChartData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: false },
                    },
                  }}
                />
              )}
            </div>
          </div>

          <div className="order-details">
            <h3>Order Details</h3>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Value (₹)</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Profit (₹)</th>
                </tr>
              </thead>
              <tbody>
                {result.perOrder.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{order.valueRs}</td>
                    <td>{order.assignedDriver}</td>
                    <td>
                      <span
                        className={
                          order.onTime ? "status-on-time" : "status-late"
                        }
                      >
                        {order.onTime ? "On Time" : "Late"}
                      </span>
                    </td>
                    <td>{order.profit.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
