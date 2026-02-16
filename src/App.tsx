import { CookiesProvider } from "react-cookie";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { ServicesProvider } from "./contexts/ServicesContext";

function App() {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <AuthProvider>
        <ServicesProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ServicesProvider>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default App;
