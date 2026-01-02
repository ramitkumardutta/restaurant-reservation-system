import { useState } from "react";
import Toast from "../../components/toast";

const Reserve = () => {
  const [toastMsg, setToastMsg] = useState("");
  const [bookingType, setBookingType] = useState("normal");
  const [peopleCount, setPeopleCount] = useState(2);
  const [startTime, setStartTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/user/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingType, peopleCount, startTime }),
    });

    const data = await res.json();

    if (res.ok) {
      // show popup
      setToastMsg(data.message || "Reservation successful");
    } else {
      setToastMsg(data.message || "Reservation failed");
    }
  };

  return (
    <>
    <Toast message={toastMsg} onClose={() => setToastMsg("")} />
    <div className="reserve-page">
      <h2 className="reserve-title">Reserve a Table</h2>

      <form onSubmit={handleSubmit} className="reserve-form">
        <select
          value={bookingType}
          onChange={(e) => {
            setBookingType(e.target.value);
            if (e.target.value === "couple") setPeopleCount(2);
          }}
          className="reserve-select"
        >
          <option value="normal">Normal</option>
          <option value="couple">Couple</option>
          <option value="birthday">Birthday</option>
          <option value="celebration">Celebration</option>
        </select>

        {bookingType !== "couple" && (
          <input
            type="number"
            min="1"
            value={peopleCount}
            onChange={(e) => setPeopleCount(e.target.value)}
            className="reserve-input"
            placeholder="Number of people"
          />
        )}

        <input
          type="datetime-local"
          onChange={(e) => setStartTime(e.target.value)}
          className="reserve-input"
          required
        />

        <button className="reserve-button">
          Reserve
        </button>
      </form>

      {toastMsg && <p className="reserve-title">{toastMsg}</p>}
    </div>
    </>
  );
};

export default Reserve;
