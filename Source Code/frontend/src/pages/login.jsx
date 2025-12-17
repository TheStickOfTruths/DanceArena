import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../services/apiService.jsx";

function Login() {
  const navigate = useNavigate();

  // Funkcija koja se pokreće kada korisnik klikne "Login with Google"
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Google success, šaljem token backendu...");
        // Šaljemo access_token (koji nam je Google dao) našem API-ju
        const data = await loginWithGoogle(tokenResponse.access_token);

        if (data) {
          console.log("Prijava uspješna!");
          navigate("/homepage"); // Preusmjeri na homepage nakon prijave
        }
      } catch (error) {
        console.error("Greška pri prijavi na backend:", error);
        alert("Prijava nije uspjela. Provjerite konzolu.");
      }
    },
    onError: (error) => console.log("Google Login Failed:", error),
  });

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

          {/* ZAMIJENJENO: Umjesto <a> koristimo gumb koji pokreće Google Popup */}
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
