"use client";

import { useFAQ } from "@/entities/faq/api";

import { Description } from "@/shared/ui/Description";
import { FAQItem } from "@/shared/ui/FAQItem";
import { Skeleton } from "@/shared/ui/Skeleton";
import { Title } from "@/shared/ui/Title";

export const FAQWidget = () => {
  const { data: questions, isLoading } = useFAQ();

  if (isLoading) {
    return (
      <section className="my-12" id="faq">
        <div className="mb-8">
          <Skeleton className="w-1/3 h-8 mb-4" />
          <Skeleton className="w-1/2 h-5" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Рендерим 4 скелетона для имитации загрузки аккордеонов */}
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="w-full h-18 rounded-3xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!questions || questions.length === 0) return null;

  return (
    <section className="my-12" id="faq">
      <div className="mb-8">
        <Title>
          Часто задаваемые <br /> вопросы
        </Title>
        <Description>Ответы на самые популярные вопросы</Description>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {questions.map((item) => (
          <FAQItem
            key={item.id}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </section>
  );
};
