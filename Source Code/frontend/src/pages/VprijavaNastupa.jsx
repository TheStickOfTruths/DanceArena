import '../styles/v-prijava-nastupa.css';
import Navbar from '../components/navbar';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { createOrder, signUpForCompetition } from '../services/apiService.jsx';

function VprijavaNastupa() {
    const location = useLocation();
    const navigate = useNavigate();
    const competition = location.state?.competition;
    const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
    const { user: currentUser, loading } = useAuth();

    const [formData, setFormData] = useState({
        imeKoreografije: '',
        imeKoreografa: '',
        trajanje: '',
        plesniStil: null,
        dobnaKategorija: null,
        velicinaGrupe: null,
        glazbaFile: null
    });

    const handleTextChange = (e) => {
        const { id, value } = e.target;
        let key = '';
        if (id === 'ime-koreografije') key = 'imeKoreografije';
        else if (id === 'ime-koreografa') key = 'imeKoreografa';
        else if (id === 'trajanje-koreografije') key = 'trajanje';

        if (key) setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, glazbaFile: e.target.files[0] }));
        }
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: selectedOption
        }));
    };

    if (loading) {
        console.log(competition);

        return (
            <div className="homepage-container">
                <Navbar currentUser={currentUser} />
                <div className="homepage-content-container">
                    <p>Učitavanje podataka...</p>
                </div>
            </div>
        );
    }

    const dobOptions = competition.age_categories.map(category => ({
        value: category,
        label: category
    }));

    const stilOptions = competition.style_categories.map(style => ({
        value: style,
        label: style
    }));

    const velicinaOptions = competition.group_size_categories.map(size => ({
        value: size,
        label: size
    }));

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.glazbaFile) {
            alert("Molimo učitajte glazbu.");
            return;
        }

        setIsPaymentInProgress(true);

        try {
            const orderData = await createOrder(competition.id);
            const popup = window.open(orderData.links[1].href, "_blank", "width=600,height=800,left=200,top=100");

            const timer = setInterval(() => {
                if (popup.closed) {
                    clearInterval(timer);
                }
            }, 500);
        } catch (error) {
            console.error("Error creating order:", error);
            setIsPaymentInProgress(false);
            alert("Greška pri kreiranju narudžbe.");
        }
    };

    useEffect(() => {
        const handleMessage = async (event) => {
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'PAYPAL_SUCCESS') {
                const { token } = event.data;

                try {
                    const payload = new FormData();

                    payload.append('orderID', token);

                    payload.append('choreography', formData.imeKoreografije);
                    payload.append('choreograph', formData.imeKoreografa);
                    payload.append('length', formData.trajanje);

                    payload.append('age_category', formData.dobnaKategorija?.value);
                    payload.append('style_category', formData.plesniStil?.value);
                    payload.append('group_size_category', formData.velicinaGrupe?.value);

                    payload.append('muzika', formData.glazbaFile);

                    console.log("Sending to backend...");

                    await signUpForCompetition(competition.id, payload);

                    navigate('/payment-success');

                } catch (err) {
                    console.error("Registration failed", err);
                    alert("Plaćanje je prošlo, ali spremanje prijave nije uspjelo. Kontaktirajte podršku.");
                } finally {
                    setIsPaymentInProgress(false);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [formData, competition.id, navigate]);

    if (isPaymentInProgress) {
        return (
            <div className='new-act-container'>
                <Navbar currentUser={currentUser} />
                <div className="payment-waiting-screen" style={{ textAlign: 'center', padding: '100px' }}>
                    <h2>Plaćanje u tijeku...</h2>
                    <p>Molimo dovršite plaćanje u PayPal prozoru.</p>
                    <p>Nemojte zatvarati ovu stranicu.</p>
                    <button onClick={() => setIsPaymentInProgress(false)} style={{ marginTop: '20px' }}>
                        Otkaži / Resetiraj
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='new-act-container'>
            <Navbar currentUser={currentUser} />

            <div className='new-act-form-container'>
                <div className='headboard-v'>
                    <div
                        className="back-button"
                        role="button"
                        tabIndex={0}
                        aria-label="Return to previous page"
                        onClick={() => navigate('/voditelj/prijava-nastupa-odabir')}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </div>
                    <p>Prijava natjecanja</p>
                </div>

                <form className='new-act-form' onSubmit={handleSubmit}>
                    <p> {competition?.name} </p>
                    <div className='form-input-group'>
                        <label htmlFor='ime-koreografije'>Ime koreografije: </label>
                        <input
                            required
                            type='text'
                            id='ime-koreografije'
                            value={formData.imeKoreografije}
                            onChange={handleTextChange}
                            placeholder='Unesite ime koreografije'
                        />
                    </div>
                    <div className='form-input-group'>
                        <label htmlFor='ime-koreografa'>Ime koreografa: </label>
                        <input
                            required
                            type='text'
                            id='ime-koreografa'
                            value={formData.imeKoreografa}
                            onChange={handleTextChange}
                            placeholder='Unesite ime koreografa'
                        />
                    </div>
                    <div className='form-input-group'>
                        <label htmlFor='trajanje-koreografije'>Duljina trajanja koreografije (HH:MM:SS): </label>
                        <input
                            required
                            type='text'
                            id='trajanje-koreografije'
                            value={formData.trajanje}
                            onChange={handleTextChange}
                            pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                            title="Format vremena mora biti HH:MM:SS (npr. 00:03:30)"
                            placeholder='00:03:00'
                        />
                    </div>

                    <div className='form-options-row'>
                        <div className='select-group'>
                            <label>Plesni Stil:</label>
                            <Select
                                options={stilOptions}
                                value={formData.plesniStil}
                                onChange={(option) => handleSelectChange('plesniStil', option)}
                                placeholder="Odaberi stil..."
                                className="react-select-container"
                                classNamePrefix="react-select"
                                required
                            />
                        </div>
                        <div className='select-group'>
                            <label>Dob natjecatelja:</label>
                            <Select
                                options={dobOptions}
                                value={formData.dobnaKategorija}
                                onChange={(option) => handleSelectChange('dobnaKategorija', option)}
                                placeholder="Odaberi dob..."
                                className="react-select-container"
                                classNamePrefix="react-select"
                                required
                            />
                        </div>

                        <div className='select-group'>
                            <label>Veličina grupe:</label>
                            <Select
                                options={velicinaOptions}
                                value={formData.velicinaGrupe}
                                onChange={(option) => handleSelectChange('velicinaGrupe', option)}
                                placeholder="Odaberi veličinu..."
                                className="react-select-container"
                                classNamePrefix="react-select"
                                required
                            />
                        </div>

                        <div className='file-container'>
                            <label htmlFor='upload-glazbe'>Glazba: </label>
                            <input
                                required
                                type='file'
                                id='upload-glazbe'
                                accept=".mp3,audio/mpeg"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <input type='submit' value='Nastavi na plaćanje'></input>
                </form>
            </div>
        </div>
    );
}

export default VprijavaNastupa;