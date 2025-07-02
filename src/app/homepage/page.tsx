'use client';

import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaArrowUp, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {
  const [showScroll, setShowScroll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#041025] text-white font-inter">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-[#041025] fixed w-full z-30 top-0 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-blue-500 font-extrabold text-lg sm:text-xl select-none">ImHere!!!</span>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-8 font-semibold text-sm">
          <li><a className="hover:underline transition-all" href="homepage">Home</a></li>
          <li><a className="hover:underline transition-all" href="feature">Features</a></li>
          <li><a className="hover:underline transition-all" href="contact">Contact</a></li>
        </ul>

        {/* Present Now - Desktop */}
        <div className="hidden md:flex items-center space-x-1 text-sm font-semibold cursor-pointer hover:underline">
          <span>Present Now</span>
          <FaMapMarkerAlt />
        </div>

        {/* Mobile menu icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#041025] px-6 py-4 border-t border-blue-600 z-20">
          <ul className="flex flex-col space-y-3 text-sm font-medium">
            <li><a href="homepage" className="hover:underline">Home</a></li>
            <li><a href="feature" className="hover:underline">Features</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
            <li className="flex items-center space-x-2">
              <span>Present Now</span>
              <FaMapMarkerAlt />
            </li>
          </ul>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="pt-32 pb-50 px-4 sm:px-6 flex flex-col items-center text-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(4,16,37,1) 0%, rgba(4,16,37,0.9) 40%, rgba(28, 11, 215, 0.3) 100%), url('/bkg1.jpg')",
        }}
      >
        <div className="flex justify-center mb-6">
          <img src="/imhere1.png" alt="IM HERE" className="h-20 w-auto" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#d3c7e9] leading-tight max-w-3xl">
          E-Presence<br />
          <span className="text-blue-400">Im Heree</span>
        </h1>
        <p className="mt-4 max-w-lg text-sm sm:text-base text-[#d3c7e9] px-2">
          Welcome to our site. This helps your organization improve presence accuracy & monitoring.
        </p>
        <ul className="flex flex-wrap justify-center items-center mt-6 text-xs sm:text-sm text-white/90 font-medium space-x-3 sm:space-x-6">
          <li>Available for:</li>
          <li className="border-l border-white/50 pl-3">Student</li>
          <li className="border-l border-white/50 pl-3">Employee</li>
          <li className="border-l border-white/50 pl-3">Others</li>
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/choose">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md min-w-[140px] transition">
              Try It Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#041025] py-10 px-4 sm:px-8 lg:px-20 text-sm md:text-base border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-bold text-white mb-2">ImHere!!!</h3>
            <p className="text-white/60">A digital attendance app for students and employees.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><a href="#" className="text-white/70 hover:text-white transition">Home</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Features</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Contact</h4>
            <p className="text-white/60">present@imhere.com</p>
            <p className="text-white/60">+62 123-1234-1234</p>
          </div>
        </div>
        <div className="mt-6 text-center text-white/40 text-xs">
          © 2025 ImHere!!! All rights reserved.
        </div>
      </footer>

      {/* Scroll to Top */}
      {showScroll && (
        <button
          aria-label="Scroll to top"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}
