import '../styles/s-registracija.css';

function Sregistracija(){

    return(
        <div className='sudac-reg-container'>

            <div className='sudac-reg-form-container'>
                <div className='headboard-v'>
                    <p>Registracija - sudac</p>
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
                    
                    
                    <input type='submit' value='Registriraj se'></input>
                </form>
            </div>
        </div>
        
    );
}

export default Sregistracija