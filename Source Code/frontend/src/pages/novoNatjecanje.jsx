import '../styles/novo-natjecanje.css';
import Navbar from '../components/navbar';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { createCompetition, getCompetitionByID, updateCompetition } from '../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stilOptions = [
    { value: 'HIPHOP', label: 'Hip Hop' },
    { value: 'BREAK', label: 'Breakdance' },
    { value: 'JAZZ', label: 'Jazz' },
    { value: 'BALET', label: 'Balet' },
    { value: 'STEP', label: 'Step' }
];

const dobOptions = [
    { value: 'DJECA', label: 'Djeca' },
    { value: 'JUNIORI', label: 'Juniori' },
    { value: 'SENIORI', label: 'Seniori' }
];

const velicinaOptions = [
    { value: 'SOLO', label: 'Solo' },
    { value: 'DUO', label: 'Duo' },
    { value: 'MALA_GRUPA', label: 'Mala grupa' },
    { value: 'FORMACIJA', label: 'Formacija' }
];


function NovoNatjecanje() {
    const { user: currentUser, loading } = useAuth();
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        location: '',
        description: '',
        style_categories: [],
        age_categories: [],
        group_size_categories: [],
        registration_fee: 0
    });

    useEffect(() => {
        if (currentUser.role !== 'ORGANIZER') {
            navigate('/');
        }
        if (isEditMode) {
            const fetchData = async () => {
                try {
                    const data = await getCompetitionByID(id);
                    setFormData({
                        name: data.name,
                        date: data.date ? data.date.split("T")[0] : "",
                        location: data.location || "",
                        description: data.description || "",
                        registration_fee: data.registration_fee || 0,
                        style_categories: data.style_categories || [],
                        age_categories: data.age_categories || [],
                        group_size_categories: data.group_size_categories || [],
                    });
                } catch (error) {
                    alert("Greška pri učitavanju natjecanja.");
                    navigate("/organizator/moja-natjecanja");
                }
            };
            fetchData();
        }
    }, [id, isEditMode, navigate]);

    if (loading) {
        return (
            <div className="homepage-container">
                <Navbar currentUser={currentUser} />
                <div className="homepage-content-container">
                    <p>Učitavanje podataka...</p>
                </div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSelectChange = (name, selectedOptions) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: selectedOptions.map(option => option.value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditMode) {
                console.log("Ažuriram natjecanje...", formData);
                await updateCompetition(id, formData);
                alert("Natjecanje uspješno ažurirano!");
            } else {
                console.log("Kreiram novo natjecanje...", formData);
                await createCompetition(formData);
                alert("Natjecanje uspješno kreirano!");
            }

            navigate("/organizator/moja-natjecanja");
        } catch (error) {
            console.error("Greška:", error);
            alert("Došlo je do greške. Provjerite podatke.");
        }
    };

    return (
        <div className='new-comp-container'>
            <Navbar currentUser={currentUser} />
            {currentUser ? (

                <div className='new-comp-form-container'>
                    <div className='headboard'>
                        <p>Novo natjecanje</p>
                    </div>

                    <form className='new-comp-form' onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor='naziv-natjecanja'>Naziv natjecanja:</label>
                            <input
                                type='text'
                                id='naziv-natjecanja'
                                name='name'
                                placeholder='Unesite naziv natjecanja'
                                value={formData.name}
                                onChange={handleChange}
                                className='form-input'
                                required
                            />
                        </div>

                        <div className='form-group-dates'>
                            <label htmlFor='datum-start'>Početak natjecanja:</label>
                            <input
                                type='date'
                                id='datum-start'
                                name='date'
                                value={formData.date}
                                onChange={handleChange}
                                className='form-input'
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='lokacija-natjecanja'>Lokacija natjecanja:</label>
                            <input
                                type='text'
                                id='lokacija-natjecanja'
                                name='location'
                                placeholder='Unesite lokaciju natjecanja'
                                value={formData.location}
                                onChange={handleChange}
                                className='form-input'
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='opis-natjecanja'>Opis natjecanja:</label>
                            <textarea
                                id='opis-natjecanja'
                                name='description'
                                placeholder='Unesite opis natjecanja'
                                value={formData.description}
                                onChange={handleChange}
                                className='form-textarea'
                                required
                            />
                        </div>

                        <div className='kategorije-container'>
                            <div className='form-group'>
                                <p>Stilovi:</p>
                                <Select
                                    isMulti
                                    name="style_categories"
                                    options={stilOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={stilOptions.filter(option => formData.style_categories.includes(option.value))}
                                    onChange={(options) => handleSelectChange('style_categories', options)}
                                    placeholder="Odaberi stilove..."
                                    required
                                />
                            </div>

                            <div className='form-group'>
                                <p>Dobne kategorije:</p>
                                <Select
                                    isMulti
                                    name="age_categories"
                                    options={dobOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    value={dobOptions.filter(option => formData.age_categories.includes(option.value))}
                                    onChange={(options) => handleSelectChange('age_categories', options)}
                                    placeholder="Odaberi dob..."
                                    required
                                />
                            </div>

                            <div className='form-group'>
                                <p>Veličine grupa:</p>
                                <Select
                                    isMulti
                                    name="group_size_categories"
                                    options={velicinaOptions}
                                    className="basic-multi-select"
                                    value={velicinaOptions.filter(option => formData.group_size_categories.includes(option.value))}
                                    classNamePrefix="select"
                                    onChange={(options) => handleSelectChange('group_size_categories', options)}
                                    placeholder="Odaberi veličine..."
                                    required
                                />
                            </div>
                        </div>

                        <div className='form-group-row'>
                            <label htmlFor='iznos-kotizacije'>Iznos kotizacije (€):</label>
                            <input
                                type='number'
                                id='iznos-kotizacije'
                                name='registration_fee'
                                placeholder='0.00'
                                value={formData.registration_fee}
                                onChange={handleChange}
                                className='form-input'
                                min="0"
                                step="0.01"
                                max="10000"
                                required
                            />
                        </div>

                        <input type='submit' value={isEditMode ? 'Spremi promjene' : 'Kreiraj natjecanje'} className='submit-button' />

                    </form>
                </div>
            ) : (
                <div className="not-logged-in">
                    <p>Niste prijavljeni.</p>
                    <Link to="/login">Idi na prijavu</Link>
                </div>
            )}
        </div>
    );
}

export default NovoNatjecanje;