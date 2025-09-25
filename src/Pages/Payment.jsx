import React from 'react'

export default function Payment() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      {/* Error Icon */}
      <div className="h-16 w-16 flex  items-center justify-center  mb-4">
        <span className=" text-3xl">⚠</span>
      </div>

      {/* Error Message */}
      <p className="text-black max-w-xl mb-6 text-base mt-10 ">
        This could be due to insufficient funds, an expired card, or a temporary network issue.
        Please check your card details or try again.
      </p>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="bg-red-500 text-white px-8 py-2  font-bold text-sm rounded-lg shadow ">
          Retry Payment
        </button>
        <button className="border border-gray-300 text-black px-8 font-bold text-sm py-2 rounded-lg shadow ">
          Modify Booking
        </button>
      </div>
    </div>
  );
}
