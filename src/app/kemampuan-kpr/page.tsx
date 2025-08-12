import { KPRAffordability } from "@/components/kpr-affordability";

export default function KemampuanKPRPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-black mb-4">
          Cek Kemampuan KPR
        </h1>
        <p className="text-gray-600">
          Temukan harga rumah yang sesuai dengan kemampuan finansial Anda
        </p>
      </div>
      
      <KPRAffordability />
    </div>
  );
}