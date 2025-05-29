import { Navigate } from 'react-router-dom';
import {useAppSelector} from "../../app/hooks.ts";
import type { JSX } from 'react';


const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const token = useAppSelector((state) => state.auth.token);
    return token ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;
