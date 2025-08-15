import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
      
      {/* Footer */}
      <footer className="bg-teal-500 text-white py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white mb-1">Butuh Informasi Lebih Lanjut?</p>
          <h3 className="text-xl font-bold text-white">BNI Call - 1500046</h3>
        </div>
      </footer>
    </div>
  );
}