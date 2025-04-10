const Ride = require('../models/Ride');

// Get all available rides
const getAvailableRides = async (req, res) => {
    try {
        const rides = await Ride.find({ status: 'available' })
            .sort({ departureTime: 1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new ride
const createRide = async (req, res) => {
    try {
        const ride = new Ride(req.body);
        const savedRide = await ride.save();
        res.status(201).json(savedRide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Book a ride
const bookRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        if (ride.status !== 'available') {
            return res.status(400).json({ message: 'Ride is not available' });
        }

        ride.status = 'booked';
        ride.bookedBy = req.user._id;
        const updatedRide = await ride.save();
        res.json(updatedRide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get user's booked rides
const getUserRides = async (req, res) => {
    try {
        const rides = await Ride.find({ bookedBy: req.user._id })
            .sort({ departureTime: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Complete a ride
const completeRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        if (ride.status !== 'booked') {
            return res.status(400).json({ message: 'Ride is not booked' });
        }

        ride.status = 'completed';
        const updatedRide = await ride.save();
        res.json(updatedRide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAvailableRides,
    createRide,
    bookRide,
    getUserRides,
    completeRide
}; 