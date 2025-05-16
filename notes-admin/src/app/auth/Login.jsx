import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
	const [formData, setFormData] = useState({ email: '', password: '' }); //State to store input form data
	const navigate = useNavigate(); //Navigate to diffrent components

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	}; //Handle form input changes and update formData

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const res = await axios.post('http://localhost:5000/api/auth/login', formData);
			localStorage.setItem('token', res.data.token);
			navigate('/dashboard');
		} catch (err) {
			console.log(err);
			alert(err.response?.data?.msg || 'User Login Failed');
		}
	}; // Handles form submission

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
			<Box sx={{ maxWidth: 400, p: 2, textAlign: 'center', border: '2px solid grey', borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.2)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.36)' }, backdropFilter: 'blur(14px)' }}>
				<Typography variant="h5">Login</Typography>
				<form onSubmit={handleSubmit}>
					<TextField fullWidth name="email" label="Email" margin="normal" value={formData.email} onChange={handleChange} />
					<TextField fullWidth type="password" name="password" label="Password" margin="normal" value={formData.password} onChange={handleChange} />
					<Button fullWidth type="submit" variant="contained" sx={{ mt: 2, color: 'black', bgcolor: '#ffffff31' }}>
						Login
					</Button>
				</form>
				<Typography variant="body2" sx={{ mt: 2 }}>
					Don't have an account?{' '}
					<Link to="/register" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
						Register here
					</Link>
				</Typography>
			</Box>
		</Box>
	);
};

export default Login;
