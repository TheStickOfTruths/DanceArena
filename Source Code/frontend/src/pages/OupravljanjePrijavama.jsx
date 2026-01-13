import '../styles/o-upravljanje-prijavama.css';
import Navbar from '../components/navbar';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/apiService.jsx';

function OupravljanjePrijavama(){

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCurrentUser();

                if (response) {
                    setCurrentUser(response);
                }
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

    return(
        <div className='page-container'>
            <Navbar currentUser={currentUser} />

            <div className='page-content-container'>
                <div className='headboard'>
                    <p>Upravljanje prijavama</p>
                </div>

                <div className='competitors-list-container'>
                    <div className='competitors-o'>
                        <p>Ime koreografije</p>
                        <div className='btn-container'>
                            <button className='prijava-button' label="1">Prihvati</button>
                            <button className='prijava-button' label="2">Odbij</button>
                            <button className='prijava-button' label="3">Uredi</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default OupravljanjePrijavama