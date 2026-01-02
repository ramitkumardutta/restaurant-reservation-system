import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../../services/auth";
import { fetchMenu } from "../../services/api";

const Landing = () => {
  const user = getUser();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetchMenu()
      .then((data) => setMenu(data))
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2">Welcome to Our Restaurant</h1>
      <p className="text-gray-600 mb-6">
        Book tables, order food, and manage reservations easily.
      </p>

      {/* AUTH / ACTION BUTTONS */}
      {!user ? (
        <div className="flex gap-3 mb-8">
          <Link to="/login">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button className="px-4 py-2 bg-green-600 text-white rounded">
              Signup
            </button>
          </Link>

          <Link to="/menu">
            <button className="px-4 py-2 bg-gray-800 text-white rounded">
              View Full Menu
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex gap-3 mb-8">
          {user.role === "customer" && (
            <>
              <Link to="/reserve">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  Reserve Table
                </button>
              </Link>

              <Link to="/orders">
                <button className="px-4 py-2 bg-purple-600 text-white rounded">
                  My Orders
                </button>
              </Link>

              <Link to="/history">
                <button className="px-4 py-2 bg-gray-700 text-white rounded">
                  Reservation History
                </button>
              </Link>
            </>
          )}

          {(user.role === "admin" ||
            user.role === "manager" ||
            user.role === "staff") && (
            <Link to="/admin">
              <button className="px-4 py-2 bg-red-600 text-white rounded">
                Dashboard
              </button>
            </Link>
          )}
        </div>
      )}

      {/* MENU SECTION */}
      <h2 className="text-2xl font-semibold mb-4">Today’s Menu</h2>

      {menu.length === 0 ? (
        <p className="text-gray-500">No menu available today.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {menu.map((item) => (
            <div
              key={item._id}
              className="border rounded p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Landing;
