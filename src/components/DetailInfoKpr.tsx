"use client";

import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

interface StyleProps {
  $isActive?: boolean;
  $isSelected?: boolean;
}

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #007A70;
    --primary-button: #27C5B8;
    --primary-light: #E6F2F1;
    --text-dark: #2D3748;
    --text-light: #718096;
    --white-color: #ffffff;
    --border-color: #E2E8F0;
    --bg-light: #F7FAFC;
  }
  html {
    font-size: 15px;
  }
  body {
    font-family: 'Poppins', sans-serif;
    background-color: var(--white-color);
    color: var(--text-dark);
    margin: 0;
    line-height: 1.6;
  }
`;

const Container = styled.main`
  max-width: 1024px;
  margin: 40px auto;
  padding: 0 20px;
  @media (max-width: 768px) {
    margin: 20px auto;
  }
`;

const Section = styled.section`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 35px;
  color: var(--text-dark);
`;

const RequirementsContainer = styled.div`
  background-color: var(--white-color);
  border-radius: 16px;
  padding: 35px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
`;

const RequirementCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 40px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const RequirementCard = styled.div`
  flex: 1;
  background-color: var(--bg-light);
  padding: 25px;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  color: var(--primary-color);
  background-color: var(--primary-light);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const CardContent = styled.div`
  h4 {
    margin: 0 0 8px 0;
    color: var(--text-dark);
    font-size: 1.1rem;
  }
  p,
  ul {
    margin: 0;
    padding: 0;
    font-size: 0.9rem;
    color: var(--text-light);
    line-height: 1.7;
  }
  ul {
    list-style-position: inside;
    padding-left: 5px;
  }
`;

const DocumentTableWrapper = styled.div`
  overflow-x: auto;
`;

const DocumentTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 14px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.9rem;
  }

  th {
    background-color: var(--bg-light);
    font-weight: 600;
    color: var(--text-dark);
  }

  td:not(:first-child) {
    text-align: center;
  }

  svg {
    color: var(--primary-color);
    width: 22px;
    height: 22px;
  }
`;

const TableFootnote = styled.p`
  margin-top: 15px;
  font-size: 0.85rem;
  color: var(--text-light);
  font-style: italic;
`;

const RateCard = styled.div`
  background: var(--white-color);
  border-radius: 16px;
  padding: 35px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
  @media (max-width: 768px) {
    padding: 25px;
  }
`;

const RateTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 30px;
`;

const RateTypeButton = styled.button<StyleProps>`
  padding: 12px;
  border: 2px solid
    ${(props) =>
      props.$isActive ? "var(--primary-color)" : "var(--border-color)"};
  background-color: ${(props) =>
    props.$isActive ? "var(--primary-light)" : "transparent"};
  color: ${(props) =>
    props.$isActive ? "var(--primary-color)" : "var(--text-light)"};
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease-in-out;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  font-size: 0.85rem;
  &:hover {
    border-color: var(--primary-color);
  }
`;

const InterestRateTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  background-color: var(--bg-light);
  border-radius: 10px;
  padding: 5px;
`;

const TabLink = styled.button<StyleProps>`
  flex: 1;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  background-color: ${(props) =>
    props.$isActive ? "var(--primary-color)" : "transparent"};
  color: ${(props) =>
    props.$isActive ? "var(--white-color)" : "var(--text-light)"};
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  transition: all 0.3s ease;
`;

const InterestTableWrapper = styled.div`
  overflow-x: auto;
  padding-bottom: 10px;
`;

const InterestTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    background-color: var(--bg-light);
    font-weight: 600;
    padding: 12px;
    font-size: 0.85rem;
  }
  td {
    padding: 12px;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
  }
`;

const TableCell = styled.td<StyleProps>`
  background-color: ${(props) =>
    props.$isSelected ? "var(--primary-light)" : "transparent"};
  font-weight: ${(props) => (props.$isSelected ? "600" : "normal")};
  color: ${(props) =>
    props.$isSelected ? "var(--primary-color)" : "var(--text-dark)"};
`;

const TableHeader = styled.th<StyleProps>`
  background-color: ${(props) =>
    props.$isSelected ? "var(--primary-light)" : "var(--bg-light)"};
  color: ${(props) =>
    props.$isSelected ? "var(--primary-color)" : "var(--text-dark)"};
`;

const TdUnavailable = styled(TableCell)`
  background-color: #f1f1f1 !important;
  color: #bdbdbd !important;
  font-style: italic;
`;

const FeesSection = styled.div`
  margin-top: 20px;
  border-top: 2px dashed var(--border-color);
  padding-top: 20px;
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 10px;
  font-size: 0.9rem;

  strong {
    font-weight: 600;
    color: var(--text-light);
  }
`;

const SnkTrigger = styled.div`
  text-align: center;
  margin-top: 25px;
  button {
    background: none;
    border: none;
    color: var(--primary-color);
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--white-color);
  padding: 30px 40px;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  position: relative;
  h3 {
    margin-top: 0;
    color: var(--primary-color);
  }
  p {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--text-light);
    b {
      color: var(--text-dark);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: var(--text-light);
`;

const CtaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CtaCard = styled.div`
  background-color: var(--bg-light);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }
`;

const CtaCardImage = styled.div`
  img {
    width: 100%;
    height: 220px;
    object-fit: cover;
    display: block;
  }
`;

const CtaCardContent = styled.div`
  padding: 25px 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(
      --primary-color
    ); /* PERUBAHAN DI SINI: Warna diubah jadi hijau */
    margin: 0 0 10px 0;
  }

  p {
    color: var(--text-light);
    font-size: 0.95rem;
    margin: 0 0 25px 0;
    flex-grow: 1;
  }
`;

const CtaButton = styled.a`
  display: block;
  width: 100%;
  background-color: var(--primary-button);
  color: var(--white-color);
  padding: 14px 25px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  transition: background-color 0.2s ease, transform 0.2s ease;
  margin-top: auto; /* Mendorong tombol ke bawah */

  &:hover {
    background-color: #21b3a6;
    transform: scale(1.03);
  }
`;

const IconFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
    />
  </svg>
);
const IconUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);
const IconBriefcase = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6"
    />
    <rect
      x="3.75"
      y="6"
      width="16.5"
      height="14.25"
      rx="2"
      ry="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 10.5h16.5" />
  </svg>
);

const IconCheckmark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);
const IconInfo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      clipRule="evenodd"
    />
  </svg>
);

const rateTypes = [
  { id: "A", label: "Properti Baru (Top Developer)" },
  { id: "B", label: "Properti Baru (Developer Rekanan)" },
  { id: "C", label: "Non-Primary" },
  { id: "D", label: "Multiguna / Refinancing" },
];

const documentRequirements = [
  {
    name: "Fotokopi KTP (suami dan istri)",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi Kartu Keluarga",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi Surat Nikah (apabila sudah menikah)",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi NPWP Pribadi/SPT PPH 21",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi Rekening Gaji 3 Bulan Terakhir",
    pegawai: true,
    profesional: false,
    pengusaha: false,
  },
  {
    name: "Fotokopi Rekening Koran 6 Bulan Terakhir",
    pegawai: false,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Asli Surat Keterangan Kerja dan Slip Gaji",
    pegawai: true,
    profesional: false,
    pengusaha: false,
  },
  {
    name: "Fotokopi Ijin Praktik/Surat Kepengurusan perpanjangan izin praktik dari instansi terkait",
    pegawai: false,
    profesional: true,
    pengusaha: false,
  },
  {
    name: "Fotokopi SIUP/Surat Izin Usaha Lainnya/TDP/NIB (Nomor Induk Berusaha)/surat kepengurusan pembuatan/perpanjangan jika TDP/NIB sedang diproses",
    pegawai: false,
    profesional: false,
    pengusaha: true,
  },
  {
    name: "Fotokopi Akte Pendirian dan/atau akta perubahan terakhir (jika ada perubahan pengurus/pemilik saham)",
    pegawai: false,
    profesional: false,
    pengusaha: true,
  },
  {
    name: "Pas Foto Pemohon dan Suami/Istri Pemohon ukuran 3x4",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi Dokumen Jaminan*)",
    pegawai: true,
    profesional: true,
    pengusaha: true,
  },
  {
    name: "Fotokopi Laporan Keuangan 2 Tahun Terakhir",
    pegawai: false,
    profesional: false,
    pengusaha: true,
  },
];

const DetailInfoKpr: React.FC = () => {
  const [activeTab, setActiveTab] = useState("single-fixed");
  const [selectedRateType, setSelectedRateType] = useState("A");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <GlobalStyle />
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              &times;
            </CloseButton>
            <h3>Syarat & Ketentuan Suku Bunga</h3>
            <p>
              <b>A. Pembelian di Top Selected Developer:</b> Promo spesial untuk
              properti baru yang dikembangkan oleh Ciputra, Sinarmas Land, Jaya
              Real Properti, Paramount, Summarecon, Agung Podomoro, Pakuwon
              Group, dan developer terpilih lainnya (plafon kredit min. Rp 300
              Juta).
            </p>
            <p>
              <b>B. Pembelian di Developer Kerjasama:</b> Promo khusus untuk
              properti baru yang dikembangkan oleh seluruh developer kerjasama.
            </p>
            <p>
              <b>C. Non-Primary:</b> Promo untuk pembelian properti second,
              pembangunan/renovasi, top up, atau take over dari bank lain.
            </p>
            <p>
              <b>D. Multiguna/Refinancing:</b> Promo khusus untuk tujuan
              refinancing dan multiguna.
            </p>
            <p>
              <i>
                Semua promo spesial di atas hanya berlaku untuk permohonan
                dengan dokumen lengkap selambat-lambatnya tanggal 30 September
                2025. Setelah suku bunga fixed berakhir, akan dikenakan suku
                bunga floating yang berlaku.
              </i>
            </p>
          </ModalContent>
        </ModalOverlay>
      )}

      <Container>
        <Section>
          <SectionTitle>Syarat & Ketentuan Pengajuan</SectionTitle>
          <RequirementsContainer>
            <RequirementCardsGrid>
              <RequirementCard>
                <IconWrapper>
                  <IconFlag />
                </IconWrapper>
                <CardContent>
                  <h4>Kewarganegaraan</h4>
                  <p>
                    Warga Negara Indonesia (WNI) dan berdomisili di Indonesia.
                  </p>
                </CardContent>
              </RequirementCard>
              <RequirementCard>
                <IconWrapper>
                  <IconUser />
                </IconWrapper>
                <CardContent>
                  <h4>Usia Pemohon</h4>
                  <p>Minimum 21 tahun, maksimal saat kredit lunas:</p>
                  <ul>
                    <li>
                      <b>55 tahun</b> (Pegawai)
                    </li>
                    <li>
                      <b>65 tahun</b> (Profesional & Wiraswasta)
                    </li>
                  </ul>
                </CardContent>
              </RequirementCard>
              <RequirementCard>
                <IconWrapper>
                  <IconBriefcase />
                </IconWrapper>
                <CardContent>
                  <h4>Status Pekerjaan</h4>
                  <p>Memiliki pekerjaan dan penghasilan tetap:</p>
                  <ul>
                    <li>
                      <b>Pegawai Tetap</b> (min. 1-2 tahun)
                    </li>
                    <li>
                      <b>Profesional</b> (min. 2 tahun)
                    </li>
                    <li>
                      <b>Wiraswasta</b> (min. 2 tahun)
                    </li>
                  </ul>
                </CardContent>
              </RequirementCard>
            </RequirementCardsGrid>

            <h3
              style={{
                textAlign: "center",
                marginBottom: "25px",
                color: "var(--text-dark)",
              }}
            >
              Persyaratan Dokumen
            </h3>
            <DocumentTableWrapper>
              <DocumentTable>
                <thead>
                  <tr>
                    <th>Jenis Dokumen</th>
                    <th>Pegawai Tetap</th>
                    <th>Profesional</th>
                    <th>Pengusaha/Wiraswasta</th>
                  </tr>
                </thead>
                <tbody>
                  {documentRequirements.map((doc, index) => (
                    <tr key={index}>
                      <td>{doc.name}</td>
                      <td>{doc.pegawai && <IconCheckmark />}</td>
                      <td>{doc.profesional && <IconCheckmark />}</td>
                      <td>{doc.pengusaha && <IconCheckmark />}</td>
                    </tr>
                  ))}
                </tbody>
              </DocumentTable>
            </DocumentTableWrapper>
            <TableFootnote>
              *) Properti baru : Surat Pemesanan Rumah. Properti seken :
              Sertifikat IMB, Bukti Lunas PBB Tahun Terakhir.
            </TableFootnote>
          </RequirementsContainer>
        </Section>

        <Section>
          <SectionTitle>Pilihan Suku Bunga</SectionTitle>
          <RateCard>
            <RateTypeSelector>
              {rateTypes.map((type) => (
                <RateTypeButton
                  key={type.id}
                  $isActive={selectedRateType === type.id}
                  onClick={() => setSelectedRateType(type.id)}
                >
                  {type.label}
                </RateTypeButton>
              ))}
            </RateTypeSelector>

            <InterestRateTabs>
              <TabLink
                $isActive={activeTab === "single-fixed"}
                onClick={() => setActiveTab("single-fixed")}
              >
                Single Fixed
              </TabLink>
              <TabLink
                $isActive={activeTab === "fixed-berjenjang"}
                onClick={() => setActiveTab("fixed-berjenjang")}
              >
                Fixed Berjenjang
              </TabLink>
            </InterestRateTabs>

            {activeTab === "single-fixed" && (
              <InterestTableWrapper>
                <InterestTable>
                  <thead>
                    <tr>
                      <th>Masa Fixed</th>
                      <th>Min. Tenor</th>
                      <TableHeader $isSelected={selectedRateType === "A"}>
                        Tipe A
                      </TableHeader>
                      <TableHeader $isSelected={selectedRateType === "B"}>
                        Tipe B
                      </TableHeader>
                      <TableHeader $isSelected={selectedRateType === "C"}>
                        Tipe C
                      </TableHeader>
                      <TableHeader $isSelected={selectedRateType === "D"}>
                        Tipe D
                      </TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td rowSpan={1}>Fixed 1 Tahun</td>
                      <td>3 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        2.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        3.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        3.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        4.75%
                      </TableCell>
                    </tr>
                    <tr>
                      <td rowSpan={2}>Fixed 2 Tahun</td>
                      <td>1 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        7.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        8.00%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        8.50%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        9.25%
                      </TableCell>
                    </tr>
                    <tr>
                      <td>2 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        7.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        8.00%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        8.50%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        9.25%
                      </TableCell>
                    </tr>
                    <tr>
                      <td rowSpan={4}>Fixed 3 Tahun</td>
                      <td>15 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        2.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        3.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        3.75%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>10 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        3.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        4.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        4.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        5.75%
                      </TableCell>
                    </tr>
                    <tr>
                      <td>5 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        6.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        7.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        7.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        8.75%
                      </TableCell>
                    </tr>
                    <tr>
                      <td>3 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        7.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        8.00%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        8.50%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        9.25%
                      </TableCell>
                    </tr>
                    <tr>
                      <td>Fixed 4 Tahun</td>
                      <td>4 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        8.00%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        8.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        8.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        9.50%
                      </TableCell>
                    </tr>
                    <tr>
                      <td rowSpan={4}>Fixed 5 Tahun</td>
                      <td>15 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        3.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        4.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        5.25%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>12 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        4.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        5.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        6.25%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>10 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        5.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        6.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        6.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        7.75%
                      </TableCell>
                    </tr>
                    <tr>
                      <td>5 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        8.00%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        8.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        8.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        9.50%
                      </TableCell>
                    </tr>
                    <tr>
                      <td>Fixed 6 Tahun</td>
                      <td>6 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        8.00%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        8.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        8.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        9.50%
                      </TableCell>
                    </tr>
                    <tr>
                      <td>Fixed 7 Tahun</td>
                      <td>7 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        8.00%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        8.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        8.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        9.50%
                      </TableCell>
                    </tr>
                    <tr>
                      <td>Fixed 8 Tahun</td>
                      <td>8 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        8.00%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        8.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        8.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        9.50%
                      </TableCell>
                    </tr>
                    <tr>
                      <td>Fixed 9 Tahun</td>
                      <td>9 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        8.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        8.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        9.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        10.25%
                      </TableCell>
                    </tr>
                    <tr>
                      <td>Fixed 10 Tahun</td>
                      <td>10 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        8.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        8.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        9.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "D"}>
                        10.25%
                      </TableCell>
                    </tr>
                  </tbody>
                </InterestTable>
                <FeesSection>
                  <strong>Provisi</strong>
                  <span>1,00% dari plafon kredit</span>
                  <strong>Administrasi</strong>
                  <span>Rp 750.000,- sampai dengan Rp 2.500.000,-</span>
                </FeesSection>
              </InterestTableWrapper>
            )}

            {activeTab === "fixed-berjenjang" && (
              <InterestTableWrapper>
                <InterestTable>
                  <thead>
                    <tr>
                      <th>Masa Fixed</th>
                      <th>Min. Tenor</th>
                      <TableHeader $isSelected={selectedRateType === "A"}>
                        Tipe A
                      </TableHeader>
                      <TableHeader $isSelected={selectedRateType === "B"}>
                        Tipe B
                      </TableHeader>
                      <TableHeader $isSelected={selectedRateType === "C"}>
                        Tipe C
                      </TableHeader>
                      <TableHeader $isSelected={selectedRateType === "D"}>
                        Tipe D
                      </TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Fixed tahun ke-1</td>
                      <td rowSpan={5}>15 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        2.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        3.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        3.75%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>Fixed tahun ke-2 sampai dengan 3</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        4.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        5.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        5.75%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>Fixed tahun ke-4 sampai dengan 5</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        6.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        7.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        7.75%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>Fixed tahun ke-6 sampai dengan 7</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        8.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        9.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        9.75%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>Fixed tahun ke-8 sampai dengan 10</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        10.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        11.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        11.75%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>Fixed tahun ke-1</td>
                      <td rowSpan={5}>10 Tahun</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        2.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        3.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        3.75%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>Fixed tahun ke-2</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        4.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        5.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        5.75%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>Fixed tahun ke-3</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        6.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        7.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        7.75%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>Fixed tahun ke-4</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        8.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        9.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        9.75%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                    <tr>
                      <td>Fixed tahun ke-5 sampai dengan 10</td>
                      <TableCell $isSelected={selectedRateType === "A"}>
                        10.75%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "B"}>
                        11.25%
                      </TableCell>
                      <TableCell $isSelected={selectedRateType === "C"}>
                        11.75%
                      </TableCell>
                      <TdUnavailable $isSelected={selectedRateType === "D"}>
                        -
                      </TdUnavailable>
                    </tr>
                  </tbody>
                </InterestTable>
                <FeesSection>
                  <strong>Provisi</strong>
                  <span>1,00% dari plafon kredit</span>
                  <strong>Administrasi</strong>
                  <span>Rp 750.000,- sampai dengan Rp 2.500.000,-</span>
                </FeesSection>
              </InterestTableWrapper>
            )}
          </RateCard>
          <SnkTrigger>
            <button onClick={() => setIsModalOpen(true)}>
              <IconInfo />
              Lihat Syarat & Ketentuan Suku Bunga
            </button>
          </SnkTrigger>
        </Section>

        <Section>
          <CtaGrid>
            <CtaCard>
              <CtaCardImage>
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
                  alt="Keluarga bahagia di rumah baru"
                />
              </CtaCardImage>
              <CtaCardContent>
                <h3>Cek Kemampuan KPR-mu</h3>
                <p>
                  Hitung dulu estimasi KPR yang bisa kamu dapatkan di sini.
                  Sebuah langkah awal untuk wujudkan rumah impianmu bersama BNI.
                </p>
                <CtaButton href="#">Cek Sekarang!</CtaButton>
              </CtaCardContent>
            </CtaCard>
            <CtaCard>
              <CtaCardImage>
                <img
                  src="https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=1964&auto=format&fit=crop"
                  alt="Proses pindah rumah yang mudah"
                />
              </CtaCardImage>
              <CtaCardContent>
                <h3>Ajukan KPR Anti Ribet</h3>
                <p>Ajukan KPRmu dengan mudah di manapun dan kapanpun.</p>
                <CtaButton href="#">Ajukan KPR</CtaButton>
              </CtaCardContent>
            </CtaCard>
          </CtaGrid>
        </Section>
      </Container>
    </>
  );
};

export default DetailInfoKpr;
