import "../styles/navbar.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function DropdownItem({
	icon,
	text,
	path,
	border = "yes",
	onClick,
	themeToggle = false,
	isDark,
	setIsDark
}) {
	const handleClick = () => {
		if (themeToggle) {
			setIsDark(prev => !prev);
		}
		if (onClick) onClick();
	};

	const displayedIcon = themeToggle
		? isDark ? "bi bi-sun" : "bi bi-moon"
		: icon;

	const displayedText = themeToggle
		? isDark ? "Normal" : "High Contrast"
		: text;

	const itemContent = (
		<div className={`da-dropdown-item ${border}`} onClick={handleClick}>
			<div>
				<i className={displayedIcon}></i>
			</div>
			<p>{displayedText}</p>
		</div>
	);

	return path ? <Link to={path}>{itemContent}</Link> : itemContent;
}

function Navbar({ currentUser }) {
	const [isOpen, setIsOpen] = useState(false);
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	// Mijenjanje teme

	const [isDark, setIsDark] = useState(() =>
		localStorage.getItem("theme") === "dark"
	);

	useEffect(() => {
		const root = document.getElementById("root");
		root.classList.toggle("theme-dark", isDark);
		localStorage.setItem("theme", isDark ? "dark" : "light");
	}, [isDark]);

	// Logout funkcija
	const handleLogout = () => {
		logout();
		navigate('/homepage', { replace: true });
	};

	// dinamičko prikazivanje gumbova na osnovi uloge
	const roleButtons = {
		ORGANIZER: [
			{ text: "Novo natjecanje", path: "/organizator/novo-natjecanje" },
			{ text: "Moja natjecanja", path: "/organizator/moja-natjecanja" },
		],
		JUDGE: [
			{ text: "Ocijeni nastupe", path: "/sudac/odabir-natjecanja" },
		],
		CLUB_MANAGER: [
			{ text: "Prijavi Nastup", path: "/voditelj/prijava-nastupa-odabir" },
			{ text: "Otvorene prijave", path: "/voditelj/pregled-natjecanja" },
		],
		NULL: []
	};

	const userRoleButtons = currentUser?.role ? roleButtons[currentUser.role] || [] : [];
	


	return (
		<div className="da-navbar">
			<Link to="/homepage" className="logo-text-container">
				<img
					src="/pictures/logo.png"
					alt="Dance Arena Logo"
					className="navbar-logo"
				/>
				<img
					src="/pictures/tekst.png"
					alt="Dance Arena Title"
					className="da-navbar-text"
				/>
			</Link>
			<div className="navbar-buttons">
				{currentUser ? (
					userRoleButtons.map((btn, idx) => (
					<Link key={idx} to={btn.path} className="navbar-btn">
						{btn.text}
					</Link>
				))
				) : (<></>)}
				
			</div>
			<div className="account-info-container">
				<div className="account-name">
				{currentUser ? (
					<>
						<p>
							{currentUser.first_name}
						</p>
					</>
				) : (
					<>
						<Link to="/login">Prijavi se</Link>
					</>)}
			</div>
			<div className="account-section">
				<img
					src="/pictures/profile-icon.webp"
					alt="User Icon"
					className="user-icon"
					onClick={() => setIsOpen(!isOpen)}
				/>

				{isOpen && currentUser && (
					<div className="da-dropdown-menu">
						<DropdownItem
							icon="bi bi-x-circle"
							text="Close menu"
							onClick={() => setIsOpen(!isOpen)}
						/>
						<DropdownItem
							icon="bi bi-person-fill"
							text="Profile"
							path="/profile"
						/>
						<DropdownItem
							themeToggle
							border="yes"
							isDark={isDark}
							setIsDark={setIsDark}
						/>
						<DropdownItem
							border="no"
							icon="bi bi-escape"
							text="LogOut"
							onClick={handleLogout}
						/>

					</div>
				)}
			</div>
			</div>
			
		</div>
	);
}

export default Navbar;