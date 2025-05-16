const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Note = require('../models/Note');

exports.createNote = async (req, res) => {
	const createdBy = req.user.id;
	const { content, expiry_type, expiresInMinutes, password_protected, note_password } = req.body;

	let hashedPassword = null;
	if (password_protected && note_password) {
		const salt = await bcrypt.genSalt(10);
		hashedPassword = await bcrypt.hash(note_password, salt);
	}

	const noteData = {
		content,
		expiry_type,
		createdBy,
		password_protected: !!password_protected,
		note_password: hashedPassword,
	};

	if (expiry_type === 'time' && expiresInMinutes) {
		noteData.expiresAt = new Date(Date.now() + parseInt(expiresInMinutes) * 60000);
	}

	const note = await Note.create(noteData);

	return res.status(200).json({ message: 'Note Created successfully', note }); // Return response
};

exports.updateNote = async (req, res) => {
	const createdBy = req.user.id;
	const noteId = req.params.id;
	const { content, expiry_type, expiresInMinutes, password_protected, note_password } = req.body;

	const updateData = {
		content,
		expiry_type,
		createdBy,
		password_protected: !!password_protected,
	};

	if (password_protected && note_password) {
		const salt = await bcrypt.genSalt(10);
		updateData.note_password = await bcrypt.hash(note_password, salt);
	} else {
		updateData.note_password = null;
	}

	if (expiry_type === 'time' && expiresInMinutes) {
		updateData.expiresAt = new Date(Date.now() + parseInt(expiresInMinutes) * 60000);
	} else if (expiry_type === 'read') {
		updateData.expiresAt = null;
	}

	const note = await Note.findOneAndUpdate({ _id: noteId, createdBy }, updateData, { new: true });
	if (!note) return res.status(401).json({ message: 'Note Details Not Found' });

	return res.status(200).json({ message: 'Note Updated successfully', note }); // Return response
};

exports.noteAuth = async (req, res) => {
	const userId = req.user.id;
	const noteId = req.params.id;
	const { note_password } = req.body;

	const note = await Note.findById(noteId);
	if (!note) return res.status(401).json({ message: 'Note Details Not Found' });

	if (!note.createdBy.equals(userId)) {
		return res.status(401).json({ message: 'Unauthorized User Access' });
	}

	if (note.password_protected) {
		if (!note_password) {
			return res.status(401).json({ message: 'Password Field Required' });
		}

		const isMatch = await bcrypt.compare(note_password, note.note_password || '');
		if (!isMatch) {
			return res.status(401).json({ message: 'Incorrect Password' });
		}
	}

	return res.status(200).json({ message: 'Note Authentication Successfull', note }); // Return response
};

exports.deleteNote = async (req, res) => {
	const userId = req.user.id;
	const noteId = req.params.id;

	const note = await Note.findById(noteId);
	if (!note) return res.status(401).json({ message: 'Note Details Not Found' });

	const deleteNote = await Note.findOneAndDelete({ _id: noteId, createdBy: userId });
	if (!deleteNote) return res.status(401).json({ message: 'Note Deletion Failed' });

	return res.status(200).json({ message: 'Note Deleted Successfully', note: deleteNote }); // Return response
};

exports.getAllNotes = async (req, res) => {
	const userId = req.user.id;

	await Note.deleteMany({ createdBy: new mongoose.Types.ObjectId(userId), hasBeenRead: true });

	const notes = await Note.find({ createdBy: new mongoose.Types.ObjectId(userId), hasBeenRead: false });

	return res.status(200).json({ message: 'All Notes Featched Successfully', notes }); // Return response
};

exports.getNoteDetails = async (req, res) => {
	const noteId = req.params.id;

	const note = await Note.findById(noteId);
	if (!note) return res.status(401).json({ message: 'Note Details Not Found' });

	if (note.expiresAt && new Date() > note.expiresAt) {
		return res.status(401).json({ message: 'Note Time Expired' });
	}

	if (!note.hasBeenRead && note.expiry_type === 'read') {
		note.hasBeenRead = true;
		await note.save();
	}

	return res.status(200).json({ message: 'All Notes Featched Successfully', note }); // Return response
};
