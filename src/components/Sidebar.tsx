"use client";

import { useAuth } from "@/contexts/authContext";
import { App } from "antd";
import { BarChart3, HousePlus, LogOut, PieChart, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Sales Dashboard", href: "/admin/sales-report", icon: BarChart3 },
  { label: "Sales Management", href: "/admin/sales-management", icon: Users },
  {
    label: "Developer Dashboard",
    href: "/admin/developer-report",
    icon: PieChart,
  },
  {
    label: "Developer Management",
    href: "/admin/developer-management",
    icon: HousePlus,
  },
];

const salesMenuItems = [
  { label: "Approval List", href: "/sales/approval-list", icon: BarChart3 },
];

const getInitials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "AD";

const Sidebar = ({ type = "admin" }: { type?: "sales" | "admin" }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { modal } = App.useApp();

  const handleLogout = () => {
    modal.confirm({
      icon: <></>,
      title: "Konfirmasi Logout",
      content: "Apakah Anda yakin ingin keluar dari aplikasi?",
      okText: "Logout",
      okType: "danger",
      cancelText: "Batal",
      onOk: () => logout(),
    });
  };

  const items = type === "sales" ? salesMenuItems : menuItems;

  return (
    <aside className="w-64 bg-primary-black h-screen text-white flex flex-col">
      <p className="px-4 py-6 font-semibold text-white capitalize">
        {type} Dashboard
      </p>

      <div className="h-px bg-white/10 mx-4" />

      <div className="px-4 py-4 flex items-center gap-3">
        <div className="size-10 rounded-full bg-primary-tosca/20 flex items-center justify-center font-semibold">
          {getInitials(user?.fullName)}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight truncate">
            {user?.fullName ?? "Administrator"}
          </p>
          <p className="text-xs text-white/60 truncate">{user?.email ?? "—"}</p>
        </div>
      </div>

      <div className="h-px bg-white/10 mx-4" />

      {/* Menu (kembali ke gaya lama) */}
      <nav className="mt-6 space-y-2 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-4 font-medium transition-colors text-sm ${
                isActive
                  ? "!bg-primary-tosca/30 !text-white border-l-4 border-primary-tosca"
                  : "!text-white hover:!bg-dark-tosca/25 hover:!text-primary-tosca border-l-4 border-transparent"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout (tetap sederhana) */}
      <button
        className="text-sm flex items-center w-max cursor-pointer mx-6 my-8 font-medium text-red-500 hover:text-red-700 transition-colors"
        type="button"
        aria-label="Logout"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5 mr-3" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
