// app/register/verify-email/page.tsx
import Link from 'next/link';
import React from 'react';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

const VerifyEmailPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-bold text-teal-500 mb-4">Verifikasi Email Anda</h3>
          <p className="text-gray-600 mb-6">
            Terima kasih telah mendaftar! Kami telah mengirimkan tautan verifikasi ke alamat email Anda. 
            Silakan periksa kotak masuk atau folder spam Anda dan klik tautan untuk menyelesaikan proses registrasi.
          </p>
          <p className="text-gray-600 mb-6">
            Jika Anda tidak menerima email dalam 5 menit, klik tombol di bawah ini untuk mengirim ulang.
          </p>
          <button
            className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition mb-4"
            onClick={() => alert('Tautan verifikasi dikirim ulang. Periksa email Anda!')}
          >
            Kirim Ulang Tautan
          </button>
          <p className="text-center mt-6 text-gray-700">
            Kembali ke <Link href="/login" className="text-teal-500 hover:underline">Masuk</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmailPage;