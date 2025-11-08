import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import BookParking from './components/BookParking';
import LastMileRides from './components/LastMileRides';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(true);
  const [currentView, setCurrentView] = useState('parking'); // 'parking' or 'rides'

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    },
    header: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '1rem',
      textAlign: 'center'
    },
    nav: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      padding: '1rem',
      backgroundColor: '#f8f9fa'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    activeButton: {
      backgroundColor: '#0056b3'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Park and Ride</h1>
        <p>Smart Parking & Last-Mile Connectivity Solution</p>
      </div>

      {isLoggedIn ? (
        <>
          <div style={styles.nav}>
            <button
              style={{
                ...styles.button,
                ...(currentView === 'parking' ? styles.activeButton : {})
              }}
              onClick={() => setCurrentView('parking')}
            >
              Book Parking
            </button>
            <button
              style={{
                ...styles.button,
                ...(currentView === 'rides' ? styles.activeButton : {})
              }}
              onClick={() => setCurrentView('rides')}
            >
              Last-Mile Rides
            </button>
            <button
              style={styles.button}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          {currentView === 'parking' ? <BookParking /> : <LastMileRides />}
        </>
      ) : (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
          {showLogin ? (
            <>
              <Login onLoginSuccess={handleLoginSuccess} />
              <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Don't have an account?{' '}
                <button
                  onClick={() => setShowLogin(false)}
                  style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
                >
                  Register Here
                </button>
              </p>
            </>
          ) : (
            <>
              <Register />
              <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Already have an account?{' '}
                <button
                  onClick={() => setShowLogin(true)}
                  style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
                >
                  Login Here
                </button>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App; 
