import { useState } from 'react'
import './App.css'
import Login from './pages/login.jsx'
import Homepage from './pages/homepage.jsx'
import ProfileO from './pages/profile-o.jsx'

function App() {
  const [displayPage, setDisplayPage] = useState('login');

  if (displayPage === 'login') {
    return (
      <Login
        setPage={setDisplayPage} />
    )
  }
  else
    return (
      <Homepage
        setPage={setDisplayPage} />
    )
}

export default App
