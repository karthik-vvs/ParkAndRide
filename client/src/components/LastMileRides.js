import React, { useState, useEffect } from 'react';
import CreateRide from './CreateRide';

const LastMileRides = () => {
  const [rides, setRides] = useState([]);
  const [userRides, setUserRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserRides, setShowUserRides] = useState(false);
  const [showCreateRide, setShowCreateRide] = useState(false);
  const [filters, setFilters] = useState({
    vehicleType: '',
    maxPrice: '',
    source: '',
    destination: ''
  });

  useEffect(() => {
    fetchRides();
  }, [showUserRides]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = showUserRides ? '/api/rides/user' : '/api/rides/available';
      const headers = showUserRides ? { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        headers,
        credentials: 'include'
      });
      const data = await response.json();
      
      if (response.ok) {
        if (showUserRides) {
          setUserRides(data);
        } else {
          setRides(data);
        }
      } else {
        setError(data.message || 'Failed to fetch rides');
      }
    } catch (error) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredRides = (showUserRides ? userRides : rides).filter(ride => {
    return (
      (!filters.vehicleType || ride.vehicleType === filters.vehicleType) &&
      (!filters.maxPrice || ride.price <= filters.maxPrice) &&
      (!filters.source || ride.source.toLowerCase().includes(filters.source.toLowerCase())) &&
      (!filters.destination || ride.destination.toLowerCase().includes(filters.destination.toLowerCase()))
    );
  });

  const bookRide = async (rideId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book a ride');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/rides/${rideId}/book`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        alert('Ride booked successfully!');
        fetchRides();
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  const completeRide = async (rideId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/rides/${rideId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        alert('Ride marked as completed!');
        fetchRides();
      } else {
        alert(data.message || 'Failed to complete ride');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    filters: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    filterInput: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    rideGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    rideCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    actionButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      marginTop: '10px',
      cursor: 'pointer'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: showCreateRide ? 'block' : 'none'
    }
  };

  if (loading) return <div style={styles.container}>Loading rides...</div>;
  if (error) return <div style={styles.container}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Last-Mile Rides</h2>
        <div>
          <button 
            style={styles.button}
            onClick={() => setShowUserRides(!showUserRides)}
          >
            {showUserRides ? 'Show Available Rides' : 'Show My Rides'}
          </button>
          {!showUserRides && (
            <button 
              style={{...styles.button, marginLeft: '10px'}}
              onClick={() => setShowCreateRide(true)}
            >
              Add New Ride
            </button>
          )}
        </div>
      </div>

      <div style={styles.filters}>
        <select
          name="vehicleType"
          value={filters.vehicleType}
          onChange={handleFilterChange}
          style={styles.filterInput}
        >
          <option value="">All Vehicle Types</option>
          <option value="Auto">Auto</option>
          <option value="Cab">Cab</option>
          <option value="Bike">Bike</option>
        </select>

        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          style={styles.filterInput}
        />

        <input
          type="text"
          name="source"
          placeholder="Source Location"
          value={filters.source}
          onChange={handleFilterChange}
          style={styles.filterInput}
        />

        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={filters.destination}
          onChange={handleFilterChange}
          style={styles.filterInput}
        />
      </div>

      <div style={styles.rideGrid}>
        {filteredRides.map(ride => (
          <div key={ride._id} style={styles.rideCard}>
            <h3>{ride.vehicleType}</h3>
            <p>From: {ride.source}</p>
            <p>To: {ride.destination}</p>
            <p>Price: ₹{ride.price}</p>
            <p>Available Seats: {ride.availableSeats}</p>
            <p>Departure: {new Date(ride.departureTime).toLocaleString()}</p>
            {ride.driver && (
              <div>
                <p>Driver: {ride.driver.name}</p>
                <p>Contact: {ride.driver.contact}</p>
                <p>Rating: {ride.driver.rating} ⭐</p>
              </div>
            )}
            {!showUserRides && (
              <button 
                style={styles.actionButton}
                onClick={() => bookRide(ride._id)}
              >
                Book Now
              </button>
            )}
            {showUserRides && ride.status === 'booked' && (
              <button 
                style={{...styles.actionButton, backgroundColor: '#dc3545'}}
                onClick={() => completeRide(ride._id)}
              >
                Complete Ride
              </button>
            )}
          </div>
        ))}
      </div>

      {showCreateRide && (
        <>
          <div style={styles.modalOverlay} onClick={() => setShowCreateRide(false)} />
          <CreateRide
            onClose={() => setShowCreateRide(false)}
            onRideCreated={fetchRides}
          />
        </>
      )}
    </div>
  );
};

export default LastMileRides; 