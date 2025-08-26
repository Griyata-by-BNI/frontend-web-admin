"use client";

import React, { useCallback, useEffect } from "react";
import { Clock, Star, Shield, LogOut, Edit, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "@/services";
import { App } from "antd";

// =====================
// Types
// =====================
interface UserData {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

// =====================
// Skeleton
// =====================
const ProfileSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-6 shadow-sm animate-pulse">
    <div className="flex items-center gap-4">
      <div className="size-16 rounded-full bg-gray-200" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-40" />
        <div className="h-4 bg-gray-200 rounded w-60" />
      </div>
    </div>
  </div>
);

// =====================
// Avatar
// =====================
const Avatar: React.FC<{ user?: UserData }> = ({ user }) => {
  const getInitials = (name?: string): string =>
    (name ?? "U")
      .split(" ")
      .map((w) => w.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div
      className="size-16 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600 grid place-items-center text-white"
      aria-label="User avatar"
    >
      {user?.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatar}
          alt={`${user.name || "User"} avatar`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="font-semibold text-lg">{getInitials(user?.name)}</span>
      )}
    </div>
  );
};

// =====================
// Profile Card
// =====================
const ProfileCard: React.FC<{
  user?: UserData;
  onEditProfile?: () => void;
}> = ({ user, onEditProfile }) => {
  return (
    <div className="rounded-2xl border border-teal-100/60 bg-white/80 backdrop-blur p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar user={user} />
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900 truncate">
              {user?.name || "-"}
            </h2>
            <p className="text-teal-700/90 truncate">{user?.email || "-"}</p>
            {user?.phone && (
              <p className="text-sm text-gray-500 mt-0.5">{user.phone}</p>
            )}
          </div>
        </div>

        <button
          onClick={onEditProfile}
          className="p-2.5 rounded-full border border-teal-100 text-teal-700 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          aria-label="Edit profil"
          title="Edit profil"
        >
          <Edit className="size-5" />
        </button>
      </div>
    </div>
  );
};

// =====================
// List Item (Menu)
// =====================
const MenuItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}> = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/40 transition-colors group text-left"
  >
    <div className="size-12 rounded-full bg-teal-50 grid place-items-center group-hover:bg-teal-100 transition-colors">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-gray-800 group-hover:text-teal-700">
        {title}
      </h3>
    </div>
    <ChevronRight className="size-5 text-gray-400 group-hover:text-teal-700" />
  </button>
);

// =====================
// Logout Button
// =====================
const LogoutButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-3.5 shadow-sm hover:shadow-md hover:from-teal-600 hover:to-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
  >
    <span className="inline-flex items-center gap-2">
      <LogOut className="size-5" />
      Keluar Akun
    </span>
  </button>
);

// =====================
// Footer & Version
// =====================
const Footer: React.FC = () => (
  <div className="rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-center py-5">
    <p className="text-sm/5 opacity-90">Butuh Informasi Lebih Lanjut?</p>
    <p className="text-lg font-bold tracking-wide">BNI Call — 1500046</p>
  </div>
);

const VersionInfo: React.FC = () => (
  <p className="text-center text-sm text-gray-400">Griyata by BNI — v1.0.0</p>
);

// =====================
// MAIN
// =====================
const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { modal } = App.useApp();
  const { user: savedData, token, logout } = useAuth();

  // Hindari redirect server di client component
  useEffect(() => {
    if (!savedData) router.replace("/");
  }, [savedData, router]);

  const {
    data: profile,
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["profile", savedData?.userId],
    queryFn: () => fetchProfile(savedData!.userId, token!),
    enabled: !!savedData?.userId && !!token,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const profileData: UserData | undefined = profile
    ? {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.photoUrl,
      }
    : undefined;

  // Handlers
  const handleEditProfile = useCallback(() => {
    router.push("/profile/edit");
  }, [router]);

  const handleHistoryClick = useCallback(() => {
    router.push("/profile/riwayat");
  }, [router]);

  const handlePolicyClick = useCallback(() => {
    router.push("/profile/policy");
  }, [router]);

  const handleFavoriteClick = useCallback(() => {
    router.push("/favorite");
  }, [router]);

  const handleLogout = useCallback(() => {
    modal.confirm({
      title: "Konfirmasi Logout",
      icon: <></>,
      content: "Apakah Anda yakin ingin keluar dari Aplikasi?",
      okText: "Keluar",
      cancelText: "Batal",
      okButtonProps: { danger: true, type: "default" },
      onOk: async () => {
        await Promise.resolve(logout());
        router.replace("/");
      },
    });
  }, [logout, modal]);

  return (
    <div className="min-h-screen bg-light-tosca">
      {/* Hero */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600">
        {/* Wave ornament */}
        <svg
          className="absolute bottom-[-1px] left-0 w-full"
          viewBox="0 0 1440 80"
          fill="none"
          aria-hidden
        >
          <path
            d="M0 40C160 10 320 10 480 40C640 70 800 70 960 40C1120 10 1280 10 1440 40V80H0V40Z"
            fill="white"
            opacity="0.2"
          />
          <path
            d="M0 50C160 20 320 20 480 50C640 80 800 80 960 50C1120 20 1280 20 1440 50V80H0V50Z"
            fill="white"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 -mt-16 pb-10">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Profile */}
          {loading ? (
            <ProfileSkeleton />
          ) : isError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
              Gagal memuat profil. Coba muat ulang halaman.
            </div>
          ) : (
            <ProfileCard user={profileData} onEditProfile={handleEditProfile} />
          )}

          {/* Menu */}
          <section className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
            <div className="grid gap-3">
              <MenuItem
                icon={<Clock className="size-6 text-teal-700" />}
                title="Riwayat Pengajuan KPRmu"
                onClick={handleHistoryClick}
              />
              <MenuItem
                icon={<Shield className="size-6 text-teal-700" />}
                title="Kebijakan Aplikasi"
                onClick={handlePolicyClick}
              />
              <MenuItem
                icon={<Star className="size-6 text-teal-700" />}
                title="Favorit"
                onClick={handleFavoriteClick}
              />
            </div>
          </section>

          {/* Logout */}
          <LogoutButton onClick={handleLogout} />

          {/* Footer Card */}
          <Footer />

          {/* Version */}
          <VersionInfo />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
