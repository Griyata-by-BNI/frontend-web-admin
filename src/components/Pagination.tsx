"use client";

import { useState } from 'react';

// Ganti dengan logic pagination yang sesungguhnya jika diperlukan
const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      <button className="p-2 rounded-md hover:bg-gray-200" disabled={currentPage === 1}>
        &lt;
      </button>
      
      {[1, 2, 3, 4].map(page => (
        <button 
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-teal-600 text-white' : 'hover:bg-gray-200'}`}
        >
          {page}
        </button>
      ))}

      <span className="px-4 py-2">...</span>
      
      <button 
        onClick={() => setCurrentPage(totalPages)}
        className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-teal-600 text-white' : 'hover:bg-gray-200'}`}
      >
        {totalPages}
      </button>

      <button className="p-2 rounded-md hover:bg-gray-200" disabled={currentPage === totalPages}>
        &gt;
      </button>
    </nav>
  );
}

export default Pagination;