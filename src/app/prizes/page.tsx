import { Metadata } from "next";

import { PrizesClient } from "./PrizesClient";

export const metadata: Metadata = {
  title: "KGLOTO | Мои призы",
};

export default function PrizesPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik pt-6 pb-24">
      <div className="max-w-250 mx-auto">
        <PrizesClient />
      </div>
    </div>
  );
}
