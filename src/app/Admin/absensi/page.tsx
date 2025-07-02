'use client';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaSearch, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { usePathname } from 'next/navigation';
import { db } from '@/../firebase';
import {
  collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc
} from 'firebase/firestore';

export default function Dashboard() {
  const [dateTime, setDateTime] = useState('');
  const pathname = usePathname();
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [kodeUnik, setKodeUnik] = useState('');
  const [namaAbsen, setnamaAbsen] = useState('');
  const [jamMasuk, setJamMasuk] = useState('08:00');
  const [hariAbsen, setHariAbsen] = useState<string[]>([]);
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterHari, setFilterHari] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

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
    const unsubLoc = onSnapshot(collection(db, 'lokasiAbsensi'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLocations(data);
    });

    const unsubJadwal = onSnapshot(collection(db, 'jadwalAbsensi'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJadwalList(data);
    });

    return () => {
      unsubLoc();
      unsubJadwal();
    };
  }, []);

  const handleJadwalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeUnik || !selectedLocation || !jamMasuk || hariAbsen.length === 0) {
      return alert('Harap lengkapi semua data jadwal absen.');
    }

    const jadwalData = {
      kodeUnik,
      namaAbsen,
      lokasiId: selectedLocation,
      lokasiNama: locations.find(loc => loc.id === selectedLocation)?.nama || '',
      jamMasuk,
      hariAbsen,
      toleransiMenit: 15
    };

    if (editId) {
      await updateDoc(doc(db, 'jadwalAbsensi', editId), jadwalData);
      setEditId(null);
      alert('Jadwal berhasil diperbarui!');
    } else {
      await addDoc(collection(db, 'jadwalAbsensi'), jadwalData);
      alert('Jadwal absen berhasil ditambahkan!');
    }

    setKodeUnik('');
    setnamaAbsen('');
    setSelectedLocation('');
    setJamMasuk('08:00');
    setHariAbsen([]);
  };

  const handleEdit = (jadwal: any) => {
    setEditId(jadwal.id);
    setKodeUnik(jadwal.kodeUnik);
    setnamaAbsen(jadwal.namaAbsen);
    setSelectedLocation(jadwal.lokasiId);
    setJamMasuk(jadwal.jamMasuk);
    setHariAbsen(jadwal.hariAbsen);
  };

  const handleDelete = async (id: string) => {
    const konfirmasi = confirm('Yakin ingin menghapus jadwal ini?');
    if (konfirmasi) {
      await deleteDoc(doc(db, 'jadwalAbsensi', id));
      alert('Jadwal berhasil dihapus!');
    }
  };

  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const filteredJadwal = jadwalList
    .filter(j =>
      j.kodeUnik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.lokasiNama.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(j => (filterHari ? j.hariAbsen.includes(filterHari) : true))
    .sort((a, b) =>
      sortAsc
        ? a.jamMasuk.localeCompare(b.jamMasuk)
        : b.jamMasuk.localeCompare(a.jamMasuk)
    );

  return (
    <div className="bg-[#f7f9fc] min-h-screen flex flex-row font-times">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between gap-6 px-6 py-4 border-b border-gray-200 bg-white">
          <div className="text-sm text-gray-600 select-none">
            Date/Time: <span className="text-green-500 font-medium">{dateTime}</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulir Jadwal */}
          <div>
            <h1 className="text-xl font-semibold text-gray-700 mb-6">Formulir Jadwal Absen</h1>
            <form onSubmit={handleJadwalSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
              <div>
                <label className="text-black font-semibold block mb-1 text-sm">Kode Unik User</label>
                <input
                  type="text"
                  value={kodeUnik}
                  onChange={(e) => setKodeUnik(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-black"
                  placeholder="Masukkan kode unik"
                />
              </div>
               <div>
                <label className="text-black font-semibold block mb-1 text-sm">Nama Absensi</label>
                <input
                  type="text"
                  value={namaAbsen}
                  onChange={(e) => setnamaAbsen(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-black"
                  placeholder="Masukkan Nama Absen"
                />
              </div>
              <div>
                <label className="text-black font-semibold block mb-1 text-sm">Pilih Lokasi Absensi</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-black"
                >
                  <option value="">-- Pilih Lokasi --</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.nama}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-black font-semibold block mb-1 text-sm">Jam Masuk</label>
                <input
                  type="time"
                  value={jamMasuk}
                  onChange={(e) => setJamMasuk(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-black"
                />
                <p className="text-xs text-gray-500 mt-1">Absensi tidak bisa dilakukan jika lewat dari 15 menit.</p>
              </div>
              <div>
                <label className="text-black font-semibold block mb-1 text-sm">Hari Absen</label>
                <div className="grid grid-cols-2 gap-2">
                  {hariList.map(hari => (
                    <label key={hari} className="text-black flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hariAbsen.includes(hari)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHariAbsen([...hariAbsen, hari]);
                          } else {
                            setHariAbsen(hariAbsen.filter(h => h !== hari));
                          }
                        }}
                      />
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

          {/* Daftar Jadwal */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Daftar Jadwal Absen</h2>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan kode/lokasi"
                className="text-black border px-3 py-2 rounded w-full text-sm"
              />
              <select
                value={filterHari}
                onChange={(e) => setFilterHari(e.target.value)}
                className="text-black border px-2 py-2 rounded text-sm"
              >
                <option value="">Filter Hari</option>
                {hariList.map(hari => (
                  <option key={hari} value={hari}>{hari}</option>
                ))}
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="text-blue-600 text-lg p-2"
                title="Urutkan Jam Masuk"
              >
                {sortAsc ? <FaSortAmountDown /> : <FaSortAmountUp />}
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-4 space-y-4 max-h-[600px] overflow-y-auto">
              {filteredJadwal.length === 0 && <p className="text-sm text-gray-500">Belum ada jadwal.</p>}
              {filteredJadwal.map(j => (
                <div key={j.id} className="text-black border rounded p-3 text-sm relative">
                  <div><strong>Kode:</strong> {j.kodeUnik}</div>
                  <div><strong>Nama Absen:</strong> {j.namaAbsen}</div>
                  <div><strong>Lokasi:</strong> {j.lokasiNama}</div>
                  <div><strong>Jam Masuk:</strong> {j.jamMasuk}</div>
                  <div><strong>Hari:</strong> {j.hariAbsen.join(', ')}</div>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <button onClick={() => handleEdit(j)} className="text-blue-600 hover:underline flex items-center gap-1">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(j.id)} className="text-red-600 hover:underline flex items-center gap-1">
                      <FaTrash /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="py-4 text-center text-gray-500 text-xs select-none">
          Present by Azmi Afif
        </footer>
      </div>
    </div>
  );
}
