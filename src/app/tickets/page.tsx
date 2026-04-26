import { Metadata } from "next";

import { TicketsClient } from "./TicketsClient";

export const metadata: Metadata = {
  title: "KGLOTO | Мои билеты",
};

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik pt-6 pb-24">
      <div className="max-w-250 mx-auto">
        <TicketsClient />
      </div>
    </div>
  );
}
