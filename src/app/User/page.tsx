'use client';
import React, { useEffect, useState } from 'react';
import {
  FaUserCheck,
  FaMapMarkedAlt,
  FaHistory,
  FaClock,
  FaChevronLeft,
  FaUniversity,
} from 'react-icons/fa';

// Lokasi target absensi
const TARGET_LOCATION = {
  lat: -6.200000,
  lng: 106.816666,
  radius: 100, // meter
};

// Fungsi menghitung jarak (meter)
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Tipe lokasi pengguna
type Location = {
  lat: number;
  lng: number;
};

export default function DashboardUser() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isWithinArea, setIsWithinArea] = useState(false);
  const [message, setMessage] = useState('');
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toISOString().slice(0, 19).replace('T', ' ');
      setDateTime(formatted);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = pos.coords;
        const userLocation = { lat: coords.latitude, lng: coords.longitude };
        setLocation(userLocation);
        const distance = haversineDistance(
          userLocation.lat,
          userLocation.lng,
          TARGET_LOCATION.lat,
          TARGET_LOCATION.lng
        );
        setIsWithinArea(distance <= TARGET_LOCATION.radius);
      },
      (err) => {
        console.error(err);
        setMessage('Gagal mendapatkan lokasi. Aktifkan GPS Anda.');
      }
    );
  }, []);

  const handleAbsen = () => {
    if (isWithinArea) {
      setMessage('Absensi berhasil!');
    } else {
      setMessage('Anda di luar area absensi.');
    }
  };

  return (
    <div className="bg-[#f7f9fc] min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-[#1a88cc] to-[#005f99] text-white flex flex-col">
          <div className="flex items-center gap-2 px-6 py-6 border-b border-white/20">
            <FaUniversity className="text-xl" />
            <span className="font-extrabold uppercase text-lg select-none font-times">I'M HERE</span>
          </div>
          <nav className="flex flex-col px-6 py-4 space-y-6 text-sm font-normal opacity-70 font-times">
            <a className="flex items-center gap-3 hover:opacity-100 transition-opacity duration-200" href="#">
              <FaUserCheck />
              Absen Sekarang
            </a>
            <a className="flex items-center gap-3 hover:opacity-100 transition-opacity duration-200" href="#">
              <FaMapMarkedAlt />
              Lokasi Saya
            </a>
            <a className="flex items-center gap-3 hover:opacity-100 transition-opacity duration-200" href="#">
              <FaHistory />
              Riwayat Absen
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
          <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard Pengguna</h1>
            <div className="text-sm text-gray-600 select-none font-times">
              <FaClock className="inline mr-1 text-gray-400" />
              <span className="text-green-500 font-medium">{dateTime}</span>
            </div>
          </header>

          <section className="flex-1 p-8 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Status Lokasi</h2>
                {location ? (
                  <p className="text-sm text-gray-700">
                    Latitude: {location.lat.toFixed(6)}<br />
                    Longitude: {location.lng.toFixed(6)}
                  </p>
                ) : (
                  <p className="text-sm text-red-500">Menunggu lokasi...</p>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
                {isWithinArea ? (
                  <>
                    <p className="text-green-600 font-semibold mb-2">Anda berada di dalam area absensi.</p>
                    <button onClick={handleAbsen} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                      Absen Sekarang
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-red-600 font-semibold mb-2">Anda di luar area absensi.</p>
                    <button disabled className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed">
                      Absen Tidak Tersedia
                    </button>
                  </>
                )}
              </div>
            </div>
            {message && <p className="mt-4 text-center text-blue-600 text-sm">{message}</p>}
          </section>

          <footer className="py-4 text-center text-gray-500 text-xs select-none font-times">
            Present by Azmi Afif
          </footer>
        </main>
      </div>
    </div>
  );
}
