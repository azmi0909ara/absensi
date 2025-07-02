'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaUniversity,
  FaTachometerAlt,
  FaUserCheck,
  FaUsers,
  FaLocationArrow,
  FaHistory,
  FaCog,
  FaChevronLeft,
  FaBars,
  FaSignOutAlt
} from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const allowedPaths = ['/Admin/dashboard', '/Admin/pengguna', '/Admin/lokasi','/Admin/riwayat', '/Admin/absensi'];
  const isAllowed = allowedPaths.some(path => pathname.startsWith(path));
  if (!isAllowed) return null;

  // Atur isMobile dan isOpen saat resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true); // di desktop, sidebar harus terbuka
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tutup sidebar saat pindah halaman (mobile)
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [pathname, isMobile]);

  const menuItems = [
    { href: "/Admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/Admin/absensi", label: "Absensi", icon: <FaUserCheck /> },
    { href: "/Admin/pengguna", label: "Manajemen Pengguna", icon: <FaUsers /> },
    { href: "/Admin/lokasi", label: "Lokasi Absen", icon: <FaLocationArrow /> },
    { href: "/Admin/riwayat", label: "Riwayat Absensi", icon: <FaHistory /> },
  
  ];

  const handleLogout = () => {
    localStorage.removeItem('uid');
    router.push('/Admin'); // Arahkan ke halaman login atau landing page user
  };

  return (
    <>
      {/* Tombol Toggle Sidebar Mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden fixed top-4 left-4 z-50 bg-[#3b5bdc] text-white p-2 rounded-md shadow-md"
        >
          {isOpen ? <FaChevronLeft /> : <FaBars />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:static top-0 left-0 h-screen w-64 bg-gradient-to-b from-[#3b5bdc] to-[#1a2ea8] text-white shadow-lg z-40 transition-transform duration-300`}
      >
        <div className="flex items-center gap-2 px-6 py-6 border-b border-white/20">
          <FaUniversity className="text-xl" />
          <span className="font-extrabold uppercase text-lg select-none font-times">IM HERE !!</span>
        </div>

        <nav className="flex flex-col px-6 py-4 space-y-2 text-sm font-normal font-times">
          {menuItems.map(({ href, label, icon }) => {
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
        {/* Logout Button */}
                <div className="px-6 pb-6">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition-all duration-300"
                  >
                    <FaSignOutAlt />
                    Keluar
                  </button>
                </div>
      </aside>
    </>
  );
}
