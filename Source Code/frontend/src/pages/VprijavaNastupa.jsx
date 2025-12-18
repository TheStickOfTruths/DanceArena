import '../styles/v-prijava-nastupa.css';
import Navbar from '../components/navbar';

function VprijavaNastupa({setPage}){

    return(
        <div className='new-act-container'>
            <Navbar
                setPage={setPage} />

            <div className='new-act-form-container'>
                <div className='headboard-v'>
                    <p>Prijava timova</p>
                </div>
                
                <form className='new-act-form'>
                    <p> Naziv Natjecanja </p>
                    <div>
                        <label for='ime-koreografije'>Ime koreografije: </label>
                        <input type='text' id='ime-koreografije' placeholder='Unesite ime koreografije'></input>
                    </div>
                    <div>
                        <label for='ime-koreografa'>Ime koreografa: </label>
                        <input type='text' id='ime-koreografa' placeholder='Unesite ime koreografa'></input>
                    </div>
                    <div>
                        <label for='trajanje-koreografije'>Duljina trajanja koreografije: </label>
                        <input type='text' id='trajanje-koreografije' placeholder='Unesite duljinu trajanja'></input>
                    </div>
                    
                    <div>

                        <div>
                            <label>Plesni Stil:</label>
                            <select id='plesni-stil'>
                                <option >Hip Hop</option>
                                <option >Breakdance</option>
                                <option >Jazz</option>
                                <option >Step</option>
                                <option >Balet</option>
                            </select>
                        </div>
                        <div>
                            <label>Dob natjecatelja:</label>
                            <select id='dobna-kategorija'>
                                <option >Djeca</option>
                                <option >Juniori</option>
                                <option >Seniori</option>
                            </select>
                        </div>
                        
                        <div>   
                                <label>Veličina grupe:</label>
                            <select id='velicina-grupe'>
                                <option >Solo</option>
                                <option >Duo</option>
                                <option >Mala grupa</option>
                                <option >Formacija</option>
                            </select>
                        </div>

                        <div className='file-container'>
                            <label for='upload-glazbe'>Glazba: </label>
                            <input type='file' id='upload-glazbe' ></input>
                        </div>
                        
                    </div>
                    
                    <input type='submit' value='Prijavi koreografiju'></input>
                </form>
            </div>
        </div>
        
    );
}

export default VprijavaNastupa