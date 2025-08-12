// app/forgot-password/reset/page.tsx
'use client'; // Menandakan ini adalah client component
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logika sederhana untuk simulasi reset password
    if (newPassword && newPassword === confirmPassword) {
      alert('Password berhasil direset. Anda akan diarahkan ke halaman login.');
      router.push('/login');
    } else {
      alert('Password baru dan konfirmasi tidak cocok.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-teal-500 mb-4">Reset Password</h3>
          <p className="text-gray-600 mb-6">Masukkan password baru untuk akun Anda.</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="password"
              placeholder="Konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition"
            >
              Simpan Password Baru
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

export default ResetPasswordPage;