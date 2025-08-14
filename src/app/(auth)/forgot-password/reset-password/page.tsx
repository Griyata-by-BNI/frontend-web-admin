// app/forgot-password/reset-password/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
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

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isParametersValid, setIsParametersValid] = useState(false);
  const [popup, setPopup] = useState({
    isVisible: false,
    type: 'error' as 'success' | 'error' | 'warning',
    title: '',
    message: ''
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const tokenReset = searchParams.get('token');

  // Enhanced parameter validation
  useEffect(() => {
    console.log('=== RESET PASSWORD PAGE LOADED ===');
    console.log('Email from URL:', email);
    console.log('Token from URL:', tokenReset ? `${tokenReset.substring(0, 20)}...` : 'None');
    console.log('Email valid:', !!email);
    console.log('Token valid:', !!tokenReset);
    console.log('===================================');

    if (!email) {
      showPopup('error', 'Email Tidak Ditemukan', 'Parameter email tidak ditemukan di URL. Silakan ulangi proses reset password dari awal.');
      setIsParametersValid(false);
      return;
    }

    if (!tokenReset) {
      showPopup('error', 'Token Reset Tidak Ditemukan', 'Token reset password tidak ditemukan di URL. Silakan ulangi proses verifikasi OTP.');
      setIsParametersValid(false);
      return;
    }

    // Basic token format validation
    if (tokenReset.length < 10) {
      showPopup('error', 'Token Tidak Valid', 'Format token reset password tidak valid. Silakan ulangi proses verifikasi OTP.');
      setIsParametersValid(false);
      return;
    }

    setIsParametersValid(true);
  }, [email, tokenReset]);

  const showPopup = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    setPopup({ isVisible: true, type, title, message });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isVisible: false }));
  };

  const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password harus minimal 8 karakter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password harus mengandung huruf besar');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password harus mengandung huruf kecil');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password harus mengandung angka');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password harus mengandung karakter khusus (!@#$%^&*(),.?":{}|<>)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleError = (err: any) => {
    console.error('=== RESET PASSWORD ERROR ===');
    console.error('Error object:', err);
    console.error('Response status:', err.response?.status);
    console.error('Response data:', err.response?.data);
    console.error('============================');

    if (err.response) {
      const status = err.response.status;
      const errorMessage = err.response.data?.message || err.response.data?.error;

      switch (status) {
        case 400:
          showPopup('error', 'Data Tidak Valid', errorMessage || 'Data yang dikirimkan tidak valid. Periksa kembali password Anda.');
          break;
        case 401:
          showPopup('error', 'Token Tidak Valid', 'Token reset password tidak valid atau telah kedaluwarsa. Silakan ulangi proses reset password.');
          break;
        case 403:
          showPopup('error', 'Akses Ditolak', 'Anda tidak memiliki izin untuk melakukan reset password dengan token ini.');
          break;
        case 404:
          showPopup('error', 'Email Tidak Ditemukan', 'Email tidak ditemukan dalam sistem.');
          break;
        case 410:
          showPopup('error', 'Token Kedaluwarsa', 'Token reset password telah kedaluwarsa. Silakan minta token reset yang baru.');
          break;
        case 422:
          showPopup('error', 'Data Tidak Lengkap', errorMessage || 'Data yang dikirimkan tidak lengkap atau tidak sesuai format.');
          break;
        case 429:
          showPopup('error', 'Terlalu Banyak Percobaan', 'Anda telah mencoba terlalu banyak kali. Silakan tunggu beberapa menit.');
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          showPopup('error', 'Kesalahan Server', 'Terjadi gangguan pada server. Silakan coba lagi nanti.');
          break;
        default:
          showPopup('error', 'Reset Password Gagal', errorMessage || `Terjadi kesalahan (${status}). Silakan coba lagi.`);
          break;
      }
    } else if (err.request) {
      showPopup('error', 'Koneksi Bermasalah', 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
    } else {
      showPopup('error', 'Kesalahan Sistem', 'Terjadi kesalahan sistem yang tidak terduga. Silakan coba lagi.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parameter validation
    if (!isParametersValid || !email || !tokenReset) {
      showPopup('error', 'Parameter Tidak Valid', 'Email atau token reset tidak ditemukan. Silakan ulangi proses reset password dari awal.');
      return;
    }

    setIsLoading(true);

    try {
      // Password validation
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        showPopup('error', 'Password Tidak Valid', passwordValidation.errors.join('\n'));
        return;
      }

      // Confirm password validation
      if (newPassword !== confirmPassword) {
        showPopup('error', 'Password Tidak Cocok', 'Password dan konfirmasi password tidak cocok. Silakan periksa kembali.');
        return;
      }

      // Prepare payload exactly as specified
      const payload = {
        email: email,
        tokenReset: tokenReset,
        newPassword: newPassword
      };

      console.log('=== RESET PASSWORD REQUEST ===');
      console.log('Email:', email);
      console.log('Token Reset (first 20 chars):', tokenReset.substring(0, 20) + '...');
      console.log('New Password Length:', newPassword.length);
      console.log('Password meets requirements:', validatePassword(newPassword).isValid);
      console.log('Request Payload Keys:', Object.keys(payload));
      console.log('==============================');

      // Call reset password API
      const response = await axiosInstance.post('/api/v1/auth/forgot-password-reset', payload);

      console.log('=== RESET PASSWORD SUCCESS ===');
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);
      console.log('==============================');

      showPopup('success', 'Password Berhasil Direset', 'Password Anda telah berhasil direset. Anda akan diarahkan ke halaman login dalam 3 detik.');
      
      // Clear form
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        console.log('Redirecting to login page...');
        router.push('/login');
      }, 3000);

    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    let checks = [];

    if (password.length >= 8) {
      strength++;
      checks.push('✓ Minimal 8 karakter');
    } else {
      checks.push('✗ Minimal 8 karakter');
    }

    if (/[A-Z]/.test(password)) {
      strength++;
      checks.push('✓ Huruf besar');
    } else {
      checks.push('✗ Huruf besar');
    }

    if (/[a-z]/.test(password)) {
      strength++;
      checks.push('✓ Huruf kecil');
    } else {
      checks.push('✗ Huruf kecil');
    }

    if (/[0-9]/.test(password)) {
      strength++;
      checks.push('✓ Angka');
    } else {
      checks.push('✗ Angka');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength++;
      checks.push('✓ Karakter khusus');
    } else {
      checks.push('✗ Karakter khusus');
    }

    return { strength, checks };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Redirect to OTP if parameters are invalid after 5 seconds
  useEffect(() => {
    if (!isParametersValid) {
      const timer = setTimeout(() => {
        console.log('Redirecting to forgot password due to invalid parameters...');
        router.push('/forgot-password');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isParametersValid, router]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-red-50">
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              isParametersValid ? 'bg-orange-100' : 'bg-red-100'
            }`}>
              {isParametersValid ? (
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m0-4v4m-7-4V3a2 2 0 00-2-2H6a2 2 0 00-2 2v4M5 9h6m6 0h2" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.346 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isParametersValid ? 'Reset Password' : 'Parameter Tidak Valid'}
            </h1>
            <p className="text-gray-600 text-sm">
              {isParametersValid 
                ? 'Masukkan password baru untuk akun Anda'
                : 'Silakan ulangi proses reset password'
              }
            </p>
            {email && (
              <p className="text-orange-600 font-medium text-sm mt-1">
                {email}
              </p>
            )}
          </div>

          {/* Parameter status indicator */}
          <div className={`mb-6 p-3 rounded-lg border ${
            isParametersValid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center">
              <svg className={`w-5 h-5 mr-2 ${
                isParametersValid ? 'text-green-500' : 'text-red-500'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isParametersValid ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.346 15.5c-.77.833.192 2.5 1.732 2.5z" />
                )}
              </svg>
              <span className={`text-sm font-medium ${
                isParametersValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {isParametersValid ? 'Parameter Valid' : 'Parameter Tidak Valid'}
              </span>
            </div>
            <div className={`text-xs mt-1 ${
              isParametersValid ? 'text-green-700' : 'text-red-700'
            }`}>
              Email: {email ? '✓' : '✗'} | Token: {tokenReset ? '✓' : '✗'}
            </div>
          </div>

          {/* Debug info (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-3 bg-gray-50 rounded-lg border text-xs">
              <div className="font-medium text-gray-700 mb-1">Debug Info:</div>
              <div className="text-gray-600">Email: {email || 'Not found'}</div>
              <div className="text-gray-600 break-all">Token: {tokenReset ? `${tokenReset.substring(0, 20)}...${tokenReset.substring(tokenReset.length - 10)}` : 'Not found'}</div>
              <div className="text-gray-600">Token Length: {tokenReset?.length || 0}</div>
              <div className="text-gray-600">Parameters Valid: {isParametersValid ? 'Yes' : 'No'}</div>
            </div>
          )}

          {isParametersValid ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password baru"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>

                {/* Password strength indicator */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${
                            i < passwordStrength.strength
                              ? passwordStrength.strength <= 2
                                ? 'bg-red-500'
                                : passwordStrength.strength <= 4
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">
                      {passwordStrength.checks.map((check, i) => (
                        <div key={i} className={check.startsWith('✓') ? 'text-green-600' : 'text-red-500'}>
                          {check}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showConfirmPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      )}
                    </svg>
                  </button>
                </div>

                {/* Password match indicator */}
                {confirmPassword && (
                  <div className="mt-1 text-xs">
                    {newPassword === confirmPassword ? (
                      <span className="text-green-600">✓ Password cocok</span>
                    ) : (
                      <span className="text-red-500">✗ Password tidak cocok</span>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  isLoading || 
                  !isParametersValid || 
                  !newPassword || 
                  !confirmPassword || 
                  newPassword !== confirmPassword ||
                  !validatePassword(newPassword).isValid
                }
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan Password...
                  </div>
                ) : (
                  'Simpan Password Baru'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-gray-600 text-sm">
                Parameter yang diperlukan tidak tersedia atau tidak valid.
              </div>
              <div className="text-gray-500 text-xs">
                Anda akan diarahkan ke halaman reset password dalam 5 detik...
              </div>
              <Link
                href="/forgot-password"
                className="inline-block bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
              >
                Ulangi Reset Password
              </Link>
            </div>
          )}
          
          <div className="mt-6 text-center pt-4 border-t border-gray-200">
            <Link 
              href="/login"
              className="text-gray-600 hover:text-gray-800 hover:underline text-sm transition-colors"
            >
              ← Kembali ke halaman masuk
            </Link>
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

export default ResetPasswordPage;