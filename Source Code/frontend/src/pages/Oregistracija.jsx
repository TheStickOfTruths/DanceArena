import '../styles/o-registracija.css';

function Oregistracija(){

    return(
        <div className='organizator-reg-container'>

            <div className='organizator-reg-form-container'>
                <div className='headboard-v'>
                    <p>Registracija - organizator</p>
                </div>
                
                <form className='organizator-reg-form'>
                    <div>
                        <label for='ime'>Ime i prezime: </label>
                        <input type='text' id='ime' placeholder='Unesite vaše ime i prezime'></input>
                    </div>
                    <div>
                        <label for='email'>E-mail: </label>
                        <input type='text' id='email' placeholder='Unesite email'></input>
                    </div>
                    <div className='clanarina'>
                        <label for='clanarina'>Godišnja članarina za organizatore iznosi {}. Molimo izaberite način plaćanja: </label>
                        <button className='pay-button'>Paypal</button>
                    </div>
                    
                
                    <input type='submit' value='Registriraj se'></input>
                </form>
            </div>
        </div>
        
    );
}

export default Oregistracija