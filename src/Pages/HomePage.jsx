import React, { useState } from "react";
import Properties from "./Properties";

export default function HomePage() {
 
  return (
    <>
    <div className=" bg-[#FAF4F4] ">
      {/* Hero Section */}
      <section className="flex flex-col    shadow-sm md:flex-row items-center justify-between  min-md:py-10 max-sm:py-20 max-sm:px-4 lg:px-20 md:px-10 lg:py-25">
        {/* Left Content */}
        <div className="max-w-lg text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-snug">
            Find Your Perfect Stay with{" "}
            <span className="text-black">StaySphere</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Discover unique rental properties tailored to your needs. Book
            effortlessly, stay comfortably.
          </p>
          <button className="mt-6 px-6 py-3 bg-red-600 text-white rounded-md font-bold">
            Browse Properties
          </button>
        </div>

        {/* Right Image */}
        <div className="mt-8 md:mt-0 md:ml-12">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Apartment interior"
            className="rounded-md shadow-lg w-full max-w-md"
          />
        </div>
      </section>
      </div>
<Properties/>
    </>
  );
}
