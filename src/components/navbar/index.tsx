"use client";

import { useAuth } from "@/contexts/authContext";
import { DownOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { App, Avatar, Dropdown, MenuProps, Skeleton, Typography } from "antd";
import clsx from "clsx";
import { LogOut, User2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile } from "@/services";
import { kprItems, navItems } from "./constants";
import { NavItem } from "./types";

const useIsActive = (pathname: string) => {
  return (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);
};

const NavLink = ({
  item,
  isActive,
  className = "",
}: {
  item: NavItem;
  isActive: boolean;
  className?: string;
}) => (
  <Link
    href={item.href}
    className={clsx(
      isActive
        ? "!text-primary-tosca hover:!text-dark-tosca"
        : "!text-primary-black hover:!text-dark-tosca",
      "font-semibold transition-colors duration-300",
      className
    )}
  >
    {item.label}
  </Link>
);

const LoginButton = ({ className = "" }: { className?: string }) => {
  const { modal } = App.useApp();
  const { user, token, loading, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.userId],
    queryFn: () => fetchProfile(user!.userId, token!),
    enabled: !!user?.userId && !!token,
  });

  const profilePicture = profile?.photoUrl || null;
  const displayName = profile?.name || user?.fullName || "";

  useEffect(() => {
    const handleProfileUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.userId] });
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, [user?.userId, queryClient]);

  const menuItems = [
    {
      key: "profile",
      label: <Link href="/profile">Profile</Link>,
      icon: <User2 className="w-4 h-4" />,
    },
    { type: "divider" as const },
    {
      key: "logout",
      label: "Logout",
      danger: true,
      icon: <LogOut className="w-4 h-4" />,
      onClick: () => {
        modal.confirm({
          icon: <></>,
          title: "Konfirmasi Logout",
          content: "Apakah Anda yakin ingin keluar dari aplikasi?",
          okText: "Logout",
          okType: "danger",
          cancelText: "Batal",
          onOk: () => logout(),
        });
      },
    },
  ];

  if (loading) {
    return <Skeleton.Button active className={"!w-40"} />;
  }

  if (user) {
    return (
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <div
          className={`flex items-center gap-2 cursor-pointer rounded-full px-3 py-1 hover:bg-gray-100 transition ${className}`}
        >
          <Avatar
            size="small"
            src={profilePicture}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#30a5a2" }}
          />

          <Typography.Text className="font-medium text-primary-black">
            {displayName || user.fullName}
          </Typography.Text>

          <DownOutlined />
        </div>
      </Dropdown>
    );
  }

  return (
    <Link href="/login">
      <button
        className={`bg-primary-black text-white font-semibold py-1 px-6 rounded-full hover:bg-primary-tosca cursor-pointer transition-all duration-300 ease-in-out ${className}`}
      >
        Login
      </button>
    </Link>
  );
};

const Navbar = () => {
  const pathname = usePathname();
  const isActive = useIsActive(pathname);

  // NEW: deteksi scroll
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8); // threshold kecil
    onScroll(); // cek saat pertama render
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const kprMenuItems: MenuProps["items"] = kprItems.map((item) => ({
    key: item.href,
    label: (
      <NavLink
        item={item}
        isActive={isActive(item.href)}
        className="block py-1"
      />
    ),
  }));

  const mobileMenuItems: MenuProps["items"] = [
    ...navItems.map((item) => ({
      key: item.href,
      label: (
        <NavLink item={item} isActive={isActive(item.href)} className="block" />
      ),
    })),
    {
      type: "group",
      label: (
        <span className="font-semibold text-primary-black">Simulasi KPR</span>
      ),
      children: kprMenuItems,
    },
    { key: "login", label: <LoginButton className="w-full py-2" /> },
  ];

  return (
    <header
      className={clsx(
        "!p-0 sticky top-0 z-50 transition-colors duration-300",
        "bg-white",
        {
          "border-b border-gray-200 shadow-lg shadow-gray-500/10": isScrolled,
        }
      )}
    >
      <nav className="custom-container px-6 !py-4 md:px-0 md:py-5 flex !flex-row justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-griyata.png"
            alt="Griyata Logo"
            width={80}
            height={35}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isActive(item.href)}
              className="text-md"
            />
          ))}

          {/* KPR Dropdown */}
          <Dropdown menu={{ items: kprMenuItems }} placement="bottomRight">
            <button
              className={clsx(
                kprItems.some((i) => isActive(i.href))
                  ? "text-primary-tosca"
                  : "text-primary-black",
                "font-semibold hover:text-primary-tosca transition-colors duration-300 text-md flex items-center gap-1"
              )}
            >
              Simulasi KPR
              <DownOutlined />
            </button>
          </Dropdown>

          <LoginButton />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Dropdown
            menu={{ items: mobileMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <button aria-label="Toggle Menu">
              <MenuOutlined className="text-2xl text-primary-black" />
            </button>
          </Dropdown>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
