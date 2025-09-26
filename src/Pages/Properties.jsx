import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import axios from 'axios';
import { API_BASE_URL } from '../components/constant';

const Properties = () => {
    const [search, setSearch] = useState(""); // search input state
    const [properties, setProperties] = useState([]); // properties from API
    const [filtered, setFiltered] = useState([]); // displayed properties
    const [loading, setLoading] = useState(true); // loading state
    const [error, setError] = useState(""); // error state

    // Fetch properties from API
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/properties`);
                
                if (response.data.success) {
                    setProperties(response.data.data.properties);
                    setFiltered(response.data.data.properties);
                } else {
                    setError('Failed to fetch properties');
                }
            } catch (error) {
                console.error('Error fetching properties:', error);
                setError('Unable to load properties. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    // Update filtered properties as user types
    useEffect(() => {
        if (search === "") {
            // Show all properties when search is cleared
            setFiltered(properties);
        } else {
            // Filter properties based on title
            const filteredData = properties.filter((property) =>
                property.title.toLowerCase().includes(search.toLowerCase())
            );
            setFiltered(filteredData);
        }
    }, [search, properties]);

    // Get first image URL or fallback image
    const getPropertyImage = (property) => {
        if (property.images && property.images.length > 0 && property.images[0].url) {
            return property.images[0].url;
        }
        const fallbackImages = [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM3NTgxNDY3MDI4MjAyOTQ4NQ==/original/5fc7e7e4-8bb8-47c7-92e7-cb4217746ab8.jpeg?im_w=960",
            "https://a0.muscache.com/im/pictures/hosting/Hosting-1257682100579478788/original/9ed8a9f2-1188-4cf1-bd90-fe2d42c6bd2c.jpeg?im_w=720",
            "https://a0.muscache.com/im/pictures/hosting/Hosting-1353694329077466185/original/2cb4557a-1cb0-4f27-a91a-559d9bba657a.jpeg?im_w=960"
        ];
        return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    };

    // Generate availability preview (mock - since it's not in API response)
    const getAvailabilityPreview = (propertyId) => {
        const availabilityOptions = [
            "Mon, Jul 1 - Fri, Jul 5",
            "Tue, Jul 2 - Sat, Jul 6",
            "Wed, Jul 3 - Sun, Jul 7",
            "Thu, Jul 4 - Mon, Jul 8",
            "Fri, Jul 5 - Tue, Jul 9",
            "Sat, Jul 6 - Wed, Jul 10",
            "Sun, Jul 7 - Thu, Jul 11",
            "Mon, Jul 8 - Fri, Jul 12"
        ];
        return availabilityOptions[propertyId.charCodeAt(propertyId.length - 1) % availabilityOptions.length];
    };

    const ViewBookingId = "booking114";

    if (loading) {
        return (
            <div className='py-5 px-10 min-h-screen bg-gray-50'>
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl font-semibold text-gray-600">Loading properties...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='py-5 px-10 min-h-screen bg-gray-50'>
                <div className="flex justify-center items-center h-64">
                    <div className="text-red-600 text-lg font-semibold">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className='py-5 px-10 min-h-screen bg-gray-50'>
            <section className="bg-white py-6 text-center rounded-lg shadow-sm mb-8 mt-10">
                <h2 className="text-2xl font-bold text-gray-900">
                    Discover Your Next Getaway
                </h2>

                <div className="mt-6 flex justify-center gap-6">
                    <div className="flex items-center border rounded-md shadow-sm overflow-hidden w-[30%] max-w-xl">
                        {/* Search Icon */}
                        <span className="pl-3 text-gray-400">
                            <FiSearch className="h-5 w-5" />
                        </span>

                        {/* Input */}
                        <input
                            type="text"
                            placeholder="Search by title..."
                            className="flex-1 px-3 py-2 focus:outline-none text-gray-700"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Optional: Keep the search button if desired, though not needed for real-time */}
                    {/* <button
                        className="px-6 py-2 text-white rounded-md bg-[#4B5470] hover:bg-[#3a4259] transition duration-200"
                        onClick={() => {}} // No action needed
                    >
                        Search
                    </button> */}
                </div>
            </section>

                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Featured Properties
                </h2>
                
                {filtered.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No properties found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {filtered.map((property) => (
                                                            <Link to={`/viewbooking/${property._id}`} className="block">

                            <div
                                key={property._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                            >
                                <img
                                    src={getPropertyImage(property)}
                                    alt={property.images && property.images[0]?.alt || property.title}
                                    className="h-48 w-full object-cover"
                                />
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                            {property.title}
                                        </h3>
                                        <div className="flex items-baseline gap-1 flex-shrink-0 ml-2">
                                            <span className="text-red-600 font-bold">
                                                ${property.pricePerNight}
                                            </span>
                                            <span className="text-sm text-gray-500">/night</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {property.description}
                                    </p>
                                    
                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <span className="mr-3">📍 {property.address.city}, {property.address.state}</span>
                                        <span>👥 {property.maxGuests} guests</span>
                                    </div>

                                    <div className="mt-3 p-3 bg-gray-100 rounded text-center text-sm text-black">
                                        <p className="font-medium">Availability Preview</p>
                                        <p className="text-gray-500 text-xs font-medium">
                                            {getAvailabilityPreview(property._id)}
                                        </p>
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

export default Properties;