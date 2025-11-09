import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'

import NotFoundPage from './pages/notfoundpage.jsx'
import Login from './pages/login.jsx'
import Homepage from './pages/homepage.jsx'
import NovoNatjecanje from './pages/novoNatjecanje.jsx'
import ProfileO from './pages/profile-o.jsx'

const router = createBrowserRouter([{
  path: "/homepage",
  element: <Homepage />,
},
{
  path: "/login",
  element: <Login />,
},
{
  path: "/novo-natjecanje",
  element: <NovoNatjecanje />,
},
{
  path: "/profile-o",
  element: <ProfileO />,
},
{
  path: "*",
  element: <NotFoundPage />,
}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
