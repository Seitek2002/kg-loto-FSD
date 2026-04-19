import { Metadata } from "next";

import { LanguageClient } from "./LanguageClient";

export const metadata: Metadata = {
  title: "KGLOTO | Язык",
};

export default function LanguagePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik pb-24">
      <div className="max-w-[600px] mx-auto pt-6 px-4">
        <LanguageClient />
      </div>
    </div>
  );
}
