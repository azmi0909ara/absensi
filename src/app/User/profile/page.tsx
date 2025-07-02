'use client';

import SidebarUser from '../../components/Sidebar_user';
import { useEffect, useState, ChangeEvent } from 'react';
import { db } from '@/../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    noTelp: '',
    username: '',
  });
  const [dateTime, setDateTime] = useState<string>('');
  const [foto, setFoto] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);

    const uid = localStorage.getItem('uid');
    if (!uid) return;

    const fetchUser = async () => {
      try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(data);
          setFoto(data.fotoProfil || null);
          setFormData({
            namaLengkap: data.namaLengkap || '',
            email: data.email || '',
            noTelp: data.noTelp || '',
            username: data.username || '',
          });
        }
      } catch (error) {
        console.error('Gagal mengambil data user:', error);
      }
    };

    fetchUser();
    return () => clearInterval(interval);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word: string) => word[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('uid');
    window.location.href = '/User';
  };

  const resizeImage = (file: File, maxSize = 300): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedBase64 = await resizeImage(file);
      setFoto(resizedBase64);

      const uid = localStorage.getItem('uid');
      if (!uid) return;

      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { fotoProfil: resizedBase64 });
      alert('Foto berhasil diperbarui!');
    } catch (error) {
      console.error('Gagal unggah foto:', error);
      alert('Gagal unggah foto');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const uid = localStorage.getItem('uid');
    if (!uid) return;

    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...formData,
      });
      setIsEditing(false);
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      console.error('Gagal memperbarui profil:', error);
      alert('Gagal menyimpan perubahan');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans">
      <SidebarUser />
      <main className="flex-1 p-6 relative">
        <header className="flex items-center justify-between gap-6 px-6 py-4 border-b border-gray-200 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-600">
            ⏰ Waktu Sekarang:{' '}
            <span className="text-green-600 font-semibold">{dateTime}</span>
          </div>
        </header>

        <section className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-md p-8 relative">
          <div className="flex items-center space-x-6 mb-6">
            <label htmlFor="foto-upload" className="cursor-pointer relative">
              {foto ? (
                <img
                  src={foto}
                  alt="Foto Profil"
                  className="w-20 h-20 rounded-full object-cover shadow"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold shadow-md">
                  {user ? getInitials(user.namaLengkap || 'U') : 'U'}
                </div>
              )}
              <input
                id="foto-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="text-xs text-center mt-1 text-blue-600">Ubah Foto</div>
            </label>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">Profil Saya</h1>
              <p className="text-gray-500">Selamat datang di halaman profil Anda</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['namaLengkap', 'email', 'noTelp', 'username'].map(field => (
              <div key={field}>
                <h2 className="text-sm text-gray-500 capitalize">
                  {field === 'noTelp' ? 'Nomor Telepon' : field === 'namaLengkap' ? 'Nama Lengkap' : field.charAt(0).toUpperCase() + field.slice(1)}
                </h2>
                {isEditing ? (
                  <input
                    type="text"
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleInputChange}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-800">{(formData as any)[field]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Simpan Perubahan
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded shadow-md"
              >
                Edit Profil
              </button>
            )}
          </div>

        
        </section>
      </main>
    </div>
  );
}
