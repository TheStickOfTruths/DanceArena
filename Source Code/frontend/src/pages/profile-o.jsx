import '../styles/profile-o.css';
import Navbar from '../components/navbar';

function ProfileO() {

    return (
        <div className='profile-container'>
            <Navbar />

            <div className='profile-content-container'>
                <div className='headboard'>
                    <p>Profil (Organizator)</p>
                </div>
                <div className='profile-info'>
                    <div className='profile-info-main'>
                        <div className='pfp'>
                            <img src="./pictures/profile-icon.webp" alt="profile-picture" />
                        </div>
                        <p className='ime'>Ime i prezime</p>
                    </div>

                    <div className='profile-info-general'>
                        <div className='profile-buttons'>
                            <button className='novo-natjecanje'>Novo Natjecanje</button>
                            <button className='upr-prijavama'>Upravljaj prijavama</button>
                        </div>
                        <div className='profile-about'>
                            <div>
                                <p className='atribut'>Status članstva:</p>
                                <p className='value'>Aktivno</p>
                            </div>
                            <div>
                                <p className='atribut'>E-mail:</p>
                                <p className='value'>ime.prezime@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ProfileO