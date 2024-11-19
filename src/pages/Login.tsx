import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Define the structure of the login form data
interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  // Initialize the form handling with react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  // Get the login function from the custom useAuth hook
  const { login } = useAuth();
  // Initialize the navigation function from react-router-dom
  const navigate = useNavigate();

  // Function to handle form submission
  const onSubmit = async (data: LoginForm) => {
    try {
      // Attempt to log in the user with the provided data
      await login(data.email, data.password);
      // Navigate to the dashboard upon successful login
      navigate('/dashboard');
    } catch (error) {
      // Log the error if login fails
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {/* Form to handle user login */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            {/* Input field for email */}
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="form-input"
            />
            {/* Display validation error for email */}
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            {/* Input field for password */}
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="form-input"
            />
            {/* Display validation error for password */}
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;