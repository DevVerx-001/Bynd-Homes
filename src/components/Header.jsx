import React, { useState } from "react";
import logo from "../assets/logo.svg";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const propertyId = "Serene-Lakeside-Cabin";
  const bookingId = "Booking-123";
  const paymentId = "Payment-456";

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Properties", to: `/properties/${propertyId}` },
    { name: "Bookings", to: `/booking/${bookingId}` },
    { name: "About Us", to: `/payment/${paymentId}` },
  ];

  return (
    <div className="bg-gray-50 fixed z-50 w-full">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img src={logo} alt="Logo" className="w-16" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center">
              <div className="flex space-x-8">
                {navLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.to}
                    end={link.name === "Home"}
                    className={({ isActive }) =>
                      `font-bold transition-colors ${
                        isActive
                          ? "text-red-600"
                          : "text-black hover:text-red-600"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-red-600 focus:outline-none"
              >
                {isOpen ? (
                  // Close Icon (X)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  // Hamburger Menu Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <nav className="flex flex-col items-center space-y-4 px-6 py-4">
              {navLinks.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.to}
                  end={link.name === "Home"}
                  className={({ isActive }) =>
                    `font-bold transition-colors ${
                      isActive
                        ? "text-red-600"
                        : "text-black hover:text-red-600"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
