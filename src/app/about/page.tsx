import { Metadata } from "next";
import { cookies } from "next/headers";

import { getAboutCompanyData } from "@/entities/company/api";

import { AboutClient } from "./AboutClient";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "ru";

  const aboutData = await getAboutCompanyData(locale);
  const pageTitle = aboutData?.title || "О компании";

  return {
    title: `${pageTitle} | KGLOTO`,
    description:
      aboutData?.shortText || "Первый маркетплейс лотерейных билетов",
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
