import { useState } from 'react';
import { Gamepad2, Eye, Ear, Brain, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  accessibilityFeatures: string[];
  availableTickets: number;
}

function AccessibilityGuide() {
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFeature = (feature: string) => {
    const newFeatures = new Set(selectedFeatures);
    if (newFeatures.has(feature)) {
      newFeatures.delete(feature);
    } else {
      newFeatures.add(feature);
    }
    setSelectedFeatures(newFeatures);
  };

  const findEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/events');
      const allEvents = response.data.events;
      
      // Filter events based on selected features
      const filteredEvents = allEvents.filter((event: Event) => 
        Array.from(selectedFeatures).every(feature => 
          event.accessibilityFeatures.includes(feature)
        )
      );

      setRecommendedEvents(filteredEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Gaming Accessibility Guide</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our commitment to making gaming events accessible and enjoyable for everyone
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Gamepad2 className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Adaptive Controllers</h3>
          <p className="text-gray-600">
            Custom controller setups and alternative input devices for different abilities
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Eye className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Visual Accessibility</h3>
          <p className="text-gray-600">
            Colorblind modes, high contrast options, and adjustable text sizes
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Ear className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Audio Features</h3>
          <p className="text-gray-600">
            Closed captions, audio descriptions, and customizable sound options
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Brain className="w-12 h-12 text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Cognitive Support</h3>
          <p className="text-gray-600">
            Adjustable game speeds, clear instructions, and simplified controls
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Find Events Based on Your Needs</h2>
        <div className="space-y-4 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 transition">
            <h3 className="font-semibold mb-2">Visual Needs</h3>
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="colorblindMode"
                checked={selectedFeatures.has('colorblindMode')}
                onChange={() => toggleFeature('colorblindMode')}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="colorblindMode">Colorblind-friendly options</label>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 transition">
            <h3 className="font-semibold mb-2">Audio Needs</h3>
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="closedCaptions"
                checked={selectedFeatures.has('closedCaptions')}
                onChange={() => toggleFeature('closedCaptions')}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="closedCaptions">Closed captions</label>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <input
                type="checkbox"
                id="audioDescription"
                checked={selectedFeatures.has('audioDescription')}
                onChange={() => toggleFeature('audioDescription')}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="audioDescription">Audio descriptions</label>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 transition">
            <h3 className="font-semibold mb-2">Control Requirements</h3>
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="adaptiveControllers"
                checked={selectedFeatures.has('adaptiveControllers')}
                onChange={() => toggleFeature('adaptiveControllers')}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="adaptiveControllers">Adaptive controller support</label>
            </div>
          </div>
        </div>

        <button
          onClick={findEvents}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              Find Matching Events
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </button>

        {recommendedEvents.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Recommended Events</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendedEvents.map((event) => (
                <div key={event._id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{event.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                  <div className="text-sm text-gray-500 mb-2">
                    <p>{new Date(event.date).toLocaleDateString()}</p>
                    <p>{event.location}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.accessibilityFeatures.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  {event.availableTickets > 0 ? (
                    <Link
                      to={`/events`}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      View Event <ArrowRight className="inline h-4 w-4 ml-1" />
                    </Link>
                  ) : (
                    <span className="text-red-600 text-sm">Sold Out</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Resources</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">For Gamers</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Accessibility hardware recommendations</li>
              <li>• Software settings guides</li>
              <li>• Community support forums</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">For Event Organizers</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Venue accessibility checklist</li>
              <li>• Equipment setup guides</li>
              <li>• Inclusive event planning tips</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessibilityGuide;