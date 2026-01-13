import '../styles/reg-odabir-uloga.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function RegOdabirUloga() {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    if (loading) {
        return (
            <div className="homepage-container">
                <div className="homepage-content-container">
                    <p>Učitavanje podataka...</p>
                </div>
            </div>
        );
    }

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

                <form className='registration-form'>
                    <div className='ime'>
                        <label for='ime'>Ime i prezime: </label>
                        <input type='text' id='ime' placeholder='Unesite vaše ime i prezime'></input>
                    </div>
                    <div className='ime-klub'>
                        <label for='ime-klub'>Naziv plesnog kluba: </label>
                        <input type='text' id='ime-klub' placeholder='Unesite naziv plesnog kluba'></input>
                    </div>
                    <div className='mjesto-klub'>
                        <label for='mjesto-kluba'>Mjesto djelovanja kluba </label>
                        <input type='text' id='mjesto-kluba' placeholder='Unesite mjesto djelovanja kluba'></input>
                    </div>
                    <div className='telefon'>
                        <label for='telefon'>Broj telefona: </label>
                        <input type='text' id='telefon' placeholder='Unesite broj telefona'></input>
                    </div>
                    
                    
                    <input type='submit' className='submit-btn' value='Registriraj se'></input>

                </form>
            </div>
        </div>
    )
};

export default RegOdabirUloga;