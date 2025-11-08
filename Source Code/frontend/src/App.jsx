import { useState } from 'react'
import './App.css'
import Login from './pages/login.jsx'
import Homepage from './pages/homepage.jsx'
import ProfileO from './pages/profile-o.jsx'
import NovoNatjecanje from './pages/novoNatjecanje.jsx'

function App() {
  const [displayPage, setDisplayPage] = useState('login');

  if (displayPage === 'login') {
    return (
      <Login
        setPage={setDisplayPage} />
    )
  }
  else if (displayPage === 'homepage') {
    return (
      <Homepage
        setPage={setDisplayPage} />
    )
  }
  else if (displayPage === 'profileO'){
    return (
      <ProfileO setPage={setDisplayPage} />
    )
  }
  else if (displayPage === 'novoNatjecanje'){
    return (
      <NovoNatjecanje setPage={setDisplayPage} />
    )
  }
}

export default App
