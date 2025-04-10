const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ride = require('../models/Ride');

dotenv.config();

mongoose.connect('mongodb://127.0.0.1:27017/park-and-ride', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

const rides = [
    {
        source: 'Metro Station A',
        destination: 'Tech Park',
        vehicleType: 'Auto',
        price: 50,
        availableSeats: 3,
        departureTime: new Date(Date.now() + 30 * 60000), // 30 minutes from now
        driver: {
            name: 'Raj Kumar',
            contact: '9876543210',
            rating: 4.5
        },
        status: 'available'
    },
    {
        source: 'Metro Station B',
        destination: 'Shopping Mall',
        vehicleType: 'Cab',
        price: 120,
        availableSeats: 4,
        departureTime: new Date(Date.now() + 45 * 60000), // 45 minutes from now
        driver: {
            name: 'Suresh Kumar',
            contact: '9876543211',
            rating: 4.8
        },
        status: 'available'
    },
    {
        source: 'Metro Station C',
        destination: 'Business District',
        vehicleType: 'Bike',
        price: 30,
        availableSeats: 1,
        departureTime: new Date(Date.now() + 15 * 60000), // 15 minutes from now
        driver: {
            name: 'Amit Singh',
            contact: '9876543212',
            rating: 4.6
        },
        status: 'available'
    },
    {
        source: 'Metro Station A',
        destination: 'Residential Complex',
        vehicleType: 'Cab',
        price: 150,
        availableSeats: 4,
        departureTime: new Date(Date.now() + 60 * 60000), // 1 hour from now
        driver: {
            name: 'Priya Sharma',
            contact: '9876543213',
            rating: 4.9
        },
        status: 'available'
    },
    {
        source: 'Metro Station B',
        destination: 'Hospital',
        vehicleType: 'Auto',
        price: 80,
        availableSeats: 3,
        departureTime: new Date(Date.now() + 20 * 60000), // 20 minutes from now
        driver: {
            name: 'Ravi Kumar',
            contact: '9876543214',
            rating: 4.7
        },
        status: 'available'
    }
];

const seedRides = async () => {
    try {
        // Clear existing rides
        await Ride.deleteMany({});
        console.log('Cleared existing rides');

        // Insert new rides
        const createdRides = await Ride.insertMany(rides);
        console.log(`Added ${createdRides.length} rides`);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding rides:', error);
        mongoose.connection.close();
    }
};

seedRides(); 