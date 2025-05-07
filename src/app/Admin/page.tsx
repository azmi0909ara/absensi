'use client';
import React, { JSX, useEffect, useState } from 'react';
import {
  FaUniversity,
  FaTachometerAlt,
  FaUserCheck,
  FaUser,
  FaChalkboardTeacher,
  FaFileAlt,
  FaChevronLeft,
  FaLocationArrow,
  FaUsers,
  FaHistory,
  FaCog
} from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/../firebase'; // pastikan path ini sesuai
import { usePathname } from 'next/navigation';

export default function Dashboard() {
  const [dateTime, setDateTime] = useState<string>('');
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const pathname = usePathname();
  const [totalLokasi, setTotalLokasi] = useState<number>(0);


  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatted = new Intl.DateTimeFormat('id-ID', options).format(now);
      setDateTime(formatted);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        setTotalUsers(usersSnapshot.size);
      } catch (error) {
        console.error('Gagal mengambil data pengguna:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const lokasiCollection = collection(db, 'lokasiAbsensi');
        const lokasiSnapshot = await getDocs(lokasiCollection);
        setTotalLokasi(lokasiSnapshot.size);
      } catch (error) {
        console.error('Gagal mengambil data lokasi absensi:', error);
      }
    };
  
    fetchLocations();
  }, []);
  

  return (
    <div className="bg-[#f7f9fc] min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-[#3b5bdc] to-[#1a2ea8] text-white flex flex-col shadow-lg">
          <div className="flex items-center gap-2 px-6 py-6 border-b border-white/20">
            <FaUniversity className="text-xl" />
            <span className="font-extrabold uppercase text-lg select-none font-times">IM HERE !!</span>
          </div>
          <nav className="flex flex-col px-6 py-4 space-y-2 text-sm font-normal font-times">
            {[
              { href: "/Admin", label: "Dashboard", icon: <FaTachometerAlt /> },
              { href: "/Admin/absensi", label: "Absensi", icon: <FaUserCheck /> },
              { href: "/Admin/pengguna", label: "Manajemen Pengguna", icon: <FaUsers /> },
              { href: "/Admin/lokasi", label: "Lokasi Absen", icon: <FaLocationArrow /> },
              { href: "/Admin/riwayat", label: "Riwayat Absensi", icon: <FaHistory /> },
              { href: "/Admin/pengaturan", label: "Pengaturan", icon: <FaCog /> },
            ].map(({ href, label, icon }) => {
              const isActive = pathname === href;
              return (
                <a
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 ${
                    isActive
                      ? 'bg-white/30 text-white font-semibold border-l-4 border-white ring-1 ring-white/40 shadow-sm'
                      : 'hover:bg-white/20 hover:text-white opacity-80'
                  }`}
                >
                  {icon}
                  {label}
                </a>
              );
            })}
          </nav>
          <div className="flex-grow" />
          <div className="px-6 py-4 border-t border-white/20">
            <button
              aria-label="Collapse sidebar"
              className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <FaChevronLeft />
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col font-times">
          {/* Top bar */}
          <header className="flex items-center justify-end gap-6 px-6 py-4 border-b border-gray-200 bg-white">
            <div className="text-sm text-gray-600 select-none font-times">
              Date/Time:{' '}
              <span className="text-green-500 font-medium" id="realtime-login">
                {dateTime}
              </span>
            </div>
            <div className="border-l border-gray-300 h-6" />
          </header>

          {/* Dashboard content */}
          <section className="flex-1 p-8 overflow-auto">
            <h1 className="text-gray-700 text-xl font-normal mb-6 select-none font-times">
              Dashboard Admin
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <Card
                title="TOTAL PENGGUNA"
                value={totalUsers.toString()}
                icon={<FaUser className="text-gray-300 text-3xl select-none" />}
                color="green-500"
              />
              <Card
                title="ABSEN HARI INI"
                value="15"
                icon={<FaChalkboardTeacher className="text-gray-300 text-3xl select-none" />}
                color="blue-500"
              />
             <Card
                title="LOKASI AKTIF"
                value={totalLokasi.toString()}
                icon={<FaLocationArrow className="text-gray-300 text-3xl select-none" />}
                color="purple-500"
              />

              <Card
                title="LAPORAN BULANAN"
                value="Download"
                icon={<FaFileAlt className="text-gray-300 text-3xl select-none" />}
                color="yellow-500"
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
    <div
      className={`bg-white rounded-lg shadow-md p-5 relative border-l-4 border-${color} flex items-center justify-between font-times`}
    >
      <div>
        <p
          className={`text-${color} text-xs font-semibold leading-tight select-text whitespace-pre-line`}
        >
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
