import '../styles/v-pregled-natjecanja.css';
import Navbar from '../components/navbar';

function VpregledNatjecanja({setPage}){

    return(
        <div className='page-container'>
            <Navbar
                setPage={setPage} />

            <div className='page-content-container'>
                <div className='headboard-v'>
                    <p>Moja natjecanja</p>
                </div>

                <div className='competition-list-container'>
                    
                </div>
            </div>
        </div>
        
    );
}

export default VpregledNatjecanja