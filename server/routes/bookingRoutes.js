const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getParkingSpots } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.get('/parking-spots', getParkingSpots);
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);

module.exports = router; 