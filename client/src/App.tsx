import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import RequireAuth from "./features/auth/RequireAuth";
import {AdminPage} from "./pages/AdminPage.tsx";
import {LoginPage} from "./pages/LoginPage.tsx";
import {RegisterPage} from "./pages/RegisterPage.tsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/admin"
                    element={
                        <RequireAuth>
                            <AdminPage />
                        </RequireAuth>
                    }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;