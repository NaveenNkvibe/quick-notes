import { Navigate } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem('token');

const PrivateRoute = ({ children }) => {
	return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
