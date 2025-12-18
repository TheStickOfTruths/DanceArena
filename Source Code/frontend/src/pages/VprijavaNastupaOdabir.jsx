import '../styles/v-prijava-nastupa-odabir.css';
import Navbar from '../components/navbar';

function VprijavaNastupaOdabir({setPage}){

    return(
        <div className='page-container'>
            <Navbar
                setPage={setPage} />

            <div className='page-content-container'>
                <div className='headboard-v'>
                    <p>Prijava Timova</p>
                </div>

                <div className='competition-list-container'>
                    <div className='competition'>
                        <p>Natjecanje 1</p>
                        <button className='prijava-button' label="1" onClick={() => setPage('VprijavaNastupa')}>Prijavi se</button>
                    </div>
                    <div className='competition'>
                        <p>Natjecanje 2</p>
                        <button className='prijava-button' label="2" onClick={() => setPage('VprijavaNastupa')}>Prijavi se</button>
                    </div>
                </div>
            </div>
        </div>
        
    );
}

export default VprijavaNastupaOdabir