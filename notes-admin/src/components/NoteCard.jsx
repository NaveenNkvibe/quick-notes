import { Card, CardContent, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NoteCard = ({ note }) => {
	const shortContent = note.content.length > 18 ? note.content.slice(0, 18) + '....' : note.content; // Shorten the content for display

	return (
		<Card component={Link} to={`/note/${note._id}`} sx={{ textDecoration: 'none' }}>
			<CardContent>
				<Typography variant="h6">{shortContent}</Typography>
				<Box justifyContent="center" alignItems="center">
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="caption">
							<strong>Created On:</strong>
						</Typography>
						<Typography>{note.createdAt.slice(0, 10)}</Typography>
					</Box>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="caption">
							<strong>Status:</strong>
						</Typography>
						<Typography variant="caption">{note.hasBeenRead ? 'Read' : 'Unread'}</Typography>
					</Box>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="caption">
							<strong>Expiry Type:</strong>
						</Typography>
						<Typography variant="caption">{note.expiry_type ? 'Read' : 'Unread'}</Typography>
					</Box>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="caption">
							<strong>Expires At:</strong>
						</Typography>
						<Typography variant="caption">{note.expiresAt ? new Date(note.expiresAt).toLocaleString() : 'No Expiry'}</Typography>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
};

export default NoteCard;
