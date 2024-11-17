import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

interface ProfileForm {
    username: string;
    email: string;
    currentPassword: string;
    newPassword?: string;
    confirmPassword?: string;
}

function Profile() {
    const { user, token } = useAuth();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ProfileForm>({
        defaultValues: {
        username: user?.username || '',
        email: user?.email || ''
        }
    });

    const newPassword = watch('newPassword');

    const onSubmit = async (data: ProfileForm) => {
        try {
        setMessage(null);

        if (data.newPassword && data.newPassword !== data.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        await axios.put('/auth/profile', 
            {
                username: data.username,
                email: data.email,
                currentPassword: data.currentPassword,
                newPassword: data.newPassword || undefined
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error: any) {
        setMessage({ 
            type: 'error', 
            text: error.response?.data?.message || 'Failed to update profile' 
        });
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                {message.text}
                </div>
            )}

        <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        {...register('username', { required: 'Username is required' })}
                        className="form-input"
                    />
                    {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className="form-input"
                    />
                    {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                        type="password"
                        {...register('currentPassword', { required: 'Current password is required' })}
                        className="form-input"
                    />
                    {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
                    <input
                        type="password"
                        {...register('newPassword')}
                        className="form-input"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                        type="password"
                        {...register('confirmPassword', {
                            validate: value => 
                            !newPassword || value === newPassword || 'Passwords do not match'
                        })}
                        className="form-input"
                    />
                    {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                </div>

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