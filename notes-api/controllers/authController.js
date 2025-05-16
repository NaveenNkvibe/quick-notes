const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
	const { name, email, password, confirm_password } = req.body; // Fetch all data from body

	if (password !== confirm_password) {
		return res.status(401).json({ message: 'Passwords Do Not Match' });
	} // Compare password and confirm password

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		return res.status(401).json({ message: 'Email Already Registered' });
	} // Check if user already exists

	const hashedPassword = await bcrypt.hash(password, 10); // Hash password

	const newUser = new User({
		name,
		email,
		password: hashedPassword,
	}); // Create New User

	await newUser.save();

	const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	}); // Create An Token

	return res.status(200).json({ message: 'User Registred Successfully', token }); // Return response
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (!user) return res.status(401).json({ message: 'Invalid credentials' });

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

	return res.status(200).json({ message: 'User Log In Successfully', token }); // Return response
};
