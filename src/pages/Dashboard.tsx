import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Ticket, Calendar, Users } from 'lucide-react';

// Define the structure of a user's event
interface UserEvent {
  _id: string;
  title: string;
  date: string;
  availableTickets: number;
}

// Define the structure of a user's ticket
interface UserTicket {
  _id: string;
  event: {
    title: string;
    date: string;
  };
  token: string;
  status: string;
}

function Dashboard() {
  // Get the user information from the custom useAuth hook
  const { user } = useAuth();
  // State to store the list of user's events
  const [events, setEvents] = useState<UserEvent[]>([]);
  // State to store the list of user's tickets
  const [tickets, setTickets] = useState<UserTicket[]>([]);

  // useEffect hook to fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.role === 'member') {
          // Make an API call to fetch the user's events
          const response = await axios.get('http://localhost:8081/api/events/organizer');
          // Set the fetched events to state
          setEvents(response.data);
        } else {
          // Make an API call to fetch the user's tickets
          const response = await axios.get('http://localhost:8081/api/tickets/user');
          // Set the fetched tickets to state
          setTickets(response.data);
        }
      } catch (error) {
        // Log any errors to the console
        console.error('Failed to fetch user data:', error);
      }
    };

    // Call the fetchUserData function
    fetchUserData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        {/* Display the "Create Event" button for members */}
        {user?.role === 'member' && (
          <div>
            <Link
              to="/create-event"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 mr-2" 
            >
              Create Event
            </Link>
          </div>
        )}
      </div>

      {/* Display the list of current users booked events */}
      {user?.role === 'member' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">{event.title}</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  {/* Display the event date */}
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {/* Display the number of available tickets */}
                  <span>{event.availableTickets} tickets available</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{ticket.event.title}</h3>
                  <p className="text-gray-600">
                    {new Date(ticket.event.date).toLocaleDateString()}
                  </p>
                </div>
                <Ticket className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">Token:</p>
                <p className="font-mono bg-gray-100 p-2 rounded mt-1">{ticket.token}</p>
              </div>
              <div className="mt-4">
                {/* Display the status of the ticket */}
                <span className={`px-2 py-1 rounded-full text-sm ${
                  ticket.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800'
                    : ticket.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;