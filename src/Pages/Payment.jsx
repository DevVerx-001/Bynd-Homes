import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_BASE_URL } from '../components/constant';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51SBCvPGzW801ceSnIGzXbUWTWpat3CTkadnes2rweseiPpsXpYmAWiV5WR2kwX6bXfBn05lawMGimdPpY0UnMrHn00zL3g3b23');

// Payment Form Component
const PaymentForm = ({ booking, onPaymentSuccess, onPaymentError, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  // Fetch client secret when the component mounts or booking changes
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/bookings/${booking._id}/payment-intent-secret`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { paymentIntentId: booking.stripePaymentIntentId }
        });

        if (response.data.success && response.data.clientSecret) {
          setClientSecret(response.data.clientSecret);
        } else {
          throw new Error('Unable to retrieve payment secret.');
        }
      } catch (error) {
        setError('Failed to initialize payment. Contact support.');
        onPaymentError('Failed to initialize payment.');
      }
    };

    if (booking && booking._id && booking.stripePaymentIntentId) {
      fetchClientSecret();
    }
  }, [booking]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    // Validate client secret format
    if (!clientSecret || !clientSecret.includes('_secret_')) {
      setError('Invalid payment configuration. Please try again.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: booking.user?.name || 'Customer',
            email: booking.user?.email || 'customer@example.com',
          },
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        onPaymentError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed. Please try again.');
      onPaymentError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Payment Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Card Details</label>
            <div className="border rounded-md p-3">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm mb-4">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || processing || !clientSecret}
              className="flex-1 bg-green-600 text-white py-3 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Pay $${booking.totalAmount}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GetoneBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/bookings/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Booking API Response:', response.data);

        if (response.data.success) {
          const bookingData = response.data.data.booking;
          setBooking(bookingData);
        } else {
          setError('Failed to fetch booking details');
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Unable to load booking details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id, navigate]);

  // Handle payment success
  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      setProcessingPayment(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      // Update the booking status to paid
      const updateResponse = await axios.patch(
        `${API_BASE_URL}/api/bookings/${id}`,
        {
          paymentStatus: 'paid',
          stripePaymentIntentId: paymentIntent.id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (updateResponse.data.success) {
        // Confirm the booking
        const confirmResponse = await axios.post(
          `${API_BASE_URL}/api/bookings/${id}/confirm`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (confirmResponse.data.success) {
          setIsPayModalOpen(false);
          
          // Refresh booking details
          const updatedResponse = await axios.get(`${API_BASE_URL}/api/bookings/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setBooking(updatedResponse.data.data.booking);
        } else {
        }
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentError = (errorMessage) => {
    setIsPayModalOpen(false);
  };

  const handlePayBillClick = () => {
    if (!booking.stripePaymentIntentId || booking.paymentStatus !== 'pending') {
      return;
    }
    setIsPayModalOpen(true);
  };

  const handleClosePaymentForm = () => {
    setIsPayModalOpen(false);
  };

  const calculateNights = (checkIn, checkOut) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.round(Math.abs((checkOutDate - checkInDate) / oneDay));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-xl font-semibold text-gray-600">Loading booking details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-red-600 text-lg font-semibold">{error}</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-gray-600 text-lg">Booking not found.</div>
      </div>
    );
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Details</h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Booking ID: {booking._id}</p>
              <p className={`text-lg font-semibold ${
                booking.status === 'confirmed' ? 'text-green-600' : 
                booking.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                Status: {booking.status.toUpperCase()}
              </p>
              <p className="text-sm text-gray-500">
                Stripe PI: {booking.stripePaymentIntentId || 'Not set'}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${
                booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'
              }`}>
                Payment: {booking.paymentStatus.toUpperCase()}
              </p>
              <p className="text-2xl font-bold text-gray-900">Total: ${booking.totalAmount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Property Information</h2>
              {booking.property && (
                <div className="space-y-4">
                  <img
                    src={booking.property.images?.[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={booking.property.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{booking.property.title}</h3>
                    <p className="text-gray-600">
                      {booking.property.address?.city}, {booking.property.address?.state}, {booking.property.address?.country}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Check-in Date</p>
                  <p className="text-gray-600">{new Date(booking.checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium">Check-out Date</p>
                  <p className="text-gray-600">{new Date(booking.checkOut).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium">Number of Nights</p>
                  <p className="text-gray-600">{nights}</p>
                </div>
                <div>
                  <p className="font-medium">Number of Guests</p>
                  <p className="text-gray-600">{booking.guests}</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Price Breakdown</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>${booking.property?.pricePerNight || booking.totalAmount / nights} x {nights} nights</span>
                  <span>${booking.totalAmount}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total Amount</span>
                  <span>${booking.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Section */}
          <div className="space-y-6">
            {booking.paymentStatus === 'pending' && booking.stripePaymentIntentId && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Payment Required</h3>
                <p className="text-gray-600 mb-4">
                  Complete your payment to confirm this booking.
                </p>
                <button
                  onClick={handlePayBillClick}
                  className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700"
                >
                  Pay Your Bill to Confirm Booking
                </button>
              </div>
            )}

            {booking.paymentStatus === 'paid' && booking.status === 'confirmed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-green-600 text-4xl mb-2">✓</div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Booking Confirmed!</h3>
                  <p className="text-green-700">Your payment has been processed and your booking is confirmed.</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/properties')}
                  className="w-full bg-gray-600 text-white py-2 rounded-md font-semibold hover:bg-gray-700"
                >
                  Book Another Property
                </button>
                
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => window.print()}
                    className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700"
                  >
                    Print Booking Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {isPayModalOpen && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            booking={booking}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onClose={handleClosePaymentForm}
          />
        </Elements>
      )}
    </div>
  );
};

export default GetoneBooking;