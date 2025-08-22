interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function TabButton({
  isActive,
  onClick,
  children,
}: TabButtonProps) {
  const baseClasses = "flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none";
  const activeClasses = "bg-teal-600 text-white shadow-md";
  const inactiveClasses = "text-gray-500 hover:text-gray-800";
  
  return (
    <button
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
