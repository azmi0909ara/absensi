'use client';
import React, { useEffect, useState } from 'react';
import {
  FaUniversity, FaTachometerAlt, FaUserCheck, FaUsers, FaLocationArrow,
  FaHistory, FaCog, FaChevronLeft, FaEdit
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { db } from '@/../firebase';
import {
  collection, addDoc, getDocs, onSnapshot, updateDoc, doc
} from 'firebase/firestore';

export default function Dashboard() {
  const [dateTime, setDateTime] = useState('');
  const pathname = usePathname();
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [kodeUnik, setKodeUnik] = useState('');
  const [jamMasuk, setJamMasuk] = useState('00:00');
  const [hariAbsen, setHariAbsen] = useState<string[]>([]);
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

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
    const unsub = onSnapshot(collection(db, 'lokasiAbsensi'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'jadwalAbsensi'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJadwalList(data);
    });
    return () => unsub();
  }, []);

  const handleJadwalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeUnik || !selectedLocation || !jamMasuk || hariAbsen.length === 0) {
      return alert('Harap lengkapi semua data jadwal absen.');
    }

    if (editId) {
      await updateDoc(doc(db, 'jadwalAbsensi', editId), {
        kodeUnik,
        lokasiId: selectedLocation,
        lokasiNama: locations.find(loc => loc.id === selectedLocation)?.nama || '',
        jamMasuk,
        hariAbsen,
        toleransiMenit: 15
      });
      setEditId(null);
      alert('Jadwal berhasil diperbarui!');
    } else {
      await addDoc(collection(db, 'jadwalAbsensi'), {
        kodeUnik,
        lokasiId: selectedLocation,
        lokasiNama: locations.find(loc => loc.id === selectedLocation)?.nama || '',
        jamMasuk,
        hariAbsen,
        toleransiMenit: 15
      });
      alert('Jadwal absen berhasil ditambahkan!');
    }

    setKodeUnik('');
    setSelectedLocation('');
    setJamMasuk('08:00');
    setHariAbsen([]);
  };

  const handleEdit = (jadwal: any) => {
    setEditId(jadwal.id);
    setKodeUnik(jadwal.kodeUnik);
    setSelectedLocation(jadwal.lokasiId);
    setJamMasuk(jadwal.jamMasuk);
    setHariAbsen(jadwal.hariAbsen);
  };

  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  return (
    <div className="bg-[#f7f9fc] min-h-screen flex flex-col">
      <div className="flex flex-1">
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

                <main className="flex-1 flex flex-col font-times">
          <header className="flex items-center justify-end gap-6 px-6 py-4 border-b border-gray-200 bg-white">
            <div className="text-sm text-gray-600 select-none font-times">
              Date/Time: <span className="text-green-500 font-medium">{dateTime}</span>
            </div>
          </header>

          <div className="flex-1 p-8 overflow-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-700 mb-6">Formulir Jadwal Absen</h1>
              <form onSubmit={handleJadwalSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                  <label className="text-black font-semibold block mb-1 text-sm font-medium">Kode Unik User</label>
                  <input type="text" value={kodeUnik} onChange={(e) => setKodeUnik(e.target.value)} className="w-full px-3 py-2 border rounded text-black" placeholder="Masukkan kode unik" />
                </div>
                <div>
                  <label className="text-black font-semibold block mb-1 text-sm font-medium">Pilih Lokasi Absensi</label>
                  <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-black">
                    <option value="">-- Pilih Lokasi --</option>
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-black font-semibold block mb-1 text-sm font-medium">Jam Masuk</label>
                  <input type="time" value={jamMasuk} onChange={(e) => setJamMasuk(e.target.value)} className="w-full px-3 py-2 border rounded text-black" />
                  <p className="text-xs text-gray-500 mt-1">Absensi tidak bisa dilakukan jika lewat dari 15 menit.</p>
                </div>
                <div>
                  <label className="text-black font-semibold block mb-1 text-sm font-medium">Hari Absen</label>
                  <div className="grid grid-cols-2 gap-2">
                    {hariList.map(hari => (
                      <label key={hari} className="text-black flex items-center gap-2">
                        <input type="checkbox" checked={hariAbsen.includes(hari)} onChange={(e) => {
                          if (e.target.checked) {
                            setHariAbsen([...hariAbsen, hari]);
                          } else {
                            setHariAbsen(hariAbsen.filter(h => h !== hari));
                          }
                        }} />
                        {hari}
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  {editId ? 'Perbarui Jadwal' : 'Simpan Jadwal'}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Daftar Jadwal Absen</h2>
              <div className="bg-white rounded-lg shadow p-4 space-y-4 max-h-[600px] overflow-y-auto">
                {jadwalList.length === 0 && <p className="text-sm text-gray-500">Belum ada jadwal.</p>}
                {jadwalList.map(j => (
                  <div key={j.id} className="text-black border rounded p-3 text-sm">
                    <div><strong>Kode:</strong> {j.kodeUnik}</div>
                    <div><strong>Lokasi:</strong> {j.lokasiNama}</div>
                    <div><strong>Jam Masuk:</strong> {j.jamMasuk}</div>
                    <div><strong>Hari:</strong> {j.hariAbsen.join(', ')}</div>
                    <button onClick={() => handleEdit(j)} className="mt-2 text-blue-600 hover:underline text-xs flex items-center gap-1">
                      <FaEdit /> Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <footer className="py-4 text-center text-gray-500 text-xs select-none font-times">
            Present by Azmi Afif
          </footer>
        </main>
      </div>
    </div>
  );
}