import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/orders/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // backend returns { count, orders }
        const list = Array.isArray(data) ? data : data?.orders || [];
        setOrders(list);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="orders-page">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 && <p className="orders-empty">No orders yet</p>}

      {orders.map((order) => (
        <div key={order._id} className="orders-card">
          <p><strong>Status:</strong>{" "}<span className={`order-status ${order.status}`}>{order.status}</span></p>
          <p><strong>Ordered at:</strong>{" "} {new Date(order.createdAt).toLocaleString()}</p>

          <ul className="orders-items">
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
