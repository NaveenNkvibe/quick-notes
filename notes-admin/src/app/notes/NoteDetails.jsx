import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogActions, IconButton, Tooltip } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import axios from 'axios';

const NoteDetailCard = () => {
	const { id } = useParams();
	const [note, setNote] = useState(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const navigate = useNavigate();

	const token = localStorage.getItem('token');

	useEffect(() => {
		const fetchNote = async () => {
			try {
				const token = localStorage.getItem('token');
				const res = await axios.get(`http://localhost:5000/api/notes/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setNote(res.data.note);
			} catch (err) {
				console.log(err);
				alert('Failed To Load Note Details.');
			}
		};
		fetchNote();
	}, [id]);

	const handleDelete = async () => {
		try {
			const token = localStorage.getItem('token');
			await axios.delete(`http://localhost:5000/api/notes/delete/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			navigate('/dashboard');
		} catch (err) {
			console.log(err);
			alert('Failed to delete note');
		}
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(window.location.href);
		alert('Link Copied To Clipboard!');
	};

	if (!note)
		return (
			<Box display="flex" justifyContent="center" alignContent="center" alignItems="center" sx={{ width: '100%', height: '100%' }}>
				<Typography variant="h1">Loading...</Typography>
			</Box>
		);

	return (
		<>
			<Box sx={{ maxWidth: '100%', mx: 'auto', pl: 6, pr: 6, pt: 4 }}>
				<Grid container justifyContent="space-between" alignItems="center">
					<Grid item justifyContent="flex-start" sx={{ maxHeight: 100, maxWidth: '100%' }}>
						<Typography variant="h4">Note Details</Typography>
					</Grid>
					<Grid item justifyContent="flex-end" sx={{ maxHeight: 100, maxWidth: '100%' }}>
						{token && (
							<Box>
								<Tooltip title="Copy Link">
									<IconButton color="primary" onClick={handleCopyLink}>
										<ContentCopy />
									</IconButton>
								</Tooltip>
								<Button variant="contained" sx={{ mr: 2 }} onClick={() => navigate(`/update-note/${id}`)}>
									Update
								</Button>
								<Button variant="outlined" color="error" onClick={() => setConfirmOpen(true)}>
									Delete
								</Button>
							</Box>
						)}
					</Grid>
				</Grid>
			</Box>

			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100vh', width: '100%', m: 2 }}>
				<Box sx={{ justifyItems: 'center', width: '60%', maxHeight: '80%', p: 2, color: 'black', textAlign: 'center', border: '2px solid grey', borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.2)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.36)' }, backdropFilter: 'blur(14px)' }}>
					<Typography variant="h5" sx={{ mt: 2, whiteSpace: 'pre-wrap', boxShadow: '2', borderRadius: 4 }}>
						{note.content}
					</Typography>

					<Box sx={{ mt: 10, boxShadow: '2', width: '40%', padding: 2, borderRadius: 4 }}>
						<Box display="flex" justifyContent="space-between">
							<Typography variant="subtitle1">
								<strong>Expiry Type:</strong>
							</Typography>
							<Typography variant="subtitle1">{note.expiry_type === 'read' ? 'Destroy After Read' : 'Expire in Time'}</Typography>
						</Box>
						{note.expiry_type === 'time' && (
							<Box display="flex" justifyContent="space-between">
								<Typography variant="subtitle1">
									<strong>Expires At:</strong>
								</Typography>
								<Typography variant="subtitle1">{new Date(note.expiresAt).toLocaleString()}</Typography>
							</Box>
						)}
						<Box display="flex" justifyContent="space-between">
							<Typography variant="subtitle1">
								<strong>Password Protected:</strong>
							</Typography>
							<Typography variant="subtitle1">{note.password_protected ? 'Yes' : 'No'}</Typography>
						</Box>
						<Box display="flex" justifyContent="space-between">
							<Typography variant="subtitle1">
								<strong>Created On:</strong>
							</Typography>
							<Typography variant="subtitle1">{note.createdAt.slice(0, 10)}</Typography>
						</Box>
					</Box>

					{token && (
						<Button variant="contained" color="primary" sx={{ margin: 2 }} onClick={() => navigate('/dashboard')}>
							Back
						</Button>
					)}
					<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
						<DialogTitle>Are You Sure You Want To Delete?</DialogTitle>
						<DialogActions>
							<Button onClick={() => setConfirmOpen(false)} color="primary">
								Cancel
							</Button>
							<Button onClick={handleDelete} color="error" variant="contained">
								Delete
							</Button>
						</DialogActions>
					</Dialog>
				</Box>
			</Box>
		</>
	);
};

export default NoteDetailCard;
