 'use client';
import React, { JSX } from 'react';

import { useEffect, useState } from 'react';
import { FaUniversity, FaTachometerAlt, FaUserCheck, FaUser, FaChalkboardTeacher, FaBook, FaFileAlt, FaChevronLeft, FaLocationArrow } from 'react-icons/fa';

export default function Dashboard() {
  const [dateTime, setDateTime] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setDateTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#f7f9fc] min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-[#3b5bdc] to-[#1a2ea8] text-white flex flex-col">
          <div className="flex items-center gap-2 px-6 py-6 border-b border-white/20">
            <FaUniversity className="text-xl" />
            <span className="font-extrabold uppercase text-lg select-none font-times">IM HERE !!</span>
          </div>
          <nav className="flex flex-col px-6 py-4 space-y-6 text-sm font-normal opacity-70 font-times">
            <a className="flex items-center gap-3 hover:opacity-100 transition-opacity duration-200" href="#">
              <FaTachometerAlt />
              Dashboard
            </a>
            <a className="flex items-center gap-3 hover:opacity-100 transition-opacity duration-200" href="#">
              <FaUserCheck />
              Absensi
            </a>
          </nav>
          <div className="flex-grow" />
          <div className="px-6 py-4 border-t border-white/20">
            <button aria-label="Collapse sidebar" className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors">
              <FaChevronLeft />
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col font-times">
          {/* Top bar */}
          <header className="flex items-center justify-end gap-6 px-6 py-4 border-b border-gray-200 bg-white">
            <div className="text-sm text-gray-600 select-none font-times">
              Date/Time : <span className="text-green-500 font-medium" id="realtime-login">{dateTime}</span>
            </div>
            <div className="border-l border-gray-300 h-6" />
          </header>

          {/* Dashboard content */}
          <section className="flex-1 p-8 overflow-auto">
            <h1 className="text-gray-700 text-xl font-normal mb-6 select-none font-times">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Card 1 */}
              <Card
                title="USER"
                value="-"
                icon={<FaUser className="text-gray-300 text-3xl select-none" />}
                color="green-500"
              />
              {/* Card 2 */}
              <Card
                title="ABSEN"
                value="-"
                icon={<FaChalkboardTeacher className="text-gray-300 text-3xl select-none" />}
                color="green-500"
              />
              {/* Card 3 */}
              <Card
                title="LOKASI"
                value="-"
                icon={<FaLocationArrow className="text-gray-300 text-3xl select-none" />}
                color="green-500"
              />
              {/* Card 4 */}
              <Card
                title="LAPORAN"
                value="-"
                icon={<FaFileAlt className="text-gray-300 text-3xl select-none" />}
                color="green-500"
              />
            </div>
          </section>

          {/* Footer */}
          <footer className="py-4 text-center text-gray-500 text-xs select-none font-times">
            Present by Azmi Afif
          </footer>
        </main>
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  value: string;
  icon: JSX.Element;
  color: string;
}

function Card({ title, value, icon, color }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-5 relative border-l-4 border-${color} flex items-center justify-between font-times`}>
      <div>
        <p className={`text-${color} text-xs font-semibold leading-tight select-text whitespace-pre-line`}>
          {title}
        </p>
        <p className="text-gray-900 font-semibold text-lg mt-1 select-text">
          {value}
        </p>
      </div>
      {icon}
    </div>
  );
}
