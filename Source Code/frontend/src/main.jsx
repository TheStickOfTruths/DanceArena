import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

import NotFoundPage from "./pages/notfoundpage.jsx";
import Login from "./pages/login.jsx";
import Homepage from "./pages/homepage.jsx";
import NovoNatjecanje from "./pages/novoNatjecanje.jsx";
import SodabirNatjecanja from "./pages/SodabirNatjecanja.jsx";
import SocijeniNatjecanje from "./pages/SocijeniNatjecanje.jsx";
import VprijavaNastupaOdabir from "./pages/VprijavaNastupaOdabir.jsx";
import VprijavaNastupa from "./pages/VprijavaNastupa.jsx";
import VpregledNatjecanja from "./pages/VpregledNatjecanja.jsx";
import OupravljanjePrijavama from "./pages/OupravljanjePrijavama.jsx";
import RegOdabirUloga from "./pages/RegOdabirUloga.jsx";
import Oplacanje from "./pages/Oplacanje.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProfileWrapper from "./components/ProfileWrapper.jsx";
import OMojaNatjecanja from "./pages/OMojaNatjecanja.jsx";


// Dohvati Client ID iz .env datoteke
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/homepage" replace />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/homepage",
    element: <Homepage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element:
      <ProtectedRoute>
        <ProfileWrapper />
      </ProtectedRoute>,
  },
  {
    path: "/registracija",
    element:
      <ProtectedRoute>
        <RegOdabirUloga />
      </ProtectedRoute>,
  },
  {
    path: "/organizator/novo-natjecanje",
    element:
      <ProtectedRoute>
        <NovoNatjecanje />
      </ProtectedRoute>,
  },
  {
    path: "/organizator/placanje",
    element:
      <ProtectedRoute>
        <Oplacanje />
      </ProtectedRoute>,
  },
  {
    path: "/organizator/moja-natjecanja",
    element:
      <ProtectedRoute>
        <OMojaNatjecanja />
      </ProtectedRoute>,
  },
  {
    path: "/organizator/upravljanje-prijavama",
    element:
      <ProtectedRoute>
        <OupravljanjePrijavama />
      </ProtectedRoute>,
  },
  {
    path: "/sudac/odabir-natjecanja",
    element:
      <ProtectedRoute>
        <SodabirNatjecanja />
      </ProtectedRoute>,
  },
  {
    path: "/sudac/ocijeni-natjecanje",
    element:
      <ProtectedRoute>
        <SocijeniNatjecanje />
      </ProtectedRoute>,
  },
  {
    path: "/voditelj/prijava-nastupa-odabir",
    element:
      <ProtectedRoute>
        <VprijavaNastupaOdabir />
      </ProtectedRoute>,
  },
  {
    path: "/voditelj/prijava-nastupa",
    element:
      <ProtectedRoute>
        <VprijavaNastupa />
      </ProtectedRoute>,
  },
  {
    path: "/voditelj/pregled-natjecanja",
    element:
      <ProtectedRoute>
        <VpregledNatjecanja />
      </ProtectedRoute>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
