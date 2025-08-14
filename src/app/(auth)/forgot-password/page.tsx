// app/forgot-password/page.tsx
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../../components/Footer';
import axiosInstance from '@/lib/axios';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length > 0;
  };

  const handleError = (err: any) => {
    console.error('Forgot password error details:', {
      message: err.message,
      response: err.response,
      request: err.request,
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.url,
      method: err.config?.method
    });

    if (err.response) {
      const status = err.response.status;
      const errorMessage = err.response.data?.message;
      
      console.log(`Server responded with status: ${status}`);
      console.log('Response data:', err.response.data);
      
      switch (status) {
        case 400:
          setError('Data yang dikirim tidak valid. Periksa format email Anda');
          break;
        case 404:
          setError('Email tidak terdaftar dalam sistem');
          break;
        case 422:
          setError('Format email tidak valid atau data tidak lengkap');
          break;
        case 429:
          setError('Terlalu banyak percobaan. Silakan coba lagi dalam beberapa menit');
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          setError('Terjadi gangguan pada server. Silakan coba lagi dalam beberapa saat');
          break;
        default:
          setError(errorMessage || `Terjadi kesalahan (${status}). Silakan coba lagi`);
      }
    } else if (err.request) {
      console.log('No response received from server');
      setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda');
    } else if (err.message) {
      console.log('Request setup error:', err.message);
      
      if (err.message.toLowerCase().includes('network') || 
          err.message.toLowerCase().includes('timeout') ||
          err.message.toLowerCase().includes('connection')) {
        setError('Koneksi bermasalah. Periksa internet Anda dan coba lagi');
      } else {
        setError('Terjadi kesalahan sistem. Silakan coba lagi');
      }
    } else {
      console.log('Unknown error type');
      setError('Terjadi kesalahan yang tidak diketahui. Silakan coba lagi nanti');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (!email.trim()) {
      setError('Email harus diisi');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Format email tidak valid');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending forget password request to: /api/v1/auth/forget-password');
      console.log('Request payload:', { email: email.trim() });
      
      const response = await axiosInstance.post('/api/v1/auth/forgot-password', {
        email: email.trim()
      }, {
        timeout: 15000, // 15 second timeout
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Forget password response:', response.data);

      // Check if response indicates success
      if (response.status === 200 || response.status === 201) {
        setSuccess('Kode verifikasi berhasil dikirim ke email Anda');
        
        setTimeout(() => {
          router.push(`/forgot-password/otp?email=${encodeURIComponent(email.trim())}`);
        }, 1500);
      } else {
        setError('Respons tidak dikenal dari server. Silakan coba lagi');
      }
      
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3a1 1 0 011-1h2.586l6.414-6.414a6 6 0 015.743-7.743z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password?</h1>
            <p className="text-gray-600 text-sm">
              Masukkan alamat email Anda dan kami akan mengirimkan kode verifikasi untuk mereset password
            </p>
          </div>
          
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start">
              <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
              <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.346 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Debug Info - Remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Debug:</strong> Endpoint: /api/v1/auth/forget-password
              </p>
              <p className="text-xs text-blue-800">
                Base URL: {axiosInstance.defaults.baseURL || 'Not configured'}
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label 
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isLoading}
                required
                autoComplete="email"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              disabled={isLoading || success !== ''}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim Kode...
                </div>
              ) : success ? (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Berhasil Dikirim
                </div>
              ) : (
                'Kirim Kode Verifikasi'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">atau</span>
              </div>
            </div>
          </div>
          
          <p className="text-center mt-6 text-gray-600 text-sm">
            Ingat password Anda? {' '}
            <Link 
              href="/login" 
              className="text-orange-500 hover:text-orange-600 hover:underline font-medium transition-colors"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;;