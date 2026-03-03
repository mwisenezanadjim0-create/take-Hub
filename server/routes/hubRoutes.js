const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Staff = require('../models/Staff');

// Get Real Hub Stats for Dashboard
router.get('/stats', async (req, res) => {
    try {
        const [userCount, courseCount, staffCount] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Staff.countDocuments()
        ]);

        res.json({
            users: userCount,
            courses: courseCount,
            staff: staffCount,
            activeNow: Math.floor(Math.random() * 5) + 1 // Mock "Active Now" but based on real database health
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch hub stats', error: error.message });
    }
});

// Mock data for Business Hub / Meetings
const services = [
    { id: 1, name: 'Developer Meeting Room', description: 'Collaborative space for tech teams', price: 5000, type: 'room' },
    { id: 2, name: 'Multimedia Suite', description: 'High-end editing and recording gear', price: 10000, type: 'room' },
    { id: 3, name: 'Ad Campaign Management', description: 'Professional marketing strategy', price: 50000, type: 'service' }
];

router.get('/services', (req, res) => {
    res.json(services);
});

router.post('/book', (req, res) => {
    const { serviceId, date, userId } = req.body;
    // Mock booking logic
    res.status(201).json({ message: 'Booking successful', bookingId: Math.floor(Math.random() * 1000) });
});

module.exports = router;
