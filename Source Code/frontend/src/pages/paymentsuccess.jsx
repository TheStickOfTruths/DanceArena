import Navbar from '../components/navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function PaymentSuccess() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="homepage-container">
            <Navbar currentUser={user} />
            <div className="homepage-content-container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h1 style={{ color: 'green' }}>Plaćanje i prijava uspješni!</h1>
                <p>Vaša prijava za natjecanje je zaprimljena.</p>
                <div style={{ marginTop: '30px' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{ padding: '10px 20px', cursor: 'pointer', fontSize: '16px' }}
                    >
                        Povratak na naslovnicu
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;