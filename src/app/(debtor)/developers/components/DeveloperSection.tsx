// import Link from "next/link";
// import { Developer } from "@/types/developer";
// import React from "react";
// import PropertyCard from "./PropertyCard";

// interface DeveloperSectionProps {
//   developer: Developer;
// }

// const DeveloperSection: React.FC<DeveloperSectionProps> = ({ developer }) => {
//   return (
//     // Add margin-bottom here to create space before the next developer
//     <section className="mb-16">
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex items-center gap-3">
//           <h2 className="text-2xl font-bold text-gray-800">{developer.name}</h2>
//         </div>

//         <Link
//           href={`/developers/${developer.id}`}
//           className="text-teal-600 font-semibold hover:underline"
//         >
//           Lihat lebih lengkap
//         </Link>
//       </div>

//       <p className="text-gray-600 mb-6">{developer.description}</p>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {developer.properties.map((property) => (
//           <PropertyCard
//             key={property.id}
//             property={property}
//             developerId={developer.id}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default DeveloperSection;
