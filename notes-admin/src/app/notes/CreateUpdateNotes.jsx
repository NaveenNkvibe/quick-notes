import { Box, Button, TextField, Typography, Checkbox, FormControl, InputLabel, Select, MenuItem, FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const NoteCreate = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({ content: '', expiry_type: 'read', expiresInMinutes: '', password_protected: false, note_password: '' });

	useEffect(() => {
		if (id) {
			axios
				.get(`http://localhost:5000/api/notes/${id}`)
				.then((res) => {
					setFormData({
						content: res.data.note.content,
						expiry_type: res.data.note.expiry_type || 'read',
						expiresInMinutes: res.data.note.expiresInMinutes || '',
						password_protected: res.data.note.password_protected || false,
						note_password: res.data.note.note_protected || '',
					});
				})
				.catch(() => alert('Failed To Fetch Notes.'));
		}
	}, [id]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const payload = {
				content: formData.content,
				expiry_type: formData.expiry_type,
				expiresInMinutes: formData.expiry_type === 'time' ? formData.expiresInMinutes : null,
				password_protected: formData.password_protected,
				note_password: formData.password_protected ? formData.note_password : null,
			};

			const tokenHeader = {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			};

			if (id) {
				await axios.put(`http://localhost:5000/api/notes/update/${id}`, payload, tokenHeader);
				navigate(`/note/${id}`);
			} else {
				await axios.post('http://localhost:5000/api/notes/create', payload, tokenHeader);
				navigate('/dashboard');
			}

			//navigate('/dashboard');
		} catch (err) {
			console.log(err);
			alert('Failed to submit note');
		}
	};

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
			<Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 4, textAlign: 'center', color: 'Black', border: '2px solid grey', borderRadius: 2, bgcolor: 'rgb(255, 255, 255)', '&:hover': { bgcolor: 'rgba(241, 241, 241, 0.83)' } }}>
				<Typography variant="h5">{id ? 'Update Note' : 'Create Note'}</Typography>
				<form onSubmit={handleSubmit}>
					<TextField multiline fullWidth label="Content" name="content" value={formData.content} onChange={handleChange} rows={4} margin="normal" />

					<FormControl fullWidth margin="normal">
						<InputLabel>Expiry Type</InputLabel>
						<Select name="expiry_type" value={formData.expiry_type} onChange={handleChange} label="Expiry Type">
							<MenuItem value="read">Destroy After Read</MenuItem>
							<MenuItem value="time">Expire in Time</MenuItem>
						</Select>
					</FormControl>

					{formData.expiry_type === 'time' && <TextField type="number" name="expiresInMinutes" label="Expires in Minutes" fullWidth margin="normal" value={formData.expiresInMinutes} onChange={handleChange} />}

					<FormControlLabel
						control={
							<Checkbox
								name="password_protected"
								checked={formData.password_protected}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										password_protected: e.target.checked,
										note_password: '', // Reset on toggle
									}))
								}
							/>
						}
						label="Password Protect Note"
					/>

					{formData.password_protected && <TextField type="password" name="note_password" label="Note Password" fullWidth margin="normal" value={formData.note_password} onChange={handleChange} />}
					<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
						<Button type="submit" variant="contained">
							{id ? 'Update Note' : 'Create Note'}
						</Button>
						<Button variant="outlined" color="error" onClick={() => navigate('/dashboard')}>
							Cancel
						</Button>
					</Box>
				</form>
			</Box>
		</Box>
	);
};

export default NoteCreate;
