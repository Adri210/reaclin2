import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/authcontext.js'; 

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useContext(AuthContext);  

    useEffect(() => {
        if (!isLoggedIn) {
            alert('É necessário fazer login para acessar essa página');
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
