const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Course = require('../models/Course');

// Enroll a user in a course
router.post('/enroll', async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        // Check if already enrolled
        const existing = await Enrollment.findOne({ user: userId, course: courseId });
        if (existing) return res.status(400).json({ message: 'User already enrolled in this course' });

        const enrollment = new Enrollment({ user: userId, course: courseId });
        await enrollment.save();

        // Add to user's enrolledCourses
        await User.findByIdAndUpdate(userId, { $push: { enrolledCourses: courseId } });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Error enrolling in course', error: error.message });
    }
});

// Get user's enrollments
router.get('/user/:userId', async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.params.userId }).populate('course');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
    }
});

// Update lesson progress
router.put('/progress', async (req, res) => {
    try {
        const { enrollmentId, lessonId } = req.body;
        const enrollment = await Enrollment.findById(enrollmentId).populate('course');

        if (!enrollment.completedLessons.includes(lessonId)) {
            enrollment.completedLessons.push(lessonId);

            // Calculate percentage
            const totalLessons = enrollment.course.lessons.length;
            enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

            if (enrollment.progress === 100) {
                enrollment.status = 'completed';
            }

            await enrollment.save();
        }

        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error: error.message });
    }
});

module.exports = router;
