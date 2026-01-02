import { useEffect, useState } from "react";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:3000/api/reservation/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // backend returns { count, reservations }
        const list = Array.isArray(data) ? data : data?.reservations || [];
        setHistory(list);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="history-page">
      <h2 className="history-title">Reservation History</h2>

      {history.length === 0 && <p className="history-empty">No reservations found</p>}

      {history.map((r) => (
        <div key={r._id} className="history-card">
          <p><strong>Table:</strong> {r.tableId?.tableNumber}</p>
          <p><strong>People:</strong> {r.peopleCount}</p>
          <p>
            <strong>Time:</strong> {new Date(r.startTime).toLocaleString()} –{" "}
            {new Date(r.endTime).toLocaleString()}
          </p>
          <p><strong>Type:</strong> {r.bookingType}</p>
        </div>
      ))}
    </div>
  );
};

export default History;
