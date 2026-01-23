import "../styles/homepage.css";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar.jsx";
import CompetitionMini from "../components/competitionmini.jsx";
import { getCompetitions, getResults } from "../services/apiService.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import ResultMini from "../components/resultmini.jsx";

function Homepage() {
	const { user: currentUser } = useAuth();
	const [loading, setLoading] = useState(true);
	const [competitions, setCompetitions] = useState([]);
	const [results, setResults] = useState([]);
	const [view, setView] = useState("competitions");

	if (currentUser && currentUser.role === "ANONYMOUS") {
		return <Navigate to="/registracija" replace />;
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const competitionsData = await getCompetitions(["PUBLISHED", "CLOSED_APPLICATIONS", "ACTIVE"]);
				setCompetitions(competitionsData);
				const resultsData = await getResults();
				setResults(resultsData);
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
				<div className="switch-view btn-group" role="group" aria-label="Basic radio toggle button group">
					<input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" defaultChecked onChange={() => setView("competitions")} />
					<label className="btn btn-outline-primary" htmlFor="btnradio1">Natjecanja</label>

					<input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" onChange={() => setView("results")} />
					<label className="btn btn-outline-primary" htmlFor="btnradio2">Rezultati</label>
				</div>

				{view === "competitions" && (
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
					</div>)}

				{view === "results" && (
					<div className="results-container">
						{results.length > 0 ? (
							results.map((result, index) => (
								<ResultMini
									key={`${result.competition_id}-${index}`}
									result={result}
								/>
							))
						) : (
							<p>Trenutno nema objavljenih rezultata.</p>
						)}
					</div>)}
			</div>
		</div>
	);
}

export default Homepage;
