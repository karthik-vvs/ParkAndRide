const mongoose = require('mongoose');

const ParkingSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    totalSpots: {
        type: Number,
        required: true
    },
    availableSpots: {
        type: Number,
        required: true
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    features: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['active', 'maintenance', 'closed'],
        default: 'active'
    },
    coordinates: {
        lat: Number,
        lng: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Parking', ParkingSchema); 