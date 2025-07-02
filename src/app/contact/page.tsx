'use client';

import Link from 'next/link';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><Link href="/feature" className="hover:underline">Feature</Link></li>
          <li><Link href="/contact" className="hover:underline">Contact</Link></li>
        </ul>
        <div className="hidden md:flex items-center space-x-1 font-semibold text-sm cursor-pointer hover:underline">
          <span>Need Help?</span>
          <FaEnvelope />
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
          <Link href="/homepage" onClick={toggleMenu} className="block hover:underline">Home</Link>
          <Link href="/feature" onClick={toggleMenu} className="block hover:underline">Feature</Link>
          <Link href="/contact" onClick={toggleMenu} className="block hover:underline">Contact</Link>
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
        <h1 className="text-4xl md:text-5xl font-bold text-blue-400 mb-4">Hubungi Kami</h1>
        <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base">
          Jika Anda memiliki pertanyaan, masukan, atau memerlukan bantuan mengenai aplikasi ImHere!!!,
          silakan hubungi tim kami melalui kontak di bawah ini.
        </p>
      </header>

      {/* Konten Kontak */}
      <section className="px-6 py-12 sm:px-12 md:px-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0a1f4f] p-6 rounded-lg border border-blue-600 shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-400">
              <FaEnvelope /> Email
            </h3>
            <p className="text-white/80 text-sm">imhere.support@gmail.com</p>
          </div>

          <div className="bg-[#0a1f4f] p-6 rounded-lg border border-blue-600 shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-400">
              <FaPhone /> Telepon / WhatsApp
            </h3>
            <p className="text-white/80 text-sm">+62 852-1855-3397</p>
          </div>

          <div className="bg-[#0a1f4f] p-6 rounded-lg border border-blue-600 shadow-lg hover:shadow-xl transition col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-400">
              <FaMapMarkerAlt /> Alamat Pengembang
            </h3>
            <p className="text-white/80 text-sm">
              Z-Code Development Team <br />
              Universitas XYZ, Jl. Kampus No. 123, Jakarta, Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 text-center border-t border-white/10 bg-[#041025] text-sm text-white/60">
        © 2025 ImHere!!! — All rights reserved. | Created by Z-Code Dev Team
      </footer>
    </div>
  );
}
