'use client';
import React, { JSX, useEffect, useState } from 'react';
import {
  FaUniversity,
  FaTachometerAlt,
  FaUserCheck,
  FaUsers,
  FaLocationArrow,
  FaHistory,
  FaCog,
  FaChevronLeft
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { db } from '@/../firebase';
import { collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';

export default function Dashboard() {
  const [dateTime, setDateTime] = useState<string>('');
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const pathname = usePathname();
  const [locations, setLocations] = useState<any[]>([]);
  const [previewLatLng, setPreviewLatLng] = useState<string>('-6.200000,106.816666');

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
    const unsub = onSnapshot(collection(db, 'lokasiAbsensi'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(data);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nama = (document.querySelector("#nama") as HTMLInputElement).value;
    const koordinat = (document.querySelector("#coordinates") as HTMLInputElement).value;
    const radius = parseFloat((document.querySelector("#radius") as HTMLInputElement).value);
    const [lat, lng] = koordinat.split(",").map(coord => parseFloat(coord.trim()));
    if (!nama || isNaN(lat) || isNaN(lng) || isNaN(radius)) return alert('Lengkapi semua isian dengan benar');

    await addDoc(collection(db, 'lokasiAbsensi'), {
      nama,
      latitude: lat,
      longitude: lng,
      radius,
      timestamp: new Date()
    });
    alert("Lokasi berhasil disimpan!");
  };

  const handlePreview = () => {
    const koordinat = (document.querySelector("#coordinates") as HTMLInputElement).value;
    const [lat, lng] = koordinat.split(",").map(coord => parseFloat(coord.trim()));
    if (!isNaN(lat) && !isNaN(lng)) {
      setPreviewLatLng(`${lat},${lng}`);
    } else {
      alert("Koordinat tidak valid");
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          const koordinatInput = document.querySelector("#coordinates") as HTMLInputElement;
          koordinatInput.value = `${lat}, ${lng}`;
          setPreviewLatLng(`${lat},${lng}`);
        },
        (error) => {
          alert("Gagal mendapatkan lokasi: " + error.message);
        }
      );
    } else {
      alert("Geolocation tidak didukung di browser ini.");
    }
  };

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
                <a key={href} href={href} className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-300 ${
                  isActive
                    ? 'bg-white/30 text-white font-semibold border-l-4 border-white ring-1 ring-white/40 shadow-sm'
                    : 'hover:bg-white/20 hover:text-white opacity-80'
                }`}>
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
          <header className="flex items-center justify-end gap-6 px-6 py-4 border-b border-gray-200 bg-white">
            <div className="text-sm text-gray-600 select-none font-times">
              Date/Time: <span className="text-green-500 font-medium">{dateTime}</span>
            </div>
          </header>

          <div className="flex flex-1">
            {/* Form */}
            <section className="flex-1 p-8 overflow-auto">
              <h1 className="text-gray-700 text-xl font-semibold mb-6 select-none font-times">
                Tambah Lokasi Absensi
              </h1>
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4 max-w-xl">
                <input id="nama" className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Nama Lokasi" />
                <input id="coordinates" className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Latitude, Longitude" />
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Gunakan Lokasi Saya
                </button>
                <input id="radius" type="number" className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Radius" />
                <div className="flex gap-4">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Simpan Lokasi</button>
                  <button type="button" onClick={handlePreview} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Pratinjau Lokasi</button>
                </div>
              </form>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pratinjau Lokasi</label>
                <div className="rounded overflow-hidden border border-gray-300">
                  <iframe
                    id="map-preview"
                    title="Google Maps Preview"
                    src={`https://maps.google.com/maps?q=${previewLatLng}&z=15&output=embed`}
                    width="100%"
                    height="300"
                    className="border-none"
                  ></iframe>
                </div>
              </div>
            </section>

            {/* Daftar lokasi */}
            <aside className="w-96 p-6 border-l border-gray-300 bg-gray-50 overflow-auto">
              <h2 className="text-black font-semibold mb-4">Daftar Lokasi</h2>
              <ul className="space-y-2">
                {locations.map(loc => (
                  <li key={loc.id} className="text-black bg-white p-3 rounded shadow text-sm">
                    <div><strong>{loc.nama}</strong></div>
                    <div>Lat: {loc.latitude}, Lng: {loc.longitude}</div>
                    <div>Radius: {loc.radius}m</div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <footer className="py-4 text-center text-gray-500 text-xs select-none font-times">
            Present by Azmi Afif
          </footer>
        </main>
      </div>
    </div>
  );
}
