const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
	{
		content: { type: String, required: true },
		expiry_type: { type: String, enum: ['read', 'time'], default: 'read' },
		expiresAt: { type: Date, default: null },
		hasBeenRead: { type: Boolean, default: false },
		password_protected: { type: Boolean, default: false },
		note_password: { type: String, default: null },
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true },
);

noteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Note', noteSchema);
