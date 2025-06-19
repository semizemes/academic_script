import {useState, useEffect} from "react";
import {Navigate} from 'react-router-dom';
import api from '@/services/api';

export function ProtectedRoute({children}) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.getCurrentUser();
                setAuthenticated(response.authenticated);
            } catch (error) {
                console.error('Error checking authentication:', error);
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if(loading) {
        return <div>Loading...</div>;
    }

    if(!authenticated) {
        return <Navigate to="/login" />;
    }

    return children;
}