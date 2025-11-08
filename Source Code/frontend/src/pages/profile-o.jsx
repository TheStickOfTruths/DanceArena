import '../styles/profile-o.css';
import Navbar from '../components/navbar';

function ProfileO({setPage}){

    return(
        <div className='profile-container'>
            <Navbar
                setPage={setPage} />

            <div className='profile-content-container'>
                <div className='headboard'>
                    <p>Profil (Organizator)</p>
                </div>
                <div className='profile-info'>
                    <div className='profile-info-main'>
                        <div className='pfp'>
                            <img src="./pictures/profile-icon.webp" alt="profile-picture"/>
                        </div>
                        <p id='ime'>Ime i prezime</p>
                    </div>

                    <div className='profile-info-general'>
                        <div className='profile-buttons'>
                            <button>Novo Natjecanje</button>
                            <button>Upravljaj prijavama</button>
                        </div>
                        <div className='profile-about'>
                            <div>
                                <p id='atribut'>Status članstva:</p>
                                <p id='value'>Aktivno</p>
                            </div>
                            <div>
                                <p id='atribut'>E-mail:</p>
                                <p id='value'>ime.prezime@gmail.com</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        
    );
}

export default ProfileO