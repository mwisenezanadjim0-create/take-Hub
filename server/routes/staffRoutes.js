const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// Get all staff
router.get('/', async (req, res) => {
    try {
        const staff = await Staff.find().sort({ joinedAt: -1 });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff', error: error.message });
    }
});

// Add a staff member
router.post('/', async (req, res) => {
    try {
        const { name, role, department, bio, email, avatar } = req.body;
        const newStaff = new Staff({ name, role, department, bio, email, avatar });
        await newStaff.save();
        res.status(201).json(newStaff);
    } catch (error) {
        res.status(500).json({ message: 'Error adding staff', error: error.message });
    }
});

// Update a staff member
router.put('/:id', async (req, res) => {
    try {
        const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStaff) return res.status(404).json({ message: 'Staff not found' });
        res.json(updatedStaff);
    } catch (error) {
        res.status(500).json({ message: 'Error updating staff' });
    }
});

// Delete a staff member
router.delete('/:id', async (req, res) => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) return res.status(404).json({ message: 'Staff not found' });
        res.json({ message: 'Staff deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting staff' });
    }
});

module.exports = router;
