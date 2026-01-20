import "../styles/navbar.css";
import { useState } from "react";
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
    ? isDark ? "Light Theme" : "Dark Theme"
    : text;

  const itemContent = (
    <div className={`dropdown-item ${border}`} onClick={handleClick}>
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

	const [isDark, setIsDark] = useState(() =>
		localStorage.getItem("theme") === "dark"
	);

	useEffect(() => {
		const root = document.getElementById("root");
		root.classList.toggle("theme-dark", isDark);
		localStorage.setItem("theme", isDark ? "dark" : "light");
	}, [isDark]);

	const handleLogout = () => {
		logout();
		navigate('/homepage', { replace: true });
	};


	return (
		<div className="navbar">
			<Link to="/homepage" className="logo-text-container">
				<img
					src="/pictures/logo.png"
					alt="Dance Arena Logo"
					className="navbar-logo"
				/>
				<img
					src="/pictures/tekst.png"
					alt="Dance Arena Title"
					className="navbar-text"
				/>
			</Link>
			<div className="nav-links">
				<p className="nav-link">Home</p>
				<p className="nav-link">About</p>
				<p className="nav-link">Contact</p>
			</div>
			<div className="account-section">
				<img
					src="/pictures/profile-icon.webp"
					alt="User Icon"
					className="user-icon"
					onClick={() => setIsOpen(!isOpen)}
				/>

				{isOpen && currentUser && (
					<div className="dropdown-menu">
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
							border="no"
							icon="bi bi-escape"
							text="LogOut"
							onClick={handleLogout}
						/>
						<DropdownItem 
							themeToggle
							border="yes"
							isDark={isDark}
							setIsDark={setIsDark}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default Navbar;
