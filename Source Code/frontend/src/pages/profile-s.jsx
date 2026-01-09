import '../styles/profile-s.css';
import Navbar from '../components/navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/apiService.jsx';

function ProfileS(){

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


    function handleSodabirNatjecanja() {
        navigate('/sudac/odabir-natjecanja');
    }

    return(
        <div className='profile-container'>
             <Navbar currentUser={currentUser} />

            <div className='profile-content-container'>


                {!currentUser ?
                    (
                        <div className="not-logged-in">
                            <p>Niste prijavljeni.</p>
                            <Link to="/login">Idi na prijavu</Link>
                        </div>
                    )
                    :
                    (
                        <>
                            <div className='headboard-s'>
                                <p>Profil (Sudac)</p>
                            </div>
                            <div className='profile-info-s'>
                                <div className='profile-info-main'>
                                    <div className='pfp'>
                                        <img src="./pictures/profile-icon.webp" alt="profile-picture"/>
                                    </div>
                                    <p className='ime'>{`${currentUser.first_name} ${currentUser.last_name}`}</p>
                                </div>

                                <div className='profile-info-general'>
                                    <div className='profile-buttons'>
                                        <button className='prijavi-nastup' onClick={handleSodabirNatjecanja}>Ocijeni nastupe</button>
                                        
                                    </div>
                                    <div className='profile-about'>
                                        <div>
                                            <p className='atribut'>E-mail:</p>
                                            <p className='value'>{currentUser.email}</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                
            </div>
        </div>
        
    );
}

export default ProfileS