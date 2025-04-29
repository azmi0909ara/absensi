'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi login
    if (email === 'admin123' && password === 'admin123') {
      router.push('/Admin'); // Arahkan ke halaman Admin
    } else {
      setErrorMsg('Invalid username or password');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat text-gray-800"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(11, 0, 40, 0.9), rgba(173, 216, 230, 0.6)), url('/bkg1.jpg')",
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="bg-gradient-to-b from-white/90 to-blue-100 p-10 rounded-3xl shadow-xl w-full max-w-md border border-blue-200">
      <button
                type="button"
                onClick={() => router.push('/choose')}
                className="absolute top-5 left-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <IoArrowBack size={20} />
              </button>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/imhere1.png" alt="IM HERE" className="h-30 w-auto" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Log in Admin <span className="text-blue-800">Im Here !!</span>
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-blue-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email or username"
              className="w-full p-3 rounded-md bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-blue-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-md bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {errorMsg && <div className="mb-4 text-sm text-red-500 text-center">{errorMsg}</div>}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
