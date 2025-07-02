'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';

export default function SelectSection() {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat text-gray-800"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(4,16,37,0.9) 0%, rgba(0, 32, 86, 0.8) 50%, rgba(182, 206, 247, 0.6) 100%), url('/bkg1.jpg')",
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="bg-gradient-to-b from-white/90 to-blue-100 p-10 rounded-3xl shadow-xl w-full max-w-md border border-blue-200">
        
        {/* Tombol kembali */}
        <button
          type="button"
          onClick={() => router.push('/homepage')}
          className="absolute top-5 left-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <IoArrowBack size={20} />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/imhere1.png" alt="IM HERE" className="h-35 w-auto" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Select <span className="text-blue-800">Section</span>
        </h2>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <Link href="/Admin">
            <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold border border-blue-300 py-3 rounded-lg transition">
              ADMIN
            </button>
          </Link>
          <Link href="/User">
            <button className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold border border-blue-300 py-3 rounded-lg transition">
              USER
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Present By <a href="/" className="text-blue-600 hover:underline">Z-Code</a>
        </div>
      </div>
    </div>
  );
}
