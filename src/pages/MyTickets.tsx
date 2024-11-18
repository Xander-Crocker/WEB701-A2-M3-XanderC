import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Define the structure of a ticket
interface Ticket {
  _id: string;
  token: string;
  status: string;
  event: {
    _id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    ticketPrice: number;
  };
}

function MyTickets() {
  // State to store the list of tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);
  // State to handle loading status
  const [loading, setLoading] = useState(true);
  // State to handle any errors
  const [error, setError] = useState<string | null>(null);
  // Get the token from the custom useAuth hook
  const { token } = useAuth();

  // useEffect hook to fetch tickets when the component mounts
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Make an API call to fetch the user's tickets
        const response = await axios.get('/api/tickets/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Set the fetched tickets to state
        setTickets(response.data);
        // Clear any previous errors
        setError(null);
      } catch (err: any) {
        // Set the error message if the API call fails
        setError(err.response?.data?.message || 'Failed to load tickets');
      } finally {
        // Set loading to false after the API call is complete
        setLoading(false);
      }
    };

    // Call the fetchTickets function
    fetchTickets();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Tickets</h1>

      {/* Display error message if there is any */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Display a message if there are no tickets */}
      {tickets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">You haven't booked any tickets yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Display the list of tickets */}
          {tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{ticket.event.title}</h3>
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

                <p className="text-gray-600 mb-4">{ticket.event.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(ticket.event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{ticket.event.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">Ticket Token:</p>
                  <code className="block mt-1 p-2 bg-gray-50 rounded text-sm font-mono break-all">
                    {ticket.token}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTickets;