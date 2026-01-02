import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>

      <ul className="admin-dashboard-list">
        <li>
          <Link to="/admin/reservations" className="admin-dashboard-card">
            📅 View Reservations
          </Link>
        </li>
        <li>
          <Link to="/admin/menu" className="admin-dashboard-card">
            🍽️ Manage Menu
          </Link>
        </li>
        <li>
          <Link to="/admin/tables" className="admin-dashboard-card">
            🪑 Table Availability
          </Link>
        </li>
        <li>
          <Link to="/admin/orders" className="admin-dashboard-card">
            📦 Food Orders
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
