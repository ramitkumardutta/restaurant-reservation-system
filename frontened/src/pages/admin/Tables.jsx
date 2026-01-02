import { useEffect, useState } from "react";

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchTables = async () => {
    const res = await fetch("http://localhost:3000/api/table", {
      headers: { Authorization: `Bearer ${token}` },
    });
    let data;
    try {
      data = await res.json();
    } catch (err) {
      console.error('Failed to parse tables list response', err);
      setTables([]);
      return;
    }

    setTables(data);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const addTable = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/table", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tableNumber, capacity }),
    });

    let body = null;
    try {
      body = await res.json();
    } catch (err) {
      console.error('Failed to parse add table response', err);
    }

    if (!res.ok) {
      const msg = (body && body.message) || `Add table failed (${res.status})`;
      setMessage(msg);
      console.error('Add table failed', res.status, body);
      return;
    }

    setMessage(body?.message || 'Table added');
    setTableNumber("");
    setCapacity("");
    fetchTables();
  };

  return (
    <div className="admin-tables-page">
      <h2 className="admin-tables-title">Manage Tables</h2>

      <form onSubmit={addTable} className="admin-tables-form">
        <input
          placeholder="Table No"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="admin-tables-input"
          required
        />
        <input
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="admin-tables-input"
          required
        />
        <button className="admin-tables-add-btn">
          Add Table
        </button>
      </form>

      {tables.map((t) => (
        <div key={t._id} className="admin-tables-card">
          Table <strong>{t.tableNumber}</strong> — Capacity{" "}
          <strong>{t.capacity}</strong>
        </div>
      ))}

      {message && <p className="admin-tables-message">{message}</p>}
    </div>
  );
};

export default Tables;
