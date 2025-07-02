'use client';

import React, { useEffect, useState } from 'react';
import { FaBars, FaSearch, FaTrash, FaEdit } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { db } from '@/../firebase';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

interface User {
  id: string;
  namaLengkap: string;
  username: string;
  password: string;
  noTelp: string;
  nama: string;
  email: string;
}

export default function Dashboard() {
  const [dateTime, setDateTime] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateTime(now.toLocaleString('id-ID'));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
      setUsers(data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
    }
  };

  const deleteUser = async (id: string) => {
    if (confirm('Hapus pengguna ini?')) {
      try {
        await deleteDoc(doc(db, 'users', id));
        setUsers(prev => prev.filter(user => user.id !== id));
      } catch (error) {
        console.error('Gagal menghapus:', error);
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        namaLengkap: editingUser.namaLengkap,
        username: editingUser.username,
        password: editingUser.password,
        noTelp: editingUser.noTelp,
        email: editingUser.email,
      });
      await fetchData();
      setEditingUser(null);
    } catch (error) {
      console.error('Gagal update:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.namaLengkap?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f7f9fc] font-times relative">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-full">
         <header className="flex items-center justify-between gap-6 px-4 md:px-6 py-4 border-b border-gray-200 bg-white">
          <button
            className="md:hidden text-gray-700 text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <div className="text-sm text-gray-600 ml-auto select-none">
            Date/Time:{' '}
            <span className="text-green-500 font-medium">{dateTime}</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
          <h1 className="text-gray-700 text-xl font-normal mb-6">Manajemen Pengguna</h1>

          <div className="relative max-w-md mb-6">
            <input
              type="text"
              placeholder="Cari nama/email..."
              className="text-black w-full px-4 py-2 pl-10 border rounded-md focus:ring-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="overflow-x-auto bg-white rounded-md shadow-md">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-black px-4 py-3">No</th>
                  <th className="text-black px-4 py-3">Username</th>
                  <th className="text-black px-4 py-3">Password</th>
                  <th className="text-black px-4 py-3">Email</th>
                  <th className="text-black px-4 py-3">Nama</th>
                  <th className="text-black px-4 py-3">No.Telp</th>
                  <th className="text-black px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id} className="border-t">
                      <td className="text-black px-4 py-3">{index + 1}</td>
                      <td className="text-black px-4 py-3">{user.username}</td>
                      <td className="text-black px-4 py-3">{user.password}</td>
                      <td className="text-black px-4 py-3">{user.email}</td>
                      <td className="text-black px-4 py-3">{user.namaLengkap}</td>
                      <td className="text-black px-4 py-3">{user.noTelp}</td>
                      <td className="text-black px-4 py-3 space-x-2">
                        <button
                          className="bg-yellow-400 px-2 py-1 rounded text-xs"
                          onClick={() => handleEdit(user)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="bg-red-500 px-2 py-1 rounded text-white text-xs"
                          onClick={() => deleteUser(user.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      Tidak ada data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>

        <footer className="py-4 text-center text-gray-500 text-xs select-none">
          Present by Azmi Afif
        </footer>
      </div>

      {/* Modal Edit */}
      {editingUser && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex justify-center items-center">

          <div className="bg-white rounded-lg p-6 max-w-md w-full border rounded-md shadow-lg">
            <h2 className="text-black text-xl font-bold mb-4 ">Edit Pengguna</h2>
            <div className="space-y-3">
              <input
                value={editingUser.namaLengkap}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, namaLengkap: e.target.value })
                }
                className="text-black w-full px-4 py-2 border rounded"
                placeholder="Nama Lengkap"
              />
              <input
                value={editingUser.username}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, username: e.target.value })
                }
                className="text-black  w-full px-4 py-2 border rounded"
                placeholder="Username"
              />
              <input
                value={editingUser.password}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, password: e.target.value })
                }
                className="text-black w-full px-4 py-2 border rounded"
                placeholder="Password"
              />
              <input
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                className="text-black w-full px-4 py-2 border rounded"
                placeholder="Email"
              />
              <input
                value={editingUser.noTelp}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, noTelp: e.target.value })
                }
                className="text-black w-full px-4 py-2 border rounded"
                placeholder="No Telp"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setEditingUser(null)}
              >
                Batal
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleUpdate}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'visible bg-black/50' : 'invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 h-full w-64 transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
