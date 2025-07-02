'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  FaUser,
  FaChalkboardTeacher,
  FaFileAlt,
  FaLocationArrow
} from 'react-icons/fa';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/../firebase';
import { usePathname } from 'next/navigation';

export default function Dashboard() {
  const [dateTime, setDateTime] = useState<string>('');
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [userAbsen, setUserAbsen] = useState<number>(0);
  const [totalLokasi, setTotalLokasi] = useState<number>(0);
  const [totalJadwal, setTotalJadwal] = useState<number>(0);
  const pathname = usePathname();

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

   const fetchUserAbsen = async () => {
  try {
    const absenCollection = collection(db, 'userAbsen');
    const snapshot = await getDocs(absenCollection);
    setUserAbsen(snapshot.size);
  } catch (error) {
    console.error('Gagal mengambil total data absen:', error);
  }
};


    const fetchLocations = async () => {
      try {
        const lokasiCollection = collection(db, 'lokasiAbsensi');
        const lokasiSnapshot = await getDocs(lokasiCollection);
        setTotalLokasi(lokasiSnapshot.size);
      } catch (error) {
        console.error('Gagal mengambil data lokasi absensi:', error);
      }
    };

    const fetchJadwal = async () => {
      try {
        const jadwalCollection = collection(db, 'jadwalAbsensi');
        const jadwalSnapshot = await getDocs(jadwalCollection);
        setTotalJadwal(jadwalSnapshot.size);
      } catch (error) {
        console.error('Gagal mengambil data jadwal absensi:', error);
      }
    };

    fetchUsers();
    fetchUserAbsen();
    fetchLocations();
    fetchJadwal();
  }, []);

  return (
    <div className="bg-[#f7f9fc] min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 flex flex-col font-times">
          <header className="flex items-center justify-end gap-6 px-6 py-4 border-b border-gray-200 bg-white">
            <div className="text-sm text-gray-600 select-none font-times">
              Date/Time:{' '}
              <span className="text-green-500 font-medium" id="realtime-login">
                {dateTime}
              </span>
            </div>
            <div className="border-l border-gray-300 h-6" />
          </header>

          <section className="flex-1 p-8 overflow-auto">
            <h1 className="text-gray-700 text-xl font-normal mb-6 select-none font-times">
              Dashboard Admin
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <Card
                title="TOTAL PENGGUNA"
                value={totalUsers.toString()}
                icon={<FaUser className="text-gray-300 text-3xl select-none" />}
                color="green-500"
              />
              <Card
                title="ABSEN HARI INI"
                value={userAbsen.toString()}
                icon={<FaChalkboardTeacher className="text-gray-300 text-3xl select-none" />}
                color="blue-500"
              />
              <Card
                title="LOKASI AKTIF"
                value={totalLokasi.toString()}
                icon={<FaLocationArrow className="text-gray-300 text-3xl select-none" />}
                color="purple-500"
              />
              <Card
                title="JADWAL ABSENSI"
                value={totalJadwal.toString()}
                icon={<FaFileAlt className="text-gray-300 text-3xl select-none" />}
                color="yellow-500"
              />
            </div>
          </section>

          <footer className="py-4 text-center text-gray-500 text-xs select-none font-times">
            Present by Azmi Afif
          </footer>
        </main>
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function Card({ title, value, icon, color }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-5 relative border-l-4 border-${color} flex items-center justify-between font-times`}
    >
      <div>
        <p
          className={`text-${color} text-xs font-semibold leading-tight select-text whitespace-pre-line`}
        >
          {title}
        </p>
        <p className="text-gray-900 font-semibold text-lg mt-1 select-text">
          {value}
        </p>
      </div>
      {icon}
    </div>
  );
}
