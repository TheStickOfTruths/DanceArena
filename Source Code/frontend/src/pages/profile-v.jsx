import '../styles/profile-v.css';
import Navbar from '../components/navbar';

function ProfileV({setPage}){

    return(
        <div className='profile-container'>
            <Navbar
                setPage={setPage} />

            <div className='profile-content-container'>
                <div className='headboard-v'>
                    <p>Profil (Voditelj)</p>
                </div>
                <div className='profile-info-v'>
                    <div className='profile-info-main'>
                        <div className='pfp'>
                            <img src="./pictures/profile-icon.webp" alt="profile-picture"/>
                        </div>
                        <p className='ime'>Ime i prezime</p>
                    </div>

                    <div className='profile-info-general'>
                        <div className='profile-buttons'>
                            <button className='prijavi-nastup' onClick={() => setPage('VprijavaNastupaOdabir')}>Prijavi nastup</button>
                            <button className='moja-natjecanja' onClick={() => setPage('VpregledNatjecanja')}>Moja natjecanja</button>
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
                                <p className='value'>ime.prezime@gmail.com</p>
                            </div>
                            <div>
                                <p className='atribut'>Kontakt:</p>
                                <p className='value'>+123456789</p>
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>
        </div>
        
    );
}

export default ProfileV