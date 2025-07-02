'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { db } from '@/../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    namaLengkap: '',
    noTelp: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    try {
      await addDoc(collection(db, 'users'), {
        username: formData.username,
        namaLengkap: formData.namaLengkap,
        noTelp: formData.noTelp,
        email: formData.email,
        password: formData.password, // ❗Perlu dienkripsi kalau untuk produksi
        createdAt: new Date(),
      });

      setErrorMsg('');
      router.push('User');
    } catch (error) {
      console.error('Gagal menyimpan data:', error);
      setErrorMsg('Terjadi kesalahan saat registrasi.');
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat text-gray-800"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(2, 2, 9, 0.9), rgba(173, 216, 230, 0.6)), url('/bkg1.jpg')",
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="bg-gradient-to-b from-white/90 to-blue-100 p-10 rounded-2xl shadow-xl w-full max-w-md border-4 border-blue-300">

        <button
          type="button"
          onClick={() => router.push('User')}
          className="absolute top-5 left-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <IoArrowBack size={20} />
        </button>

        <div className="flex justify-center mb-6">
          <img src="/imhere1.png" alt="IM HERE" className="h-30 w-auto" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Registrasi <span className="text-blue-800">Im Here !!</span>
        </h2>

        <form onSubmit={handleRegister}>
          {currentPage === 1 && (
            <>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-semibold text-blue-700 mb-2">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="w-full p-3 rounded-md border bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="namaLengkap" className="block text-sm font-semibold text-blue-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  id="namaLengkap"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  className="w-full p-3 rounded-md border bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="noTelp" className="block text-sm font-semibold text-blue-700 mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  id="noTelp"
                  name="noTelp"
                  value={formData.noTelp}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  className="w-full p-3 rounded-md border bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {currentPage === 2 && (
            <>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold text-blue-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full p-3 rounded-md border bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-semibold text-blue-700 mb-2">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full p-3 rounded-md border bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-blue-700 mb-2">Konfirmasi Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className="w-full p-3 rounded-md border bg-white border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {errorMsg && (
            <div className="mb-4 text-sm text-red-500 text-center">{errorMsg}</div>
          )}

          {currentPage === 1 && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Selanjutnya
              </button>
            </div>
          )}

          {currentPage === 2 && (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Register
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
