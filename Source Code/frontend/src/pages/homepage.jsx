import "../styles/homepage.css";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import { useEffect, useState } from "react";
import Navbar from "../components/navbar.jsx";
import CompetitionMini from "../components/competitionmini.jsx";
// Import your new service function
import {
  getCurrentUser,
  getLiveCompetitions,
  exchangeCodeForToken,
} from "../services/apiService.jsx";

function Homepage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState([]);

  const location = useLocation(); // Hook to access URL details
  const navigate = useNavigate(); // Hook to change URL

  useEffect(() => {
    const handleAuthAndFetchData = async () => {
      const code = new URLSearchParams(location.search).get("code");
      console.log("handleauthandfetch code?" + code);

      if (code) {
        console.log("handleauthandfetch postoji code");
        try {
          const tokenData = await exchangeCodeForToken(code);

          localStorage.setItem("accessToken", tokenData.access_token);
          localStorage.setItem("refreshToken", tokenData.refresh_token);

          navigate("/homepage", { replace: true });
        } catch (error) {
          console.error("Greška pri razmjeni koda za token:", error);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/", { replace: true });
          setLoading(false);
          return;
        }
      }

      try {
        const userData = await getCurrentUser();
        if (userData) {
          setCurrentUser(userData);
        }
        const competitionsData = await getLiveCompetitions();
        setCompetitions(competitionsData);
      } catch (error) {
        console.error("Greška u homepage.jsx fetchData:", error);
      } finally {
        setLoading(false);
      }
    };

    handleAuthAndFetchData();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="homepage-container">
        <Navbar currentUser={currentUser} />
        <div className="homepage-content-container">
          <p>Učitavanje podataka...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <Navbar currentUser={currentUser} />
      <div className="homepage-content-container">
        {currentUser ? (
          <>
            <p>Uspješno ulogirani!</p>
            <p>
              Dobrodošao {currentUser.first_name} ({currentUser.email})!
            </p>

            <div className="competitions-container">
              {competitions.length > 0 ? (
                competitions.map((competition) => (
                  <CompetitionMini
                    key={competition.id}
                    competition={competition}
                  />
                ))
              ) : (
                <p>Nema natjecanja</p>
              )}
            </div>
          </>
        ) : (
          <>
            <p>Niste prijavljeni.</p>
            <Link to="/login">Idi na prijavu</Link>
            <div className="competitions-container">
              {competitions.length > 0 ? (
                competitions.map((competition) => (
                  <CompetitionMini
                    key={competition.id}
                    competition={competition}
                  />
                ))
              ) : (
                <p>Nema natjecanja</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Homepage;
