// app/forgot-password/otp/page.tsx
'use client'; // Menandakan ini adalah client component
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika sederhana untuk simulasi verifikasi OTP (ganti dengan API call jika ada backend)
    if (otp.length === 6) { // Misalnya, OTP valid jika panjangnya 6
      router.push('/forgot-password/reset');
    } else {
      alert('Kode OTP tidak valid. Pastikan Anda memasukkan 6 digit.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-teal-500 mb-4">Masukan Kode OTP</h3>
          <p className="text-gray-600 mb-6">Kami telah mengirimkan kode OTP ke email Anda. Masukkan kode di bawah ini.</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Masukan kode OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              maxLength={6}
            />
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition"
            >
              Verifikasi Kode
            </button>
          </form>
          <p className="text-center mt-6 text-gray-700">
            Tidak menerima kode? <Link href="/forgot-password" className="text-teal-500 hover:underline">Kirim Ulang</Link>
          </p>
          <p className="text-center mt-2 text-gray-700">
            Kembali ke <Link href="/login" className="text-teal-500 hover:underline">Masuk</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OTPPage;