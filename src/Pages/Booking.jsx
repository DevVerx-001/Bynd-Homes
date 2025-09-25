import React from 'react'
import { Link } from 'react-router-dom';


export default function Booking() {
 const ViewBookingId="booking114"
 const propertyId = "Serene-Lakeside-Cabin";
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {/* Card Wrapper */}
      <div className="max-w-xl w-full shadow-xl  rounded-2xl  bg-white">
        
        {/* Header */}
        <div className="text-center  rounded-t-2xl p-10 bg-gray-200">
          <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-full bg-green-100">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mt-2 text-sm">
            Your reservation for <span className="font-semibold">Serene Lakeside Cabin</span> has been
            successfully processed and confirmed. We look forward to welcoming you!
          </p>
        </div>

        {/* Booking Summary */}
        <div className="mt-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Booking Summary</h2>
          <div className="text-sm divide-y divide-gray-200">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Property:</span>
              <span className="font-medium">Serene Lakeside Cabin</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Check-in Date:</span>
              <span className="font-medium">August 10, 2024</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Check-out Date:</span>
              <span className="font-medium">August 17, 2024</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Guests:</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Confirmation #:</span>
              <span className="font-medium">SS-20240810-002</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className=" px-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment Details</h2>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Status:</span>
            <span className="text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full text-xs">
              Paid Successfully
            </span>
          </div>
          <div className="flex justify-between py-2 text-lg font-semibold">
            <span>Total Paid:</span>
            <span className="text-red-600">$1,899.00</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 mt-10 flex gap-4 justify-center">
          <Link to={`/properties/${propertyId}`} className="bg-red-600 text-white px-4 py-2 rounded-lg shadow">
            Explore More Properties
          </Link>
          <Link to={`/viewbooking/${ViewBookingId}`} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow">
            View My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
