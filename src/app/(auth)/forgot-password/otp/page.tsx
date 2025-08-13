// app/forgot-password/otp/page.tsx
'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '../../../../components/Footer';
import axiosInstance from '../../../../../lib/axios';

// Popup Alert Component
const PopupAlert = ({ 
  isVisible, 
  onClose, 
  type = 'error', 
  title, 
  message 
}: {
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'warning';
  title: string;
  message: string;
}) => {
  if (!isVisible) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-500',
          title: 'text-green-800',
          message: 'text-green-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-500',
          title: 'text-yellow-800',
          message: 'text-yellow-700'
        };
      default:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-500',
          title: 'text-red-800',
          message: 'text-red-700'
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 transform animate-in fade-in zoom-in duration-200">
        <div className={`flex items-start ${styles.bg} ${styles.border} border rounded-lg p-4 mb-4`}>
          <div className="flex-shrink-0">
            {type === 'success' ? (
              <svg className={`w-6 h-6 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : type === 'warning' ? (
              <svg className={`w-6 h-6 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.346 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            ) : (
              <svg className={`w-6 h-6 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.346 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>
            <p className={`text-sm mt-1 ${styles.message}`}>{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [popup, setPopup] = useState({
    isVisible: false,
    type: 'error' as 'success' | 'error' | 'warning',
    title: '',
    message: ''
  });
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const showPopup = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    setPopup({ isVisible: true, type, title, message });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isVisible: false }));
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    
    if (pastedData.length === 4) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[3]?.focus();
    }
  };

  const handleError = (err: any) => {
    console.error('OTP verification error:', err);

    if (err.response) {
      const status = err.response.status;
      const errorMessage = err.response.data?.message;

      if (status === 400) {
        showPopup('error', 'Kode OTP Salah', 'Kode OTP yang Anda masukkan tidak valid. Silakan periksa kembali.');
      } else if (status === 410) {
        showPopup('error', 'Kode OTP Kedaluwarsa', 'Kode OTP telah kedaluwarsa. Silakan minta kode baru.');
      } else if (status === 429) {
        showPopup('error', 'Terlalu Banyak Percobaan', 'Anda telah mencoba terlalu banyak kali. Silakan tunggu beberapa menit.');
      } else if (status >= 500) {
        showPopup('error', 'Kesalahan Server', 'Terjadi gangguan pada server. Silakan coba lagi nanti.');
      } else {
        showPopup('error', 'Verifikasi Gagal', errorMessage || 'Terjadi kesalahan saat memverifikasi kode OTP.');
      }
    } else if (err.request) {
      showPopup('error', 'Koneksi Bermasalah', 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    } else {
      showPopup('error', 'Kesalahan Sistem', 'Terjadi kesalahan sistem. Silakan coba lagi.');
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 4) {
      showPopup('warning', 'Kode Belum Lengkap', 'Silakan masukkan 4 digit kode OTP yang telah dikirimkan ke email Anda.');
      return;
    }

    setIsLoading(true);

    try {
      await axiosInstance.post('/api/v1/auth/verify-otp', {
        email,
        otp: otpCode
      });

      showPopup('success', 'Verifikasi Berhasil', 'Kode OTP valid. Anda akan diarahkan ke halaman reset password.');
      
      setTimeout(() => {
        router.push(`/forgot-password/reset-password?email=${encodeURIComponent(email || '')}&token=${otpCode}`);
      }, 2000);

    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    
    try {
      await axiosInstance.post('/api/v1/auth/resend-otp', {
        email
      });

      showPopup('success', 'Kode Terkirim', 'Kode OTP baru telah dikirimkan ke email Anda.');
      setCountdown(60); // 60 second countdown
      setOtp(['', '', '', '']); // Clear OTP inputs
      inputRefs.current[0]?.focus();

    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-50">
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Masukkan Kode OTP</h1>
            <p className="text-gray-600 text-sm">
              Kami telah mengirimkan kode verifikasi 4 digit ke
            </p>
            <p className="text-orange-600 font-medium text-sm mt-1">
              {email || 'email Anda'}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-3 text-center">
                Masukkan Kode OTP
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 disabled:bg-gray-100"
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || otp.join('').length !== 4}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memverifikasi...
                </div>
              ) : (
                'Verifikasi Kode'
              )}
            </button>
          </div>

          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Tidak menerima kode?</p>
              <button
                onClick={handleResendOTP}
                disabled={countdown > 0 || isLoading}
                className="text-orange-500 hover:text-orange-600 hover:underline font-medium text-sm disabled:text-gray-400 disabled:hover:no-underline disabled:cursor-not-allowed transition-colors"
              >
                {countdown > 0 ? `Kirim ulang dalam ${countdown}s` : 'Kirim Ulang Kode'}
              </button>
            </div>
            
            <div className="text-center pt-4 border-t border-gray-200">
              <Link 
                href="/login"
                className="text-gray-600 hover:text-gray-800 hover:underline text-sm transition-colors"
              >
                ← Kembali ke halaman masuk
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Popup Alert */}
      <PopupAlert
        isVisible={popup.isVisible}
        onClose={closePopup}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
    </div>
  );
};

export default OTPPage;