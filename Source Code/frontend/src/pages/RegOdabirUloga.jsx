import '../styles/reg-odabir-uloga.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser, createNewUser } from '../services/apiService';

function RegOdabirUloga() {
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        uloga: '',
        ime: '',
        klub: '',
        mjesto: '',
        telefon: ''
    });

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const user = await getCurrentUser();
                if (user?.role && user.role !== "ANONYMOUS") {
                    navigate("/homepage");
                }
            } catch (error) {
                console.error("Greška pri provjeri korisnika:", error);
            }
        };
        checkUserStatus();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let backendRole = '';
            switch (newUser.uloga) {
                case 'organizator':
                    backendRole = 'ORGANIZER';
                    break;
                case 'voditelj':
                    backendRole = 'CLUB_MANAGER';
                    break;
                case 'sudac':
                    backendRole = 'JUDGE';
                    break;
                default:
                    backendRole = 'VISITOR';
            }

            const nameParts = newUser.ime.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '';

            const userData = {
                role: backendRole,
                name: firstName,
                surname: lastName,
                contact: newUser.telefon,
                club_name: newUser.klub,
                club_location: newUser.mjesto
            };

            console.log("Šaljem podatke na backend:", userData);

            const response = await createNewUser(userData);

            if (response) {
                console.log("Registracija uspješna:", response);
                navigate('/homepage');
            }

        } catch (error) {
            console.error("Greška tijekom registracije:", error);
        }
    };


    const handleRoleSelect = (role) => {
        setNewUser((prevState) => ({
            ...prevState,
            uloga: role
        }));
    };

    const isVoditelj = newUser.uloga === 'voditelj';
    const isAnyRoleSelected = !!newUser.uloga;

    return (
        <div className="role-selection-container">
            <div className="role-selection-content-container">
                <p>Dobrodošli!</p>
                <p>Odaberite svoju ulogu:</p>
                <div className='role-container'>
                    <div
                        className={`role-card-o ${newUser.uloga === 'organizator' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelect('organizator')}
                    >
                        Organizator
                    </div>
                    <div
                        className={`role-card-v ${newUser.uloga === 'voditelj' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelect('voditelj')}
                    >
                        Voditelj
                    </div>
                    <div
                        className={`role-card-s ${newUser.uloga === 'sudac' ? 'selected' : ''}`}
                        onClick={() => handleRoleSelect('sudac')}
                    >
                        Sudac
                    </div>
                </div>

                <form className='registration-form' onSubmit={handleSubmit}>
                    {isAnyRoleSelected && (
                        <div className='ime'>
                            <label htmlFor='ime'>Ime i prezime: </label>
                            <input
                                type='text'
                                id='ime'
                                name='ime'
                                placeholder='Unesite vaše ime i prezime'
                                value={newUser.ime}
                                onChange={handleChange}
                                required={isAnyRoleSelected}
                            />
                        </div>
                    )}
                    {isVoditelj && (
                        <>
                            <div className='ime-klub'>
                                <label htmlFor='ime-klub'>Naziv plesnog kluba: </label>
                                <input
                                    type='text'
                                    id='ime-klub'
                                    name='klub'
                                    placeholder='Unesite naziv plesnog kluba'
                                    value={newUser.klub}
                                    onChange={handleChange}
                                    required={isVoditelj}
                                />
                            </div>
                            <div className='mjesto-klub'>
                                <label htmlFor='mjesto-kluba'>Mjesto djelovanja kluba </label>
                                <input
                                    type='text'
                                    id='mjesto-kluba'
                                    name='mjesto'
                                    placeholder='Unesite mjesto djelovanja kluba'
                                    value={newUser.mjesto}
                                    onChange={handleChange}
                                    required={isVoditelj}
                                />
                            </div>
                            <div className='telefon'>
                                <label htmlFor='telefon'>Broj telefona: </label>
                                <input
                                    type='text'
                                    id='telefon'
                                    name='telefon'
                                    placeholder='Unesite broj telefona'
                                    value={newUser.telefon}
                                    onChange={handleChange}
                                    required={isVoditelj}
                                />
                            </div>
                        </>
                    )}

                    {isAnyRoleSelected && (
                        <input
                            type='submit'
                            className='submit-btn'
                            value='Registriraj se'
                        />
                    )}

                </form>
            </div>
        </div>
    )
};

export default RegOdabirUloga;