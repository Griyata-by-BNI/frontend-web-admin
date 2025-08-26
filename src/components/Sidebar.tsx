"use client";

import React, { useEffect, useMemo, useState } from "react";
import { App, Drawer } from "antd";
import {
  BarChart3,
  HousePlus,
  LogOut,
  Users,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const adminMenuItems: MenuItem[] = [
  { label: "Sales Management", href: "/admin/sales-management", icon: Users },
  {
    label: "Developer Management",
    href: "/admin/developer-management",
    icon: HousePlus,
  },
];

const salesMenuItems: MenuItem[] = [
  { label: "Approval List", href: "/sales/approval-list", icon: BarChart3 },
];

const getInitials = (name?: string) =>
  (name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "AD";

type SidebarProps = {
  type?: "sales" | "admin";
  showMobileToggle?: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({
  type = "admin",
  showMobileToggle = true,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { modal } = App.useApp();
  const [open, setOpen] = useState(false);

  const items = useMemo<MenuItem[]>(
    () => (type === "sales" ? salesMenuItems : adminMenuItems),
    [type]
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  const NavLinks = () => (
    <nav
      className="mt-6 space-y-2 flex-1"
      role="navigation"
      aria-label="Sidebar"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        const base =
          "flex items-center px-6 py-4 font-medium transition-colors text-sm border-l-4";
        const activeCls =
          "!bg-primary-tosca/30 !text-white border-primary-tosca";
        const idleCls =
          "!text-white hover:!bg-dark-tosca/25 hover:!text-primary-tosca border-transparent";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${base} ${isActive ? activeCls : idleCls}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            <Icon className="w-5 h-5 mr-3 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const HeaderUser = () => (
    <>
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
    </>
  );

  const FooterLogout = () => (
    <button
      className="text-sm flex items-center w-max cursor-pointer mx-6 my-8 font-medium text-red-500 hover:text-red-700 transition-colors"
      type="button"
      aria-label="Logout"
      onClick={handleLogout}
    >
      <LogOut className="w-5 h-5 mr-3" />
      Logout
    </button>
  );

  return (
    <>
      {/* Toggle (mobile) */}
      {showMobileToggle && (
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() => setOpen(true)}
          className="md:hidden fixed z-40 top-4 left-4 inline-flex items-center justify-center rounded-xl bg-primary-black/90 text-white p-2 shadow-lg ring-1 ring-white/10"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-primary-black h-[100dvh] text-white flex-col sticky top-0">
        <HeaderUser />
        <NavLinks />
        <FooterLogout />
      </aside>

      {/* Mobile drawer with custom X button */}
      <Drawer
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
        width="80%"
        rootClassName="md:hidden"
        closeIcon={null}
        closable={false}
        styles={{
          body: { padding: 0, background: "transparent" },
          content: { background: "transparent", boxShadow: "none" },
          wrapper: { insetInlineStart: 0 },
        }}
      >
        <div className="bg-primary-black text-white h-[100dvh] flex flex-col pt-safe relative">
          {/* X close button */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 p-2 ring-1 ring-white/15"
          >
            <X className="w-5 h-5" />
          </button>

          <HeaderUser />
          <NavLinks />
          <FooterLogout />
        </div>
      </Drawer>
    </>
  );
};

export default Sidebar;
