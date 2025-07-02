'use client';
import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { db } from '@/../firebase';
import {
  collection, onSnapshot, addDoc,
  updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import Sidebar from '../../components/Sidebar';

export default function Dashboard() {
  const [dateTime, setDateTime] = useState('');
  const [locations, setLocations] = useState<any[]>([]);
  const [previewLatLng, setPreviewLatLng] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minRadius, setMinRadius] = useState('');
  const [sortBy, setSortBy] = useState<'nama-asc' | 'nama-desc' | 'radius-asc' | 'radius-desc'>('nama-asc');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDateTime(new Intl.DateTimeFormat('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      }).format(now));
    }, 1000);
    return () => clearInterval(interval);
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
    const [lat, lng] = koordinat.split(",").map(val => parseFloat(val.trim()));

    if (!nama || isNaN(lat) || isNaN(lng) || isNaN(radius)) return alert('Isian tidak valid.');

    await addDoc(collection(db, 'lokasiAbsensi'), {
      nama, latitude: lat, longitude: lng, radius, timestamp: new Date()
    });

    alert("Lokasi berhasil disimpan.");
  };

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        (document.querySelector("#coordinates") as HTMLInputElement).value = `${lat}, ${lng}`;
        setPreviewLatLng(`${lat},${lng}`);
      },
      (err) => alert("Gagal mendapatkan lokasi: " + err.message)
    );
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

  const handleEdit = (loc: any) => {
    setEditData({ ...loc });
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus lokasi ini?")) {
      await deleteDoc(doc(db, 'lokasiAbsensi', id));
      alert("Data berhasil dihapus.");
    }
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    const { id, nama, latitude, longitude, radius } = editData;
    await updateDoc(doc(db, 'lokasiAbsensi', id), {
      nama, latitude, longitude, radius
    });
    setEditModalOpen(false);
    alert("Perubahan disimpan.");
  };

  const handlePreviewModal = (loc: any) => {
    setPreviewData(loc);
    setPreviewModalOpen(true);
  };

  const getFilteredSortedLocations = () => {
    return locations
      .filter(loc =>
        loc.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!minRadius || loc.radius >= parseFloat(minRadius))
      )
      .sort((a, b) => {
        if (sortBy === 'nama-asc') return a.nama.localeCompare(b.nama);
        if (sortBy === 'nama-desc') return b.nama.localeCompare(a.nama);
        if (sortBy === 'radius-asc') return a.radius - b.radius;
        if (sortBy === 'radius-desc') return b.radius - a.radius;
        return 0;
      });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-times">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <header className="flex justify-end px-6 py-4 border-b bg-white">
            <div className="text-sm text-gray-600">
              Date/Time: <span className="text-green-600">{dateTime}</span>
            </div>
          </header>
          <div className="flex flex-col lg:flex-row flex-1">
            {/* Form Tambah Lokasi */}
            <section className="flex-1 p-6">
              <h1 className="text-black text-semibold text-lg font-semibold mb-4">Tambah Lokasi Absensi</h1>
              <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3 max-w-xl">
                <input id="nama" placeholder="Nama Lokasi" className="text-black w-full border p-2 rounded" />
                <input id="coordinates" placeholder="Latitude, Longitude" className="text-black w-full border p-2 rounded" />
                <button type="button" onClick={handleGetCurrentLocation} className="text-black text-blue-600 text-sm hover:underline">
                  Gunakan Lokasi Saya
                </button>
                <input id="radius" type="number" placeholder="Radius" className="text-black w-full border p-2 rounded" />
                <div className="flex gap-4">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
                  <button type="button" onClick={handlePreview} className="bg-green-600 text-white px-4 py-2 rounded">Pratinjau</button>
                </div>
              </form>
              <div className="mt-4">
                <iframe
                  src={`https://maps.google.com/maps?q=${previewLatLng}&z=15&output=embed`}
                  width="100%"
                  height="300"
                  className="border"
                ></iframe>
              </div>
            </section>

            {/* Daftar Lokasi */}
            <aside className="w-full lg:w-96 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-300 p-4 overflow-y-auto">
              <h2 className="text-black font-semibold mb-4">Daftar Lokasi</h2>

              {/* Filter & Search */}
              <div className="mb-4 space-y-2 text-sm">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama lokasi..."
                  className="w-full border p-2 rounded text-black"
                />
                <input
                  type="number"
                  value={minRadius}
                  onChange={(e) => setMinRadius(e.target.value)}
                  placeholder="Minimal radius (meter)"
                  className="w-full border p-2 rounded text-black"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full border p-2 rounded text-black"
                >
                  <option value="nama-asc">Nama (A-Z)</option>
                  <option value="nama-desc">Nama (Z-A)</option>
                  <option value="radius-asc">Radius (terkecil)</option>
                  <option value="radius-desc">Radius (terbesar)</option>
                </select>
              </div>

              <ul className="space-y-3">
                {getFilteredSortedLocations().map(loc => (
                  <li key={loc.id} className="bg-white p-3 rounded shadow text-sm space-y-1">
                    <div className="text-black font-semibold">{loc.nama}</div>
                    <div className="text-black">Lat: {loc.latitude}, Lng: {loc.longitude}</div>
                    <div className="text-black">Radius: {loc.radius}m</div>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleEdit(loc)} className="text-blue-600 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(loc.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                      <button onClick={() => handlePreviewModal(loc)} className="text-green-600 hover:underline text-xs">Preview</button>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <footer className="text-center text-gray-500 text-xs py-4">Present by Azmi Afif</footer>
        </main>
      </div>

      {/* Modal Edit */}
     <Transition appear show={editModalOpen} as={Fragment}>
  <Dialog as="div" className="relative z-50" onClose={() => setEditModalOpen(false)}>
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {/* Tambahkan backdrop-blur-sm untuk efek blur */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
    </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
            <Dialog.Panel className="bg-white w-full max-w-md p-6 rounded shadow-lg">
              <Dialog.Title className="text-black text-semibold text-lg font-medium mb-4">Edit Lokasi</Dialog.Title>
              <input value={editData?.nama || ''} onChange={(e) => setEditData({ ...editData, nama: e.target.value })} className="text-black w-full mb-2 p-2 border rounded" placeholder="Nama Lokasi" />
              <input value={`${editData?.latitude}`} onChange={(e) => setEditData({ ...editData, latitude: parseFloat(e.target.value) })} className="text-black w-full mb-2 p-2 border rounded" placeholder="Latitude" />
              <input value={`${editData?.longitude}`} onChange={(e) => setEditData({ ...editData, longitude: parseFloat(e.target.value) })} className="text-black w-full mb-2 p-2 border rounded" placeholder="Longitude" />
              <input value={`${editData?.radius}`} onChange={(e) => setEditData({ ...editData, radius: parseFloat(e.target.value) })} className="text-black w-full mb-4 p-2 border rounded" placeholder="Radius" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditModalOpen(false)} className="text-sm text-gray-500">Batal</button>
                <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Simpan</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Modal Preview */}
      <Transition appear show={previewModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setPreviewModalOpen(false)}>
          <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {/* Tambahkan backdrop-blur-sm untuk efek blur */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
    </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center">
            <Dialog.Panel className="bg-white w-full max-w-md p-6 rounded shadow-lg">
              <Dialog.Title className="text-black text-semibold text-lg font-medium mb-2">Detail Lokasi</Dialog.Title>
              {previewData && (
                <>
                  <p className="text-black mb-2"><strong>Nama:</strong> {previewData.nama}</p>
                  <p className="text-black mb-2"><strong>Koordinat:</strong> {previewData.latitude}, {previewData.longitude}</p>
                  <p className="text-black mb-4"><strong>Radius:</strong> {previewData.radius} meter</p>
                  <iframe
                    src={`https://maps.google.com/maps?q=${previewData.latitude},${previewData.longitude}&z=15&output=embed`}
                    width="100%"
                    height="250"
                    className="rounded border"
                  ></iframe>
                </>
              )}
              <div className="mt-4 flex justify-end">
                <button onClick={() => setPreviewModalOpen(false)} className="bg-gray-600 text-white px-4 py-2 rounded text-sm">Tutup</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
