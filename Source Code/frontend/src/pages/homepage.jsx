import '../styles/homepage.css';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/navbar.jsx';
import { getCurrentUser } from '../services/apiService.jsx';

function Homepage() {

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCurrentUser();
            } catch (error) {

            }
        };
    }, []);

    return (
        <div className="homepage-container">
            <Navbar />
            <div className="homepage-content-container">
                <p>Uspješno ulogirani!</p>
                <p>Dobrodošao Taj i taj (taj.taj@gmail.com)!</p>
                <img src="/gifs/the greatest dancer of all.gif" alt="Description of your GIF" />
            </div>
        </div>
    )
};

export default Homepage;