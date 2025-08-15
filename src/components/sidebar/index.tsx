"use client";

import { BarChart3, HousePlus, LogOut, PieChart, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Sales Dashboard",
    href: "/admin/sales-report",
    icon: BarChart3,
  },
  {
    label: "Sales Management",
    href: "/admin/sales-management",
    icon: Users,
  },
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

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-primary-black h-screen flex flex-col">
      <div className="pt-8 px-6 pb-2">
        <Image
          src="/logo-griyata-white.png"
          width={120}
          height={30}
          alt="logo"
        />
      </div>

      <nav className="mt-6 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-4 font-medium transition-colors text-sm ${
                isActive
                  ? "bg-primary-tosca/30 text-white border-l-4 border-primary-tosca"
                  : "text-white hover:bg-dark-tosca/25 hover:text-primary-tosca border-l-4 border-transparent"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />

              {item.label}
            </Link>
          );
        })}
      </nav>

      <button className="text-sm flex items-center w-max cursor-pointer mx-6 my-8 font-medium text-red-500 hover:text-red-700 transition-colors">
        <LogOut className="w-5 h-5 mr-3" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
