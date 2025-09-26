import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../components/constant";

export default function Signup() {
  const navigate = useNavigate();
  
  // State for form inputs
  const [formData, setFormData] = useState({
    name: "", // Changed to match backend (was fullName)
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State for loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (formData.name.length < 2) {
      setError("Name must be at least 2 characters long");
      setLoading(false);
      return;
    }

    try {
      // API call to backend signup endpoint
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Check if registration was successful
      if (response.data.success) {
        console.log("Registration successful:", response.data);
        
        // Show success message
        
        // Redirect to login page after 1.5 seconds
        
          navigate("/login");
       
        
      } else {
        // Handle backend validation errors
        setError(response.data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data.message || 
                           "Registration failed. Please try again.";
        setError(errorMessage);
        
        // Log detailed errors for debugging
        if (error.response.data.errors) {
          console.error('Validation errors:', error.response.data.errors);
        }
      } else if (error.request) {
        // No response received (network error)
        setError("Unable to connect to server. Please check your internet connection and try again.");
        console.error("Network error:", error.request);
      } else {
        // Other errors
        setError("An unexpected error occurred. Please try again.");
        console.error("Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Create Your Account
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name" // Changed to match backend
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              required
              minLength="2"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password (min. 6 characters)"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-left text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#6f0c03] text-white font-semibold rounded-md shadow hover:bg-[#570700] focus:outline-none focus:ring-2 focus:ring-[#6f0c03] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Already have an account */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#6f0c03] font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}