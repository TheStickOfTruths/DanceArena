import '../styles/novo-natjecanje.css';
import Navbar from '../components/navbar';
import { useState } from 'react';
import Select from 'react-select';
import { createCompetition } from '../services/apiService';
//import { useNavigate } from 'react-router-dom';

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
    // const navigate = useNavigate();

    const [formData, setFormData] = useState({
        naziv: '',
        datumStart: '',
        datumEnd: '',
        lokacija: '',
        opis: '',
        stilovi: [],
        dobneKategorije: [],
        velicine: [],
        kotizacija: 0
    });

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
            const competitionData = {
                name: formData.naziv,
                date: formData.datumStart,
                location: formData.lokacija,
                description: formData.opis,
                registration_fee: parseFloat(formData.kotizacija),
                age_categories: formData.dobneKategorije,
                style_categories: formData.stilovi,
                group_size_categories: formData.velicine
            };

            const response = await createCompetition(competitionData);
            if (response) {
                console.log("Natjecanje uspješno kreirano:", response);
            }

        } catch (error) {
            console.error("Greška pri kreiranju natjecanja:", error);
        }
    };

    return (
        <div className='new-comp-container'>
            <Navbar />

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
                            name='naziv'
                            placeholder='Unesite naziv natjecanja'
                            value={formData.naziv}
                            onChange={handleChange}
                            className='form-input'
                        />
                    </div>

                    <div className='form-group-dates'>
                        <label htmlFor='datum-start'>Početak natjecanja:</label>
                        <input
                            type='date'
                            id='datum-start'
                            name='datumStart'
                            value={formData.datumStart}
                            onChange={handleChange}
                            className='form-input'
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='lokacija-natjecanja'>Lokacija natjecanja:</label>
                        <input
                            type='text'
                            id='lokacija-natjecanja'
                            name='lokacija'
                            placeholder='Unesite lokaciju natjecanja'
                            value={formData.lokacija}
                            onChange={handleChange}
                            className='form-input'
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor='opis-natjecanja'>Opis natjecanja:</label>
                        <textarea
                            id='opis-natjecanja'
                            name='opis'
                            placeholder='Unesite opis natjecanja'
                            value={formData.opis}
                            onChange={handleChange}
                            className='form-textarea'
                        />
                    </div>

                    <div className='kategorije-container'>
                        <div className='form-group'>
                            <p>Stilovi:</p>
                            <Select
                                isMulti
                                name="stilovi"
                                options={stilOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(options) => handleSelectChange('stilovi', options)}
                                placeholder="Odaberi stilove..."
                            />
                        </div>

                        <div className='form-group'>
                            <p>Dobne kategorije:</p>
                            <Select
                                isMulti
                                name="dobneKategorije"
                                options={dobOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(options) => handleSelectChange('dobneKategorije', options)}
                                placeholder="Odaberi dob..."
                            />
                        </div>

                        <div className='form-group'>
                            <p>Veličine grupa:</p>
                            <Select
                                isMulti
                                name="velicine"
                                options={velicinaOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(options) => handleSelectChange('velicine', options)}
                                placeholder="Odaberi veličine..."
                            />
                        </div>
                    </div>

                    <div className='form-group-row'>
                        <label htmlFor='iznos-kotizacije'>Iznos kotizacije (€):</label>
                        <input
                            type='number'
                            id='iznos-kotizacije'
                            name='kotizacija'
                            placeholder='0.00'
                            value={formData.kotizacija}
                            onChange={handleChange}
                            className='form-input'
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <input type='submit' value='Kreiraj natjecanje' className='submit-button' />

                </form>
            </div>
        </div>
    );
}

export default NovoNatjecanje;