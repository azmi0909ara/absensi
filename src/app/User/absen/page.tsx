'use client';
import { useEffect, useState } from 'react';
import { db } from '@/../firebase';
import SidebarUser from '../../components/Sidebar_user';
import {
  collection, getDocs, doc, getDoc, addDoc
} from 'firebase/firestore';
import { FaClock } from 'react-icons/fa';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

interface Jadwal {
  namaAbsen: string;
  id: string;
  kodeUnik: string;
  namaLokasi: string;
  lokasiId: string;
}

interface Lokasi {
  id: string;
  nama: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export default function UserAbsenPage() {
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [kodeInput, setKodeInput] = useState('');
  const [selectedJadwal, setSelectedJadwal] = useState<Jadwal | null>(null);
  const [selectedLokasi, setSelectedLokasi] = useState<Lokasi | null>(null);
  const [lokasiValid, setLokasiValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dateTime, setDateTime] = useState<string | null>(null);
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [status, setStatus] = useState('');
  const [formSiap, setFormSiap] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) setUserEmail(user.email || '');
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, 'jadwalAbsensi'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Jadwal[];
      setJadwalList(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (err) => alert("Gagal mendapatkan lokasi: " + err.message),
      { enableHighAccuracy: true }
    );
  }, []);

  function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const handleKodeSubmit = async () => {
    const jadwal = jadwalList.find(j => j.kodeUnik === kodeInput.trim());
    if (!jadwal) return alert("Kode tidak ditemukan!");

    setSelectedJadwal(jadwal);
    const lokasiRef = doc(db, 'lokasiAbsensi', jadwal.lokasiId);
    const lokasiSnap = await getDoc(lokasiRef);

    if (!lokasiSnap.exists()) {
      alert("Data lokasi tidak ditemukan.");
      return;
    }

    const lokasiData = lokasiSnap.data() as Omit<Lokasi, 'id'>;
    const lokasi: Lokasi = { id: lokasiSnap.id, ...lokasiData };
    setSelectedLokasi(lokasi);

    if (userLocation) {
      const distance = getDistanceFromLatLonInMeters(
        userLocation.lat, userLocation.lng,
        lokasi.latitude, lokasi.longitude
      );
      setLokasiValid(distance <= lokasi.radius);
    } else {
      alert("Lokasi pengguna tidak tersedia.");
    }

    setShowModal(true);
    setFormSiap(false);
  };

  const handleAbsen = async () => {
    if (!selectedJadwal || !selectedLokasi || !userLocation || !nama || !kelas || !status) {
      return alert("Form belum lengkap.");
    }

    await addDoc(collection(db, 'userAbsen'), {
      lokasiId: selectedLokasi.id,
      lokasiNama: selectedLokasi.nama,
      kodeUnik: selectedJadwal.kodeUnik,
      jamMasuk: new Date(),
      userLat: userLocation.lat,
      userLng: userLocation.lng,
      email: userEmail,
      namaAbsen: selectedJadwal.namaAbsen, // ✅ Tambahkan ini
      nama,
      kelas,
      status
    });

    alert("Absensi berhasil!");
    setShowModal(false);
    setKodeInput('');
    setSelectedJadwal(null);
    setSelectedLokasi(null);
    setNama('');
    setKelas('');
    setStatus('');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 font-sans">
      <SidebarUser />
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between px-6 py-4 border-b border-blue-200 bg-white shadow-sm rounded-md mb-6">
          <div className="flex items-center gap-2 text-sm text-blue-800 font-medium">
            <FaClock className="text-blue-500" />
            <span>Waktu Sekarang:</span>
            <span className="text-green-600">{dateTime}</span>
          </div>
        </header>

        <div className="mb-6 max-w-md">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">🔐 Masukkan Kode Unik Jadwal</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={kodeInput}
              onChange={(e) => setKodeInput(e.target.value)}
              placeholder="Contoh: ABC123"
              className="text-black flex-1 px-4 py-2 border border-blue-300 rounded-md focus:outline-none"
            />
            <button
              onClick={handleKodeSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Masuk
            </button>
          </div>
        </div>

        {/* MODAL VALIDASI */}
        {showModal && selectedLokasi && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-xl w-full max-w-sm border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Validasi Lokasi</h3>
              <p className="text-black mb-2"><strong>namaAbsen:</strong> {selectedJadwal?.namaAbsen}</p>
              <p className="text-black"><strong>Lokasi:</strong> {selectedLokasi?.nama}</p>
              <p className="text-black"><strong>Koordinat:</strong> {selectedLokasi.latitude}, {selectedLokasi.longitude}</p>
              <p className="text-black"><strong>Radius:</strong> {selectedLokasi.radius} meter</p>
              <p className={`mt-2 ${lokasiValid ? 'text-green-600' : 'text-red-600'}`}>
                {lokasiValid ? "✅ Anda berada dalam radius lokasi." : "❌ Anda berada di luar radius lokasi."}
              </p>

             {!lokasiValid && !formSiap && (
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1 text-gray-600 hover:underline"
                  >
                    Batal
                  </button>
                 
                </div>
              )}

              {lokasiValid && !formSiap && (
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1 text-gray-600 hover:underline"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => setFormSiap(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Isi Form Kehadiran
                  </button>
                </div>
              )}

              {formSiap && (
                <form onSubmit={(e) => { e.preventDefault(); handleAbsen(); }} className="mt-4">
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama"
                    className="text-black w-full mb-2 px-3 py-2 border rounded"
                  />
                  <input
                    type="text"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    placeholder="Kelas"
                    className="text-black w-full mb-2 px-3 py-2 border rounded"
                  />
                  <div className="mb-3">
                    <label className="block mb-1 text-black">Status Kehadiran:</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="text-black w-full px-3 py-2 border rounded"
                    >
                      <option value="">-- Pilih Status --</option>
                      <option value="Hadir">Hadir</option>
                      <option value="Izin">Izin</option>
                      <option value="Sakit">Sakit</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-3 py-1 text-gray-600 hover:underline"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Absen Sekarang
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
