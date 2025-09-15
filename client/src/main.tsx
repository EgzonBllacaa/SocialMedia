import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg-slate-950 text-[#ffffff] min-h-screen font-poppins px-4 ">
      <AuthProvider>
        <App />
      </AuthProvider>
    </div>
  </StrictMode>
);
