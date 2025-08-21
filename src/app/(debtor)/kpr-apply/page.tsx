import { ButtonCTA } from "./_components/ButtonCTA";
import { DocumentChecklist } from "./_components/DocumentChecklist";
import { StepCard } from "./_components/StepCard";

const steps = [
  {
    number: 1,
    title: "Informasi Pengajuan",
    description: "Berisi informasi properti dan pinjaman.",
  },
  {
    number: 2,
    title: "Informasi Nasabah",
    description: "Berisi detail identitas diri Anda.",
  },
  {
    number: 3,
    title: "Informasi Pasangan",
    description: "Berisi detail identitas pasangan Anda.",
  },
  {
    number: 4,
    title: "Informasi Pekerjaan",
    description: "Berisi detail pekerjaan Anda.",
  },
  {
    number: 5,
    title: "Unggah Dokumen",
    description:
      "Mengunggah dokumen yang diperlukan untuk melengkapi pengajuan Anda.",
  },
];

export default function KprApplyPage() {
  return (
    <>
      <div className="bg-gradient-to-b mt-[-48px] from-[rgb(32,197,181)] to-[#009688] text-white rounded-b-[50px] sm:rounded-b-[80px] pt-12 sm:pt-16 pb-32">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold">Pengajuan KPR</h1>
            <p className="text-lg mt-2 opacity-90">
              Proses Mudah Dalam 5 Langkah
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="max-w-5xl mx-auto px-4 -mt-24 sm:-mt-28 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step) => (
              <StepCard
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <DocumentChecklist />

              <div className="mt-8 text-center">
                <ButtonCTA />

                <p className="text-gray-500 text-sm mt-4">
                  Pengisian membutuhkan waktu 5-10 menit
                </p>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}
