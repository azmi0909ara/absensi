'use client';
import React, { useEffect, useState, Fragment } from 'react';
import Sidebar from '../../components/Sidebar_user';

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



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nama = (document.querySelector("#nama") as HTMLInputElement).value;
    const koordinat = (document.querySelector("#coordinates") as HTMLInputElement).value;
    const radius = parseFloat((document.querySelector("#radius") as HTMLInputElement).value);
    const [lat, lng] = koordinat.split(",").map(val => parseFloat(val.trim()));

    if (!nama || isNaN(lat) || isNaN(lng) || isNaN(radius)) return alert('Isian tidak valid.');

   
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
              <h1 className="text-black text-semibold text-lg font-semibold mb-4">Lokasi Saya</h1>
              <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3 max-w-xl">
        
                <input id="coordinates" placeholder="Latitude, Longitude" className="text-black w-full border p-2 rounded" />
                <button type="button" onClick={handleGetCurrentLocation} className="text-black text-blue-600 text-sm hover:underline">
                  Gunakan Lokasi Saya
                </button>
              </form>
              <div className="mt-4">
                <iframe
                  src={`https://maps.google.com/maps?q=${previewLatLng}&z=15&output=embed`}
                  width="100%"
                  height="400"
                  className="border"
                ></iframe>
              </div>
            </section>
     
          </div>
          <footer className="text-center text-gray-500 text-xs py-4">Present by Azmi Afif</footer>
        </main>
      </div>
    </div>
  );
}
