'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, Shield, Users, AlertCircle, Eye, EyeOff } from 'lucide-react';

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

// Terms Modal Component
const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void; onAgree: () => void }> = ({ isOpen, onClose, onAgree }) => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      title: "Kebijakan Privasi",
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-teal-800 mb-2">1.1. Informasi yang kami kumpulkan</h4>
            <p className="text-gray-700 mb-3">
              Kami mengumpulkan informasi yang Anda berikan secara langsung atau melalui penggunaan aplikasi. Informasi ini meliputi:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Data Pribadi:</strong> Nama lengkap, NIK, alamat, tanggal lahir, jenis kelamin, nomor telepon, email, dan data KTP</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Data Finansial:</strong> Informasi pendapatan, data keuangan, riwayat pekerjaan untuk analisis KPR</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Data Properti:</strong> Informasi properti seperti lokasi, harga, jenis, dan spesifikasi</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Data Teknis:</strong> Informasi perangkat, IP address, ID perangkat, dan log aktivitas</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Penggunaan & Pengungkapan Informasi",
      icon: <Users className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-teal-800 mb-2">1.2. Penggunaan Informasi</h4>
            <p className="text-gray-700 mb-3">Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Memproses, menganalisis, dan menyetujui pengajuan KPR Anda</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Memberikan layanan dan fitur aplikasi Griyata by BNI</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Berkomunikasi mengenai status pengajuan dan pembaruan layanan</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-teal-800 mb-2">1.3. Pengungkapan Informasi</h4>
            <p className="text-gray-700 mb-3">
              Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Informasi hanya dapat diungkapkan kepada:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Pihak Internal BNI:</strong> Untuk keperluan pemrosesan pengajuan KPR oleh unit terkait</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Pihak Ketiga Mitra BNI:</strong> Developer properti, asuransi, dan appraiser</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Syarat & Ketentuan Layanan",
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-teal-800 mb-2">2.1. Kewajiban Pengguna</h4>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Anda bertanggung jawab penuh atas keakuratan, kelengkapan, dan keabsahan semua informasi yang Anda berikan</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Anda bertanggung jawab penuh atas kerahasiaan dan penggunaan akun Anda</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-teal-800 mb-2">2.2. Hak Kekayaan Intelektual</h4>
            <p className="text-gray-700 text-sm mb-4">
              Seluruh konten, desain, logo, dan fitur dalam aplikasi Griyata by BNI dilindungi 
              oleh hak cipta dan kekayaan intelektual milik PT Bank Negara Indonesia (Persero) Tbk.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Ketentuan Umum & Kontak",
      icon: <AlertCircle className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-teal-800 mb-2">3.1. Pembaruan Kebijakan</h4>
            <p className="text-gray-700 text-sm mb-4">
              Kami berhak untuk mengubah atau memperbarui kebijakan ini sewaktu-waktu. 
              Setiap perubahan akan diinformasikan melalui notifikasi di aplikasi atau situs web resmi BNI.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-teal-800 mb-2">3.2. Hubungi Kami</h4>
            <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">@</span>
                  </div>
                  <div>
                    <strong>Email:</strong>
                    <br />
                    <span className="text-teal-600">bnicall@bni.co.id</span>
                  </div>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">☎</span>
                  </div>
                  <div>
                    <strong>BNI Call:</strong>
                    <br />
                    <span className="text-teal-600">1500046</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSection = () => {
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const prevSection = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  };

  const goToSection = (index: number) => {
    setCurrentSection(index);
  };

  const handleAgree = () => {
    onAgree();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                  {sections[currentSection].icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold">Kebijakan Aplikasi Griyata by BNI</h1>
                  <p className="text-teal-100 text-sm mt-1">{sections[currentSection].title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {sections.map((section, index) => (
                  <div key={index} className="flex items-center">
                    <button
                      onClick={() => goToSection(index)}
                      className={`w-8 h-8 rounded-full text-xs font-medium transition duration-200 flex items-center justify-center ${
                        index === currentSection 
                          ? 'bg-teal-500 text-white shadow-lg' 
                          : index < currentSection
                            ? 'bg-teal-200 text-teal-700 hover:bg-teal-300'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                    {index < sections.length - 1 && (
                      <div className={`w-8 h-1 mx-2 rounded transition duration-300 ${
                        index < currentSection ? 'bg-teal-300' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                {currentSection + 1} dari {sections.length}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="max-w-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="p-2 bg-teal-100 text-teal-600 rounded-lg mr-3">
                  {sections[currentSection].icon}
                </span>
                {sections[currentSection].title}
              </h2>
              <div className="prose prose-teal max-w-none">
                {sections[currentSection].content}
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={prevSection}
                disabled={currentSection === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  currentSection === 0
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : 'text-gray-700 hover:bg-gray-200 bg-white shadow-sm'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="flex space-x-1">
                {sections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSection(index)}
                    className={`w-2 h-2 rounded-full transition duration-200 ${
                      index === currentSection ? 'bg-teal-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentSection === sections.length - 1 ? (
                <button
                  onClick={handleAgree}
                  className="flex items-center space-x-2 px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition duration-200 shadow-sm"
                >
                  <span>Setuju & Tutup</span>
                </button>
              ) : (
                <button
                  onClick={nextSection}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition duration-200 shadow-sm"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Register Component
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Validation functions (unchanged from original)
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

  // Handle terms agreement
  const handleTermsAgree = () => {
    setFormData(prev => ({ ...prev, agreeToTerms: true }));
  };

  // Submit handler
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

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Registrasi berhasil! Kode OTP verifikasi telah dikirim ke email Anda.');
    } catch (error) {
      setGlobalError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Get input styling based on field status
  const getInputClass = (field: keyof FieldStatusState) => {
    const status = fieldStatus[field];
    return `w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
      status === 'valid' ? 'border-teal-500 focus:ring-teal-500 bg-teal-50' : 
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">G</span>
          </div>
          <h3 className="text-2xl font-bold text-teal-600 mb-2">Registrasi untuk pengalaman baru</h3>
          <p className="text-gray-600">Masukkan identitas diri untuk mendaftar</p>
        </div>
        
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
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {fieldErrors.name}
              </p>
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
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {fieldErrors.phoneNumber}
              </p>
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
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Kata sandi"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={getInputClass('password') + ' pr-12'}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {fieldErrors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Ulangi kata sandi"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={getInputClass('confirmPassword') + ' pr-12'}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Password validation feedback */}
          {formData.password && (
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <p className="text-sm font-medium text-teal-700 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Kriteria kata sandi:
              </p>
              <div className="space-y-2">
                {passwordValidations.map((validation, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                      validation.isValid 
                        ? 'bg-teal-500 text-white' 
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
                        ? 'text-teal-700 font-medium' 
                        : 'text-gray-600'
                    }`}>
                      {validation.rule}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms Agreement */}
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <input 
              type="checkbox" 
              id="agreeToTerms"
              className="mt-1 accent-teal-500 w-4 h-4" 
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
              disabled={loading}
              required
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-700 cursor-pointer flex-1">
              Saya setuju dengan{' '}
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="text-teal-600 hover:text-teal-700 font-medium underline"
              >
                syarat dan ketentuan
              </button>
              {' '}yang berlaku
            </label>
          </div>

          {/* Global Error Message */}
          {globalError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-red-600 text-sm font-medium">{globalError}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isFormValid()
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Mendaftarkan...
              </div>
            ) : (
              'Daftar Sekarang'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Sudah memiliki akun?{' '}
            <button className="text-teal-600 hover:text-teal-700 font-medium underline">
              Masuk
            </button>
          </p>
        </div>
      </div>

      {/* Terms Modal */}
      <TermsModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)}
        onAgree={handleTermsAgree}
      />
    </div>
  );
};

export default RegisterPage;