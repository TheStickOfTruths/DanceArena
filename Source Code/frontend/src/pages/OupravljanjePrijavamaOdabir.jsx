import '../styles/o-upravljanje-prijavama-odabir.css';
import Navbar from '../components/navbar';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/apiService.jsx';
import { Link, useNavigate } from 'react-router-dom';

function OupravljanjePrijavamaOdabir(){

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    function handleOupravljanjePrijavama() {
        navigate('/organizator/upravljanje-prijavama');
    }

    return(
        <div className='page-container'>
            <Navbar currentUser={currentUser} />

            <div className='page-content-container'>
                <div className='headboard'>
                    <p>Upravljanje prijavama</p>
                </div>

                <div className='competition-list-container'>
                    <div className='competition-o'>
                        <p>Natjecanje</p>
                        <div className='btn-container'>
                            <button className='prijava-button' label="1" onClick={handleOupravljanjePrijavama}>Upravljaj prijavama</button>
                            <button className='prijava-button' label="2">Zaključaj prijave</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default OupravljanjePrijavamaOdabir