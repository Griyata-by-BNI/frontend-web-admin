"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Partner Developer", href: "/developers" },
  { label: "Info KPR", href: "/info-kpr" },
  { label: "Simulasi KPR", href: "/simulasi-kpr" },
  { label: "Cek Kemampuan KPRmu", href: "/kemampuan-kpr" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-griyata.png"
              alt="Griyata Logo"
              width={130}
              height={35}
              priority
            />
          </Link>
        </div>

        <div className="md:flex justify-center items-center space-x-12">
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
                  "hidden md:block font-semibold hover:text-primary-tosca transition-colors duration-300"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="flex-shrink-0">
            <Link href="/login">
              <button
                className="bg-primary-black text-white font-semibold py-2 px-6 rounded-full hover:bg-indigo-800 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
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
