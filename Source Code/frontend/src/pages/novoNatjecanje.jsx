import '../styles/novo-natjecanje.css';
import Navbar from '../components/navbar';

function NovoNatjecanje() {

    return (
        <div className='new-comp-container'>
            <Navbar />

            <div className='new-comp-form-container'>
                <div className='headboard'>
                    <p>Novo natjecanje</p>
                </div>
                <form className='new-comp-form'>
                    <div>
                        <label for='naziv-natjecanja'>Naziv natjecanja: </label>
                        <input type='text' id='naziv-natjecanja' placeholder='Unesite naziv natjecanja'></input>
                    </div>
                    <div>
                        <label for='datum-start'>Početak natjecanja: </label>
                        <input type='date' id='datum-start' name='datum-start'></input>
                        <label id='datum-end-label' for='datum-end'>Završetak natjecanja: </label>
                        <input type='date' id='datum-end' name='datum-end'></input>
                    </div>
                    <div>
                        <label for='lokacija-natjecanja'>Lokacija natjecanja: </label>
                        <input type='text' id='lokacija-natjecanja' placeholder='Unesite lokaciju natjecanja'></input>
                    </div>
                    <div>
                        <label for='opis-natjecanja'>Opis natjecanja: </label>
                        <textarea id='opis-natjecanja' placeholder='Unesite opis natjecanja'></textarea>
                    </div>
                    <div>
                        <p id='text-kategorije'> Kategorije: </p>
                        <div className='stilovi'>
                            <p for='stilovi-form'>Stilovi: </p>
                            <div className='kategorije-form'>

                                <div className='option'>
                                    <input type="checkbox" id="hiphop" name="hiphop" value="hip hop"></input>
                                    <label for="hiphop"> Hip Hop</label>
                                </div>
                                <div className='option'>
                                    <input type="checkbox" id="breakdance" name="breakdance" value="breakdance"></input>
                                    <label for="breakdance"> Breakdance</label>
                                </div>
                                <div className='option'>
                                    <input type="checkbox" id="jazz" name="jazz" value="jazz"></input>
                                    <label for="jazz"> Jazz</label>
                                </div>
                                <div className='option'>
                                    <input type="checkbox" id="balet" name="balet" value="balet"></input>
                                    <label for="balet"> Balet</label>
                                </div>
                                <div className='option'>
                                    <input type="checkbox" id="step" name="step" value="step"></input>
                                    <label for="step"> Step</label>
                                </div>

                            </div>
                        </div>

                        <div className='dobne-kategorije'>
                            <p for='dobne-kategorije-form'>Dobne kategorije: </p>
                            <div className='kategorije-form'>
                                <div className='option'>
                                    <input type="checkbox" id="djeca" name="djeca" value="djeca"></input>
                                    <label for="djeca"> Djeca</label>
                                </div>
                                <div className='option'>
                                    <input type="checkbox" id="juniori" name="juniori" value="juniori"></input>
                                    <label for="juniori"> Juniori</label>
                                </div>
                                <div className='option'>
                                    <input type="checkbox" id="seniori" name="seniori" value="seniori"></input>
                                    <label for="seniori"> Seniori</label>
                                </div>
                            </div>
                        </div>

                        <div className='velicine'>
                            <p for='velicine-form'>Veličine grupa: </p>
                            <div className='kategorije-form'>
                                <div className='option'>
                                    <input type="checkbox" id="solo" name="solo" value="solo"></input>
                                    <label for="solo"> Solo</label>
                                </div>
                                <div className='option'>
                                    <input type="checkbox" id="duo" name="duo" value="duo"></input>
                                    <label for="duo"> Duo</label>
                                </div>
                                <div className='option'>
                                    <input type="checkbox" id="malagrupa" name="malagrupa" value="malagrupa"></input>
                                    <label for="malagrupa"> Mala grupa</label>
                                </div>
                                <div className='option'>
                                    <input type="checkbox" id="formacija" name="formacija" value="formacija"></input>
                                    <label for="formacija"> Formacija</label>
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* <div>
                        <p id='text-izbor'>Izbor sudaca:</p>
                        <div className='svi-sudci'>
                            <select id='sudac'>
                                <option value='sudac1'>Sudac 1</option>
                                <option value='sudac2'>Sudac 2</option>
                                <option value='sudac3'>Sudac 3</option>
                            </select>
                            <select id='sudac'>
                                <option value='sudac1'>Sudac 1</option>
                                <option value='sudac2'>Sudac 2</option>
                                <option value='sudac3'>Sudac 3</option>
                            </select>
                            <select id='sudac'>
                                <option value='sudac1'>Sudac 1</option>
                                <option value='sudac2'>Sudac 2</option>
                                <option value='sudac3'>Sudac 3</option>
                            </select>
                        </div>

                        <p id='noviSudac'>Dodaj novog sudca...</p>
                    </div> */}
                    <div>
                        <label for='iznos-kotizacije'>Iznos kotizacije: </label>
                        <input type='text' id='iznos-kotizacije' placeholder='Unesite iznos kotizacije'></input>
                    </div>
                    <input type='submit' value='Kreiraj natjecanje'></input>
                </form>
            </div>
        </div>

    );
}

export default NovoNatjecanje