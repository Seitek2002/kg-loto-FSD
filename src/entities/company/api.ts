import api from "@/shared/api/apiClient";

export interface AboutCompanyData {
  id: number;
  title: string;
  shortText: string;
  content: string;
  image: string | null;
  createdAt: string;
}

export const getAboutCompanyData = async (
  locale: string = "ru",
): Promise<AboutCompanyData | null> => {
  try {
    const { data } = await api.get("/about-company/", {
      headers: { "Accept-Language": locale },
    });
    // Если бэкенд возвращает сразу объект, берем data.data
    // Если массив, берем data.data[0]
    return Array.isArray(data.data) ? data.data[0] : data.data;
  } catch (error) {
    console.error("About Company Error:", error);

    // Моковые данные на случай падения бэкенда
    return {
      id: 1,
      title: "О компании KGLOTO",
      shortText: "Первый маркетплейс лотерейных билетов",
      content:
        "<p>KGLOTO — это инновационная платформа для проведения честных и прозрачных тиражных лотерей.</p><h2>Наши преимущества</h2><ul><li>Мгновенные выплаты</li><li>Крупные джекпоты</li><li>Государственная лицензия</li></ul>",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
      createdAt: new Date().toISOString(),
    };
  }
};
