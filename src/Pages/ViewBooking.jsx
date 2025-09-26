import React, { useState } from "react";

import { Link } from "react-router-dom";
// Custom Card Component
// function Card({ children, className }) {
//   return (
//     <div
//       className={`border rounded-2xl bg-white shadow-md p-6 ${
//         className || ""
//       }`}
//     >
//       {children}
//     </div>
//   );
// }

// function CardContent({ children, className }) {
//   return <div className={`mt-2 ${className || ""}`}>{children}</div>;
// }
// function CardContent({ children, className }) {
//   return <div className={`mt-2 ${className || ""}`}>{children}</div>;
// }

export default function ViewBooking() {
  const [guests, setGuests] = useState(1);

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [activeInput, setActiveInput] = useState("checkIn"); // track which input is active
  const [highlightedDay, setHighlightedDay] = useState(null);

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
    setHighlightedDay(day);

    if (activeInput === "checkIn") {
      setCheckInDate(dateStr);
      setCheckOutDate(""); // reset checkout when new checkin chosen
      setActiveInput("checkOut"); // switch to checkout next
    } else {
      if (!checkInDate || new Date(dateStr) <= new Date(checkInDate)) {
        alert("Check-out date must be after check-in date");
        return;
      }
      setCheckOutDate(dateStr);
      setActiveInput("checkIn"); // back to checkin for next flow
    }
  };

  const bookingId = "Booking-123";

  return (
    <>
      <div className="min-h-screen bg-white lg:p-30 lg:pt-30 max-sm:p-6 min-md:p-10 flex flex-col lg:flex-row gap-8">
        {/* Left Side - Images */}
        <div className="flex-1 ">
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Select {activeInput === "checkIn" ? "Check-in" : "Check-out"} Date
            </h2>

            {/* Single Calendar */}
            <div className="grid grid-cols-7 text-center text-sm gap-1">
              {[...Array(30)].map((_, i) => {
                const day = i + 1;
                const dateStr = formatDate(day);
                return (
                  <div
                    key={`day-${i}`}
                    className={`p-2 rounded cursor-pointer ${
                      checkInDate === dateStr
                        ? "bg-green-500 text-white"
                        : checkOutDate === dateStr
                        ? "bg-red-500 text-white"
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

          {/* Booking Form */}
          <div className="bg-white px-6 py-3 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Book Your Stay</h2>

            {/* Date Inputs auto update */}
            <label className="block text-gray-700 mb-2">Check-in</label>
            <input
              type="date"
              value={checkInDate}
              onFocus={() => setActiveInput("checkIn")}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <label className="block text-gray-700 mb-2">Check-out</label>
            <input
              type="date"
              value={checkOutDate}
              onFocus={() => setActiveInput("checkOut")}
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
                className="w-20 py-2 text-center border rounded-xl border-gray-300"
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
    </>
  );
}
 