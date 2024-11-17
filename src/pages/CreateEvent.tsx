import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const { register, handleSubmit, formState: { errors } } = useForm<EventForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: EventForm) => {
    try {
      await axios.post('http://localhost:8081/api/events', data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Create Event</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="form-input"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="form-textarea"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="datetime-local"
            {...register('date', { required: 'Date is required' })}
            className="form-input"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            {...register('location', { required: 'Location is required' })}
            className="form-input"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ticket Price ($)</label>
            <input
              type="number"
              step="0.01"
              {...register('ticketPrice', { required: 'Price is required', min: 0 })}
              className="form-input"
            />
            {errors.ticketPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.ticketPrice.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Tickets</label>
            <input
              type="number"
              {...register('totalTickets', { required: 'Total tickets is required', min: 1 })}
              className="form-input"
            />
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