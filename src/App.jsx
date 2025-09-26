import React from "react";
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
import { useSelector } from "react-redux";
function App() {
  // const { user } = useAuth();
    const user = useSelector((state) => state.auth.user);
  return (
    <>
      {/* Header always visible */}
      {/* {user && <Header />}
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
            path="/booking/:id"
            element={
              <ProtectedRoute>
                <Booking />
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
      {user && <Footer />} */}
      <Header />
      <div className="pt-16">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/properties/:id" element={<Properties />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/viewbooking/:id" element={<ViewBooking />} />
        </Routes>
      </div>
       <Footer />
    </>
  );
}

export default App;


