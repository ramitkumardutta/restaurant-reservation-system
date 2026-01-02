import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, setAuth } from "../../services/auth";
import { getUser } from "../../services/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (getUser()) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser({ email, password });

    if (res.token) {
      setAuth(res.token, res.user);
      navigate("/");
    } else {
      alert(res.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button>Login</button>
    </form>
  );
};

export default Login;
