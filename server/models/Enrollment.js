const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }, // Percentage 0-100
    completedLessons: [{ type: String }], // Array of lesson IDs or titles
    status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
