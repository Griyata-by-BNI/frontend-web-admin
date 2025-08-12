// app/forgot-password/page.tsx
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    // Validate email
    if (!email) {
      setError('Email harus diisi');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://581911203717.ngrok-free.app/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Tautan reset password telah dikirim ke email Anda. Silakan cek inbox atau folder spam.');
        setEmail(''); // Clear form
      } else {
        setError(data.message || 'Terjadi kesalahan saat mengirim email reset');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-teal-500 mb-4">Lupa Password</h3>
          <p className="text-gray-600 mb-6">Masukkan alamat email Anda untuk mereset password</p>
          
          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Alamat email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
            </button>
          </form>
          
          <p className="text-center mt-6 text-gray-700">
            Kembali ke <Link href="/login" className="text-teal-500 hover:underline">Masuk</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;