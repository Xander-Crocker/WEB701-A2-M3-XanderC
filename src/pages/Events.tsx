import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Define the structure of an event
interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  ticketPrice: number;
  availableTickets: number;
  accessibilityFeatures: string[];
}

// Define the structure of an error response
interface ErrorResponse {
  message: string;
}

export default function Events() {
  // State to store the list of events
  const [events, setEvents] = useState<Event[]>([]);
  // State to handle loading status
  const [loading, setLoading] = useState(true);
  // State to handle any errors
  const [error, setError] = useState<string | null>(null);
  // Get the token and user information from the custom useAuth hook
  const { token, user } = useAuth();
  // Initialize the navigation function from react-router-dom
  const navigate = useNavigate();

  // useEffect hook to fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Clear any previous errors
        setError(null);
        // Make an API call to fetch the events
        const response = await axios.get<{ events: Event[] }>('/api/events', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        // Set the fetched events to state
        setEvents(response.data.events);
      } catch (error) {
        // Set the error message if the API call fails
        const err = error as AxiosError<ErrorResponse>;
        setError(err.response?.data?.message || 'Failed to load events');
      } finally {
        // Set loading to false after the API call is complete
        setLoading(false);
      }
    };
    // Call the fetchEvents function
    fetchEvents();
  }, [token]);

  const handleBookTicket = async (eventId: string) => {
    try {
      // Check if the user is authenticated
      if (!user) {
        navigate('/login');
        return;
      }
      // Clear any previous errors
      setError(null);
      // Make an API call to book a ticket for the event
      await axios.post('/api/tickets', {
        eventId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh events list
      const response = await axios.get<{ events: Event[] }>('/api/events', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      // Set the fetched events to state
      setEvents(response.data.events);
      
      // Navigate to My Tickets page after successful booking
      navigate('/my-tickets');
    } catch (error) {
      // Set the error message if booking
      const err = error as AxiosError<ErrorResponse>;
      setError(err.response?.data?.message || 'Failed to book ticket');
    }
  };

  // Display loading spinner while fetching events
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Gaming Events</h1>
      {/* Display error message if there is any */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      {/* Display a message if there are no events */}
      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No events available at the moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display the list of events */}
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500">
                    {/* Display the date of the event */}
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {/* Display the location of the event */}
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    {/* Display the number of available tickets */}
                    <span>{event.availableTickets} tickets available</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Accessibility Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {/* Display the accessibility features of the event */}
                    {event.accessibilityFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  {/* Display the ticket price and booking button */}
                  <span className="text-lg font-semibold">
                    ${event.ticketPrice.toFixed(2)}
                  </span>
                  {/* Button to book a ticket for the event */}
                  <button 
                    onClick={() => handleBookTicket(event._id)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={event.availableTickets === 0}
                  >
                    {/* Disable the button if no tickets are available */}
                    {event.availableTickets === 0 ? 'Sold Out' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}