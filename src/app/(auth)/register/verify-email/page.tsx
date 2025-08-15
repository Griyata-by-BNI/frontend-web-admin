'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mail, RefreshCw, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';

interface VerifyEmailProps {
  email?: string;
  onBack?: () => void;
  onVerificationSuccess?: () => void;
}

const VerifyEmailPage: React.FC<VerifyEmailProps> = ({ 
  email: propEmail, 
  onBack, 
  onVerificationSuccess 
}) => {
  const router = useRouter();
  const [email, setEmail] = useState(propEmail || '');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxAttempts = 5;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 4 && !loading && attemptCount < maxAttempts) {
      const timer = setTimeout(() => handleVerify(), 500);
      return () => clearTimeout(timer);
    }
  }, [otp, loading, attemptCount]);

  const handleOtpChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = sanitizedValue;
    setOtp(newOtp);
    
    if (error) setError('');
    if (success) setSuccess('');

    if (sanitizedValue && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    
    if (pastedData.length === 4) {
      setOtp(pastedData.split(''));
      setError('');
      setSuccess('');
      otpRefs.current[3]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!email.trim()) {
      setError('Email wajib diisi');
      return;
    }

    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Kode verifikasi harus 4 digit');
      return;
    }

    if (attemptCount >= maxAttempts) {
      setError('Terlalu banyak percobaan gagal. Silakan tunggu beberapa menit.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axiosInstance.post('/api/v1/auth/sign-up-verify', {
        email: email.trim().toLowerCase(),
        verifyToken: otpString
      });
      
     
        setSuccess(response.data.message || 'Email berhasil diverifikasi!');
        setIsVerified(true);
        setAttemptCount(0);
        
        timeoutRef.current = setTimeout(() => {
          onVerificationSuccess?.() || router.push('/');
        }, 1500);
      
    } catch (error: any) {
      setAttemptCount(prev => prev + 1);
      const message = error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
      setError(message);
      setOtp(['', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      setError('Email wajib diisi');
      return;
    }

    if (resendCooldown > 0) {
      setError(`Tunggu ${resendCooldown} detik sebelum mengirim ulang`);
      return;
    }

    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axiosInstance.post('/api/v1/auth/resend-otp', { 
        email: email.trim().toLowerCase() 
      });
      
      if (response.data.success) {
        setSuccess(response.data.message || 'Kode verifikasi berhasil dikirim!');
        setOtp(['', '', '', '']);
        setResendCooldown(60);
        otpRefs.current[0]?.focus();
      } else {
        setError(response.data.message || 'Gagal mengirim kode verifikasi.');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal mengirim kode verifikasi.';
      setError(message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading && !resendLoading) {
      handleVerify();
    }
  };

  const isBlocked = attemptCount >= maxAttempts;
  const otpStatus = error ? 'error' : success ? 'success' : 'neutral';

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            {isVerified ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <Mail className="w-8 h-8 text-white" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-teal-600 mb-2">
            {isVerified ? 'Email Terverifikasi!' : 'Verifikasi Email Anda'}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {isVerified 
              ? 'Akun Anda berhasil diverifikasi dan siap digunakan.'
              : 'Masukkan kode verifikasi 4 digit yang telah dikirim ke:'}
          </p>
          
          {!isVerified && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
              <p className="text-teal-700 font-medium text-sm flex items-center justify-center">
                <Mail className="w-4 h-4 mr-2" />
                {email}
              </p>
            </div>
          )}
        </div>

        {!isVerified ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input (if not provided as prop) */}
            {!propEmail && (
              <div>
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                  disabled={loading}
                  required
                />
              </div>
            )}

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Kode Verifikasi
              </label>
              <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                      otpStatus === 'success' ? 'border-green-500 bg-green-50' :
                      otpStatus === 'error' ? 'border-red-500 bg-red-50' :
                      'border-gray-300 hover:border-gray-400'
                    }`}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <p className="text-green-600 text-sm font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                otp.join('').length === 4 && !loading
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={otp.join('').length !== 4 || loading || resendLoading || isBlocked}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Memverifikasi...
                </div>
              ) : (
                'Verifikasi Email'
              )}
            </button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Tidak menerima kode?
              </p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || resendLoading || loading || isBlocked}
                className={`text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded px-2 py-1 ${
                  resendCooldown > 0 || resendLoading || loading || isBlocked
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-teal-600 hover:text-teal-700 underline hover:bg-teal-50'
                }`}
              >
                {resendLoading ? (
                  <span className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Mengirim...
                  </span>
                ) : resendCooldown > 0 ? (
                  `Kirim ulang dalam ${resendCooldown}s`
                ) : (
                  'Kirim ulang kode'
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success State */
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-green-800 mb-2">
                Verifikasi Berhasil!
              </h4>
              <p className="text-green-600 text-sm">
                Email Anda telah berhasil diverifikasi. Anda akan dialihkan ke halaman utama dalam beberapa saat.
              </p>
            </div>
          </div>
        )}

        {/* Back Button */}
        {onBack && !isVerified && (
          <div className="mt-6">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-full text-gray-600 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded px-4 py-2 disabled:opacity-50"
              disabled={loading || resendLoading || isBlocked}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke halaman registrasi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;