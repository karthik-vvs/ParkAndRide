const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getAvailableRides,
    createRide,
    bookRide,
    getUserRides,
    completeRide
} = require('../controllers/rideController');

// Public routes
router.get('/available', getAvailableRides);

// Protected routes
router.post('/', protect, createRide);
router.post('/:id/book', protect, bookRide);
router.get('/user', protect, getUserRides);
router.post('/:id/complete', protect, completeRide);

module.exports = router; 