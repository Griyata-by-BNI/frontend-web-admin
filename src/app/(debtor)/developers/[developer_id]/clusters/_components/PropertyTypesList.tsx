import PropertyTypeItem from "./PropertyTypeItem";

interface PropertyTypesListProps {
  propertyTypes: any[];
  clusterDetail: any;
}

export default function PropertyTypesList({
  propertyTypes,
  clusterDetail,
}: PropertyTypesListProps) {
  if (!propertyTypes?.length) return null;

  return (
    <section
      id="tipe"
      className="mb-8 bg-white p-6 rounded-2xl shadow-lg shadow-gray-500/10 border border-gray-200"
    >
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Tipe Properti
        </h2>
      </div>

      <div className="space-y-6">
        {propertyTypes.map((type) => (
          <PropertyTypeItem
            key={type.id}
            type={type}
            clusterDetail={clusterDetail}
          />
        ))}
      </div>
    </section>
  );
}