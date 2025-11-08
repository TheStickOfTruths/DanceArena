import '../styles/login.css';

function Login({ setPage }) {
    return (
        <div className="login-container">
            <img src="/pictures/login pozadina.jpg" alt="Login Pozadina" className="login-pozadina" />
            <div className="login-form">
                <img src="/pictures/logo i tekst.png" alt="Dance Arena Logo With Title" className="login-logo-tekst" />
                <div className="form-container">
                    <p>Nice to see you again!</p>
                    <div className="google-login" onClick={() => setPage('profileO')}>
                        <img src="/pictures/Google logo.png" alt="Google Logo" className="google-logo" />
                        <p>Login with Google</p>
                    </div>
                    <p>Don't want to login? Head to the homepage to see the results from your favourite dancers!</p>
                    <div className="homepage-button" onClick={() => setPage('homepage')}>
                        <p>Homepage</p>
                    </div>
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