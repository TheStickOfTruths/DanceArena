import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Uvoz Google providera
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

import NotFoundPage from "./pages/notfoundpage.jsx";
import Login from "./pages/login.jsx";
import Homepage from "./pages/homepage.jsx";
import NovoNatjecanje from "./pages/novoNatjecanje.jsx";
import ProfileO from "./pages/profile-o.jsx";
import ProfileS from "./pages/profile-s.jsx";
import SodabirNatjecanja from "./pages/SodabirNatjecanja.jsx";
import SocijeniNatjecanje from "./pages/SocijeniNatjecanje.jsx";
import ProfileV from "./pages/profile-v.jsx";
import VprijavaNastupaOdabir from "./pages/VprijavaNastupaOdabir.jsx";
import VprijavaNastupa from "./pages/VprijavaNastupa.jsx";
import VpregledNatjecanja from "./pages/VpregledNatjecanja.jsx";
import OupravljanjePrijavamaOdabir from "./pages/OupravljanjePrijavamaOdabir.jsx";
import OupravljanjePrijavama from "./pages/OupravljanjePrijavama.jsx";
import RegOdabirUloga from "./pages/RegOdabirUloga.jsx";
import Oregistracija from "./pages/Oregistracija.jsx";
import Vregistracija from "./pages/Vregistracija.jsx";
import Sregistracija from "./pages/Sregistracija.jsx";
import Oplacanje from "./pages/Oplacanje.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


// Dohvati Client ID iz .env datoteke
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/homepage" replace />,
  },
  {
    path: "/homepage",
    element: <Homepage />,
  },
  {
    path: "/registracija",
    element:
      <ProtectedRoute>
        <RegOdabirUloga />
      </ProtectedRoute>,
  },
  {
    path: "/registracija/organzator",
    element: <Oregistracija />,
  },
  {
    path: "/organizator/placanje",
    element: <Oplacanje />,
  },
  {
    path: "/registracija/voditelj",
    element: <Vregistracija />,
  },
  {
    path: "/registracija/sudac",
    element: <Sregistracija />,
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
    path: "/organizator/upravljanje-prijavama-odabir",
    element: <OupravljanjePrijavamaOdabir />,
  },
  {
    path: "/organizator/upravljanje-prijavama",
    element: <OupravljanjePrijavama />,
  },
  {
    path: "/sudac",
    element: <ProfileS />,
  },
  {
    path: "/sudac/odabir-natjecanja",
    element: <SodabirNatjecanja />,
  },
  {
    path: "/sudac/ocijeni-natjecanje",
    element: <SocijeniNatjecanje />,
  },
  {
    path: "/voditelj",
    element: <ProfileV />,
  },
  {
    path: "/voditelj/prijava-nastupa-odabir",
    element: <VprijavaNastupaOdabir />,
  },
  {
    path: "/voditelj/prijava-nastupa",
    element: <VprijavaNastupa />,
  },
  {
    path: "/voditelj/pregled-natjecanja",
    element: <VpregledNatjecanja />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* GoogleOAuthProvider omogućuje korištenje Google logina u svim komponentama unutar routera */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
