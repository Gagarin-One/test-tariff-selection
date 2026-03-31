'use client';

import { TariffCardProps } from '@/types';

export const TariffCard = ({
  tariff,
  isSelected,
  discountPercentage,
  onSelect,
  onBuy,
  isTimerEnded,
  isCheckboxAccepted,
  onCheckboxError,
}: TariffCardProps) => {
  const currentPrice = isTimerEnded ? tariff.full_price : tariff.price;
  const displayPrice = `${currentPrice} ₽`;
  const oldPrice = isTimerEnded ? undefined : tariff.full_price;

  return (
    <div
      className={`flex flex-col w-full max-w-[240px] mx-auto h-[335px] items-center gap-4 pt-[50px] sm:pt-[60px] lg:pt-[70px] pb-[26px] px-[15px] sm:px-[21px] bg-[#313637] rounded-[40px] border-2 cursor-pointer transition-all duration-300 hover:scale-105 relative ${
        isSelected
          ? 'border-accent shadow-[0_0_20px_rgba(253,176,86,0.3)]'
          : 'border-[#484d4e]'
      }`}
      onClick={() => onSelect(tariff.id)}
    >
      {/* Badge скидки */}
      {!isTimerEnded && (
        <div className="absolute top-0 left-[51px] inline-flex items-center justify-center gap-2.5 px-2 py-[5px] bg-[#fd5656] rounded-[0px_0px_8px_8px] overflow-hidden z-10">
          <div className="relative w-fit font-gilroy font-medium text-white text-[18px] sm:text-[20px] lg:text-[22px] tracking-[0] leading-[28.6px] whitespace-nowrap">
            -{discountPercentage}%
          </div>
        </div>
      )}

      <div className="inline-flex flex-col items-center gap-10 relative flex-[0_0_auto] mb-[-3.00px] ml-[-3.00px] mr-[-3.00px]">
        <div className="inline-flex flex-col items-center gap-[30px] relative flex-[0_0_auto]">
          <div className="inline-flex flex-col items-center gap-2 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] font-montserrat font-medium text-white text-[20px] sm:text-[22px] lg:text-[26px] leading-[31.2px] tracking-[0] whitespace-nowrap">
              {tariff.period}
            </div>
          </div>

          <div className="inline-flex flex-col items-end relative flex-[0_0_auto]">
            <div
              className={`relative w-fit mt-[-1.00px] font-montserrat font-semibold text-[36px] sm:text-[40px] lg:text-[50px] tracking-[0] leading-[50px] whitespace-nowrap transition-colors duration-300 ${
                isSelected ? 'text-accent' : 'text-white'
              }`}
            >
              {displayPrice}
            </div>

            {!isTimerEnded && oldPrice && (
              <div className="relative w-[75px] sm:w-[85px] h-[29px] mr-[-2.00px]">
                <div className="absolute top-0 left-[calc(50.00%_-_42px)] font-montserrat font-normal text-[#919191] text-xl sm:text-2xl leading-[28.8px] tracking-[0] whitespace-nowrap">
                  {oldPrice} ₽
                </div>
                <div className="absolute top-[13px] left-0 w-[73px] sm:w-[83px] h-0.5 bg-[#919191] transform rotate-[-3deg]" />
              </div>
            )}
          </div>
        </div>

        <div className="inline-flex items-start justify-start gap-2.5 px-0 py-2.5 relative flex-[0_0_auto] w-full">
          <div className="w-full max-w-[204px] font-montserrat font-normal text-white text-sm sm:text-base leading-[20.8px] relative mt-[-1.00px] tracking-[0] text-left">
            {tariff.text}
          </div>
        </div>
      </div>

      {/* Badge "хит!" */}
      {tariff.is_best && (
        <div className="absolute top-2.5 right-2.5 font-montserrat font-medium text-accent text-[18px] sm:text-[20px] lg:text-[22px] tracking-[0.66px] leading-[28.6px] whitespace-nowrap z-10">
          хит!
        </div>
      )}
    </div>
  );
};