'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { db } from '@/../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function Home() {
  const router = useRouter();

  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');

  const handleNavigate = () => {
    router.push('/Regist');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const usersRef = collection(db, 'users');

      const q = query(
        usersRef,
        where('password', '==', loginData.password),
        where('email', '==', loginData.identifier)
      );
      const q2 = query(
        usersRef,
        where('password', '==', loginData.password),
        where('username', '==', loginData.identifier)
      );

      const [snap1, snap2] = await Promise.all([getDocs(q), getDocs(q2)]);

      if (!snap1.empty || !snap2.empty) {
        router.push('/choose'); // arahkan ke halaman setelah login
      } else {
        setError('Email/Username atau Password salah');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan saat login');
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
      <div className="bg-gradient-to-b from-white/90 to-blue-100 p-10 rounded-2xl shadow-xl w-full max-w-md border border-blue-200">
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
          Log in to <span className="text-blue-800">Im Here !!</span>
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="identifier" className="block text-sm font-semibold text-blue-700 mb-2">
              Email address or username
            </label>
            <input
              type="text"
              id="identifier"
              value={loginData.identifier}
              onChange={handleChange}
              placeholder="Enter your email or username"
              className="w-full p-3 rounded-md bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-blue-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 rounded-md bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={handleNavigate}
            className="text-blue-600 hover:underline"
          >
            Sign up for ImHere
          </button>
        </div>
      </div>
    </div>
  );
}
