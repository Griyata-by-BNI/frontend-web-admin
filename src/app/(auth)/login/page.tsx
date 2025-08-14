// app/login/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../../components/Footer';
// import ads from '@/app/assets/aset_login.jpg';
const ads = '/assets/aset_login.jpg'; // Place aset_login.jpg in the public/assets folder
import axiosInstance from '@/lib/axios';

interface LoginFormData {
  email: string;
  password: string;
}

interface ApiResponse {
  success?: boolean;
  token?: string;
  user?: any;
  message?: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 4;
  };

  // Clear specific error when user starts typing
  const clearError = (field: keyof typeof errors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError(field);
    clearError('general');

    // Real-time validation
    if (value) {
      if (field === 'email' && !validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Format email tidak valid' }));
      } else if (field === 'password' && !validatePassword(value)) {
        setErrors(prev => ({ 
          ...prev, 
          password: 'Password harus minimal 4 karakter' 
        }));
      }
    }
  };

  // Handle API errors
  const handleApiError = (error: any) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || '';

      switch (status) {
        case 400:
          if (message.toLowerCase().includes('email') && message.toLowerCase().includes('not found')) {
            return 'Email tidak terdaftar. Silakan daftar terlebih dahulu.';
          } else if (message.toLowerCase().includes('password') && message.toLowerCase().includes('incorrect')) {
            return 'Password yang Anda masukkan salah.';
          } else if (message.toLowerCase().includes('invalid credentials')) {
            return 'Email atau password salah.';
          }
          return message || 'Data yang Anda masukkan tidak valid.';

        case 401:
          return 'Email atau password salah.';

        case 404:
          return 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.';

        case 422:
          if (message.toLowerCase().includes('email')) {
            return 'Format email tidak valid.';
          } else if (message.toLowerCase().includes('password')) {
            return 'Format password tidak valid.';
          }
          return 'Data tidak dapat diproses. Silakan periksa kembali.';

        case 500:
          return 'Terjadi kesalahan pada server. Silakan coba lagi.';

        case 503:
          return 'Layanan sedang tidak tersedia. Silakan coba lagi nanti.';

        default:
          return message || `Terjadi kesalahan (${status}). Silakan coba lagi.`;
      }
    } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    } else {
      return 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.';
    }
  };

  // Form validation before submission
  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '', general: '' };
    let isValid = true;

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid. Contoh: user@example.com';
      isValid = false;
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password harus minimal 4 karakter';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({ email: '', password: '', general: '' });

    try {
      const response = await axiosInstance.post<ApiResponse>('/api/v1/auth/sign-in', {
        email: formData.email,
        password: formData.password,
      });

      const { data } = response;

      // Store authentication data
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      if (data.user) {
        localStorage.setItem('userData', JSON.stringify(data.user));
      }

      // Success feedback and redirect
      // alert('Login berhasil!');
      router.push('/');

    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = handleApiError(error);
      setErrors(prev => ({ ...prev, general: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between">
        {/* Image Section */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <Image 
            src={ads} 
            alt="Family" 
            width={600} 
            height={400} 
            className="rounded-lg shadow-md w-full md:w-auto" 
          />
        </div>

        {/* Login Form Section */}
        <div className="md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-teal-500 mb-4">
            Masuk aplikasi dengan akun anda
          </h3>
          <p className="text-gray-600 mb-6">
            Masukkan email dan password untuk login
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Alamat email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-teal-500'
                }`}
                disabled={loading}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                placeholder="Kata sandi"
                value={formData.password}
                onChange={handleInputChange('password')}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-teal-500'
                }`}
                disabled={loading}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* General Error Message */}
            {errors.general && (
              <p className="text-red-500 text-sm">{errors.general}</p>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-4">
              <Link 
                href="/forgot-password" 
                className="text-teal-500 hover:underline"
              >
                Lupa password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Sedang masuk...' : 'Masuk'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-gray-700">
            Belum memiliki akun?{' '}
            <Link href="/register" className="text-teal-500 hover:underline">
              Registrasi
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;