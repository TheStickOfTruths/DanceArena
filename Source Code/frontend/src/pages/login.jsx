import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle, getCurrentUser } from "../services/apiService";

function Login() {
  const navigate = useNavigate();

  // Funkcija koja se pokreće kada korisnik klikne "Login with Google"
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      // 1. Šalješ token na backend (isto kao prije)
      await loginWithGoogle(credentialResponse.credential);

      // 2. KLJUČNA PROMJENA: Odmah pitaš backend "Tko je ovaj korisnik?"
      const user = await getCurrentUser();

      // 3. Logika odlučivanja (Traffic Cop)
      if (!user.role) {
        // Ako nema uloge -> Idi na registraciju
        navigate("/reg-odabir-uloga");
      } else {
        // Ako ima ulogu -> Idi na homepage
        navigate("/homepage");
      }

    } catch (error) {
      console.error("Greška:", error);
    }
  };

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

          <button
            onClick={() => handleGoogleLogin()}
            className="google-login-button"
            style={{
              border: "none",
              background: "none",
              padding: 0,
              cursor: "pointer",
              width: "100%",
            }}
          >
            <div className="google-login">
              <img
                src="/pictures/Google logo.png"
                alt="Google Logo"
                className="google-logo"
              />
              <p>Login with Google</p>
            </div>
          </button>

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
