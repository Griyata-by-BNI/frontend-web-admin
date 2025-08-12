"use client";

import React, { useState } from "react";

type Status = "Diproses" | "Disetujui" | "Ditolak";

interface Submission {
  id: number;
  imageUrl: string;
  title: string;
  group: string;
  date: string;
  status: Status;
}

const inProcessSubmissions: Submission[] = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop",
    title: "Caksana - Tipe Celosia",
    group: "Alam Sutera Group",
    date: "01/08/2025",
    status: "Diproses",
  },
];

const completedSubmissions: Submission[] = [
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    title: "Ammaia - Tipe Heliconia",
    group: "BSD Sinarmas Land",
    date: "15/07/2025",
    status: "Disetujui",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
    title: "The Nove - Tipe Coral",
    group: "Citraland Group",
    date: "10/07/2025",
    status: "Ditolak",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1600585152225-3589404e4c9f?q=80&w=2070&auto=format&fit=crop",
    title: "Zeva - Tipe Agate",
    group: "Summarecon Serpong",
    date: "01/06/2025",
    status: "Ditolak",
  },
];

interface PengajuanCardProps extends Submission {}

const PengajuanCard: React.FC<PengajuanCardProps> = ({
  imageUrl,
  title,
  group,
  date,
  status,
}) => {
  const getStatusClass = (status: Status) => {
    switch (status) {
      case "Disetujui":
        return "status-disetujui";
      case "Ditolak":
        return "status-ditolak";
      case "Diproses":
      default:
        return "status-diproses";
    }
  };

  return (
    <div className="pengajuan-card">
      <img src={imageUrl} alt={title} className="card-image" />
      <div className="card-info">
        <h3>{title}</h3>
        <p className="card-group">{group}</p>
        <p className="card-date">🗓️ {date}</p>
      </div>
      <div className={`status-badge ${getStatusClass(status)}`}>{status}</div>
    </div>
  );
};

const RiwayatPengajuanPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dalam-proses" | "selesai">(
    "dalam-proses"
  );
  const submissionsToDisplay =
    activeTab === "dalam-proses" ? inProcessSubmissions : completedSubmissions;

  return (
    <>
      <style>{`
        .riwayat-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #f8f9fa;
          border-radius: 12px;
        }
        .riwayat-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1.5rem;
        }
        .tabs-container {
          display: flex;
          background-color: #e9ecef;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 1.5rem;
        }
        .tab-button {
          flex: 1;
          padding: 0.6rem 1rem;
          border: none;
          background-color: transparent;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #6c757d;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .tab-button.active {
          background-color: #30A5A2;
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .list-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .pengajuan-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background-color: #ffffff;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pengajuan-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }
        .card-image {
          width: 110px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .card-info {
          flex-grow: 1;
        }
        .card-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          color: #212529;
        }
        .card-info .card-group {
          margin: 0 0 0.5rem 0;
          font-size: 0.85rem;
          color: #6c757d;
        }
        .card-info .card-date {
          margin: 0;
          font-size: 0.85rem;
          color: #495057;
        }
        .status-badge {
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #fff;
          white-space: nowrap;
        }
        .status-diproses {
          background-color: #17a2b8;
        }
        .status-disetujui {
          background-color: #28a745;
        }
        .status-ditolak {
          background-color: #dc3545;
        }
      `}</style>

      <div className="riwayat-container">
        <h2 className="riwayat-title">Riwayat Pengajuan</h2>
        <div className="tabs-container">
          <button
            className={`tab-button ${
              activeTab === "dalam-proses" ? "active" : ""
            }`}
            onClick={() => setActiveTab("dalam-proses")}
          >
            Dalam Proses
          </button>
          <button
            className={`tab-button ${activeTab === "selesai" ? "active" : ""}`}
            onClick={() => setActiveTab("selesai")}
          >
            Selesai
          </button>
        </div>
        <div className="list-content">
          {submissionsToDisplay.length > 0 ? (
            submissionsToDisplay.map((submission) => (
              <PengajuanCard key={submission.id} {...submission} />
            ))
          ) : (
            <p>Tidak ada data untuk ditampilkan.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default RiwayatPengajuanPage;
