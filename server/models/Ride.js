const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['Auto', 'Cab', 'Bike']
    },
    price: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true,
        min: 0
    },
    departureTime: {
        type: Date,
        required: true
    },
    driver: {
        name: String,
        contact: String,
        rating: Number
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'completed'],
        default: 'available'
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema); 