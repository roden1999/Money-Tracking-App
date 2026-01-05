'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar';
import { Toaster } from 'react-hot-toast';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return null; // or loading spinner

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}