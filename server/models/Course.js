const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['development', 'multimedia', 'soft-skills', 'business'], required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    instructor: { type: String, required: true },
    price: { type: Number, default: 0 },
    thumbnail: { type: String, default: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085' },
    duration: { type: String, default: '4 weeks' },
    lessons: [{ title: String, content: String, videoUrl: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
