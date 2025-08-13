// app/register/page.tsx
'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../../components/Footer';

// Define types
type FieldStatus = 'valid' | 'invalid' | null;
type FieldErrors = {
  [key: string]: string;
};

interface PasswordValidation {
  rule: string;
  isValid: boolean;
  message?: string;
}

interface FormData {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FieldStatusState {
  name: FieldStatus;
  phoneNumber: FieldStatus;
  email: FieldStatus;
  password: FieldStatus;
  confirmPassword: FieldStatus;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  
  const [passwordValidations, setPasswordValidations] = useState<PasswordValidation[]>([
    { rule: 'Minimal 8 karakter', isValid: false },
    { rule: 'Setidaknya satu huruf besar', isValid: false },
    { rule: 'Setidaknya satu huruf kecil', isValid: false },
    { rule: 'Setidaknya satu angka', isValid: false },
    { rule: 'Setidaknya satu karakter khusus', isValid: false },
  ]);
  
  const [fieldStatus, setFieldStatus] = useState<FieldStatusState>({
    name: null,
    phoneNumber: null,
    email: null,
    password: null,
    confirmPassword: null,
  });
  
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  
  const router = useRouter();

  // Validation functions
  const validateName = (name: string): { isValid: boolean; message: string } => {
    if (!name.trim()) {
      return { isValid: false, message: 'Nama lengkap wajib diisi' };
    }
    if (name.trim().length < 2) {
      return { isValid: false, message: 'Nama minimal 2 karakter' };
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return { isValid: false, message: 'Nama hanya boleh berisi huruf dan spasi' };
    }
    return { isValid: true, message: '' };
  };

  const validatePhone = (phoneNumber: string): { isValid: boolean; message: string } => {
    if (!phoneNumber.trim()) {
      return { isValid: false, message: 'Nomor handphone wajib diisi' };
    }
    if (!/^\d{10,13}$/.test(phoneNumber)) {
      return { isValid: false, message: 'Nomor handphone harus 10-13 digit angka' };
    }
    if (!phoneNumber.startsWith('08') && !phoneNumber.startsWith('62')) {
      return { isValid: false, message: 'Nomor handphone harus dimulai dengan 08 atau 62' };
    }
    return { isValid: true, message: '' };
  };

  const validateEmail = (email: string): { isValid: boolean; message: string } => {
    if (!email.trim()) {
      return { isValid: false, message: 'Email wajib diisi' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Format email tidak valid' };
    }
    return { isValid: true, message: '' };
  };

  const validatePassword = (password: string): { isValid: boolean; validations: PasswordValidation[] } => {
    const validations: PasswordValidation[] = [
      { 
        rule: 'Minimal 8 karakter', 
        isValid: password.length >= 8,
        message: 'Password harus minimal 8 karakter'
      },
      { 
        rule: 'Setidaknya satu huruf besar', 
        isValid: /[A-Z]/.test(password),
        message: 'Password harus mengandung minimal satu huruf besar'
      },
      { 
        rule: 'Setidaknya satu huruf kecil', 
        isValid: /[a-z]/.test(password),
        message: 'Password harus mengandung minimal satu huruf kecil'
      },
      { 
        rule: 'Setidaknya satu angka', 
        isValid: /\d/.test(password),
        message: 'Password harus mengandung minimal satu angka'
      },
      { 
        rule: 'Setidaknya satu karakter khusus', 
        isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        message: 'Password harus mengandung minimal satu karakter khusus'
      },
    ];

    setPasswordValidations(validations);
    const allValid = validations.every(v => v.isValid);
    return { isValid: allValid, validations };
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): { isValid: boolean; message: string } => {
    if (!confirmPassword.trim()) {
      return { isValid: false, message: 'Konfirmasi password wajib diisi' };
    }
    if (!password.trim()) {
      return { isValid: false, message: 'Silakan isi password terlebih dahulu' };
    }
    if (confirmPassword !== password) {
      return { isValid: false, message: 'Konfirmasi password tidak sama dengan password' };
    }
    return { isValid: true, message: '' };
  };

  // Field validation handler
  const validateField = (fieldName: keyof FieldStatusState, value: string) => {
    let validation: { isValid: boolean; message: string };
    
    switch (fieldName) {
      case 'name':
        validation = validateName(value);
        break;
      case 'phoneNumber':
        validation = validatePhone(value);
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        const passwordResult = validatePassword(value);
        validation = { 
          isValid: passwordResult.isValid, 
          message: passwordResult.isValid ? '' : 'Password tidak memenuhi kriteria'
        };
        break;
      case 'confirmPassword':
        validation = validateConfirmPassword(value, formData.password);
        break;
      default:
        validation = { isValid: true, message: '' };
    }

    // Update field status
    setFieldStatus(prev => ({
      ...prev,
      [fieldName]: validation.isValid ? 'valid' : 'invalid'
    }));

    // Update field errors
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: validation.message
    }));

    return validation.isValid;
  };

  // Input change handlers
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setGlobalError('');
    
    // Validate field if it's a string (not checkbox)
    if (typeof value === 'string' && field !== 'agreeToTerms') {
      validateField(field as keyof FieldStatusState, value);
      
      // Re-validate confirm password if password changes
      if (field === 'password' && formData.confirmPassword) {
        validateField('confirmPassword', formData.confirmPassword);
      }
    }
  };

  // Submit handler with API integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGlobalError('');

    // Validate all fields
    const isNameValid = validateField('name', formData.name);
    const isPhoneValid = validateField('phoneNumber', formData.phoneNumber);
    const isEmailValid = validateField('email', formData.email);
    const passwordResult = validatePassword(formData.password);
    const isPasswordValid = passwordResult.isValid;
    const isConfirmValid = validateField('confirmPassword', formData.confirmPassword);

    // Check terms agreement
    if (!formData.agreeToTerms) {
      setGlobalError('Anda harus menyetujui syarat dan ketentuan');
      setLoading(false);
      return;
    }

    // Check if all validations pass
    if (!(isNameValid && isPhoneValid && isEmailValid && isPasswordValid && isConfirmValid)) {
      setGlobalError('Silakan perbaiki kesalahan pada form');
      setLoading(false);
      return;
    }

    try {
      // API call untuk registrasi
      const response = await fetch('https://581911203717.ngrok-free.app/api/v1/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name.trim(),
          phoneNumber: formData.phoneNumber,
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registrasi berhasil! Kode OTP verifikasi telah dikirim ke email Anda.');
        router.push('/register/verify-email');
      } else {
        if (response.status === 400) {
          const errorMessage = data.message || '';
          if (errorMessage.toLowerCase().includes('email already exists')) {
            setFieldErrors(prev => ({ ...prev, email: 'Email sudah terdaftar. Silakan gunakan email lain.' }));
            setFieldStatus(prev => ({ ...prev, email: 'invalid' }));
          } else if (errorMessage.toLowerCase().includes('phone already exists')) {
            setFieldErrors(prev => ({ ...prev, phoneNumber: 'Nomor handphone sudah terdaftar.' }));
            setFieldStatus(prev => ({ ...prev, phoneNumber: 'invalid' }));
          } else {
            setGlobalError(errorMessage || 'Data yang Anda masukkan tidak valid.');
          }
        } else if (response.status === 422) {
          setGlobalError('Data yang Anda masukkan tidak dapat diproses. Silakan periksa kembali.');
        } else if (response.status === 500) {
          setGlobalError('Terjadi kesalahan pada server. Silakan coba lagi dalam beberapa saat.');
        } else {
          setGlobalError(data.message || 'Registrasi gagal. Silakan coba lagi.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setGlobalError('Terjadi kesalahan koneksi. Silakan periksa internet Anda dan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Get input styling based on field status
  const getInputClass = (field: keyof FieldStatusState) => {
    const status = fieldStatus[field];
    return `w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
      status === 'valid' ? 'border-green-500 focus:ring-green-500 bg-green-50' : 
      status === 'invalid' ? 'border-red-500 focus:ring-red-500 bg-red-50' : 
      'border-gray-300 focus:ring-teal-500'
    }`;
  };

  // Check if form is ready to submit
  const isFormValid = () => {
    return Object.values(fieldStatus).every(status => status === 'valid') && 
           formData.agreeToTerms && 
           !loading;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-teal-500 mb-4">Registrasi untuk pengalaman baru</h3>
          <p className="text-gray-600 mb-6">Masukkan identitas diri untuk mendaftar</p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <input
                type="text"
                placeholder="Nama lengkap"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={getInputClass('name')}
                disabled={loading}
                required
              />
              {fieldErrors.name && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <input
                type="tel"
                placeholder="Nomor handphone (08xxxxxxxxx)"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={getInputClass('phoneNumber')}
                disabled={loading}
                required
              />
              {fieldErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.phoneNumber}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Alamat email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={getInputClass('email')}
                disabled={loading}
                required
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <input
                type="password"
                placeholder="Kata sandi"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={getInputClass('password')}
                disabled={loading}
                required
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <input
                type="password"
                placeholder="Ulangi kata sandi"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={getInputClass('confirmPassword')}
                disabled={loading}
                required
              />
              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-center text-gray-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="mr-2 accent-teal-500" 
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  disabled={loading}
                  required
                />
                Setuju dengan{' '}
                <Link href="/terms" className="text-teal-500 hover:underline ml-1">
                  syarat dan ketentuan
                </Link>
              </label>
            </div>

            {/* Password validation feedback */}
            {formData.password && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Kriteria kata sandi:</p>
                <div className="space-y-1">
                  {passwordValidations.map((validation, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                        validation.isValid 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {validation.isValid ? (
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors duration-200 ${
                        validation.isValid 
                          ? 'text-green-700 font-medium' 
                          : 'text-gray-600'
                      }`}>
                        {validation.rule}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Global Error Message */}
            {globalError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">{globalError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              disabled={!isFormValid()}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mendaftarkan...
                </div>
              ) : (
                'Daftar'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-700">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="text-teal-500 hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;