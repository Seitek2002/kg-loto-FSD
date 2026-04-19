import { CheckLotteryWidget } from "@/widgets/CheckLottery";
import { DrawLotteriesWidget } from "@/widgets/DrawLotteries";
import { FAQWidget } from "@/widgets/FAQ";
import { HeroWidget } from "@/widgets/Hero";
import { PopularTicketsWidget } from "@/widgets/PopularTickets";

export const metadata = {
  title: "KGLOTO | Главная",
  description: "Покупайте билеты и выигрывайте призы!",
};

export default function Home() {
  return (
    <>
      <HeroWidget />

      <div className="mt-10 max-w-300 mx-auto px-4">
        <PopularTicketsWidget />
        <CheckLotteryWidget />
        <DrawLotteriesWidget />

        <FAQWidget />
      </div>

      <div className="h-8" />
    </>
  );
}
