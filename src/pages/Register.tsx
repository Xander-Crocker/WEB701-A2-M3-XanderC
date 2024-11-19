import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Define the structure of the registration form data
interface RegisterForm {
  username: string;
  email: string;
  password: string;
  role: string;
}

function Register() {
  // Initialize the form handling with react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  // Get the register function from the custom useAuth hook
  const { register: registerUser } = useAuth();
  // Initialize the navigation function from react-router-dom
  const navigate = useNavigate();
  // State to handle any registration errors
  const [error, setError] = useState<string | null>(null);

  // Function to handle form submission
  const onSubmit = async (data: RegisterForm) => {
    try {
      // Clear any previous errors
      setError(null);
      // Attempt to register the user with the provided data
      await registerUser(data.username, data.email, data.password, data.role);
      // Navigate to the dashboard upon successful registration
      navigate('/dashboard');
    } catch (err: any) {
      // Set the error message if registration fails
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {/* Display error message if there is any */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        {/* Form to handle user registration */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            {/* Input field for username */}
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="form-input"
            />
            {/* Display validation error for username */}
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

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
            <label className="block text-sm font-medium text-gray-700">Password</label>
            {/* Input field for password */}
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            {/* Select field for role */}
            <select
              {...register('role', { required: 'Role is required' })}
              className="form-select"
            >
              <option value="user">User</option>
              <option value="member">Charity Member</option>
              <option value="beneficiary">Beneficiary</option>
            </select>
            {/* Display validation error for role */}
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;