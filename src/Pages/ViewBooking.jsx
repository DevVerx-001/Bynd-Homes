import React, { useState, useEffect } from "react";
import { Wifi, Car, Utensils, Snowflake } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../components/constant";

// Custom Card Component
function Card({ children, className }) {
  return (
    <div className={`border rounded-2xl bg-white shadow-md p-6 ${className || ""}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className }) {
  return <div className={`mt-2 ${className || ""}`}>{children}</div>;
}

export default function ViewBooking() {
  const { id } = useParams(); // Get property ID from URL
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [guests, setGuests] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [selecting, setSelecting] = useState("checkIn");

  // State for modal
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/properties/${id}`);
        
        if (response.data.success) {
          setProperty(response.data.data.property);
          // Set default guests to 1 or property's max guests if less
          setGuests(Math.min(1, response.data.data.property.maxGuests));
        } else {
          setError('Failed to fetch property details');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('Unable to load property details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Handle day click for calendar
  const handleDayClick = (day) => {
    const year = 2025;
    const month = 8; // September (0-indexed)
    const formatDate = (day) => {
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      return `${year}-${mm}-${dd}`;
    };

    const dateStr = formatDate(day);

    if (selecting === "checkIn") {
      setCheckInDate(dateStr);
      setCheckOutDate("");
      setSelecting("checkOut");
    } else {
      if (!checkInDate || new Date(dateStr) <= new Date(checkInDate)) {
        setModalMessage("Check-out date must be after check-in date");
        setShowModal(true);
        return;
      }
      setCheckOutDate(dateStr);
      setSelecting("checkIn");
    }
  };

  // Handle book now button click
  const handleBookNow = async () => {
    if (!checkInDate || !checkOutDate) {
      setModalMessage("Please select check-in and check-out dates");
      setShowModal(true);
      return;
    }

    if (guests < 1) {
      setModalMessage("Number of guests must be at least 1");
      setShowModal(true);
      return;
    }

    if (property && guests > property.maxGuests) {
      setModalMessage(`Maximum guests allowed for this property: ${property.maxGuests}`);
      setShowModal(true);
      return;
    }

    try {
      setBookingLoading(true);
      
      // Get user token from localStorage or wherever you store it
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        setModalMessage("Please login to book a property");
        setShowModal(true);
        navigate('/login');
        return;
      }

      const bookingData = {
        propertyId: id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guests
      };

      const response = await axios.post(`${API_BASE_URL}/api/bookings`, bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        console.log("Booking created successfully:", response.data);
        
        // Redirect to booking confirmation page or show success message
        const bookingId = response.data.data.booking._id;
        setModalMessage(response.data.message || "Booking created successfully");
        setShowModal(true);
        navigate(`/payment/${bookingId}`);
      } else {
        setModalMessage(response.data.message || "Failed to create booking");
        setShowModal(true);
      }
    } catch (error) {
      console.error('Booking error:', error);
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data.message || "Booking failed. Please try again.";
        setModalMessage(errorMessage);
        setShowModal(true);
        
        // If unauthorized, redirect to login
        if (error.response.status === 401) {
          navigate('/login');
        }
      } else if (error.request) {
        setModalMessage("Unable to connect to server. Please check your internet connection.");
        setShowModal(true);
      } else {
        setModalMessage("An unexpected error occurred. Please try again.");
        setShowModal(true);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // Auto-close modal after 2 seconds
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setModalMessage("");
      }, 2000);
      return () => clearTimeout(timer); // Cleanup timer on unmount or modal close
    }
  }, [showModal]);

  // Get property image
  const getPropertyImage = (property) => {
    if (property.images && property.images.length > 0 && property.images[0].url) {
      return property.images[0].url;
    }
    const fallbackImages = [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM3NTgxNDY3MDI4MjAyOTQ4NQ==/original/5fc7e7e4-8bb8-47c7-92e7-cb4217746ab8.jpeg?im_w=960",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1257682100579478788/original/9ed8a9f2-1188-4cf1-bd90-fe2d42c6bd2c.jpeg?im_w=720",
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-xl font-semibold text-gray-600">Loading property details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-red-600 text-lg font-semibold">{error}</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-gray-600 text-lg">Property not found.</div>
      </div>
    );
  }

  const year = 2025;
  const month = 8;

  return (
    <>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold text-gray-900">{modalMessage}</p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-white lg:px-20 max-sm:px-8 min-md:px-10 py-10 pt-30 flex flex-col lg:flex-row gap-8">
        {/* Left Side - Images */}
        <div className="flex-1">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src={getPropertyImage(property)}
              alt={property.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-4 mt-4 overflow-x-auto">
            {property.images && property.images.length > 0 ? (
              property.images.slice(0, 5).map((image, idx) => (
                <img
                  key={idx}
                  src={image.url}
                  alt={image.alt || `${property.title} ${idx + 1}`}
                  className="w-42 h-24 object-cover rounded-md cursor-pointer hover:opacity-80"
                />
              ))
            ) : (
              // Fallback thumbnails
              [
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
                "https://a0.muscache.com/im/pictures/hosting/Hosting-1257682100579478788/original/9ed8a9f2-1188-4cf1-bd90-fe2d42c6bd2c.jpeg?im_w=720",
                "https://a0.muscache.com/im/pictures/hosting/Hosting-1209489582780330420/original/18b54c91-c3fb-44bd-9abf-00515132d0fb.jpeg?im_w=960",
                "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM3NTgxNDY3MDI4MjAyOTQ4NQ==/original/5fc7e7e4-8bb8-47c7-92e7-cb4217746ab8.jpeg?im_w=960",
              ].map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Thumbnail ${idx}`}
                  className="w-42 h-24 object-cover rounded-md cursor-pointer hover:opacity-80"
                />
              ))
            )}
          </div>
        </div>

        {/* Right Side - Availability + Booking */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          {/* Availability Calendar */}
          <div className="bg-white px-2 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Availability</h2>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Check-in Box */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-700 mb-2 text-center">Check-in</h3>
                <div className="grid grid-cols-7 text-center text-xs gap-1">
                  {[...Array(30)].map((_, i) => {
                    const day = i + 1;
                    const formatDate = (day) => {
                      const mm = String(month + 1).padStart(2, "0");
                      const dd = String(day).padStart(2, "0");
                      return `${year}-${mm}-${dd}`;
                    };
                    const dateStr = formatDate(day);
                    
                    return (
                      <div
                        key={`checkin-${i}`}
                        className={`p-1.5 rounded cursor-pointer ${
                          checkInDate === dateStr
                            ? "bg-green-500 text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleDayClick(day)}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Check-out Box */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-700 mb-2 text-center">Check-out</h3>
                <div className="grid grid-cols-7 text-center text-xs gap-1">
                  {[...Array(30)].map((_, i) => {
                    const day = i + 1;
                    const formatDate = (day) => {
                      const mm = String(month + 1).padStart(2, "0");
                      const dd = String(day).padStart(2, "0");
                      return `${year}-${mm}-${dd}`;
                    };
                    const dateStr = formatDate(day);
                    
                    return (
                      <div
                        key={`checkout-${i}`}
                        className={`p-1.5 rounded cursor-pointer ${
                          checkOutDate === dateStr
                            ? "bg-red-500 text-white"
                            : checkInDate && dateStr > checkInDate 
                            ? "hover:bg-gray-100" 
                            : "bg-gray-200 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (!checkInDate || new Date(dateStr) <= new Date(checkInDate)) {
                            setModalMessage("Check-out must be after check-in");
                            setShowModal(true);
                            return;
                          }
                          setCheckOutDate(dateStr);
                          setSelecting("checkIn");
                        }}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white px-6 py-3 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Book Your Stay</h2>

            {/* Date Inputs */}
            <label className="block text-gray-700 mb-2">Check-in</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <label className="block text-gray-700 mb-2">Check-out</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            {/* Guests Selector */}
            <label className="block text-gray-700 mb-2">
              Number of Guests (Max: {property.maxGuests})
            </label>
            <div className="flex items-center space-x-3 mb-4">
              <button
                className="px-3 py-2 bg-red-500 text-white rounded-md disabled:opacity-50"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                disabled={guests <= 1}
              >
                -
              </button>

              <input
                type="text"
                value={guests}
                readOnly
                className="w-full py-2 text-center border rounded-xl border-gray-300"
              />

              <button
                className="px-3 py-2 bg-green-500 text-white rounded-md disabled:opacity-50"
                onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
                disabled={guests >= property.maxGuests}
              >
                +
              </button>
            </div>

            {/* Price Calculation */}
            {checkInDate && checkOutDate && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>${property.pricePerNight} x {Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))} nights</span>
                  <span>${property.pricePerNight * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))}</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Total</span>
                  <span>${property.pricePerNight * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))}</span>
                </div>
              </div>
            )}

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              disabled={bookingLoading || !checkInDate || !checkOutDate}
              className="w-full bg-red-600 text-white py-3 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading ? "Creating Booking..." : "Book Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="lg:px-20 max-sm:px-8 min-md:px-12 lg:mb-10">
        <Card className="max-w-2xl border-gray-200 rounded-xl">
          <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-gray-600">
            {property.address.city}, {property.address.state}, {property.address.country}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-red-500">★★★★★</span>
            <span className="text-gray-700 text-sm">4.8 / 5</span>
          </div>

          <p className="text-2xl font-semibold mt-2">
            ${property.pricePerNight} <span className="text-lg font-normal">/ night</span>
          </p>

          <CardContent className="mb-20">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About this place</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {property.description}
            </p>
          </CardContent>

          <CardContent>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What this place offers
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {property.amenities && property.amenities.slice(0, 4).map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                  <Wifi className="h-5 w-5 text-gray-700" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
            {property.amenities && property.amenities.length > 4 && (
              <p className="text-gray-600 text-sm mt-2">
                +{property.amenities.length - 4} more amenities
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}