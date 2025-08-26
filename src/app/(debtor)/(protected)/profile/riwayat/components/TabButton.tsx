interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}

export default function TabButton({
  isActive,
  onClick,
  children,
  count,
}: TabButtonProps) {
  const baseClasses = "flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2";
  const activeClasses = "bg-teal-600 text-white shadow-lg transform scale-[0.98]";
  const inactiveClasses = "text-gray-600 hover:text-gray-900 hover:bg-gray-50";
  
  return (
    <button
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center gap-2">
        {children}
        {count !== undefined && count > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            isActive 
              ? "bg-white/20 text-white" 
              : "bg-teal-100 text-teal-700"
          }`}>
            {count}
          </span>
        )}
      </div>
    </button>
  );
}
