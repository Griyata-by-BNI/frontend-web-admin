"use client";

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="!bg-light-tosca">{children}</div>;
}
