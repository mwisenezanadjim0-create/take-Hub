const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true }, // e.g., Senior Developer, Tutor, Marketing Head
    department: { type: String, enum: ['academic', 'multimedia', 'marketing', 'administration', 'other'], required: true },
    bio: { type: String },
    email: { type: String },
    avatar: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
    joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);
