import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import Drivers from "./pages/Drivers";
import Routes from "./pages/Routes";
import Orders from "./pages/Orders";
import SimulationDetails from "./pages/SimulationDetails";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <RouterRoutes>
              <Route path="/login" element={<Login />} />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/simulation"
                element={
                  <PrivateRoute>
                    <Simulation />
                  </PrivateRoute>
                }
              />

              <Route
                path="/simulation/:id"
                element={
                  <PrivateRoute>
                    <SimulationDetails />
                  </PrivateRoute>
                }
              />

              <Route
                path="/drivers"
                element={
                  <PrivateRoute>
                    <Drivers />
                  </PrivateRoute>
                }
              />

              <Route
                path="/routes"
                element={
                  <PrivateRoute>
                    <Routes />
                  </PrivateRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </RouterRoutes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
