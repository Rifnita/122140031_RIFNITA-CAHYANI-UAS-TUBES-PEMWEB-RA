import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-nude">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="text-4xl mb-3">🛍️</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Selamat Datang <span className="inline-block">👋</span>
        </h2>

        <form className="space-y-5 text-left" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md font-semibold transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          Lupa password? <span className="text-orange-500 hover:underline cursor-pointer">Reset di sini</span>
        </p>
      </div>
    </div>
  );
}