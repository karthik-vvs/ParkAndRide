const Booking = require('../models/Booking');
const Parking = require('../models/Parking');

// @desc    Get all parking spots
// @route   GET /api/bookings/parking-spots
// @access  Public
const getParkingSpots = async (req, res) => {
    try {
        const parkingSpots = await Parking.find({ status: 'active' });
        res.json(parkingSpots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { startTime, endTime, vehicleDetails, parking } = req.body;

        // Check if parking spot exists and has availability
        const parkingSpot = await Parking.findById(parking);
        if (!parkingSpot) {
            return res.status(404).json({ message: 'Parking spot not found' });
        }

        if (parkingSpot.availableSpots <= 0) {
            return res.status(400).json({ message: 'No spots available' });
        }

        // Calculate total price
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        const hours = Math.ceil((endDate - startDate) / (1000 * 60 * 60));
        const totalPrice = hours * parkingSpot.pricePerHour;

        // Create booking
        const booking = await Booking.create({
            user: req.user._id,
            parking,
            startTime,
            endTime,
            vehicleDetails,
            totalPrice
        });

        // Update parking spot availability
        parkingSpot.availableSpots -= 1;
        await parkingSpot.save();

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('parking')
            .sort('-createdAt');
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getParkingSpots
}; 