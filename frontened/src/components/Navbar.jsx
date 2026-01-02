import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser, logout as doLogout } from "../services/auth";

const Navbar = () => {
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const updateUser = () => setUser(getUser());

		// initial
		updateUser();

		// update within the same tab when auth changes
		window.addEventListener("authChanged", updateUser);
		// update across tabs/windows
		window.addEventListener("storage", updateUser);

		return () => {
			window.removeEventListener("authChanged", updateUser);
			window.removeEventListener("storage", updateUser);
		};
	}, []);

	const handleLogout = () => {
		doLogout();
		setUser(null);
		navigate('/');
	};

	return (
		<nav className="p-4 bg-yellow-100">
			<button><Link to="/" className="mr-4">Home</Link></button>
			<button><Link to="/menu" className="mr-4">Menu</Link></button>

			{!user ? (
				<>
					<button><Link to="/login" className="mr-4">Login</Link></button>
					<button><Link to="/signup">Sign up</Link></button>
				</>
			) : (
				<>
				<button onClick={handleLogout} className="mr-4"> </button>
				<button onClick={handleLogout} className="mr-4">Log out</button>
				</>
			)}
		</nav>
	);
};

export default Navbar;

