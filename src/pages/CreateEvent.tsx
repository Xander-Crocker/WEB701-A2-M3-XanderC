import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define the structure of the event form data
interface EventForm {
  title: string;
  description: string;
  date: string;
  location: string;
  ticketPrice: number;
  totalTickets: number;
  accessibilityFeatures: string[];
}

function CreateEvent() {
  // Initialize the form handling with react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<EventForm>();
  // Initialize the navigation function from react-router-dom
  const navigate = useNavigate();

  // Function to handle form submission
  const onSubmit = async (data: EventForm) => {
    try {
      // Make an API call to create a new event with the provided data
      await axios.post('http://localhost:8081/api/events', data);
      // Navigate to the dashboard upon successful event creation
      navigate('/dashboard');
    } catch (error) {
      // Log the error if event creation fails
      console.error('Failed to create event:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Create Event</h1>
      {/* Form to handle event creation */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          {/* Input field for event title */}
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="form-input"
          />
          {/* Display validation error for title */}
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          {/* Input field for event description */}
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="form-textarea"
          />
          {/* Display validation error for description */}
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          {/* Input field for event date */}
          <input
            type="datetime-local"
            {...register('date', { required: 'Date is required' })}
            className="form-input"
          />
          {/* Display validation error for date */}
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          {/* Input field for event location */}
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            className="form-input"
          />
          {/* Display validation error for location */}
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ticket Price ($)</label>
            {/* Input field for ticket price */}
            <input
              type="number"
              step="0.01"
              {...register('ticketPrice', { required: 'Price is required', min: 0 })}
              className="form-input"
            />
            {/* Display validation error for ticket price */}
            {errors.ticketPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.ticketPrice.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Tickets</label>
            {/* Input field for total tickets */}
            <input
              type="number"
              {...register('totalTickets', { required: 'Total tickets is required', min: 1 })}
              className="form-input"
            />
            {/* Display validation error for total tickets */}
            {errors.totalTickets && (
              <p className="mt-1 text-sm text-red-600">{errors.totalTickets.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accessibility Features
          </label>
          <div className="space-y-2">
            {/* Checkboxes for accessibility features */}
            {['closedCaptions', 'audioDescription', 'adaptiveControllers', 'colorblindMode'].map((feature) => (
              <label key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  {...register('accessibilityFeatures')}
                  value={feature}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;