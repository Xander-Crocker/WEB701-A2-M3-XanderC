import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import AccessibilityGuide from './pages/AccessibilityGuide';
import MyTickets from './pages/MyTickets';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    // Use the BrowserRouter component to wrap the application
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Display the Navbar component */}
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {/* Define the routes for the application */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Define the protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/create-event" element={
              <ProtectedRoute allowedRoles={['member']}>
                <CreateEvent />
              </ProtectedRoute>
            } />
            <Route path="/accessibility" element={<AccessibilityGuide />} />
            <Route path="/my-tickets" element={
              <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;