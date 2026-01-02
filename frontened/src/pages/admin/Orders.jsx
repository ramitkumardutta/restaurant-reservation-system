import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:3000/api/orders/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        let body = null;
        try {
          body = await res.json();
        } catch (err) {
          console.error('Failed to parse orders response', err);
          const text = await res.text();
          console.error('Response text:', text);
          return [];
        }

        const list = Array.isArray(body) ? body : body?.orders || [];
        setOrders(list);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="admin-orders-page">
      <h2 className="admin-orders-title">All Orders</h2>

      {orders.length === 0 && (
      <p className="admin-orders-empty">No orders found</p>
    )}

    {orders.map((order) => (
      <div key={order._id} className="admin-orders-card">
        <p>
          <strong>User:</strong> {order.userId?.email}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span className={`admin-order-status ${order.status}`}>
            {order.status}
          </span>
        </p>

        <ul className="admin-orders-items">
          {order.foodItems.map((item, idx) => (
            <li key={idx}>
              {item.foodName} × {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
  );
};

export default Orders;
