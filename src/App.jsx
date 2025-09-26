import React from "react";
import { useAuth } from "./context/AuthContext";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import Header from "./components/Header";
import Properties from "./Pages/Properties";
import Booking from "./Pages/Booking";
import Payment from "./Pages/Payment";
import Footer from "./components/Footer";
import ViewBooking from "./Pages/ViewBooking";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import AlllBooking from "./Pages/AlllBooking";
import GetoneBooking from "./Pages/Payment";


function App() {
  const { user } = useAuth();
  return (
    <>
      {/* Header always visible */}
      {<Header />}
      <div className={user ? "pt-16" : ""}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/:id"
          element={
            <ProtectedRoute>
              <Properties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signlebooking/:id"
          element={
            // <ProtectedRoute>
              <GetoneBooking/>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/allbookings"
          element={
            <ProtectedRoute>
              <AlllBooking/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/:id"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewbooking/:id"
          element={
            <ProtectedRoute>
              <ViewBooking />
            </ProtectedRoute>
          }
        />
      </Routes>
    

   
       
      </div>
       {user && <Footer />}
    </>
  );
}

export default App;


