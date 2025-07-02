'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaBars, FaTimes, FaClock, FaMapMarkedAlt, FaUserCheck, FaDatabase } from 'react-icons/fa';

export default function FeaturePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle navbar mobile
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <div className="bg-[#041025] text-white font-inter min-h-screen">
      {/* Header / Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#041025] fixed w-full z-30 top-0 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <span className="text-blue-500 font-extrabold text-lg select-none">ImHere!!!</span>
        </div>
        <ul className="hidden md:flex space-x-8 font-semibold text-sm">
          <li><Link href="/homepage" className="hover:underline">Home</Link></li>
          <li><Link href="/feature" className="hover:underline">Feature</Link></li>
          <li><Link href="/contact" className="hover:underline">Contact</Link></li>
        </ul>
        <div className="hidden md:flex items-center space-x-1 font-semibold text-sm cursor-pointer hover:underline">
          <span>Present Now</span>
          <FaMapMarkerAlt />
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-[#06163a] z-20 p-6 space-y-4 text-sm font-semibold">
          <Link href="/" onClick={toggleMenu} className="block hover:underline">Home</Link>
          <Link href="/feature" onClick={toggleMenu} className="block hover:underline">Feature</Link>
          <Link href="/choose" onClick={toggleMenu} className="block hover:underline">Login</Link>
        </div>
      )}

      {/* Hero */}
      <header
        className="pt-35 pb-16 text-center bg-gradient-to-b from-[#041025] via-[#06163a] to-[#0a1f4f] px-4"
        style={{
          backgroundImage:
            "linear-gradient(360deg, rgba(4,16,37,1) 0%, rgba(4,16,37,0.9) 40%, rgba(28, 11, 215, 0.3) 100%), url('/bkg1.jpg')",
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">Fitur Unggulan</h1>
        <p className="text-white/70 max-w-xl mx-auto text-sm md:text-base">
          Jelajahi fitur-fitur utama aplikasi absensi digital ImHere!!! yang dirancang untuk efisiensi dan akurasi kehadiran.
        </p>
      </header>

      {/* Fitur Section */}
      <section className="px-6 py-12 sm:px-12 md:px-20 max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Fitur 1 */}
          <div className="bg-[#0a1f4f] p-6 rounded-lg border border-blue-600 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center space-x-4 mb-4">
              <FaClock className="text-blue-400 text-3xl" />
              <h3 className="text-xl font-semibold text-white">Absensi Real-time</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Pencatatan jam masuk secara langsung dan otomatis, memastikan akurasi kehadiran.
            </p>
          </div>

          {/* Fitur 2 */}
          <div className="bg-[#0a1f4f] p-6 rounded-lg border border-blue-600 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center space-x-4 mb-4">
              <FaMapMarkedAlt className="text-blue-400 text-3xl" />
              <h3 className="text-xl font-semibold text-white">Validasi Lokasi</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Sistem memverifikasi posisi pengguna sebelum absen, untuk mencegah kecurangan lokasi.
            </p>
          </div>

          {/* Fitur 3 */}
          <div className="bg-[#0a1f4f] p-6 rounded-lg border border-blue-600 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center space-x-4 mb-4">
              <FaUserCheck className="text-blue-400 text-3xl" />
              <h3 className="text-xl font-semibold text-white">Riwayat Absensi</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Riwayat absensi dapat dilihat kapan saja oleh pengguna maupun admin.
            </p>
          </div>

          {/* Fitur 4 */}
          <div className="bg-[#0a1f4f] p-6 rounded-lg border border-blue-600 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center space-x-4 mb-4">
              <FaDatabase className="text-blue-400 text-3xl" />
              <h3 className="text-xl font-semibold text-white">Database Aman</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Data pengguna dan absensi disimpan aman di Firebase Firestore secara real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 text-center border-t border-white/10 bg-[#041025] text-sm text-white/60">
        © 2025 ImHere!!! — All rights reserved.
      </footer>
    </div>
  );
}
