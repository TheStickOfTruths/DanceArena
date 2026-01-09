import '../styles/v-pregled-natjecanja.css';
import Navbar from '../components/navbar';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/apiService.jsx';

function VpregledNatjecanja(){

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
                <div className='headboard-v'>
                    <p>Moja natjecanja</p>
                </div>

                <div className='competition-list-container'>
                    
                </div>
            </div>
        </div>
        
    );
}

export default VpregledNatjecanja