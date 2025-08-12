// app/login/page.tsx
'use client'; // Menandakan ini adalah client component
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string) => {
    const minLength = 4;
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumber = /\d/.test(password);
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    // return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    return password.length >= minLength;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError('');
    setError('');
    
    // Real-time email validation
    if (value && !validateEmail(value)) {
      setEmailError('Format email tidak valid');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError('');
    setError('');
    
    // Real-time password validation
    if (value && !validatePassword(value)) {
      setPasswordError('Password harus minimal 8 karakter dengan huruf besar, kecil, angka, dan karakter khusus');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailError('');
    setPasswordError('');

    // Validasi client-side
    if (!validateEmail(email)) {
      setEmailError('Format email tidak valid. Contoh: user@example.com');
      setLoading(false);
      return;
    }
    
    // if (!validatePassword(password)) {
    //   setPasswordError('Password harus minimal 8 karakter, dengan setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus.');
    //   setLoading(false);
    //   return;
    // }

    try {
      // Panggil API login
      const response = await fetch('https://581911203717.ngrok-free.app/api/v1/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login berhasil (Response 200)
        console.log('Login berhasil:', data);
        
        // Simpan token jika ada di response
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // Simpan data user jika ada
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }

        alert('Login berhasil!');
        router.push('/'); // Redirect ke halaman utama
      } else {
        // Handle error responses berdasarkan status dan pesan dari API
        if (response.status === 400) {
          // Bad Request - bisa karena validasi gagal
          const errorMessage = data.message || '';
          
          if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('not found')) {
            setError('Email tidak terdaftar. Silakan daftar terlebih dahulu atau periksa kembali email Anda.');
          } else if (errorMessage.toLowerCase().includes('password') && errorMessage.toLowerCase().includes('incorrect')) {
            setError('Password yang Anda masukkan salah. Silakan coba lagi.');
          } else if (errorMessage.toLowerCase().includes('user not found') || errorMessage.toLowerCase().includes('account not found')) {
            setError('Akun tidak ditemukan. Silakan daftar terlebih dahulu atau periksa kembali email Anda.');
          } else if (errorMessage.toLowerCase().includes('invalid credentials') || errorMessage.toLowerCase().includes('authentication failed')) {
            setError('Email atau password salah. Silakan periksa kembali data Anda.');
          } else if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('invalid')) {
            setError('Format email tidak valid. Silakan masukkan email yang benar.');
          } else if (errorMessage.toLowerCase().includes('password') && errorMessage.toLowerCase().includes('invalid')) {
            setError('Format password tidak valid. Pastikan password memenuhi kriteria yang diperlukan.');
          } else {
            setError(errorMessage || 'Data yang Anda masukkan tidak valid. Silakan periksa kembali email dan password.');
          }
        } else if (response.status === 401) {
          // Unauthorized - kredensial salah
          setError('Email atau password salah. Silakan periksa kembali data Anda.');
        } else if (response.status === 404) {
          // Not Found - user tidak ditemukan di database
          setError('Akun tidak ditemukan. Silakan daftar terlebih dahulu atau periksa kembali email Anda.');
        } else if (response.status === 422) {
          // Unprocessable Entity - data tidak sesuai format
          const errorMessage = data.message || '';
          if (errorMessage.toLowerCase().includes('email')) {
            setError('Format email tidak valid atau email tidak dapat diproses.');
          } else if (errorMessage.toLowerCase().includes('password')) {
            setError('Format password tidak valid atau password tidak memenuhi kriteria.');
          } else {
            setError('Data yang Anda masukkan tidak dapat diproses. Silakan periksa kembali.');
          }
        } else if (response.status === 500) {
          // Internal Server Error
          setError('Terjadi kesalahan pada server. Silakan coba lagi dalam beberapa saat.');
        } else if (response.status === 503) {
          // Service Unavailable
          setError('Layanan sedang tidak tersedia. Silakan coba lagi nanti.');
        } else {
          // Error lainnya
          setError(data.message || `Terjadi kesalahan (${response.status}). Silakan coba lagi.`);
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.');
      } else {
        setError('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <Image src={"/aset_login.jpg"} alt="Family" width={600} height={400} className="rounded-lg shadow-md w-full md:w-auto" />
        </div>
        <div className="md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-teal-500 mb-4">Masuk aplikasi dengan akun anda</h3>
          <p className="text-gray-600 mb-6">Masukkan email dan password untuk login</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Alamat email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                emailError 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-teal-500'
              }`}
              disabled={loading}
              required
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            
            <input
              type="password"
              placeholder="Kata sandi"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                passwordError 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-teal-500'
              }`}
              disabled={loading}
              required
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between items-center mb-4">
              <label className="flex items-center text-gray-700">
                <input type="checkbox" className="mr-2 accent-teal-500" />
                Ingat Saya
              </label>
              <Link href="/forgot-password" className="text-teal-500 hover:underline">Lupa password?</Link>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Sedang masuk...' : 'Masuk'}
            </button>
          </form>
          <p className="text-center mt-6 text-gray-700">
            Belum memiliki akun? <Link href="/register" className="text-teal-500 hover:underline">Registrasi</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;