import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { setAuth } from "../../services/auth";
import { getUser } from "../../services/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/user/signup", {
        ...form,
        role: "customer",
      });

      setAuth(res.data.token, res.data.response);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  useEffect(() => {
    if (getUser()) navigate("/");
  }, [navigate]);

  return (
    <div className="signup-page">
      <form
        onSubmit={handleSubmit}
        className="signup-form"
      >
        <h2 className="signup-title">Sign Up</h2>

        {error && <p className="signup-error">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="signup-input"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          className="signup-input"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="signup-input"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="signup-input"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="signup-input"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="signup-button"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Signup;
