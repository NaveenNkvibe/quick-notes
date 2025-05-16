import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
	const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm_password: '' }); //State to store input form data
	const navigate = useNavigate(); //Navigate to diffrent components

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	}; //Handle form input changes and update formData

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const res = await axios.post('http://localhost:5000/api/auth/register', formData);
			localStorage.setItem('token', res.data.token);
			navigate('/dashboard');
		} catch (err) {
			console.log(err);
			alert(err.response?.data?.msg || 'User Registration Failed');
		}
	}; // Handles form submission

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
			<Box sx={{ maxWidth: 400, p: 2, textAlign: 'center', border: '2px solid grey', borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.2)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.36)' }, backdropFilter: 'blur(14px)' }}>
				<Typography variant="h5">Register</Typography>
				<form onSubmit={handleSubmit}>
					<TextField fullWidth name="name" label="Name" margin="normal" value={formData.name} onChange={handleChange} />
					<TextField fullWidth name="email" label="Email" margin="normal" value={formData.email} onChange={handleChange} />
					<TextField fullWidth type="password" name="password" label="Password" margin="normal" value={formData.password} onChange={handleChange} />
					<TextField fullWidth type="password" name="confirm_password" label="Confirm Password" margin="normal" value={formData.confirm_password} onChange={handleChange} />
					<Button fullWidth type="submit" variant="contained" sx={{ mt: 2, color: 'black', bgcolor: '#ffffff31' }}>
						Register
					</Button>
				</form>
				<Typography variant="body2" sx={{ mt: 2 }}>
					Already have an account?{' '}
					<Link to="/login" style={{ textDecoration: 'none', fontWeight: 'bold' }}>
						Login
					</Link>
				</Typography>
			</Box>
		</Box>
	);
};

export default Register;
