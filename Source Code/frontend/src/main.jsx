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

// Dohvati Client ID iz .env datoteke
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/homepage" replace />, // Automatski preusmjeri s / na /homepage
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
