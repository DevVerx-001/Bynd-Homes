import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../components/constant';

const AlllBooking = () => {
  const [bookings, setBookings] = useState([]); // Store fetched bookings
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Assume token is stored here; adjust as needed
        const response = await axios.get(`${API_BASE_URL}/api/bookings/my-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        if (response.data.success) {
          setBookings(response.data.data.bookings || []);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Unable to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="py-5 px-10 min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-semibold text-gray-600">Loading bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-5 px-10 min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600 text-lg font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 px-10 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No bookings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Link to={`/signlebooking/${booking._id}`} key={booking._id}>            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {booking.property?.title || 'Comfortable Downtown Property'}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Check-in: {new Date(booking.checkIn).toLocaleDateString()}<br />
                  Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                </p>
                <div className="flex flex-col text-sm text-gray-500 mb-3">
                  <span>Status: {booking.status || 'N/A'}</span>
                  <span>Payment Status: {booking.paymentStatus || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>Guests: {booking.guests || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-red-600 font-bold">
                    ${booking.totalAmount || 'N/A'}
                  </span>
                  <span className="text-sm text-gray-500">Total</span>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlllBooking;