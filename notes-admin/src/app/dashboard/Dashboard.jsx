import { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { LockOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import NoteCard from '../../components/NoteCard';

const Dashboard = () => {
	const [notes, setNotes] = useState([]); // State to store note data
	const [passwordPromptOpen, setPasswordPromptOpen] = useState(false); // Boolean state to controll password dialog
	const [selectedNoteId, setSelectedNoteId] = useState(null); // State to store selected note id
	const [enteredPassword, setEnteredPassword] = useState(''); // State to store entered password
	const navigate = useNavigate(); // Navigate to diffrent components

	useEffect(() => {
		const getNotes = async () => {
			const res = await axios.get('/notes', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
			setNotes(res.data.notes);
		};
		getNotes();
	}, []); // Featch all Notes

	const handleNoteClick = (note) => {
		if (note.password_protected) {
			setSelectedNoteId(note._id);
			setPasswordPromptOpen(true);
		} else {
			navigate(`/note/${note._id}`);
		}
	}; // Check password protected and navigate to Note display page

	const handleNoteAuth = async () => {
		try {
			const token = localStorage.getItem('token'); // Featch token from local storage
			await axios.post(`/notes/auth/${selectedNoteId}`, { note_password: enteredPassword }, { headers: { Authorization: `Bearer ${token}` } });
			setPasswordPromptOpen(false);
			setEnteredPassword('');
			navigate(`/note/${selectedNoteId}`);
		} catch (err) {
			setEnteredPassword('');
			alert(err.response?.data?.msg || 'Invalid password');
		}
	}; // Check note password authentication

	const handleLogout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	}; // Remove token from local storage & navigate to login page

	return (
		<Box sx={{ p: 4 }}>
			<Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
				<Box sx={{ border: '2px solid grey', borderRadius: 2, p: 1, boxShadow: 2 }}>
					<Typography variant="h4">Quick Notes</Typography>
				</Box>
				<Box sx={{ display: 'flex', gap: 2 }}>
					<Button variant="contained" onClick={() => navigate('/create-note')}>
						Create Note
					</Button>
					<Button variant="outlined" color="error" onClick={handleLogout}>
						Logout
					</Button>
				</Box>
			</Grid>

			<Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', m: 2 }}>
				{notes &&
					notes.length > 0 &&
					notes.map((note) => (
						<Box onClick={() => handleNoteClick(note)} sx={{ p: 2, m: 2, width: 240, height: 180, alignContent: 'center', textAlign: 'center', border: '2px solid grey', borderRadius: 2, bgcolor: 'rgba(255, 255, 255, 0.2)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.36)' }, backdropFilter: 'blur(14px)' }}>
							<NoteCard key={note._id} note={note} />
							{note.password_protected && <LockOutline fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />}
						</Box>
					))}
			</Box>

			<Dialog open={passwordPromptOpen} onClose={() => setPasswordPromptOpen(false)}>
				<DialogTitle>Enter Note Password</DialogTitle>
				<Box sx={{ p: 2 }}>
					<TextField label="Password" type="password" fullWidth value={enteredPassword} onChange={(e) => setEnteredPassword(e.target.value)} />
					<DialogActions sx={{ mt: 2 }}>
						<Button onClick={() => setPasswordPromptOpen(false)}>Cancel</Button>
						<Button variant="contained" onClick={handleNoteAuth}>
							Submit
						</Button>
					</DialogActions>
				</Box>
			</Dialog>
		</Box>
	);
};

export default Dashboard;
