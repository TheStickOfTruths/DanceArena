import '../styles/login.css';
import { Link } from 'react-router-dom';

function Login() {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    return (
        <div className="login-container">
            <img src="/pictures/login pozadina.jpg" alt="Login Pozadina" className="login-pozadina" />
            <div className="login-form">
                <img src="/pictures/logo i tekst.png" alt="Dance Arena Logo With Title" className="login-logo-tekst" />
                <div className="form-container">
                    <p>Nice to see you again!</p>

                    <a href={apiBaseUrl + "/users/auth/login/google-oauth2/"} className="google-login-anchor">
                        <div className="google-login">
                            <img src="/pictures/Google logo.png" alt="Google Logo" className="google-logo" />
                            <p>Login with Google</p>
                        </div>
                    </a>

                    <p>Don't want to login? Head to the homepage to see the results from your favourite dancers!</p>
                    <Link to="/homepage" className="homepage-button">
                        <p>Homepage</p>
                    </Link>
                </div>
                <div className="credits">
                    <a href="https://github.com/TheStickOfTruths/DanceArena" target="_blank" rel="noopener noreferrer" className="github-anchor">
                        <div className="github-link">
                            <img src="/pictures/Github logo.png" alt="GitHub Logo" className="github-logo" />
                            <p>GitHub Repository</p>
                        </div>
                    </a>
                    <a href="https://www.fer.unizg.hr/" target="_blank" rel="noopener noreferrer" className="github-anchor">
                        <p>Made with love @ FER</p>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;