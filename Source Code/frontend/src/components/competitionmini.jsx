import '../styles/competitionmini.css';

function CompetitionMini({ competition }) {
    return (
        <div className="competition-mini-container" >
            <h3>{competition.name}</h3>
            <p>{competition.date}</p>
            <p>{competition.location}</p>
        </div >
    );
};

export default CompetitionMini;