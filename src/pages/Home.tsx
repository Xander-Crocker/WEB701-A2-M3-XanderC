import { Link } from 'react-router-dom';
import { Gamepad, Users, Ticket, Heart } from 'lucide-react';

function Home() {
  return (
    // Display the hero section with browse events and join the community buttons
    <div className="max-w-7xl mx-auto">
      <section className="text-center py-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl mb-12">
        <h1 className="text-5xl font-bold text-white mb-6">
          Gaming For Good
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join our community of gamers making a difference through charity events and accessible gaming initiatives.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/events"
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition"
          >
            Browse Events
          </Link>
          <Link
            to="/register"
            className="bg-purple-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-800 transition"
          >
            Join Us
          </Link>
        </div>
      </section>

      {/* Display key features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <Gamepad className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Accessible Gaming</h3>
          <p className="text-gray-600">
            Promoting inclusive gaming experiences for everyone
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <Users className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Community Events</h3>
          <p className="text-gray-600">
            Connect with fellow gamers at charity events
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <Ticket className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
          <p className="text-gray-600">
            Simple token-based event registration system
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <Heart className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Make an Impact</h3>
          <p className="text-gray-600">
            Support charitable causes through gaming
          </p>
        </div>
      </section>

      {/* Display upcoming event cards */}
      <section className="bg-white rounded-3xl p-12 mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Upcoming Featured Events
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Event cards will be dynamically populated */}
        </div>
      </section>
    </div>
  );
}

export default Home;