import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch } from "react-icons/fi";

const properties = [
  {
    id: 1,
    name: "Cozy    Apartment",
    price: 120,
    availability: "Mon, Jul 1 - Fri, Jul 5",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Modern Loft",
    price: 150,
    availability: "Tue, Jul 2 - Sat, Jul 6",
    image:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM3NTgxNDY3MDI4MjAyOTQ4NQ==/original/5fc7e7e4-8bb8-47c7-92e7-cb4217746ab8.jpeg?im_w=960",
  },
  {
    id: 3,
    name: "Beachside Villa",
    price: 200,
    availability: "Wed, Jul 3 - Sun, Jul 7",
    image:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE5NjgyODU4MDk5NTMzNjYzMA%3D%3D/original/9253f2c7-6dec-4392-84f9-4b7263e3ef72.png?im_w=960",
  },
  {
    id: 4,
    name: "Mountain Retreat",
    price: 180,
    availability: "Thu, Jul 4 - Mon, Jul 8",
    image:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1257682100579478788/original/9ed8a9f2-1188-4cf1-bd90-fe2d42c6bd2c.jpeg?im_w=720",
  },
  {
    id: 5,
    name: "City Penthouse",
    price: 250,
    availability: "Fri, Jul 5 - Tue, Jul 9",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Country House",
    price: 130,
    availability: "Sat, Jul 6 - Wed, Jul 10",
    image:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1353694329077466185/original/2cb4557a-1cb0-4f27-a91a-559d9bba657a.jpeg?im_w=960",
  },
  {
    id: 7,
    name: "Lake Cottage",
    price: 140,
    availability: "Sun, Jul 7 - Thu, Jul 11",
    image:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-1209489582780330420/original/18b54c91-c3fb-44bd-9abf-00515132d0fb.jpeg?im_w=960",
  },
  {
    id: 8,
    name: "Downtown Studio",
    price: 110,
    availability: "Mon, Jul 8 - Fri, Jul 12",
    image:
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM3NTgxNDY3MDI4MjAyOTQ4NQ==/original/5fc7e7e4-8bb8-47c7-92e7-cb4217746ab8.jpeg?im_w=960",
  },
];

const Properties = () => {
    const [search, setSearch] = useState(""); // search input state
    const [filtered, setFiltered] = useState(properties); // displayed properties
    // handle search button click
    const handleSearch = () => {
      const filteredData = properties.filter((property) =>
        property.name.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filteredData);
    };
    const ViewBookingId="booking114"
  return (
    <div className='py-5 px-10'>
      <section className="bg-white py-6 text-center">
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
              placeholder="Search by location, property type, or amenities..."
              className="flex-1 px-3 py-2 focus:outline-none text-gray-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            className="px-6 py-2 text-white rounded-md bg-[#4B5470]"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </section>
      <Link to={`/viewbooking/${ViewBookingId}`} className="min-h-screen bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Featured Properties
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={property.image}
                alt={property.name}
                className="h-32 w-full object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {property.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-red-600 font-bold">
                      ${property.price}
                    </span>
                    <span className="text-sm text-gray-500">/night</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-100 rounded text-center text-sm text-black">
                  <p className="font-medium">Availability Preview</p>
                  <p className="text-gray-500 text-xs font-medium ">
                    {property.availability}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Link>
      </div>
   
  )
}

export default Properties
