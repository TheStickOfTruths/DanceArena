import '../styles/o-upravljanje-prijavama.css';
import Navbar from '../components/navbar';

function OupravljanjePrijavama({setPage}){

    return(
        <div className='page-container'>
            <Navbar
                setPage={setPage} />

            <div className='page-content-container'>
                <div className='headboard'>
                    <p>Upravljanje prijavama</p>
                </div>

                <div className='competition-list-container'>
                    
                </div>
            </div>
        </div>
        
    );
}

export default OupravljanjePrijavama