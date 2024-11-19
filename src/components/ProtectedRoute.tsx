import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Define the props for the ProtectedRoute component
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

// ProtectedRoute component to handle protected routes
function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
    // Get the user information from the custom useAuth hook
    const { user } = useAuth();
    // Redirect to the login page if the user is not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    // Redirect to the home page if the user is not authorized
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    // Render the children if the user is authenticated and authorized to access the route
    return <>{children}</>;
}

export default ProtectedRoute;