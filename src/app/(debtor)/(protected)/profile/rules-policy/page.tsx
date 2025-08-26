"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function RulesPolicyPage() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const sections = [
    {
      id: "1",
      title: "Kebijakan Privasi",
      content: {
        "1.1": {
          title: "Informasi yang kami kumpulkan",
          content:
            "Kami mengumpulkan informasi yang Anda berikan secara langsung atau melalui penggunaan aplikasi. Informasi ini meliputi:",
          items: [
            "Data Pribadi: Nama lengkap, Nomor Induk Kependudukan (NIK), alamat, tanggal lahir, jenis kelamin, nomor telepon, alamat email, dan data KTP atau dokumen identitas lainnya.",
            "Data Finansial: Informasi pendapatan, data keuangan, riwayat pekerjaan, dan data lain yang diperlukan untuk proses analisis dan persetujuan pengajuan KPR.",
            "Data Properti: Informasi mengenai properti yang Anda cari atau ajukan, seperti lokasi, harga, jenis, dan spesifikasi lainnya.",
            "Data Teknis dan Perangkat: Informasi tentang perangkat yang Anda gunakan (model, sistem operasi), alamat IP, ID perangkat, dan data log aktivitas Anda dalam aplikasi.",
            "Data Lokasi: Informasi geografis yang kami kumpulkan jika Anda mengaktifkan fitur pencarian lokasi sekitar.",
          ],
        },
        "1.2": {
          title: "Penggunaan Informasi",
          content:
            "Informasi yang kami kumpulkan digunakan untuk tujuan berikut:",
          items: [
            "Memproses, menganalisis, dan menyetujui pengajuan KPR Anda.",
            "Memberikan layanan, fitur, dan fungsionalitas yang ada di aplikasi Griyata by BNI.",
            "Berkomunikasi dengan Anda mengenai status pengajuan, informasi produk, dan pembaruan layanan.",
            "Meningkatkan, mengembangkan, dan mempersonalisasi pengalaman Anda saat menggunakan aplikasi.",
            "Melakukan riset, analisis, dan statistik untuk pengembangan bisnis BNI.",
            "Mencegah dan mendeteksi tindakan penipuan atau aktivitas ilegal.",
          ],
        },
        "1.3": {
          title: "Pengungkapan Informasi",
          content:
            "Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Informasi Anda hanya dapat kami ungkapkan kepada:",
          items: [
            "Pihak Internal BNI: Untuk keperluan pemrosesan pengajuan KPR oleh unit terkait (misalnya, tim verifikasi, tim kredit).",
            "Pihak Ketiga Mitra BNI: Seperti developer properti, perusahaan asuransi, dan penilai independen (appraiser) yang bekerja sama dengan kami.",
            "Lembaga Hukum: Jika diwajibkan oleh hukum, peraturan, atau perintah pengadilan yang sah.",
          ],
          additional:
            "Kami menjamin bahwa setiap pihak ketiga yang menerima informasi Anda terikat pada perjanjian kerahasiaan dan hanya menggunakan informasi tersebut sesuai dengan tujuan yang telah disepakati.",
        },
        "1.4": {
          title: "Keamanan Informasi",
          content:
            "Kami menerapkan langkah-langkah keamanan teknis dan administratif yang memadai untuk melindungi informasi Anda dari akses tidak sah, kerusakan, atau penyalahgunaan.",
        },
      },
    },
    {
      id: "2",
      title: "Syarat & Ketentuan Layanan",
      content: {
        "2.1": {
          title: "Kewajiban Pengguna",
          items: [
            "Anda bertanggung jawab penuh atas keakuratan, kelengkapan, dan keabsahan semua informasi yang Anda berikan.",
            "Anda bertanggung jawab penuh atas kerahasiaan dan penggunaan akun Anda. Segala aktivitas yang terjadi melalui akun Anda menjadi tanggung jawab Anda.",
            "Anda dilarang menggunakan aplikasi untuk tujuan yang melanggar hukum, etika, atau yang merugikan pihak lain.",
          ],
        },
        "2.2": {
          title: "Hak Kekayaan Intelektual",
          content:
            "Seluruh konten, desain, logo, dan fitur dalam aplikasi Griyata by BNI dilindungi oleh hak cipta dan kekayaan intelektual milik PT Bank Negara Indonesia (Persero) Tbk. Anda tidak diperkenankan untuk menyalin, memodifikasi, atau mendistribusikan tanpa izin tertulis dari kami.",
        },
        "2.3": {
          title: "Batasan Tanggung Jawab",
          items: [
            "BNI tidak bertanggung jawab atas kerugian atau kerusakan yang timbul akibat kesalahan atau kelalaian pengguna.",
            "BNI tidak memberikan jaminan bahwa aplikasi akan selalu bebas dari kesalahan teknis atau gangguan.",
          ],
        },
      },
    },
    {
      id: "3",
      title: "Ketentuan Umum",
      content: {
        "3.1": {
          title: "Pembaruan Kebijakan",
          content:
            "Kami berhak untuk mengubah atau memperbarui kebijakan ini sewaktu-waktu. Setiap perubahan akan diinformasikan melalui notifikasi di aplikasi atau situs web resmi BNI.",
        },
        "3.2": {
          title: "Hukum yang Berlaku",
          content:
            "Kebijakan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia.",
        },
        "3.3": {
          title: "Kontak Kami",
          content:
            "Jika Anda memiliki pertanyaan mengenai kebijakan ini, silakan hubungi kami melalui:",
          items: [
            "Email: bnicall@bni.co.id",
            "BNI Call: 1500046",
            "Kantor Cabang BNI: Hubungi kantor cabang BNI terdekat.",
          ],
        },
      },
    },
  ];

  return (
    <div className="min-h-screen bg-light-tosca p-4">
      {/* Header Card */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Kebijakan Aplikasi
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-tosca to-dark-tosca mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Selamat datang di aplikasi Griyata by BNI. Kebijakan ini dibuat
              untuk memberikan pemahaman kepada Anda mengenai cara kami
              mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda
              saat menggunakan aplikasi kami. Dengan menggunakan aplikasi ini,
              Anda dianggap telah membaca, memahami, dan menyetujui seluruh isi
              kebijakan ini.
            </p>
          </div>
        </div>
      </div>

      {/* Content Cards */}
      <div className="max-w-4xl mx-auto space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-800 font-semibold text-lg">
                {section.id}. {section.title}
              </span>
              <Plus
                className={`w-6 h-6 text-gray-500 transition-transform duration-500 ease-in-out ${
                  openSections[section.id] ? "rotate-45" : "rotate-0"
                }`}
              />
            </button>

            {openSections[section.id] && (
              <div className="px-6 pb-6 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-700 ease-out">
                <div className="pt-4 space-y-4">
                  {Object.entries(section.content).map(
                    ([key, subsection]: [string, any]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3">
                          {key}. {subsection.title}
                        </h4>
                        {subsection.content && (
                          <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                            {subsection.content}
                          </p>
                        )}
                        {subsection.items && (
                          <ul className="text-gray-700 text-sm space-y-2 ml-4">
                            {subsection.items.map(
                              (item: string, idx: number) => (
                                <li key={idx} className="leading-relaxed">
                                  • {item}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                        {subsection.additional && (
                          <p className="text-gray-700 text-sm mt-3 leading-relaxed">
                            {subsection.additional}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
