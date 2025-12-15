import React, { useState } from 'react';
import { useRegisterMutation } from '../auth/authApiSlice';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\+?[0-9]{10,15}$/.test(phoneNumber))
      newErrors.phoneNumber = 'Phone number must contain 10-15 digits and optionally start with +';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const newUser = await register({ username, email, phoneNumber, password }).unwrap();
      // Pass email to VerifyPage via router state
      navigate('/verify', { state: { email } });
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-200 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
          Create Your Account
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <input
          type="text"
          placeholder="Phone Number (+1234567890)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

        <button
          type="submit"
          className="mt-4 p-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 transition duration-300"
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {error && (
          <p className="text-red-500 text-center mt-2">
            {error?.data?.message || 'Registration failed'}
          </p>
        )}

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <span
            className="text-orange-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Log In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
