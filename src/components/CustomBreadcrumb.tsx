"use client";

import Link from "next/link";
import * as React from "react";

export type BreadcrumbItem = {
  label: React.ReactNode;
  href?: string;
};

type CustomBreadcrumbProps = {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
};

export function CustomBreadcrumb({
  items,
  separator = "/",
  className = "",
}: CustomBreadcrumbProps) {
  if (!items?.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm text-gray-500 ${className}`}
    >
      <ol className="flex flex-wrap items-center">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const content =
            item.href && !isLast ? (
              <Link
                href={item.href}
                className="!text-gray-500 hover:!text-primary-purple"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? "page" : undefined}
                className={isLast ? "text-primary-tosca font-semibold" : ""}
              >
                {item.label}
              </span>
            );

          return (
            <li key={idx} className="flex items-center">
              {content}
              {!isLast && <span className="mx-2">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
