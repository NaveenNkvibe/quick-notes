const { body, validationResult } = require('express-validator');

const validateUserRegistration = [
	body('name').notEmpty().withMessage('Username is required'), // Check if username is available
	body('email').isEmail().withMessage('Invalid email format'), // Check if email format is correct
	body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'), // Check if password has atleast 6 characters
	body('confirm_password').isLength({ min: 6 }).withMessage('Confirm Password must be at least 6 characters long'), // Check if confirm_password has atleast 6 characters
	(req, res, next) => {
		const errors = validationResult(req); // It extracts validation errors from the req
		if (!errors.isEmpty()) {
			// checks if there are validation errors
			return res.status(400).json({ errors: errors.array() }); // Returns response
		}
		next(); // Passes control to the next middleware
	},
]; // User Register validation

const validateUserLogin = [
	body('email').isEmail().withMessage('Invalid email format'), // Check if email format is correct
	body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'), // Check if password has atleast 6 characters
	(req, res, next) => {
		const errors = validationResult(req); // It extracts validation errors from the req
		if (!errors.isEmpty()) {
			// checks if there are validation errors
			return res.status(400).json({ errors: errors.array() }); // Returns response
		}
		next(); // Passes control to the next middleware
	},
]; // User Login validation

const validateCreateNote = [
	body('content').notEmpty().withMessage('Content is required'), // Check if content is available
	body('expiry_type').notEmpty().withMessage('Expiry type is required'), // Check if expiry_type is available
	body('password_protected').notEmpty().withMessage('Password is required'), // Check if password_protected is available
	(req, res, next) => {
		const errors = validationResult(req); // It extracts validation errors from the req
		if (!errors.isEmpty()) {
			// checks if there are validation errors
			return res.status(400).json({ errors: errors.array() }); // Returns response
		}
		next(); // Passes control to the next middleware
	},
]; // Note Create validation

const validateUpdateNote = [
	body('content').notEmpty().withMessage('Content is required'), // Check if content is available
	body('expiry_type').notEmpty().withMessage('Expiry type is required'), // Check if expiry_type is available
	body('password_protected').notEmpty().withMessage('Password is required'), // Check if password_protected is available
	(req, res, next) => {
		const errors = validationResult(req); // It extracts validation errors from the req
		if (!errors.isEmpty()) {
			// checks if there are validation errors
			return res.status(400).json({ errors: errors.array() }); // Returns response
		}
		next(); // Passes control to the next middleware
	},
]; // Note Update validation

const validateNoteAuth = [
	body('note_password').notEmpty().withMessage('Password is required'), // Check if note_password is available
	(req, res, next) => {
		const errors = validationResult(req); // It extracts validation errors from the req
		if (!errors.isEmpty()) {
			// checks if there are validation errors
			return res.status(400).json({ errors: errors.array() }); // Returns response
		}
		next(); // Passes control to the next middleware
	},
]; // Note Authentication validation

module.exports = {
	validateCreateNote,
	validateUpdateNote,
	validateNoteAuth,
	validateUserRegistration,
	validateUserLogin,
};
