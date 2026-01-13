import '../styles/reg-odabir-uloga.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function RegOdabirUloga() {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        uloga: '',
        ime: '',
        klub: '',
        mjesto: '',
        telefon: ''
    });

    if (loading) {
        return (
            <div className="homepage-container">
                <div className="homepage-content-container">
                    <p>Učitavanje podataka...</p>
                </div>
            </div>
        );
    }

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
            const userData = {
                uloga: newUser.uloga,
                ime: newUser.ime,
                klub: newUser.klub,
                mjesto: newUser.mjesto,
                telefon: newUser.telefon
            };

            // ime 'createNewUser' treba zamijeniti stvarnom funkcijom za registraciju korisnika

            // const response = await createNewUser(userData);
            //             if (response) {
            //                 console.log("Registracija uspješna:", response);
            //                 navigate('/homepage');
            //             }

        } catch (error) {
            console.error("Greška tijekom registracije:", error);
        }
    };


    function oForm(){
        var roleO = document.querySelector('.role-card-o');
        var roleV = document.querySelector('.role-card-v');
        var roleS = document.querySelector('.role-card-s');
        var ime = document.querySelector('.ime');
        var imeKlub = document.querySelector('.ime-klub');
        var mjestoKlub = document.querySelector('.mjesto-klub');
        var telefon = document.querySelector('.telefon');
        var submitBtn = document.querySelector('.submit-btn');
        submitBtn.style.display = 'block';

        roleO.classList.add('selected');
        roleS.classList.remove('selected');
        roleV.classList.remove('selected');

        ime.style.display = 'block';
        imeKlub.style.display = 'none';
        mjestoKlub.style.display = 'none';
        telefon.style.display = 'none';

        newUser.uloga = 'organizator';
    }

    function vForm(){
        var roleO = document.querySelector('.role-card-o');
        var roleV = document.querySelector('.role-card-v');
        var roleS = document.querySelector('.role-card-s');
        var ime = document.querySelector('.ime');
        var imeKlub = document.querySelector('.ime-klub');
        var mjestoKlub = document.querySelector('.mjesto-klub');
        var telefon = document.querySelector('.telefon');
        var submitBtn = document.querySelector('.submit-btn');
        submitBtn.style.display = 'block';

        roleV.classList.add('selected');
        roleS.classList.remove('selected');
        roleO.classList.remove('selected');

        ime.style.display = 'block';
        imeKlub.style.display = 'block';
        mjestoKlub.style.display = 'block';
        telefon.style.display = 'block';

        newUser.uloga = 'voditelj';

    }

    function sForm(){
        var roleO = document.querySelector('.role-card-o');
        var roleV = document.querySelector('.role-card-v');
        var roleS = document.querySelector('.role-card-s');
        var ime = document.querySelector('.ime');
        var imeKlub = document.querySelector('.ime-klub');
        var mjestoKlub = document.querySelector('.mjesto-klub');
        var telefon = document.querySelector('.telefon');
        var submitBtn = document.querySelector('.submit-btn');
        submitBtn.style.display = 'block';

        roleS.classList.add('selected');
        roleO.classList.remove('selected');
        roleV.classList.remove('selected');

        ime.style.display = 'block';
        imeKlub.style.display = 'none';
        mjestoKlub.style.display = 'none';
        telefon.style.display = 'none';

        newUser.uloga = 'sudac';
    }

    return (
        <div className="role-selection-container">
            <div className="role-selection-content-container">
                <p>Dobrodošli!</p>
                <p>Odaberite svoju ulogu:</p>
                <div className='role-container'>
                    <div className='role-card-o' onClick={oForm}>Organizator</div>
                    <div className='role-card-v' onClick={vForm}>Voditelj</div>
                    <div className='role-card-s' onClick={sForm}>Sudac</div>
                </div>

                <form className='registration-form' onSubmit={handleSubmit}>
                    <div className='ime'>
                        <label htmlFor='ime'>Ime i prezime: </label>
                        <input 
                            type='text' 
                            id='ime' 
                            placeholder='Unesite vaše ime i prezime'
                            value={newUser.ime}
                            onChange={handleChange}
                            required   
                        />
                    </div>
                    <div className='ime-klub'>
                        <label htmlFor='ime-klub'>Naziv plesnog kluba: </label>
                        <input 
                            type='text' 
                            id='ime-klub' 
                            placeholder='Unesite naziv plesnog kluba'
                            value={newUser.klub}
                            onChange={handleChange} 
                            required   
                        />
                    </div>
                    <div className='mjesto-klub'>
                        <label htmlFor='mjesto-kluba'>Mjesto djelovanja kluba </label>
                        <input 
                            type='text' 
                            id='mjesto-kluba' 
                            placeholder='Unesite mjesto djelovanja kluba'
                            value={newUser.mjesto}
                            onChange={handleChange}    
                            required
                        />
                    </div>
                    <div className='telefon'>
                        <label htmlFor='telefon'>Broj telefona: </label>
                        <input 
                            type='text' 
                            id='telefon' 
                            placeholder='Unesite broj telefona'
                            value={newUser.telefon}
                            onChange={handleChange}    
                            required
                        />
                    </div>
                    
                    
                    <input type='submit' className='submit-btn' value='Registriraj se'></input>

                </form>
            </div>
        </div>
    )
};

export default RegOdabirUloga;