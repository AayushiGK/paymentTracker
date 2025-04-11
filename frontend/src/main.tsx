import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";

const root = document.getElementById("root");


export const ProtectRouter = ({ children }: { children: React.ReactNode }) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
  }
  return children;
}
if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectRouter><Dashboard /></ProtectRouter>} />
      </Routes>
    </BrowserRouter>
  );
} else {
  console.error("Root element not found");
}
