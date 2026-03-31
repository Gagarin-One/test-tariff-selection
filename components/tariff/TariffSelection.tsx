'use client';

import { useState, useEffect } from 'react';
import { Tariff } from '@/types';
import { TariffCard } from './TariffCard';
import { useTimer } from '@/hooks/useTimer';
import { fetchTariffs } from '@/services/api';

export const TariffSelection = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [selectedTariffId, setSelectedTariffId] = useState<string>('');
  const [isCheckboxAccepted, setIsCheckboxAccepted] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const { formatTime, isEnded } = useTimer(2);
  const { minutes, seconds, isBlinking } = formatTime();

  useEffect(() => {
    const loadTariffs = async () => {
      let data = await fetchTariffs();
      
      // Исправляем дублирующиеся ID на фронтенде
      data = data.map((item) => {
        if (item.period === "Навсегда") {
          return { ...item, id: `${item.id}_forever` };
        }
        return item;
      });
      
      setTariffs(data);
      const defaultTariff = data.find((t) => t.is_best);
      if (defaultTariff) {
        setSelectedTariffId(defaultTariff.id);
      } else if (data.length > 0) {
        setSelectedTariffId(data[0].id);
      }
      setIsLoading(false);
    };

    loadTariffs();
  }, []);

  // Эффект для масштабирования при ширине менее 1500px
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const maxWidth = 1920;
      const minScaleWidth = 1500;
      
      if (width < minScaleWidth) {
        const newScale = width / maxWidth;
        setScale(Math.max(0.195, Math.min(1, newScale)));
      } else {
        setScale(1);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateDiscount = (fullPrice: number, price: number) => {
    return Math.round(((fullPrice - price) / fullPrice) * 100);
  };

  const handleBuy = (tariffId: string) => {
    if (!isCheckboxAccepted) {
      setCheckboxError(true);
      setTimeout(() => setCheckboxError(false), 2000);
      return;
    }
    console.log('Buying tariff:', tariffId);
    const tariff = tariffs.find((t) => t.id === tariffId);
    alert('Покупка тарифа: ' + tariff?.period);
  };

  const handleCheckboxChange = () => {
    setIsCheckboxAccepted(!isCheckboxAccepted);
    setCheckboxError(false);
  };

  const selectedTariff = tariffs.find((t) => t.id === selectedTariffId);
  const bestTariff = tariffs.find((t) => t.is_best);
  const otherTariffs = tariffs
    .filter((t) => !t.is_best && t.id !== bestTariff?.id)
    .sort((a, b) => {
      const order: { [key: string]: number } = {
        '3 месяца': 3,
        '1 месяц': 2,
        '1 неделя': 1
      };
      return (order[b.period] || 0) - (order[a.period] || 0);
    });

  return (
    <div className="relative w-full min-h-screen bg-[#232829] overflow-x-hidden">
      {/* Timer Header - НЕ МАСШТАБИРУЕТСЯ */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="flex flex-col w-full items-center gap-1 px-2 sm:px-4 py-2 bg-[#1d5b43] transition-all duration-300">
          <div className="inline-flex items-center gap-2.5 relative flex-[0_0_auto]">
            <div className="relative w-fit font-montserrat font-semibold text-white text-sm sm:text-base md:text-xl lg:text-2xl text-center tracking-[0] leading-[31.2px] whitespace-nowrap">
              {isEnded ? 'Акция завершена!' : 'Успейте открыть пробную неделю'}
            </div>
          </div>

          {!isEnded && (
            <div className="inline-flex items-center justify-center gap-1 sm:gap-2 relative flex-[0_0_auto]">
              {/* Левая звездочка */}
              <div className="flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[12px] sm:h-[12px] w-[8px] h-[8px]">
                  <path d="M4.99781 0.463683C5.22659 -0.154582 6.10105 -0.15458 6.32983 0.463685L7.44113 3.46694C7.51306 3.66132 7.66632 3.81458 7.8607 3.8865L10.864 4.99781C11.4822 5.22659 11.4822 6.10105 10.864 6.32983L7.8607 7.44113C7.66632 7.51306 7.51306 7.66632 7.44113 7.8607L6.32983 10.864C6.10105 11.4822 5.22659 11.4822 4.99781 10.864L3.8865 7.8607C3.81458 7.66632 3.66132 7.51306 3.46694 7.44113L0.463683 6.32983C-0.154582 6.10105 -0.15458 5.22659 0.463685 4.99781L3.46694 3.8865C3.66132 3.81458 3.81458 3.66132 3.8865 3.46694L4.99781 0.463683Z" fill="#FFBB00"/>
                </svg>
              </div>
              
              <div className="inline-flex items-center gap-1 sm:gap-1.5 relative flex-[0_0_auto]">
                <div className={`relative w-fit font-raleway font-bold text-[24px] sm:text-[32px] md:text-[36px] lg:text-[40px] tracking-[0] leading-[44.0px] whitespace-nowrap transition-colors duration-300 ${
                  isBlinking ? 'text-red-500' : 'text-[#ffba00]'
                }`}>
                  {minutes}
                </div>
                <div className={`relative w-fit font-raleway font-bold text-[24px] sm:text-[32px] md:text-[36px] lg:text-[40px] tracking-[0] leading-[52.0px] whitespace-nowrap transition-colors duration-300 ${
                  isBlinking ? 'text-red-500' : 'text-[#ffba00]'
                }`}>
                  :
                </div>
                <div className={`relative w-fit font-raleway font-bold text-[24px] sm:text-[32px] md:text-[36px] lg:text-[40px] tracking-[0] leading-[44.0px] whitespace-nowrap transition-colors duration-300 ${
                  isBlinking ? 'text-red-500' : 'text-[#ffba00]'
                }`}>
                  {seconds}
                </div>
              </div>

              {/* Правая звездочка */}
              <div className="flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-[12px] sm:h-[12px] w-[8px] h-[8px]">
                  <path d="M4.99781 0.463683C5.22659 -0.154582 6.10105 -0.15458 6.32983 0.463685L7.44113 3.46694C7.51306 3.66132 7.66632 3.81458 7.8607 3.8865L10.864 4.99781C11.4822 5.22659 11.4822 6.10105 10.864 6.32983L7.8607 7.44113C7.66632 7.51306 7.51306 7.66632 7.44113 7.8607L6.32983 10.864C6.10105 11.4822 5.22659 11.4822 4.99781 10.864L3.8865 7.8607C3.81458 7.66632 3.66132 7.51306 3.46694 7.44113L0.463683 6.32983C-0.154582 6.10105 -0.15458 5.22659 0.463685 4.99781L3.46694 3.8865C3.66132 3.81458 3.81458 3.66132 3.8865 3.46694L4.99781 0.463683Z" fill="#FFBB00"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* МАСШТАБИРУЕМЫЙ КОНТЕЙНЕР - масштабируется при ширине менее 1500px */}
      <div 
        className="transition-all duration-300 ease-out"
        style={{
          transform: scale < 1 ? `scale(${scale})` : 'none',
          transformOrigin: 'top center',
          width: '1920px',
          maxWidth: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {/* Main Content */}
        <div className="pt-[70px] pb-[18px] px-4 sm:px-6 lg:px-8">
          
          {/* Title */}
          <div className="w-full max-w-[1216px] mx-auto mb-[110px] mt-[81px]">
            <p className="font-montserrat font-bold text-transparent text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] tracking-[0.40px] leading-[44.0px] text-left">
              <span className="text-white tracking-[0.16px]">Выбери подходящий для себя </span>
              <span className="text-accent tracking-[0.16px]">тариф</span>
            </p>
          </div>

          {/* Main container */}
          <div className="w-full max-w-[1216px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              
              {/* Left Image */}
              <div className="hidden lg:block w-[381px] h-[767px] flex-shrink-0 relative mt-[52px]">
                <div 
                  className="w-full h-full bg-cover bg-center bg-no-repeat rounded-[60px]"
                  style={{ 
                    backgroundImage: 'url(https://c.animaapp.com/xZME2bu5/img/freepik-export-20240531103402aths-1.png)',
                    backgroundSize: '100% 100%'
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#232829] via-[rgba(35,40,41,0.8)] to-transparent rounded-b-[60px]"></div>
              </div>

              {/* Right Content */}
              <div className="flex-1 w-full lg:max-w-[748px]">
                
                {/* "Best" Tariff Card */}
                {bestTariff && (
                  <div 
                    onClick={() => setSelectedTariffId(bestTariff.id)}
                    className={`relative w-full lg:w-[748px] h-auto lg:h-[190px] bg-[#313637] rounded-[34px] border-2 transition-all duration-300 cursor-pointer p-4 sm:p-6 lg:p-[30px] ${
                      selectedTariffId === bestTariff.id ? 'border-accent' : 'border-[#484d4e]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10">
                      <div className="flex flex-col items-center gap-4">
                        <div className="font-montserrat font-medium text-white text-[20px] sm:text-[22px] lg:text-[26px]">
                          {bestTariff.period}
                        </div>
                        <div className="flex flex-col items-center">
                          <div className={`font-montserrat font-semibold text-[36px] sm:text-[40px] lg:text-[50px] leading-[50px] transition-colors duration-300 ${
                            selectedTariffId === bestTariff.id ? 'text-accent' : 'text-white'
                          }`}>
                            {isEnded ? `${bestTariff.full_price} ₽` : `${bestTariff.price} ₽`}
                          </div>
                          {!isEnded && (
                            <div className="relative">
                              <div className="font-montserrat font-normal text-[#919191] text-xl lg:text-2xl line-through">
                                {bestTariff.full_price} ₽
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="max-w-[328px] text-center md:text-left">
                        <p className="font-montserrat font-normal text-white text-sm sm:text-base leading-[20.8px]">
                          {bestTariff.text}
                        </p>
                      </div>
                    </div>
                    {!isEnded && (
                      <div className="absolute top-0 left-[50px] inline-flex items-center justify-center px-2 py-[5px] bg-[#fd5656] rounded-[0px_0px_8px_8px]">
                        <div className="font-gilroy font-medium text-white text-[18px] sm:text-[20px] lg:text-[22px]">
                          -{calculateDiscount(bestTariff.full_price, bestTariff.price)}%
                        </div>
                      </div>
                    )}
                    {bestTariff.is_best && (
                      <div className="absolute top-2.5 right-[30px] font-montserrat font-medium text-accent text-[18px] sm:text-[20px] lg:text-[22px]">
                        хит!
                      </div>
                    )}
                  </div>
                )}

                {/* Small Tariff Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-[14px]">
                  {otherTariffs.map((tariff) => (
                    <TariffCard
                      key={tariff.id}
                      tariff={tariff}
                      isSelected={selectedTariffId === tariff.id}
                      discountPercentage={calculateDiscount(tariff.full_price, tariff.price)}
                      onSelect={setSelectedTariffId}
                      onBuy={handleBuy}
                      isTimerEnded={isEnded}
                      isCheckboxAccepted={isCheckboxAccepted}
                      onCheckboxError={() => setCheckboxError(true)}
                    />
                  ))}
                </div>

                {/* Info Box */}
                <div className="w-full max-w-[499px] bg-[#2d3233] rounded-[20px] p-4 sm:p-5 mt-5">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-1 flex items-center justify-center">
                      <span className="text-[#fdb056] text-xl sm:text-2xl font-bold">!</span>
                    </div>
                    <p className="font-montserrat font-light text-white text-[14px] sm:text-[16px] leading-[20.8px] tracking-[-0.01em]">
                      Следуя плану на 3 месяца и более, люди получают в 2 раза лучший результат, чем за 1 месяц
                    </p>
                  </div>
                </div>

                {/* Checkbox and Button */}
                <div className="flex flex-col items-start gap-4 sm:gap-6 mt-[30px]">
                  <div className="inline-flex items-start sm:items-center gap-3">
                    <button
                      onClick={handleCheckboxChange}
                      className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 focus:outline-none mt-1 sm:mt-0"
                      aria-label="Согласие с условиями"
                    >
                      <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect 
                          x="0.5" 
                          y="0.5" 
                          width="31" 
                          height="31" 
                          stroke={checkboxError ? "#FD5656" : "#D4D4D4"} 
                          strokeWidth="1"
                          fill="none"
                        />
                        {isCheckboxAccepted && (
                          <path 
                            d="M8 16L14 24L24 8" 
                            stroke="#FDB056" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            fill="none"
                          />
                        )}
                      </svg>
                    </button>
                    
                    <p className="font-montserrat font-normal text-[14px] sm:text-[16px] text-txtgray tracking-[0] leading-[17.6px] max-w-[513px]">
                      <span className="text-[#cdcdcd]">Я согласен с </span>
                      <span className="underline">офертой рекуррентных платежей</span>
                      <span className="text-[#cdcdcd]"> и </span>
                      <span className="underline">Политикой конфиденциальности</span>
                    </p>
                  </div>
                  {checkboxError && (
                    <div className="text-red-500 text-sm animate-slide-down">
                      Пожалуйста, примите условия перед покупкой
                    </div>
                  )}
                </div>

                <button
                  onClick={() => selectedTariff && handleBuy(selectedTariff.id)}
                  className={`w-full sm:w-[352px] h-[56px] sm:h-[66px] bg-accent rounded-[20px] font-montserrat font-bold text-[#191e1f] text-lg sm:text-xl transition-all mt-4 flex items-center justify-center ${
                    !isCheckboxAccepted ? 'animate-pulse-glow' : 'hover:scale-105'
                  }`}
                >
                  Купить
                </button>

                <p className="font-montserrat font-normal text-[#9a9a9a] text-xs sm:text-sm leading-[16.8px] mt-8 max-w-3xl">
                  Нажимая кнопку «Купить», Пользователь соглашается на разовое списание денежных средств для получения пожизненного доступа к приложению. Пользователь соглашается, что данные кредитной/дебетовой карты будут сохранены для осуществления покупок дополнительных услуг сервиса в случае желания пользователя.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Guarantee */}
        <div className="w-full">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="w-full max-w-[1176px] mx-auto">
              <div className="border border-[#484d4e] rounded-[20px] sm:rounded-[30px] p-4 sm:p-5">
                <div className="inline-block bg-[#2d3233] rounded-[20px] sm:rounded-[30px] border border-[#81fe95] px-4 sm:px-8 py-2 sm:py-4">
                  <div className="font-montserrat font-medium text-[#81fe95] text-[20px] sm:text-[24px] lg:text-[28px] leading-[33.6px] whitespace-nowrap">
                    гарантия возврата 30 дней
                  </div>
                </div>
                <div className="mt-[20px] sm:mt-[30px]">
                  <p className="font-montserrat font-light text-[#DCDCDC] text-[16px] sm:text-[20px] lg:text-[24px] leading-[31.2px] w-full max-w-[1176px]">
                    Мы уверены, что наш план сработает для тебя и ты увидишь видимые результаты уже через 4 недели! Мы даже готовы полностью вернуть твои деньги в течение 30 дней с момента покупки, если ты не получишь видимых результатов.
                  </p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};