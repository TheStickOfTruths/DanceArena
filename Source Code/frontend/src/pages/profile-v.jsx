import '../styles/profile-v.css';
import Navbar from '../components/navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/apiService.jsx';

function ProfileV(){

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


    function handleVprijavaNastupaOdabir() {
        navigate('/voditelj/prijava-nastupa-odabir');
    }

    function handleVpregledNatjecanja() {
        navigate('/voditelj/pregled-natjecanja');
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
                            <div className='headboard-v'>
                                <p>Profil (Voditelj)</p>
                            </div>
                            <div className='profile-info-v'>
                                <div className='profile-info-main'>
                                    <div className='pfp'>
                                        <img src="./pictures/profile-icon.webp" alt="profile-picture"/>
                                    </div>
                                    <p className='ime'>{`${currentUser.first_name} ${currentUser.last_name}`}</p>
                                </div>

                                <div className='profile-info-general'>
                                    <div className='profile-buttons'>
                                        <button className='prijavi-nastup' onClick={handleVprijavaNastupaOdabir}>Prijavi nastup</button>
                                        <button className='moja-natjecanja' onClick={handleVpregledNatjecanja}>Moja natjecanja</button>
                                    </div>
                                    <div className='profile-about'>
                                        <div>
                                            <p className='atribut'>Naziv kluba:</p>
                                            <p className='value'>Plesni Klub</p>
                                        </div>
                                        <div>
                                            <p className='atribut'>Lokacija:</p>
                                            <p className='value'>Zagreb</p>
                                        </div>
                                        <div>
                                            <p className='atribut'>E-mail:</p>
                                            <p className='value'>{currentUser.email}</p>
                                        </div>
                                        <div>
                                            <p className='atribut'>Kontakt:</p>
                                            <p className='value'>+123456789</p>
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

export default ProfileV