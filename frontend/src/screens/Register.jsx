import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';

const Register = () => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    // Email validation regex
    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    // Password strength validation
   

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Check if user is already logged in
        if (user) {
            setError("You are already registered and logged in.");
            setLoading(false);
            return;
        }

        // Validate email
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        // Validate password strength
      

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post('/users/register', { email, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.message || "";
            if (errorMessage.toLowerCase().includes("email already exists")) {
                setError("This email is already registered! Please login.");
            } else {
                setError("Something went wrong. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                    Create an Account
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-500 text-white text-center rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
                        <div className="relative">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                            <span
                                className="absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-blue-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </span>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2" htmlFor="confirm-password">Confirm Password</label>
                        <input
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            id="confirm-password"
                            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Re-enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="text-gray-400 mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
