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
  return (
    <button
      className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-300 focus:outline-none ${
        isActive
          ? "bg-teal-600 text-white shadow-md"
          : "text-gray-500 hover:text-gray-800"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
