import '../styles/profile-v.css';
import Navbar from '../components/navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProfileV() {
    const { user: currentUser, loading } = useAuth();
    const navigate = useNavigate();

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

    return (
        <div className='profile-container'>
            <Navbar currentUser={currentUser} />

            <div className='profile-content-container'>
                <div className='headboard-v'>
                    <div
                        className="back-button"
                        role="button"
                        tabIndex={0}
                        aria-label="Return to previous page"
                        onClick={() => navigate('/homepage')}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </div>
                    <p>Profil (Voditelj)</p>
                </div>
                <div className='profile-info-v'>
                    <div className='profile-info-main'>
                        <div className='pfp'>
                            <img src="./pictures/profile-icon.webp" alt="profile-picture" />
                        </div>
                        <p className='ime'>{`${currentUser.first_name} ${currentUser.last_name}`}</p>
                    </div>

                    <div className='profile-info-general'>
                        <div className='profile-buttons'>
                            <button className='prijavi-nastup' onClick={handleVprijavaNastupaOdabir}>Prijavi nastup</button>
                            <button className='moja-natjecanja' onClick={handleVpregledNatjecanja}>Otvorene prijave</button>
                        </div>
                        <div className='profile-about'>
                            <div>
                                <p className='atribut'>Naziv kluba:</p>
                                <p className='value'>{currentUser.club_name}</p>
                            </div>
                            <div>
                                <p className='atribut'>Lokacija:</p>
                                <p className='value'>{currentUser.club_location}</p>
                            </div>
                            <div>
                                <p className='atribut'>E-mail:</p>
                                <p className='value'>{currentUser.email}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
}

export default ProfileV