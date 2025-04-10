const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Parking = require('../models/Parking');

dotenv.config();

const parkingSpots = [
    {
        location: 'Metro Station A',
        totalSpots: 50,
        availableSpots: 30,
        pricePerHour: 20,
        status: 'active'
    },
    {
        location: 'Metro Station B',
        totalSpots: 40,
        availableSpots: 25,
        pricePerHour: 25,
        status: 'active'
    },
    {
        location: 'Metro Station C',
        totalSpots: 30,
        availableSpots: 15,
        pricePerHour: 30,
        status: 'active'
    }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/park-and-ride', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('MongoDB Connected');
    
    // Clear existing parking spots
    await Parking.deleteMany({});
    console.log('Cleared existing parking spots');

    // Add new parking spots
    const createdParkings = await Parking.insertMany(parkingSpots);
    console.log('Added parking spots:', createdParkings);

    process.exit();
})
.catch(err => {
    console.error('Error:', err);
    process.exit(1);
}); 