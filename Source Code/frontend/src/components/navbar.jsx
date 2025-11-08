import '../styles/navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className="navbar">
            <Link to="/login" className="logo-text-container" >
                <img src="/pictures/logo.png" alt="Dance Arena Logo" className="navbar-logo" />
                <img src="/pictures/tekst.png" alt="Dance Arena Title" className="navbar-text" />
            </Link>
            <div className="nav-links">
                <p className="nav-link">Home</p>
                <p className="nav-link">About</p>
                <p className="nav-link">Contact</p>
            </div>
            <div className="account-section">
                <img src="/pictures/profile-icon.webp" alt="User Icon" className="user-icon" />
            </div>

        </div>
    )
};

export default Navbar;