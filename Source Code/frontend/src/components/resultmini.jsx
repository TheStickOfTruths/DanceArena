import React from 'react';
import '../styles/resultmini.css';

function ResultMini({ result }) {
    const getRankBadge = (rank) => {
        switch (rank) {
            case 1: return <span className="badge bg-warning text-dark">1.</span>;
            case 2: return <span className="badge bg-secondary">2.</span>;
            case 3: return <span className="badge" style={{ backgroundColor: '#cd7f32' }}>3.</span>;
            default: return <span className="badge bg-light text-dark">{rank}.</span>;
        }
    };

    return (
        <div className="card mb-4 shadow-sm result-card">
            <div className="card-header result-card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{result.competition_name}</h5>
                <small>{new Date(result.competition_date).toLocaleDateString()}</small>
            </div>
            <div className="card-body">
                <p className="card-text result-location mb-4">
                    <i className="bi bi-geo-alt-fill"></i> {result.competition_location} - {result.competition_description}
                </p>

                {result.categories.map((cat, index) => (
                    <div key={index} className="mb-4">
                        <h6 className="result-category-title border-bottom pb-2">{cat.category}</h6>
                        <div className="table-responsive">
                            <table className="table table-hover table-sm">
                                <thead className="result-table-head">
                                    <tr>
                                        <th scope="col" style={{ width: '60px' }}>Mjesto</th>
                                        <th scope="col">Koreografija</th>
                                        <th scope="col">Klub / Voditelj</th>
                                        <th scope="col">Koreograf</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cat.results
                                        .sort((a, b) => a.rank - b.rank)
                                        .map((r, rIndex) => (
                                            <tr key={rIndex}>
                                                <td className="align-middle text-center">{getRankBadge(r.rank)}</td>
                                                <td className="align-middle fw-bold">{r.choreography}</td>
                                                <td className="align-middle">{r.club_manager}</td>
                                                <td className="align-middle small result-choreographer">{r.choreograph}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ResultMini;