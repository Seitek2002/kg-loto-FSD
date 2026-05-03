export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] font-rubik pb-20 overflow-hidden">
      <div className="max-w-360 mx-auto px-4 pt-6 animate-pulse">
        {/* 1. Хлебные крошки (Breadcrumbs) Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-16 h-4 bg-gray-200 rounded" />
          <div className="w-2 h-4 bg-gray-200 rounded" />
          <div className="w-32 h-4 bg-gray-200 rounded" />
          <div className="w-2 h-4 bg-gray-200 rounded" />
          <div className="w-28 h-4 bg-gray-300 rounded" />
        </div>

        {/* 2. Блок Hero (Картинка, Джекпот, Таймер) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-6">
          {/* Левая часть (Фон, Логотип, Джекпот, Вкладки) */}
          <div className="lg:col-span-2 relative min-h-65 sm:min-h-87.5 lg:min-h-105 bg-gray-200 rounded-3xl lg:rounded-4xl flex flex-col justify-between shadow-sm p-4 sm:p-8 lg:p-16">
            <div>
              {/* Логотип */}
              <div className="w-25 h-18.75 sm:h-25 bg-gray-300 rounded-2xl mb-4" />
              {/* Текст "Суперприз от" */}
              <div className="w-32 h-4 sm:h-5 bg-gray-300 rounded mb-2" />
              {/* Сумма джекпота */}
              <div className="w-48 sm:w-64 h-10 sm:h-16 bg-gray-300 rounded" />
            </div>
            {/* Блок вкладок */}
            <div className="h-12 bg-gray-300 rounded-[14px] w-full mt-8" />
          </div>

          {/* Правая часть (Инфо о тираже + Таймер) */}
          <div className="flex flex-col gap-4 lg:gap-6">
            {/* Инфо о тираже */}
            <div className="bg-white rounded-3xl lg:rounded-4xl p-6 lg:p-8 shadow-sm flex flex-col justify-center flex-1">
              <div className="h-6 lg:h-8 w-3/4 mx-auto bg-gray-200 rounded mb-6" />
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="w-20 h-4 bg-gray-100 rounded" />
                    <div className="w-24 h-4 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Таймер */}
            <div className="h-32.5 sm:h-37.5 lg:h-45 bg-gray-200 rounded-3xl lg:rounded-4xl shadow-sm" />
          </div>
        </div>

        {/* 3. Сетка билетов (Tickets Grid) */}
        <div className="mt-12 lg:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-3xl shadow-sm" />
            ))}
          </div>

          {/* 4. Слайдер победителей (Winners Slider) */}
          <div className="mt-10 lg:mt-16">
            <div className="w-52 h-8 bg-gray-200 rounded-xl mb-6" />
            <div className="flex gap-4 md:gap-6 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-65 md:min-w-[320px] h-85 bg-white border border-gray-100 rounded-3xl p-5 flex flex-col shrink-0"
                >
                  <div className="w-full h-40 bg-gray-200 rounded-2xl mb-4" />
                  <div className="w-2/3 h-6 bg-gray-200 rounded-md mb-2" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded-md mb-auto" />
                  <div className="w-full h-12 bg-gray-200 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
