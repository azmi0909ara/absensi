'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaUser,
  FaClock,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaBars,
  FaSignOutAlt,
} from 'react-icons/fa';

export default function SidebarUser() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Atur isMobile dan isOpen saat resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tutup sidebar saat pindah halaman di mobile
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [pathname, isMobile]);

  // Menu user dengan ikon
  const navItems = [
    { href: '/User/profile', label: 'Profil', icon: <FaUser /> },
    { href: '/User/absen', label: 'Absen Sekarang', icon: <FaClock /> },
    { href: '/User/lokasi', label: 'Lokasi Saya', icon: <FaMapMarkerAlt /> },
  ];

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('uid');
    router.push('/User'); // Arahkan ke halaman login atau landing page user
  };

  return (
    <>
      {/* Tombol toggle mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden fixed top-4 left-4 z-50 bg-[#3b5bdc] text-white p-2 rounded-md shadow-md"
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <FaChevronLeft /> : <FaBars />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:static top-0 left-0 h-screen w-64 bg-gradient-to-b from-[#3b5bdc] to-[#1a2ea8] text-white shadow-lg z-40 transition-transform duration-300 flex flex-col justify-between`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-white/20 select-none font-times font-extrabold uppercase text-lg">
            <FaUser className="text-xl" />
            <span>USER MENU</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col px-6 py-4 space-y-2 text-sm font-normal font-times">
            {navItems.map(({ href, label, icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 ${
                    active
                      ? 'bg-white/30 text-white font-semibold border-l-4 border-white ring-1 ring-white/40 shadow-sm'
                      : 'hover:bg-white/20 hover:text-white opacity-80'
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

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
