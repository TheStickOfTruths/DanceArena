import '../styles/navbar.css';
import { useState } from 'react';
import { logoutUser } from '../services/apiService.jsx';
import { Link, useNavigate } from 'react-router-dom';

function DropdownItem({ icon, text, path, border = "yes", onClick }) {
    const itemContent = (
        <div className={`dropdown-item ${border}`}>
            <div>
                <i className={icon}></i>
            </div>
            <p>{text}</p>
        </div>
    );

    if (path) {
        return <Link to={path}>{itemContent}</Link>;
    }

    return <div onClick={onClick}>{itemContent}</div>;
}


function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            if (response) {
                navigate('/login');
            }
        } catch (error) {
            console.error("Greška pri odjavi:", error);
        }
    };

    return (
        <div className="navbar">
            <Link to="/homepage" className="logo-text-container" >
                <img src="/pictures/logo.png" alt="Dance Arena Logo" className="navbar-logo" />
                <img src="/pictures/tekst.png" alt="Dance Arena Title" className="navbar-text" />
            </Link>
            <div className="nav-links">
                <p className="nav-link">Home</p>
                <p className="nav-link">About</p>
                <p className="nav-link">Contact</p>
            </div>
            <div className="account-section">
                <img src="/pictures/profile-icon.webp" alt="User Icon" className="user-icon"
                    onClick={() => setIsOpen(!isOpen)} />

                {isOpen && <div className="dropdown-menu">
                    <DropdownItem icon="bi bi-x-circle" text="Close menu" onClick={() => setIsOpen(!isOpen)} />
                    <DropdownItem icon="bi bi-person-fill" text="Profile" path="/profile-o" />
                    <DropdownItem border="no" icon="bi bi-escape" text="LogOut" onClick={handleLogout} />
                </div>}
            </div>

        </div>
    )
};

export default Navbar;