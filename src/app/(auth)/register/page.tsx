"use client";

import { useRegister } from "@/services/authServices";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import { App, Button, Checkbox, Form, Input, Modal } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FormData } from "./types";

const RegisterForm: React.FC = ({}) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { mutateAsync: register, status, error } = useRegister();
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk kontrol modal

  const handleSubmit = async (values: FormData) => {
    try {
      await register({
        fullName: values.fullName.trim(),
        phoneNumber: values.phoneNumber.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
      });

      router.push(`/register/verify-email?email=${values.email}`);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.status?.message ||
        "Terjadi kesalahan. Silakan coba lagi.";

      message.error(errorMessage);
    }
  };

  const loading = status === "pending";

  // Isi kebijakan aplikasi
  const termsContent = (
    <div className="text-sm text-gray-600">
      <h4 className="text-base font-bold text-teal-600 mb-3">
        KEBIJAKAN APLIKASI
      </h4>
      <p className="mb-3">
        Selamat datang di aplikasi Griyata by BNI. Kebijakan ini dibuat untuk
        memberikan pemahaman kepada Anda mengenai cara kami mengumpulkan,
        menggunakan, dan melindungi informasi pribadi Anda saat menggunakan
        aplikasi kami. Dengan menggunakan aplikasi ini, Anda dianggap telah
        membaca, memahami, dan menyetujui seluruh isi kebijakan ini.
      </p>

      <h5 className="font-semibold text-gray-700 mb-2">1. Kebijakan Privasi</h5>
      <h6 className="font-medium mb-1">1.1. Informasi yang kami kumpulkan</h6>
      <p className="mb-2">
        Kami mengumpulkan informasi yang Anda berikan secara langsung atau
        melalui penggunaan aplikasi. Informasi ini meliputi:
      </p>
      <ul className="list-disc pl-5 mb-3">
        <li>
          <strong>Data Pribadi:</strong> Nama lengkap, Nomor Induk Kependudukan
          (NIK), alamat, tanggal lahir, jenis kelamin, nomor telepon, alamat
          email, dan data KTP atau dokumen identitas lainnya.
        </li>
        <li>
          <strong>Data Finansial:</strong> Informasi pendapatan, data keuangan,
          riwayat pekerjaan, dan data lain yang diperlukan untuk proses analisis
          dan persetujuan pengajuan KPR.
        </li>
        <li>
          <strong>Data Properti:</strong> Informasi mengenai properti yang Anda
          cari atau ajukan, seperti lokasi, harga, jenis, dan spesifikasi
          lainnya.
        </li>
        <li>
          <strong>Data Teknis dan Perangkat:</strong> Informasi tentang
          perangkat yang Anda gunakan (model, sistem operasi), alamat IP, ID
          perangkat, dan data log aktivitas Anda dalam aplikasi.
        </li>
        <li>
          <strong>Data Lokasi:</strong> Informasi geografis yang kami kumpulkan
          jika Anda mengaktifkan fitur pencarian lokasi sekitar.
        </li>
      </ul>

      <h6 className="font-medium mb-1">1.2. Penggunaan Informasi</h6>
      <p className="mb-2">
        Informasi yang kami kumpulkan digunakan untuk tujuan berikut:
      </p>
      <ul className="list-decimal pl-5 mb-3">
        <li>Memproses, menganalisis, dan menyetujui pengajuan KPR Anda.</li>
        <li>
          Memberikan layanan, fitur, dan fungsionalitas yang ada di aplikasi
          Griyata by BNI.
        </li>
        <li>
          Berkomunikasi dengan Anda mengenai status pengajuan, informasi produk,
          dan pembaruan layanan.
        </li>
        <li>
          Meningkatkan, mengembangkan, dan mempersonalisasi pengalaman Anda saat
          menggunakan aplikasi.
        </li>
        <li>
          Melakukan riset, analisis, dan statistik untuk pengembangan bisnis
          BNI.
        </li>
        <li>
          Mencegah dan mendeteksi tindakan penipuan atau aktivitas ilegal.
        </li>
      </ul>

      <h6 className="font-medium mb-1">1.3. Pengungkapan Informasi</h6>
      <p className="mb-2">
        Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada
        pihak ketiga. Informasi Anda hanya dapat kami ungkapkan kepada:
      </p>
      <ul className="list-decimal pl-5 mb-3">
        <li>
          <strong>Pihak Internal BNI:</strong> Untuk keperluan pemrosesan
          pengajuan KPR oleh unit terkait (misalnya, tim verifikasi, tim
          kredit).
        </li>
        <li>
          <strong>Pihak Ketiga Mitra BNI:</strong> Seperti developer properti,
          perusahaan asuransi, dan penilai independen (appraiser) yang bekerja
          sama dengan kami.
        </li>
        <li>
          <strong>Lembaga Hukum:</strong> Jika diwajibkan oleh hukum, peraturan,
          atau perintah pengadilan yang sah.
        </li>
      </ul>
      <p className="mb-3">
        Kami menjamin bahwa setiap pihak ketiga yang menerima informasi Anda
        terikat pada perjanjian kerahasiaan dan hanya menggunakan informasi
        tersebut sesuai dengan tujuan yang telah disepakati.
      </p>

      <h6 className="font-medium mb-1">1.4. Keamanan Informasi</h6>
      <p className="mb-3">
        Kami menerapkan langkah-langkah keamanan teknis dan administratif yang
        memadai untuk melindungi informasi Anda dari akses tidak sah, kerusakan,
        atau penyalahgunaan.
      </p>

      <h5 className="font-semibold text-gray-700 mb-2">
        2. SYARAT & KETENTUAN LAYANAN
      </h5>
      <h6 className="font-medium mb-1">2.1. Kewajiban Pengguna</h6>
      <ul className="list-decimal pl-5 mb-3">
        <li>
          Anda bertanggung jawab penuh atas keakuratan, kelengkapan, dan
          keabsahan semua informasi yang Anda berikan.
        </li>
        <li>
          Anda bertanggung jawab penuh atas kerahasiaan dan penggunaan akun
          Anda. Segala aktivitas yang terjadi melalui akun Anda menjadi tanggung
          jawab Anda.
        </li>
        <li>
          Anda dilarang menggunakan aplikasi untuk tujuan yang melanggar hukum,
          etika, atau yang merugikan pihak lain.
        </li>
      </ul>

      <h6 className="font-medium mb-1">2.2. Hak Kekayaan Intelektual</h6>
      <p className="mb-3">
        Seluruh konten, desain, logo, dan fitur dalam aplikasi Griyata by BNI
        dilindungi oleh hak cipta dan kekayaan intelektual milik PT Bank Negara
        Indonesia (Persero) Tbk. Anda tidak diperkenankan untuk menyalin,
        memodifikasi, atau mendistribusikan tanpa izin tertulis dari kami.
      </p>

      <h6 className="font-medium mb-1">2.3. Batasan Tanggung Jawab</h6>
      <ul className="list-disc pl-5 mb-3">
        <li>
          BNI tidak bertanggung jawab atas kerugian atau kerusakan yang timbul
          akibat kesalahan atau kelalaian pengguna.
        </li>
        <li>
          BNI tidak memberikan jaminan bahwa aplikasi akan selalu bebas dari
          kesalahan teknis atau gangguan.
        </li>
      </ul>

      <h5 className="font-semibold text-gray-700 mb-2">3. KETENTUAN UMUM</h5>
      <h6 className="font-medium mb-1">3.1. Pembaruan Kebijakan</h6>
      <p className="mb-3">
        Kami berhak untuk mengubah atau memperbarui kebijakan ini sewaktu-waktu.
        Setiap perubahan akan diinformasikan melalui notifikasi di aplikasi atau
        situs web resmi BNI.
      </p>

      <h6 className="font-medium mb-1">3.2. Hukum yang Berlaku</h6>
      <p className="mb-3">
        Kebijakan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di
        Republik Indonesia.
      </p>

      <h6 className="font-medium mb-1">3.3. Kontak Kami</h6>
      <p className="mb-2">
        Jika Anda memiliki pertanyaan mengenai kebijakan ini, silakan hubungi
        kami melalui:
      </p>
      <ul className="list-disc pl-5 mb-3">
        <li>Email: bnicall@bni.co.id</li>
        <li>BNI Call: 1500046</li>
        <li>Kantor Cabang BNI: Hubungi kantor cabang BNI terdekat.</li>
      </ul>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 my-8 md:my-12 sm:p-8 rounded-2xl shadow-2xl border border-gray-200">
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-teal-600 mb-2">
          Daftar Akun Griyata
        </h3>

        <p className="text-gray-600 text-sm sm:text-base">
          Masukkan identitas diri untuk mendaftar
        </p>
      </div>

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          className="!mb-3"
          label={"Nama Lengkap"}
          name="fullName"
          rules={[
            { required: true, message: "Nama lengkap wajib diisi" },
            { min: 2, message: "Nama minimal 2 karakter" },
            {
              pattern: /^[a-zA-Z\s]+$/,
              message: "Nama hanya boleh berisi huruf dan spasi",
            },
          ]}
        >
          <Input placeholder="Nama lengkap" disabled={loading} />
        </Form.Item>

        <Form.Item
          className="!mb-3"
          label={"Nama Handphone"}
          name="phoneNumber"
          rules={[
            { required: true, message: "Nomor handphone wajib diisi" },
            {
              pattern: /^\d{10,13}$/,
              message: "Nomor handphone harus 10-13 digit angka",
            },
            {
              validator: (_, value) => {
                if (
                  !value ||
                  value.startsWith("08") ||
                  value.startsWith("62")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Nomor handphone harus dimulai dengan 08 atau 62")
                );
              },
            },
          ]}
        >
          <Input
            placeholder="Nomor handphone (08xxxxxxxxx)"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          className="!mb-3"
          label={"Email"}
          name="email"
          rules={[
            { required: true, message: "Email wajib diisi" },
            { type: "email", message: "Format email tidak valid" },
          ]}
        >
          <Input placeholder="Alamat email" disabled={loading} />
        </Form.Item>

        <Form.Item
          className="!mb-3"
          label={"Kata Sandi"}
          name="password"
          rules={[
            { required: true, message: "Kata Sandi wajib diisi" },
            { min: 8, message: "Kata Sandi minimal 8 karakter" },
            {
              pattern: /(?=.*[a-z])/,
              message: "Kata Sandi harus mengandung huruf kecil",
            },
            {
              pattern: /(?=.*[A-Z])/,
              message: "Kata Sandi harus mengandung huruf besar",
            },
            {
              pattern: /(?=.*\d)/,
              message: "Kata Sandi harus mengandung angka",
            },
            {
              pattern: /(?=.*[^\w\s])/,
              message: "Kata Sandi harus mengandung karakter khusus",
            },
            {
              pattern: /^\S+$/,
              message: "Kata Sandi tidak boleh mengandung spasi",
            },
          ]}
        >
          <Input.Password
            placeholder="Kata sandi"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          className="!mb-3"
          label={"Konfirmasi Kata Sandi"}
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Konfirmasi kata sandi wajib diisi" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Konfirmasi password tidak sama dengan password")
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Ulangi kata sandi"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          className="!mb-3"
          name="agreeToTerms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Anda harus menyetujui syarat dan ketentuan")
                    ),
            },
          ]}
        >
          <Checkbox disabled={loading}>
            Saya setuju dengan{" "}
            <Button
              type="link"
              className="!p-0 !text-teal-600 hover:!text-teal-700 !font-medium"
              onClick={() => setIsModalOpen(true)}
            >
              syarat dan ketentuan
            </Button>{" "}
            yang berlaku
          </Checkbox>
        </Form.Item>

        {/* Modal untuk Kebijakan Aplikasi */}
        <Modal
          title="Syarat dan Ketentuan"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalOpen(false)}>
              Tutup
            </Button>,
          ]}
          width={600}
          className="max-h-[80vh] overflow-y-auto"
        >
          {termsContent}
        </Modal>

        <Form.Item className="!mb-3">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
            size="large"
          >
            Daftar Sekarang
          </Button>
        </Form.Item>

        <div className="text-center">
          <p className="text-gray-600 text-sm sm:text-base">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="!text-teal-600 hover:!text-teal-800 font-medium underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
