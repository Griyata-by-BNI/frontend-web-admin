import { KPRSimulator } from "@/components/kpr-simulator";
import { Button } from "antd";

export default function SimulasiKPR() {
  return (
    <>
      <p className="text-3xl mb-1 font-bold text-primary-black self-start">
        Simulasi KPR
      </p>

      <p className="text-lg mb-8 text-primary-black self-start">
        Dapatkan estimasi angsuran KPR Anda secara cepat dan mudah!
      </p>

      <KPRSimulator />
    </>
  );
}
