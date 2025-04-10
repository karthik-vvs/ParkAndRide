import React, { useState, useEffect } from 'react';

const BookParking = () => {
  const [bookingData, setBookingData] = useState({
    startTime: '',
    endTime: '',
    vehicleDetails: ''
  });

  const [parkingSpots, setParkingSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParkingSpots();
  }, []);

  const fetchParkingSpots = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings/parking-spots');
      const data = await response.json();
      if (response.ok) {
        setParkingSpots(data);
      } else {
        setError(data.message || 'Failed to fetch parking spots');
      }
    } catch (error) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSpotSelect = (spot) => {
    setSelectedSpot(spot);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSpot) {
      alert('Please select a parking spot');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book parking');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...bookingData,
          parking: selectedSpot._id
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Booking successful!');
        // Refresh parking spots after successful booking
        fetchParkingSpots();
        // Reset form
        setBookingData({
          startTime: '',
          endTime: '',
          vehicleDetails: ''
        });
        setSelectedSpot(null);
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '40px auto',
      padding: '20px'
    },
    spotList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    spot: {
      padding: '15px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer'
    },
    selectedSpot: {
      border: '2px solid #007bff'
    },
    form: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  };

  if (loading) return <div style={styles.container}>Loading parking spots...</div>;
  if (error) return <div style={styles.container}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h2>Book Parking</h2>
      
      <div style={styles.spotList}>
        {parkingSpots.map(spot => (
          <div
            key={spot._id}
            style={{
              ...styles.spot,
              ...(selectedSpot?._id === spot._id ? styles.selectedSpot : {})
            }}
            onClick={() => handleSpotSelect(spot)}
          >
            <h3>{spot.location}</h3>
            <p>Available Spots: {spot.availableSpots}/{spot.totalSpots}</p>
            <p>Price: ₹{spot.pricePerHour}/hour</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="datetime-local"
          name="startTime"
          value={bookingData.startTime}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="datetime-local"
          name="endTime"
          value={bookingData.endTime}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="vehicleDetails"
          placeholder="Vehicle Details (e.g., KA01AB1234)"
          value={bookingData.vehicleDetails}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookParking; 