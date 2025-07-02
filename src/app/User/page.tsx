'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { db } from '@/../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();

  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNavigate = () => {
    router.push('/Regist');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const usersRef = collection(db, 'users');

      const qEmail = query(
        usersRef,
        where('email', '==', loginData.identifier),
        where('password', '==', loginData.password)
      );

      const qUsername = query(
        usersRef,
        where('username', '==', loginData.identifier),
        where('password', '==', loginData.password)
      );

      const [emailSnap, usernameSnap] = await Promise.all([
        getDocs(qEmail),
        getDocs(qUsername),
      ]);

      const userSnap = !emailSnap.empty ? emailSnap : !usernameSnap.empty ? usernameSnap : null;

      if (userSnap && !userSnap.empty) {
        const userData = userSnap.docs[0].data();
        const uid = userSnap.docs[0].id;

        // Simpan UID ke localStorage
        localStorage.setItem('uid', uid);

        setIsSuccess(true);
        setTimeout(() => {
          router.push('/User/profile');
        }, 1500);
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
      <div className="bg-gradient-to-b from-white/90 to-blue-100 p-10 rounded-2xl shadow-xl w-full max-w-md border border-blue-200 relative">
        <button
          type="button"
          onClick={() => router.push('/choose')}
          className="absolute top-5 left-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <IoArrowBack size={20} />
        </button>

        <div className="flex justify-center mb-6">
          <img src="/imhere1.png" alt="IM HERE" className="h-30 w-auto" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Log in to <span className="text-blue-800">Im Here !!</span>
        </h2>

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
              required
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
              required
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

      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-10 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-md"
        >
          🎉 Login berhasil! Selamat datang di <strong>ImHere</strong>!
        </motion.div>
      )}
    </div>
  );
}
