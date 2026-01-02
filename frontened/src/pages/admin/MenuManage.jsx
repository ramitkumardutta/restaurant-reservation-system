import { useEffect, useState } from "react";

const MenuManage = () => {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const token = localStorage.getItem("token");

  const fetchMenu = async () => {
    const res = await fetch("http://localhost:3000/api/menu");
    const data = await res.json();
    setMenu(data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addMenu = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, price }),
    });

    let respBody;
    try {
      respBody = await res.json();
    } catch (err) {
      console.error('Failed to parse response JSON', err);
    }

    if (!res.ok) {
      console.error('Add menu failed', res.status, respBody);
      // bail out so developer can inspect console
      return;
    }

    setName("");
    setPrice("");
    fetchMenu();
  };

  const deleteMenu = async (id) => {
    await fetch(`http://localhost:3000/api/menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchMenu();
  };

  return (
    <div className="menu-manage-page">
      <h2 className="menu-manage-title">Manage Menu</h2>

      <form onSubmit={addMenu} className="menu-manage-form">
        <input
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="menu-manage-input"
          required
        />
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="menu-manage-input"
          required
        />
        <button className="menu-manage-add-btn">
          Add Item
        </button>
      </form>

      {menu.map((item) => (
        <div key={item._id} className="menu-manage-card">
          <span className="menu-manage-item">
            {item.name} — ₹{item.price}
          </span>
          <button
            onClick={() => deleteMenu(item._id)}
            className="menu-manage-delete-btn"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default MenuManage;
