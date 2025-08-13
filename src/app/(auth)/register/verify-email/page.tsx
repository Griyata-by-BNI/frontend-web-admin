// app/register/verify-email/page.tsx
'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import axiosInstance from '../../../../../lib/axios';

interface VerifyResponse {
  status?: {
    code: number;
    message: string;
  };
  message?: string;
  success?: boolean;
}

interface ResendResponse {
  status?: {
    code: number;
    message: string;
  };
  message?: string;
  success?: boolean;
}

const VerifyEmailPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get email from multiple possible sources
  useEffect(() => {
    const getEmailFromSources = () => {
      // 1. Try to get from URL params (most reliable)
      const emailFromUrl = searchParams.get('email');
      if (emailFromUrl) {
        setEmail(decodeURIComponent(emailFromUrl));
        return;
      }

      // 2. Try to get from localStorage (registration data)
      const registrationData = localStorage.getItem('registrationData');
      if (registrationData) {
        try {
          const parsed = JSON.parse(registrationData);
          if (parsed.email) {
            setEmail(parsed.email);
            return;
          }
        } catch (error) {
          console.error('Error parsing registration data:', error);
        }
      }

      // 3. Try to get from sessionStorage
      const sessionEmail = sessionStorage.getItem('pendingVerificationEmail');
      if (sessionEmail) {
        setEmail(sessionEmail);
        return;
      }

      // 4. If no email found, redirect to register
      console.warn('No email found for verification');
      setError('Email tidak ditemukan. Silakan lakukan registrasi terlebih dahulu.');
      setTimeout(() => {
        router.push('/register');
      }, 3000);
    };

    getEmailFromSources();
  }, [searchParams, router]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Auto-redirect after successful verification
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        // Clear any temporary data
        localStorage.removeItem('registrationData');
        sessionStorage.removeItem('pendingVerificationEmail');
        router.push('/login?verified=true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  // Handle OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(''); // Clear error when user types

    // Auto focus to next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle paste functionality
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const newOtp = ['', '', '', ''];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    setError('');
  };

  // Handle API errors
  const handleApiError = (error: any): string => {
    if (error.response?.data?.status) {
      const { code, message } = error.response.data.status;
      
      switch (code) {
        case 400:
          if (message.toLowerCase().includes('invalid') && message.toLowerCase().includes('token')) {
            return 'Kode OTP tidak valid. Silakan periksa kembali kode yang Anda masukkan.';
          } else if (message.toLowerCase().includes('expired')) {
            return 'Kode OTP telah kedaluwarsa. Silakan minta kode baru.';
          }
          return message || 'Data yang Anda masukkan tidak valid.';
          
        case 404:
          if (message.toLowerCase().includes('user') && message.toLowerCase().includes('not found')) {
            return 'Email tidak terdaftar dalam sistem. Silakan lakukan registrasi terlebih dahulu.';
          }
          return 'Data tidak ditemukan. Silakan periksa email Anda.';
          
        case 422:
          return 'Format kode OTP tidak valid. Pastikan memasukkan 4 digit angka.';
          
        case 429:
          return 'Terlalu banyak percobaan. Silakan tunggu beberapa menit sebelum mencoba lagi.';
          
        case 500:
          return 'Terjadi kesalahan pada server. Silakan coba lagi dalam beberapa saat.';
          
        default:
          return message || `Terjadi kesalahan (${code}). Silakan coba lagi.`;
      }
    } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    } else {
      return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.';
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      setError('Mohon masukkan kode OTP yang lengkap (4 digit)');
      return;
    }

    if (!email) {
      setError('Email tidak ditemukan. Silakan kembali ke halaman registrasi.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post<VerifyResponse>('/api/v1/auth/sign-up-verify', {
        email: email,
        verifyToken: otpCode
      });

      // Check if verification was successful
      if (response.data.success || response.status === 200 || response.status === 201) {
        setSuccess(true);
        // Store success state
        sessionStorage.setItem('emailVerified', 'true');
        
        // Clear registration data since verification is complete
        localStorage.removeItem('registrationData');
        sessionStorage.removeItem('pendingVerificationEmail');
      } else {
        setError('Verifikasi gagal. Silakan periksa kode OTP Anda.');
      }

    } catch (error: any) {
      console.error('Verification error:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);

      // If user not found, suggest going back to register
      if (error.response?.data?.status?.code === 404) {
        setTimeout(() => {
          const shouldRedirect = confirm('Email tidak ditemukan. Apakah Anda ingin kembali ke halaman registrasi?');
          if (shouldRedirect) {
            // Clear any stored data
            localStorage.removeItem('registrationData');
            sessionStorage.removeItem('pendingVerificationEmail');
            router.push('/register');
          }
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!email) {
      setError('Email tidak ditemukan. Silakan kembali ke halaman registrasi.');
      return;
    }

    setIsResending(true);
    setError('');
    setCountdown(60);

    try {
      // Use the same endpoint as registration but for resend
      const response = await axiosInstance.post<ResendResponse>('/api/v1/auth/resend-otp', {
        email: email
      });

      if (response.data.success || response.status === 200 || response.status === 201) {
        alert('Kode OTP baru telah dikirim ke email Anda!');
        // Clear current OTP
        setOtp(['', '', '', '']);
      } else {
        setError('Gagal mengirim kode OTP. Silakan coba lagi.');
        setCountdown(0);
      }

    } catch (error: any) {
      console.error('Resend error:', error);
      const errorMessage = handleApiError(error);
      setError(`Gagal mengirim ulang kode: ${errorMessage}`);
      setCountdown(0);
    } finally {
      setIsResending(false);
    }
  };

  // Success state rendering
  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Header /> */}
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-500 mb-4">Email Terverifikasi!</h3>
              <p className="text-gray-600 mb-4">
                Selamat! Email <strong>{email}</strong> telah berhasil diverifikasi.
              </p>
              <p className="text-gray-500 text-sm">
                Anda akan diarahkan ke halaman login dalam beberapa detik...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-teal-500 mb-4">Verifikasi Email Anda</h3>
            <p className="text-gray-600 mb-4">
              Kami telah mengirimkan kode OTP 4 digit ke:
            </p>
            <p className="font-semibold text-gray-800 mb-4">
              {email || 'Loading...'}
            </p>
            <p className="text-gray-600 text-sm">
              Silakan masukkan kode tersebut di bawah ini.
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2 text-center">
              Masukkan Kode OTP
            </label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={isLoading || otp.join('').length !== 4 || !email}
            className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
          >
            {isLoading ? 'Memverifikasi...' : 'Verifikasi OTP'}
          </button>

          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">
              Tidak menerima kode?
            </p>
            {countdown > 0 ? (
              <p className="text-gray-500 text-sm">
                Kirim ulang dalam {countdown} detik
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={!email || isResending}
                className="text-teal-500 hover:underline text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isResending ? 'Mengirim...' : 'Kirim Ulang Kode OTP'}
              </button>
            )}
          </div>

          <div className="text-center mt-6 space-y-2">
            <p className="text-gray-700">
              <Link href="/login" className="text-teal-500 hover:underline">
                Kembali ke Login
              </Link>
            </p>
            <p className="text-gray-700">
              Email salah?{' '}
              <Link href="/register" className="text-teal-500 hover:underline">
                Registrasi Ulang
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmailPage;