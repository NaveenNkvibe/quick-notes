const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { createNote, updateNote, deleteNote, noteAuth, getAllNotes, getNoteDetails } = require('../controllers/noteController');
const { validateCreateNote, validateUpdateNote, validateNoteAuth } = require('../middleware/validationMiddleware');

router.post('/create', auth, validateCreateNote, createNote);
router.put('/update/:id', auth, validateUpdateNote, updateNote);
router.post('/auth/:id', auth, validateNoteAuth, noteAuth);
router.delete('/delete/:id', auth, deleteNote);
router.get('/', auth, getAllNotes);
router.get('/:id', getNoteDetails);

module.exports = router;
