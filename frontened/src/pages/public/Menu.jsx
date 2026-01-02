import { useEffect, useState } from "react";
import Toast from "../../components/toast";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [toastMsg, setToastMsg] = useState("");

  // FETCH MENU
  useEffect(() => {
    fetch("http://localhost:3000/api/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch((err) => console.error("Menu fetch failed", err));
  }, []);

  // ORDER ITEM
  const orderItem = async (menuItemId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setToastMsg("Please login to order");
      return;
    }

    const res = await fetch("http://localhost:3000/api/orders/ordermenu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: [{ menuItemId, quantity: 1 }],
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setToastMsg("Order placed successfully!");
    } else {
      setToastMsg(data.message || "Order failed");
    }
  };

  return (
    <>
      <Toast message={toastMsg} onClose={() => setToastMsg("")} />

      <div className="menu-page">
        <h1 className="menu-title">Welcome to Our Restaurant</h1>
        <h2 className="menu-subtitle">Menu</h2>

        {menu.length === 0 && <p className="menu-empty">No menu available</p>}

        <div className="menu-grid">
          {menu.map((item) => (
            <div
              key={item._id}
              className="menu-card"
            >
              <h3 className="menu-card-title">{item.name}</h3>
              <p className="menu-card-price">₹{item.price}</p>

              <p className="menu-card-status">
                {item.availableForDelivery
                  ? "Available for delivery"
                  : "Not available for delivery"}
              </p>

              {/* ORDER BUTTON */}
              {item.availableForDelivery && (
                <button
                  onClick={() => orderItem(item._id)}
                  className="menu-order-btn"
                >
                  Order
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Menu;
