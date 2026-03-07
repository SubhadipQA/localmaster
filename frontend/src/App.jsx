import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Providers from "./pages/public/Providers";
import Contact from "./pages/public/Contact";

// Customer pages
import CustomerDashboard from "./pages/customer/Dashboard";
import BookNow from "./pages/customer/BookNow";
import BookingDetail from "./pages/customer/BookingDetail";


// Provider pages
import ProviderDashboard from "./pages/provider/Dashboard";
import ProviderProfile from "./pages/provider/Profile";


// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCategories from "./pages/admin/Categories";
import AdminProviders from "./pages/admin/Providers";
import AdminReviews from "./pages/admin/Reviews";
import AdminMessages from "./pages/admin/Messages";




function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/contact" element={<Contact />} />

          {/* Customer - Protected */}
          <Route path="/customer/dashboard" element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } />

          {/* Customer - Book Now */}
          <Route path="/customer/book/:providerId" element={
            <ProtectedRoute role="customer">
              <BookNow />
            </ProtectedRoute>
          } />

          {/* Customer - Booking Detail */}
          <Route path="/customer/bookings/:id" element={
            <ProtectedRoute role="customer">
              <BookingDetail />
            </ProtectedRoute>
          } />

          {/* Provider - Protected */}
          <Route path="/provider/dashboard" element={
            <ProtectedRoute role="provider">
              <ProviderDashboard />
            </ProtectedRoute>
          } />

          {/* Provider - Profile */}
          <Route path="/provider/profile" element={
            <ProtectedRoute role="provider">
              <ProviderProfile />
            </ProtectedRoute>
          } />

          {/* Admin - Protected */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Admin - Categories */}
          <Route path="/admin/categories" element={
            <ProtectedRoute role="admin">
              <AdminCategories />
            </ProtectedRoute>
          } />

          {/* Admin - Providers */}
          <Route path="/admin/providers" element={
            <ProtectedRoute role="admin">
              <AdminProviders />
            </ProtectedRoute>
          } />

          {/* Admin - Reviews */}
          <Route path="/admin/reviews" element={
            <ProtectedRoute role="admin">
              <AdminReviews />
            </ProtectedRoute>
          } />

          {/* Admin - Messages */}
          <Route path="/admin/messages" element={
            <ProtectedRoute role="admin">
              <AdminMessages />
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;