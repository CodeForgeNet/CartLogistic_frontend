import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLatestSimulation, getDrivers, getOrders, getRoutes } from "../api";
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

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Dashboard() {
  const [latestSimulation, setLatestSimulation] = useState(null);
  const [summary, setSummary] = useState({
    totalDrivers: 0,
    totalRoutes: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const simulationResponse = await getLatestSimulation();
        setLatestSimulation(simulationResponse.data);

        const [driversRes, ordersRes, routesRes] = await Promise.all([
          getDrivers(),
          getOrders(),
          getRoutes(),
        ]);

        setSummary({
          totalDrivers: driversRes.data.length,
          totalOrders: ordersRes.data.length,
          totalRoutes: routesRes.data.length,
        });
      } catch (err) {
        console.error("Dashboard data error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const prepareDeliveryChartData = () => {
    if (!latestSimulation) return null;

    return {
      labels: ["On-time", "Late"],
      datasets: [
        {
          data: [
            latestSimulation.kpis.onTimeDeliveries,
            latestSimulation.kpis.totalDeliveries -
              latestSimulation.kpis.onTimeDeliveries,
          ],
          backgroundColor: ["#4CAF50", "#F44336"],
          borderColor: ["#388E3C", "#D32F2F"],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareFuelCostChartData = () => {
    if (!latestSimulation) return null;

    const fuelData = latestSimulation.kpis.fuelCostBreakdown;

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

  if (loading) return <div className="loading">Loading dashboard data...</div>;

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-page">
      <h1>Logistics Dashboard</h1>
      <div className="dashboard-content">
        <div className="summary-cards">
          <div className="summary-card">
            <h2>Drivers</h2>
            <div className="summary-value">{summary.totalDrivers}</div>
            <Link to="/drivers" className="summary-link">
              Manage Drivers
            </Link>
          </div>
          <div className="summary-card">
            <h2>Routes</h2>
            <div className="summary-value">{summary.totalRoutes}</div>
            <Link to="/routes" className="summary-link">
              Manage Routes
            </Link>
          </div>
          <div className="summary-card">
            <h2>Orders</h2>
            <div className="summary-value">{summary.totalOrders}</div>
            <Link to="/orders" className="summary-link">
              Manage Orders
            </Link>
          </div>
        </div>
        {latestSimulation ? (
          <div className="latest-simulation">
            <h2>Latest Simulation Results</h2>
            <div className="timestamp">
              Run on: {new Date(latestSimulation.createdAt).toLocaleString()}
            </div>
            <div className="kpi-cards">
              <div className="kpi-card">
                <h3>Total Profit</h3>
                <div className="kpi-value">
                  ₹{latestSimulation.kpis.totalProfit.toLocaleString()}
                </div>
              </div>

              <div className="kpi-card">
                <h3>Efficiency</h3>
                <div className="kpi-value">
                  {latestSimulation.kpis.efficiency.toFixed(2)}%
                </div>
              </div>

              <div className="kpi-card">
                <h3>Deliveries</h3>
                <div className="kpi-value">
                  {latestSimulation.kpis.onTimeDeliveries} /{" "}
                  {latestSimulation.kpis.totalDeliveries}
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

            {latestSimulation.perOrder &&
              latestSimulation.perOrder.length > 0 && (
                <div className="order-details-section">
                  <h3>Simulation Order Details</h3>
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
                      {latestSimulation.perOrder.slice(0, 5).map((order) => (
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
                  {latestSimulation.perOrder.length > 5 && (
                    <Link
                      to={`/simulation/${latestSimulation._id}`}
                      className="button view-all-button"
                    >
                      View All Orders
                    </Link>
                  )}
                </div>
              )}

            <Link to="/simulation" className="button run-new-button">
              Run New Simulation
            </Link>
          </div>
        ) : (
          <div className="no-simulation">
            <p>No simulations have been run yet.</p>
            <Link to="/simulation" className="button run-new-button">
              Run First Simulation
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
