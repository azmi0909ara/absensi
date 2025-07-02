'use client';

import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';
import { db } from '@/../firebase';
import {
  collection,
  getDocs,
  Timestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Absen {
  id?: string;
  jamMasuk: Timestamp;
  lokasiNama: string;
  status: string;
  nama: string;
  namaAbsen: string;
}

export default function RiwayatAbsensiPage() {
  const [riwayat, setRiwayat] = useState<Absen[]>([]);
  const [dateTime, setDateTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [filterNamaAbsen, setFilterNamaAbsen] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);

    const fetchRiwayat = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'userAbsen'));
        const data = snapshot.docs.map((docSnapshot) => ({
          ...docSnapshot.data(),
          id: docSnapshot.id,
        })) as Absen[];
        setRiwayat(data);
      } catch (error) {
        console.error('Gagal mengambil riwayat absensi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await deleteDoc(doc(db, 'userAbsen', id));
        setRiwayat((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error('Gagal menghapus data:', error);
      }
    }
  };

  const riwayatFilter = riwayat.filter((item) => {
    const cocokNama =
      filterNamaAbsen === '' ||
      item.namaAbsen?.toLowerCase().includes(filterNamaAbsen.toLowerCase());
    const cocokTanggal =
      filterTanggal === '' ||
      item.jamMasuk?.toDate().toISOString().slice(0, 10) === filterTanggal;
    return cocokNama && cocokTanggal;
  });

  const exportToCSV = () => {
    const header = ['Nama', 'Nama Absen', 'Jam Masuk', 'Lokasi', 'Status'];
    const rows = riwayatFilter.map((item) => [
      item.nama,
      item.namaAbsen,
      item.jamMasuk?.toDate().toLocaleString(),
      item.lokasiNama,
      item.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows]
        .map((e) => e.map((cell) => `"${cell}"`).join(','))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'riwayat_absensi.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Laporan Riwayat Absensi', 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [['Nama', 'Nama Absen', 'Jam Masuk', 'Lokasi', 'Status']],
      body: riwayatFilter.map((item) => [
        item.nama,
        item.namaAbsen,
        item.jamMasuk?.toDate().toLocaleString(),
        item.lokasiNama,
        item.status,
      ]),
    });

    doc.save('riwayat_absensi.pdf');
  };

  const totalTepat = riwayatFilter.filter((r) => r.status === 'Tepat Waktu').length;
  const totalTerlambat = riwayatFilter.filter((r) => r.status === 'Terlambat').length;
  const totalSemua = riwayatFilter.length;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-3 border-b border-gray-200 bg-white rounded-lg shadow mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Riwayat Absensi</h1>
          <div className="text-sm text-gray-600">
            ⏰ Waktu Sekarang:{' '}
            <span className="text-green-600 font-semibold">{dateTime}</span>
          </div>
        </header>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Cari Nama Absen..."
            className="text-black border border-gray-300 px-4 py-2 rounded-md shadow-sm w-full sm:w-64"
            value={filterNamaAbsen}
            onChange={(e) => setFilterNamaAbsen(e.target.value)}
          />
          <input
            type="date"
            className="text-black border border-gray-300 px-4 py-2 rounded-md shadow-sm w-full sm:w-48"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm text-sm"
            >
              Unduh CSV
            </button>
            <button
              onClick={exportToPDF}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-sm text-sm"
            >
              Unduh PDF
            </button>
          </div>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white shadow rounded p-4 text-center">
            <p className="text-sm text-gray-500">Total Kehadiran</p>
            <p className="text-xl font-bold text-gray-800">{totalSemua}</p>
          </div>
          <div className="bg-white shadow rounded p-4 text-center">
            <p className="text-sm text-gray-500">Tepat Waktu</p>
            <p className="text-xl font-bold text-green-600">{totalTepat}</p>
          </div>
          <div className="bg-white shadow rounded p-4 text-center">
            <p className="text-sm text-gray-500">Terlambat</p>
            <p className="text-xl font-bold text-yellow-600">{totalTerlambat}</p>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Memuat riwayat...</p>
        ) : riwayatFilter.length === 0 ? (
          <p className="text-gray-500">Tidak ditemukan data absensi yang cocok.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
            <table className="min-w-full table-auto text-sm text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Nama Absen</th>
                  <th className="px-4 py-2">Jam Masuk</th>
                  <th className="px-4 py-2">Lokasi</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {riwayatFilter.map((item, index) => (
                  <tr key={index} className="border-b text-gray-700">
                    <td className="px-4 py-2">{item.nama || '-'}</td>
                    <td className="px-4 py-2">{item.namaAbsen || '-'}</td>
                    <td className="px-4 py-2">
                      {item.jamMasuk?.toDate().toLocaleString() || '-'}
                    </td>
                    <td className="px-4 py-2">{item.lokasiNama || '-'}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-xs ${
                          item.status === 'Tepat Waktu'
                            ? 'bg-green-500'
                            : item.status === 'Terlambat'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
