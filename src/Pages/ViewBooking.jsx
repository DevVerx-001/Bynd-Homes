import React, { useState } from "react";
import { Wifi, Car, Utensils, Snowflake } from "lucide-react";
import { Link } from "react-router-dom";

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
  const [guests, setGuests] = useState(1);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [selecting, setSelecting] = useState("checkIn"); // track which date to set

  const year = 2025;
  const month = 8; // September (0-indexed)

  // Helper to format day as YYYY-MM-DD
  const formatDate = (day) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const handleDayClick = (day) => {
    const dateStr = formatDate(day);

    if (selecting === "checkIn") {
      setCheckInDate(dateStr);
      setCheckOutDate(""); // reset checkout when new checkin chosen
      setSelecting("checkOut");
    } else {
      // make sure checkout is after checkin
      if (!checkInDate || new Date(dateStr) <= new Date(checkInDate)) {
        alert("Check-out date must be after check-in date");
        return;
      }
      setCheckOutDate(dateStr);
      setSelecting("checkIn"); // reset to checkin for next flow
    }
  };

  const bookingId = "Booking-123";

  return (
    <>
      <div className="min-h-screen bg-white lg:px-20 max-sm:px-8 min-md:px-10 py-10 pt-30 flex flex-col lg:flex-row gap-8">
        {/* Left Side - Images */}
        <div className="flex-1">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Main property"
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-4 mt-4 overflow-x-auto">
            {[
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
              "https://a0.muscache.com/im/pictures/hosting/Hosting-1257682100579478788/original/9ed8a9f2-1188-4cf1-bd90-fe2d42c6bd2c.jpeg?im_w=720",
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
              "https://a0.muscache.com/im/pictures/hosting/Hosting-1209489582780330420/original/18b54c91-c3fb-44bd-9abf-00515132d0fb.jpeg?im_w=960",
              "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM3NTgxNDY3MDI4MjAyOTQ4NQ==/original/5fc7e7e4-8bb8-47c7-92e7-cb4217746ab8.jpeg?im_w=960",
            ].map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Thumbnail ${idx}`}
                className="w-42 h-24 object-cover rounded-md cursor-pointer hover:opacity-80"
              />
            ))}
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
                    const dateStr = formatDate(day);
                    return (
                      <div
                        key={`checkin-${i}`}
                        className={`p-1.5 rounded cursor-pointer ${checkInDate === dateStr
                            ? "bg-green-500 text-white"
                            : "hover:bg-gray-100"
                          }`}
                        onClick={() => {
                          setCheckInDate(dateStr);
                          setCheckOutDate(""); // reset checkout
                          setSelecting("checkOut");
                        }}
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
                    const dateStr = formatDate(day);
                    return (
                      <div
                        key={`checkout-${i}`}
                        className={`p-1.5 rounded cursor-pointer ${checkOutDate === dateStr
                            ? "bg-red-500 text-white"
                            : "hover:bg-gray-100"
                          }`}
                        onClick={() => {
                          if (!checkInDate || new Date(dateStr) <= new Date(checkInDate)) {
                            alert("Check-out must be after check-in");
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

            {/* Date Inputs auto update */}
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
            <label className="block text-gray-700 mb-2">Number of Guests</label>
            <div className="flex items-center space-x-3 mb-4">
              <button
                className="px-3 py-2 bg-red-500 text-white rounded-md"
                onClick={() => setGuests(Math.max(1, guests - 1))}
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
                className="px-3 py-2 bg-green-500 text-white rounded-md"
                onClick={() => setGuests(guests + 1)}
              >
                +
              </button>
            </div>

            {/* Book Now Button */}
            <Link
              to={`/booking/${bookingId}`}
              className="w-full bg-red-600 text-white py-3 rounded-md font-semibold text-center block"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
      <div className="  lg:px-20 max-sm:px-8 min-md:px-12 lg:mb-10 ">
        <Card className="max-w-2xl border-gray-200 rounded-xl">
          <h1 className="text-2xl font-bold text-gray-900">Serene Coastal Villa</h1>
          <p className="text-gray-600">Malibu, California</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-red-500">★★★★★</span>
            <span className="text-gray-700 text-sm">4.8 / 5</span>
          </div>

          <p className="text-2xl font-semibold mt-2">
            $750 <span className="text-lg font-normal">/ night</span>
          </p>

          <CardContent className="mb-20">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">About this place</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Experience unparalleled luxury at our Serene Coastal Villa...
            </p>
          </CardContent>

          <CardContent>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What this place offers
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                <Wifi className="h-5 w-5 text-gray-700" />
                <span>Free Wi-Fi</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                <Snowflake className="h-5 w-5 text-gray-700" />
                <span>Air Conditioning</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                <Utensils className="h-5 w-5 text-gray-700" />
                <span>Fully Equipped Kitchen</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                <Car className="h-5 w-5 text-gray-700" />
                <span>Free Parking</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
