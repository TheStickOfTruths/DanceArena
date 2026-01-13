import '../styles/v-registracija.css';

function Vregistracija(){

    return(
        <div className='voditelj-reg-container'>

            <div className='voditelj-reg-form-container'>
                <div className='headboard-v'>
                    <p>Registracija - voditelj</p>
                </div>
                
                <form className='voditelj-reg-form'>
                    <div>
                        <label for='ime'>Ime i prezime: </label>
                        <input type='text' id='ime' placeholder='Unesite vaše ime i prezime'></input>
                    </div>
                    <div>
                        <label for='email'>E-mail: </label>
                        <input type='text' id='email' placeholder='Unesite email'></input>
                    </div>
                    <div>
                        <label for='ime-klub'>Naziv plesnog kluba: </label>
                        <input type='text' id='ime-klub' placeholder='Unesite naziv plesnog kluba'></input>
                    </div>
                    <div>
                        <label for='mjesto-kluba'>Mjesto djelovanja kluba </label>
                        <input type='text' id='mjesto-kluba' placeholder='Unesite mjesto djelovanja kluba'></input>
                    </div>
                    <div>
                        <label for='telefon'>Broj telefona: </label>
                        <input type='text' id='telefon' placeholder='Unesite broj telefona'></input>
                    </div>
                    
                    
                    <input type='submit' value='Registriraj se'></input>
                </form>
            </div>
        </div>
        
    );
}

export default Vregistracija