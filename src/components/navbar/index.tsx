"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Dropdown, MenuProps } from "antd";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Partner Developer", href: "/developers" },
  { label: "Info KPR", href: "/info-kpr" },
];

const kprItems: NavItem[] = [
  { label: "Simulasi Angsuran", href: "/kpr-simulator" },
  { label: "Cek Kemampuan KPR", href: "/kpr-affordability" },
];

const Navbar = () => {
  const pathname = usePathname();

  const kprMenuItems: MenuProps["items"] = kprItems.map((item) => ({
    key: item.href,
    className: pathname.startsWith(item.href) ? "bg-gray-50" : "",
    label: (
      <Link
        href={item.href}
        className={clsx(
          {
            "!text-primary-tosca font-semibold": pathname.startsWith(item.href),
            "text-primary-black": !pathname.startsWith(item.href),
          },
          "block py-1 hover:text-primary-tosca transition-colors duration-300"
        )}
      >
        {item.label}
      </Link>
    ),
  }));

  return (
    <header className="bg-white shadow-md shadow-dark-tosca/5 sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-griyata.png"
              alt="Griyata Logo"
              width={80}
              height={35}
              priority
            />
          </Link>
        </div>

        <div className="md:flex justify-center items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={clsx(
                  {
                    "text-primary-tosca": isActive,
                    "text-primary-black": !isActive,
                  },
                  "hidden md:block font-semibold hover:text-primary-tosca transition-colors duration-300 text-md"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="hidden md:block">
            <Dropdown menu={{ items: kprMenuItems }} placement="bottomRight">
              <button
                className={clsx(
                  {
                    "text-primary-tosca": kprItems.some((item) =>
                      pathname.startsWith(item.href)
                    ),
                    "text-primary-black": !kprItems.some((item) =>
                      pathname.startsWith(item.href)
                    ),
                  },
                  "font-semibold hover:text-primary-tosca transition-colors duration-300 text-md flex items-center gap-1"
                )}
              >
                Simulasi KPR
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </Dropdown>
          </div>

          <div className="flex-shrink-0">
            <Link href="/login">
              <button
                className="bg-primary-black text-white font-semibold py-1 px-6 rounded-full hover:bg-indigo-800 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                aria-label="Login"
              >
                Login
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
