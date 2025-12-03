import "../styles/login.css";
import { Link } from "react-router-dom";

function Login() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${GOOGLE_REDIRECT_URI}
    &prompt=consent&response_type=code&client_id=${GOOGLE_CLIENT_ID}&scope=openid%20email%20profile`;
  console.log("Full Login URL:", googleLoginUrl);
  return (
    <div className="login-container">
      <img
        src="/pictures/login pozadina.jpg"
        alt="Login Pozadina"
        className="login-pozadina"
      />
      <div className="login-form">
        <img
          src="/pictures/logo i tekst.png"
          alt="Dance Arena Logo With Title"
          className="login-logo-tekst"
        />
        <div className="form-container">
          <p>Nice to see you again!</p>

          <a href={googleLoginUrl} className="google-login-anchor">
            <div className="google-login">
              <img
                src="/pictures/Google logo.png"
                alt="Google Logo"
                className="google-logo"
              />
              <p>Login with Google</p>
            </div>
          </a>

          <p>
            Don't want to login? Head to the homepage to see the results from
            your favourite dancers!
          </p>
          <Link to="/homepage" className="homepage-button">
            <p>Homepage</p>
          </Link>
        </div>
        <div className="credits">
          <a
            href="https://github.com/TheStickOfTruths/DanceArena"
            target="_blank"
            rel="noopener noreferrer"
            className="github-anchor"
          >
            <div className="github-link">
              <img
                src="/pictures/Github logo.png"
                alt="GitHub Logo"
                className="github-logo"
              />
              <p>GitHub Repository</p>
            </div>
          </a>
          <a
            href="https://www.fer.unizg.hr/"
            target="_blank"
            rel="noopener noreferrer"
            className="github-anchor"
          >
            <p>Made with love @ FER</p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
