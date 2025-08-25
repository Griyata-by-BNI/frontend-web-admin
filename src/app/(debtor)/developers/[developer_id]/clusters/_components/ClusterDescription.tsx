interface ClusterDescriptionProps {
  description: string;
}

export default function ClusterDescription({ description }: ClusterDescriptionProps) {
  return (
    <div className="rounded-2xl border border-gray-200 shadow-lg shadow-gray-500/10 bg-white p-5 md:p-6 mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
        Deskripsi
      </h2>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}