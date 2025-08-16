import { KPRAffordability } from "./_components/KPRAffordability";

export default function KprAffordabilityPage() {
  return (
    <>
      <p className="text-3xl mb-1 font-bold text-primary-black self-start">
        Cek Kemampuan KPR
      </p>

      <p className="text-lg mb-8 text-primary-black self-start">
        Temukan harga rumah yang sesuai dengan kemampuan finansial Anda!
      </p>

      <KPRAffordability />
    </>
  );
}
