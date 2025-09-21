import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSimulationById } from "../api";

export default function SimulationDetails() {
  const { id } = useParams();
  const [simulation, setSimulation] = useState(null);

  useEffect(() => {
    const fetchSimulation = async () => {
      try {
        const res = await getSimulationById(id);
        setSimulation(res.data);
      } catch (err) {
        console.error("Error loading simulation details", err);
      }
    };
    fetchSimulation();
  }, [id]);

  if (!simulation) return <div>Loading simulation details...</div>;

  return (
    <div className="simulation-details-page">
      <h1>Simulation Details</h1>
      <p>Run on: {new Date(simulation.createdAt).toLocaleString()}</p>

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
          {simulation.perOrder.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.valueRs}</td>
              <td>{order.assignedDriver}</td>
              <td className={order.onTime ? "status-on-time" : "status-late"}>
                {order.onTime ? "On Time" : "Late"}
              </td>
              <td>{order.profit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/dashboard" className="view-all-button">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
