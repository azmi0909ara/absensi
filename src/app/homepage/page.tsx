'use client';

import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';
import Link from 'next/link';


export default function Home() {
  const [showScroll, setShowScroll] = useState(false);

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
      <nav className="flex items-center justify-between px-6 py-4 bg-[#041025] fixed w-full z-30 top-0">
        <div className="flex items-center space-x-2">
         
          <span className="text-blue-500 font-extrabold text-lg select-none">ImHere!!!</span>
        </div>
        <ul className="hidden md:flex space-x-8 font-semibold text-sm">
          <li><a className="hover:underline" href="#">Home</a></li>
          <li><a className="hover:underline" href="#">Inner Pages</a></li>
          <li><a className="hover:underline" href="#">Contact</a></li>
        </ul>
        <div className="hidden md:flex items-center space-x-1 font-semibold text-sm cursor-pointer hover:underline">
          <span>Present Now</span>
          <FaMapMarkerAlt />
        </div>
      </nav>

      {/* Hero Section */}
      <section
  className="relative pt-30 pb-20 flex flex-col items-center text-center overflow-hidden bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "linear-gradient(180deg, rgba(4,16,37,1) 0%, rgba(4,16,37,0.9) 40%, rgba(28, 11, 215, 0.3) 100%), url('/bkg1.jpg')",
    backgroundBlendMode: 'overlay'
  }}
>
        <div className="flex justify-center mb-6">
          <img src="/imhere1.png" alt="IM HERE" className="h-20 w-auto" />
        </div>
        <h1 className="text-[2.25rem] sm:text-[2.75rem] md:text-5xl font-extrabold text-[#d3c7e9] leading-tight max-w-4xl">
          E-Presence<br />
          <span className="text-blue-400">Im Heree</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm sm:text-base text-[#d3c7e9]">
          welcome to our site. this help your company or your present to be kind than other
        </p>
        <ul className="flex flex-wrap justify-center items-center mt-6 space-x-4 text-xs sm:text-sm text-white/90 font-semibold max-w-xl">
          <li>Avaiable for :</li>
          <li className="border-l border-white/50 pl-4">Student</li>
          <li className="border-l border-white/50 pl-4">Employee</li>
          <li className="border-l border-white/50 pl-4">Others</li>
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
  <Link href="/choose">
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition">
      Try It Now
    </button>
  </Link>
  {/* <button className="border border-blue-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-600 hover:text-white transition">Explore More</button>*/}
</div>

      </section>

      {/* Info Section */}
      <section className="bg-[#041025] py-12 px-6 md:px-20 flex flex-col md:flex-row justify-between text-sm md:text-base max-w-10xl mx-auto">

          <h3 className="font-semibold text-white text-base md:text-lg mb-2">Present by Z-Code</h3>
          <p className="text-white/60 leading-relaxed">(footer)</p>
    
      </section>

      {/* Scroll to top button */}
      {showScroll && (
        <button
          aria-label="Scroll to top"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:blue-700 transition"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}
