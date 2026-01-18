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
            navigate('/homepage');
        }

    } catch (error) {
        console.error("Greška pri kreiranju natjecanja:", error);
    }
};