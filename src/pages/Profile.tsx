import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

// Define the structure of the profile form data
interface ProfileForm {
    username: string;
    email: string;
    currentPassword: string;
    newPassword?: string;
    confirmPassword?: string;
}

const Profile: React.FC = () => {
    // Initialize the form handling with react-hook-form
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileForm>();
    // State to handle messages (success or error)
    const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
    // Get the updateProfile function and token from the custom useAuth hook
    const { updateProfile, token } = useAuth();
    
    // Check if the user is authenticated
    if (!token) {
        setMessage({ type: 'error', text: 'User is not authenticated' });
        return null;
    }
    // Watch the newPassword field for changes
    const newPassword = watch('newPassword');

    // Function to handle form submission
    const onSubmit = async (data: ProfileForm) => {
        try {
            // Clear any previous messages
            setMessage(null);

            // Check if new passwords match
            if (data.newPassword && data.newPassword !== data.confirmPassword) {
                setMessage({ type: 'error', text: 'New passwords do not match' });
                return;
            }
            // Attempt to update the profile with the provided data
            await updateProfile(data, token);
            // Set success message upon successful profile update
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error: any) {
            // Set the error message if profile update fails
            setMessage({ 
                type: 'error', 
                text: error.message || 'Failed to update profile' 
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

            {/* Display success or error message */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                {message.text}
                </div>
            )}

        <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Form to handle profile updates */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    {/* Input field for current password */}
                    <input
                        type="password"
                        {...register('currentPassword', { required: 'Current password is required' })}
                        className="form-input"
                    />
                    {/* Display validation error for current password if password doesn't match */}
                    {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
                    {/* Input field for new password */}
                    <input
                        type="password"
                        {...register('newPassword')}
                        className="form-input"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    {/* Input field for confirming new password */}
                    <input
                        type="password"
                        {...register('confirmPassword', {
                            validate: value => 
                            !newPassword || value === newPassword || 'Passwords do not match'
                        })}
                        className="form-input"
                    />
                    {/* Display validation error for confirm password */}
                    {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                </div>
                
                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                    Update Profile
                </button>
            </form>
        </div>
    </div>
    );
}

export default Profile;