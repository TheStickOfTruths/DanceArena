import "../styles/homepage.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar.jsx";
import CompetitionMini from "../components/competitionmini.jsx";
import { getCompetitions } from "../services/apiService.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Homepage() {
	const { user: currentUser } = useAuth();
	const [loading, setLoading] = useState(true);
	const [competitions, setCompetitions] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const competitionsData = await getCompetitions(["PUBLISHED", "CLOSED_APPLICATIONS"]);
				setCompetitions(competitionsData);
			} catch (error) {
				console.error("Greška u homepage.jsx:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

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
							Dobrodošao {currentUser.first_name}!
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
