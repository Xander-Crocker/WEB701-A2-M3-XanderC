import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Calendar, MapPin, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

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

interface ErrorResponse {
  message: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setError(null);
        const response = await axios.get<{ events: Event[] }>('/api/events', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        
        setEvents(response.data.events);
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        setError(err.response?.data?.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const handleBookTicket = async (eventId: string) => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      setError(null);
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
      
      setEvents(response.data.events);
      
      // Navigate to My Tickets page after successful booking
      navigate('/my-tickets');
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      setError(err.response?.data?.message || 'Failed to book ticket');
    }
  };

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
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}
      
      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No events available at the moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{event.availableTickets} tickets available</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Accessibility Features:</h4>
                  <div className="flex flex-wrap gap-2">
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
                  <span className="text-lg font-semibold">
                    ${event.ticketPrice.toFixed(2)}
                  </span>
                  <button 
                    onClick={() => handleBookTicket(event._id)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={event.availableTickets === 0}
                  >
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