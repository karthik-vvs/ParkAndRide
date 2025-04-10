import React, { useState } from 'react';

const CreateRide = ({ onClose, onRideCreated }) => {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicleType: 'Auto',
    price: '',
    availableSeats: '',
    departureTime: '',
    driver: {
      name: '',
      contact: '',
      rating: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('driver.')) {
      const driverField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        driver: {
          ...prev.driver,
          [driverField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Ride created successfully!');
        onRideCreated();
        onClose();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create ride');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  const styles = {
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      width: '90%'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    group: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    },
    label: {
      fontWeight: 'bold'
    },
    input: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    select: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px'
    },
    button: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer'
    },
    submitButton: {
      backgroundColor: '#28a745',
      color: 'white'
    },
    cancelButton: {
      backgroundColor: '#dc3545',
      color: 'white'
    }
  };

  return (
    <div style={styles.modal}>
      <h2>Add New Ride</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.group}>
          <label style={styles.label}>Source:</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Destination:</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Vehicle Type:</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="Auto">Auto</option>
            <option value="Cab">Cab</option>
            <option value="Bike">Bike</option>
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Price (₹):</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Available Seats:</label>
          <input
            type="number"
            name="availableSeats"
            value={formData.availableSeats}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Departure Time:</label>
          <input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Driver Name:</label>
          <input
            type="text"
            name="driver.name"
            value={formData.driver.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Driver Contact:</label>
          <input
            type="text"
            name="driver.contact"
            value={formData.driver.contact}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.group}>
          <label style={styles.label}>Driver Rating:</label>
          <input
            type="number"
            name="driver.rating"
            value={formData.driver.rating}
            onChange={handleChange}
            style={styles.input}
            min="1"
            max="5"
            step="0.1"
            required
          />
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={onClose}
            style={{...styles.button, ...styles.cancelButton}}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{...styles.button, ...styles.submitButton}}
          >
            Create Ride
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRide; 