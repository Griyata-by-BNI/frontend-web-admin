'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

// Import axios instance from separate config
import axiosInstance from '@/lib/axios';

// Types
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePassword = (password: string): boolean => {
    return password.trim().length >= 8;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!value) {
      setEmailError('Email wajib diisi');
    } else if (!validateEmail(value)) {
      setEmailError('Email tidak valid');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!value) {
      setPasswordError('Password wajib diisi');
    } else if (!validatePassword(value)) {
      setPasswordError('Password harus minimal 8 karakter');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    // Validate inputs
    let hasError = false;
    if (!email) {
      setEmailError('Email wajib diisi');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Email tidak valid');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password wajib diisi');
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError('Password harus minimal 8 karakter');
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      const loginData = {
        email: email.trim(),
        password: password.trim(),
      };

      const response = await axiosInstance.post<LoginResponse>('/api/v1/auth/sign-in', loginData);
      
      if (response.status === 200) {
        // Check if response has token (different response structures)
        const token = response.data?.token || response.data?.data?.token || response.data?.access_token;
        const userData = response.data?.user || response.data?.data?.user || response.data?.data;
        
        if (token) {
          // Store token if remember me is checked
          if (rememberMe) {
            localStorage.setItem('authToken', token);
            if (userData) localStorage.setItem('userData', JSON.stringify(userData));
          } else {
            // Store in session storage if not remember me
            sessionStorage.setItem('authToken', token);
            if (userData) sessionStorage.setItem('userData', JSON.stringify(userData));
          }

          // Show success message
          setError('');
          
          // Add success notification
          const successMessage = document.createElement('div');
          successMessage.innerHTML = '✅ Login berhasil! Mengalihkan...';
          successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          document.body.appendChild(successMessage);
          
          setTimeout(() => {
            successMessage.remove();
          }, 3000);

          // Redirect to / or home after short delay
          setTimeout(() => {
            router.push('/');
          }, 1500);
        } else {
          setError('Login berhasil tapi token tidak ditemukan. Silakan coba lagi.');
        }
      } else {
        setError(response.data?.message || 'Login failed');
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Email atau password tidak valid');
      } else if (err.response?.status === 500) {
        setError('Terjadi kesalahan server. Silakan coba lagi nanti.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Koneksi timeout. Periksa koneksi internet Anda.');
      } else if (err.response?.status === 404) {
        setError('API endpoint tidak ditemukan. Periksa konfigurasi server.');
      } else if (!err.response) {
        setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        setError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header Navigation */}


      {/* Main Content */}
      <div className="flex" style={{ height: 'calc(100vh - 72px)' }}>
        
        {/* Left Side - Image Only */}
        <div className="w-1/2 relative">
          <Image
            src="/aset_login.jpg"
            alt="Happy family"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 bg-gray-50 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-teal-600 mb-1 text-center">
                Masuk aplikasi
              </h2>
              <h3 className="text-3xl font-bold text-teal-600 mb-4 text-center">
                dengan akun anda
              </h3>
              <p className="text-gray-600">
                Masukkan email dan password untuk login
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder="Alamat email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full px-4 py-3 border ${emailError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200 bg-white disabled:bg-gray-100`}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
                {emailError && (
                  <p className="mt-1 text-red-600 text-sm">{emailError}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Kata sandi"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border ${passwordError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all duration-200 bg-white disabled:bg-gray-100`}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-6 w-6" />
                  ) : (
                    <EyeIcon className="h-6 w-6" />
                  )}
                </button>
                {passwordError && (
                  <p className="mt-1 text-red-600 text-sm">{passwordError}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 disabled:cursor-not-allowed"
                    disabled={loading}
                  />
                  <span className="ml-2 text-gray-600">Ingat Saya</span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className={`text-teal-600 hover:text-teal-700 font-medium ${loading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Lupa password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>

              {/* Registration Link */}
              <p className="text-center text-gray-600 mt-4">
                Belum memiliki akun?{' '}
                <Link 
                  href="/register" 
                  className={`text-teal-600 hover:text-teal-700 font-semibold ${loading ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Registrasi
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-teal-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white mb-1">Butuh Informasi Lebih Lanjut?</p>
          <h3 className="text-xl font-bold text-white">BNI Call - 1500046</h3>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;