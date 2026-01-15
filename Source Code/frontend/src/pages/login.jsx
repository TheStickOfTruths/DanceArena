import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle, getCurrentUser } from "../services/apiService";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
	const navigate = useNavigate();
	const { refreshUser } = useAuth();

	const login = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				console.log("Google response:", tokenResponse);

				await loginWithGoogle(tokenResponse.access_token);

				await refreshUser();

				const user = await getCurrentUser();

				if (user.role === "ANONYMOUS") {
					navigate("/registracija");
				} else {
					navigate("/homepage");
				}
			} catch (error) {
				console.error("Greška pri loginu:", error);
			}
		},
		onError: (error) => console.log("Login Failed:", error),
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

					<button
						onClick={() => login()}
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