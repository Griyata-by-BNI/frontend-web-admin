import { KPRSimulator } from "@/components/kpr-simulator";

export default function SimulasiKPR() {
  return (
    <>
      <p className="text-3xl mb-1 font-bold text-primary-black">Simulasi KPR</p>

      <p className="text-lg mb-8 text-primary-black">
        Dapatkan estimasi angsuran KPR Anda secara cepat dan mudah!
      </p>

      <KPRSimulator />
    </>
  );
}
