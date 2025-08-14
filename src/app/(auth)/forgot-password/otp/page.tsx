// app/forgot-password/otp/page.tsx
'use client';

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '../../../../components/Footer';
import axiosInstance from '@/lib/axios';

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
  const [tokenReset, setTokenReset] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
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

  // Check if email parameter exists
  useEffect(() => {
    if (!email) {
      showPopup('error', 'Parameter Tidak Valid', 'Email tidak ditemukan. Silakan ulangi proses reset password dari awal.');
    }
  }, [email]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0] && !isSuccess) {
      inputRefs.current[0].focus();
    }
  }, [isSuccess]);

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

      switch (status) {
        case 400:
          showPopup('error', 'Kode OTP Salah', 'Kode OTP yang Anda masukkan tidak valid. Silakan periksa kembali.');
          break;
        case 404:
          showPopup('error', 'Email Tidak Ditemukan', 'Email tidak ditemukan dalam sistem.');
          break;
        case 410:
          showPopup('error', 'Kode OTP Kedaluwarsa', 'Kode OTP telah kedaluwarsa. Silakan minta kode baru.');
          break;
        case 429:
          showPopup('error', 'Terlalu Banyak Percobaan', 'Anda telah mencoba terlalu banyak kali. Silakan tunggu beberapa menit.');
          break;
        case 500:
        default:
          if (status >= 500) {
            showPopup('error', 'Kesalahan Server', 'Terjadi gangguan pada server. Silakan coba lagi nanti.');
          } else {
            showPopup('error', 'Verifikasi Gagal', errorMessage || 'Terjadi kesalahan saat memverifikasi kode OTP.');
          }
          break;
      }
    } else if (err.request) {
      showPopup('error', 'Koneksi Bermasalah', 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    } else {
      showPopup('error', 'Kesalahan Sistem', 'Terjadi kesalahan sistem. Silakan coba lagi.');
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join('');

    // Validation
    if (!email) {
      showPopup('error', 'Parameter Tidak Valid', 'Email tidak ditemukan. Silakan ulangi proses reset password dari awal.');
      return;
    }

    if (otpCode.length !== 4) {
      showPopup('warning', 'Kode Belum Lengkap', 'Silakan masukkan 4 digit kode OTP yang telah dikirimkan ke email Anda.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('=== OTP VERIFICATION REQUEST ===');
      console.log('Email:', email);
      console.log('OTP Code:', otpCode);
      console.log('================================');

      const response = await axiosInstance.post('/api/v1/auth/forgot-password-verify-otp', {
        email,
        otp: otpCode
      });

      // Enhanced token extraction with multiple fallbacks
      const resetToken = response.data?.tokenReset || 
                        response.data?.token || 
                        response.data?.resetToken ||
                        response.data?.data?.tokenReset ||
                        response.data?.data?.token ||
                        '';

      console.log('=== OTP VERIFICATION SUCCESS ===');
      console.log('Full API Response:', response.data);
      console.log('Extracted Token Reset:', resetToken);
      console.log('Token Length:', resetToken?.length || 0);
      console.log('Token Type:', typeof resetToken);
      console.log('================================');

      if (!resetToken) {
        console.error('WARNING: No token found in response!');
        showPopup('error', 'Token Tidak Ditemukan', 'Server tidak mengirimkan token reset. Silakan coba lagi atau hubungi administrator.');
        return;
      }

      setTokenReset(resetToken);
      setIsSuccess(true);

      showPopup('success', 'Verifikasi Berhasil', 'Kode OTP valid. Anda akan diarahkan ke halaman reset password.');
      
      // Navigate to reset password page with proper URL encoding
      setTimeout(() => {
        const encodedEmail = encodeURIComponent(email);
        const encodedToken = encodeURIComponent(resetToken);
        const resetUrl = `/forgot-password/reset-password?email=${encodedEmail}&token=${encodedToken}`;
        
        console.log('Navigating to:', resetUrl);
        router.push(resetUrl);
      }, 2000);

    } catch (err) {
      handleError(err);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0 || !email) return;

    setIsLoading(true);
    
    try {
      console.log('=== RESEND OTP REQUEST ===');
      console.log('Email:', email);
      console.log('=========================');

      await axiosInstance.post('/api/v1/auth/resend-otp', {
        email
      });

      showPopup('success', 'Kode Terkirim', 'Kode OTP baru telah dikirimkan ke email Anda.');
      setCountdown(60);
      setOtp(['', '', '', '']);
      setTokenReset('');
      setIsSuccess(false);
      
      // Focus back to first input after clearing
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

    } catch (err) {
      console.error('Resend OTP error:', err);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToReset = () => {
    if (!email || !tokenReset) {
      showPopup('error', 'Data Tidak Lengkap', 'Email atau token tidak tersedia. Silakan verifikasi ulang.');
      return;
    }

    const encodedEmail = encodeURIComponent(email);
    const encodedToken = encodeURIComponent(tokenReset);
    const resetUrl = `/forgot-password/reset-password?email=${encodedEmail}&token=${encodedToken}`;
    
    console.log('Manual navigation to:', resetUrl);
    router.push(resetUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-50">
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isSuccess ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              {isSuccess ? (
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isSuccess ? 'Verifikasi Berhasil!' : 'Masukkan Kode OTP'}
            </h1>
            <p className="text-gray-600 text-sm">
              {isSuccess 
                ? 'Token reset password telah diterima'
                : 'Kami telah mengirimkan kode verifikasi 4 digit ke'
              }
            </p>
            <p className="text-orange-600 font-medium text-sm mt-1">
              {email || 'email Anda'}
            </p>
          </div>

          {!isSuccess ? (
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
                disabled={isLoading || otp.join('').length !== 4 || !email}
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
          ) : (
            <div className="space-y-6">
              {/* Success state - Show token info and proceed button */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-medium text-sm">Token Reset Diterima</span>
                </div>
                <p className="text-green-700 text-xs mb-3">
                  Sistem telah menerima token reset password untuk email Anda.
                </p>
                
                {/* Display token (truncated for security) */}
                <div className="bg-white p-2 rounded border">
                  <div className="text-xs text-gray-600 mb-1">Reset Token:</div>
                  <div className="text-xs font-mono text-gray-800 break-all">
                    {tokenReset ? `${tokenReset.substring(0, 20)}...${tokenReset.substring(tokenReset.length - 10)}` : 'Loading...'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToReset}
                disabled={!tokenReset}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                Lanjut ke Reset Password
              </button>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {!isSuccess && (
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Tidak menerima kode?</p>
                <button
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || isLoading || !email}
                  className="text-orange-500 hover:text-orange-600 hover:underline font-medium text-sm disabled:text-gray-400 disabled:hover:no-underline disabled:cursor-not-allowed transition-colors"
                >
                  {countdown > 0 ? `Kirim ulang dalam ${countdown}s` : 'Kirim Ulang Kode'}
                </button>
              </div>
            )}
            
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