// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import "./index.css";
import App from "./App.tsx";

// Registramos el handler global UNA sola vez
// ahora TypeScript sabe de window.customInputHandler
window.customInputHandler = async (msg: string) => {
  const { value = "" } = await Swal.fire({
    title: msg,
    input: "text",
    inputPlaceholder: "Tu respuesta…",
    showCancelButton: true,
    confirmButtonText: "Enviar",
    cancelButtonText: "Cancelar",
    backdrop: true,
    allowOutsideClick: false,
  });
  return value;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
