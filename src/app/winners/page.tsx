import { Metadata } from "next";

import { WinnersListContent } from "./WinnersListContent";

export const metadata: Metadata = {
  title: "KGLOTO | Победители",
  description: "История победителей лотереи",
};

export default function WinnersPage() {
  return <WinnersListContent />;
}
