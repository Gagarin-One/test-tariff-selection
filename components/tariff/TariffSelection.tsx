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

      data = data.map((item) => {
        if (item.period === 'Навсегда') {
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

  // Эффект для масштабирования от 1920 до 1024px
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const maxWidth = 1920;
      const minWidth = 1024;

      if (width >= minWidth && width <= maxWidth) {
        const scaleRange = 1 - minWidth / maxWidth;
        const widthRange = maxWidth - minWidth;
        const newScale = minWidth / maxWidth + ((width - minWidth) * scaleRange) / widthRange;
        setScale(Math.min(1, Math.max(minWidth / maxWidth, newScale)));
      } else if (width > maxWidth) {
        setScale(1);
      } else if (width < minWidth) {
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
        '1 неделя': 1,
      };
      return (order[b.period] || 0) - (order[a.period] || 0);
    });

  const headerHeight = 70;
  const shouldScale = scale < 1 && window.innerWidth >= 1024 && window.innerWidth <= 1920;

  return (
    <div className="relative w-full min-h-screen bg-[#232829] overflow-x-hidden">
      {/* Timer Header */}
      <div className="fixed top-0 left-0 w-full z-50 min-w-[320px]">
        <div className="flex flex-col w-full items-center gap-1 bg-[#1d5b43] transition-all duration-300 max-[1024px]:h-[74px] max-[1024px]:justify-center">
          <div className="inline-flex items-center gap-2.5 relative flex-[0_0_auto] max-[1024px]:mt-[8px]">
            <div className="relative w-fit font-montserrat font-semibold text-white text-sm sm:text-base md:text-xl lg:text-2xl text-center tracking-[0] leading-[31.2px] whitespace-nowrap max-[1024px]:text-[14px] max-[1024px]:leading-[1.2]">
              {isEnded ? 'Акция завершена!' : 'Успейте открыть пробную неделю'}
            </div>
          </div>

          {!isEnded && (
            <div className="inline-flex items-center justify-center gap-1 sm:gap-2 relative flex-[0_0_auto] max-[1024px]:mt-[4px] max-[1024px]:mb-[8px]">
              <div className="flex items-center justify-center">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-[12px] sm:h-[12px] w-[8px] h-[8px] max-[1024px]:w-[8px] max-[1024px]:h-[8px]">
                  <path
                    d="M4.99781 0.463683C5.22659 -0.154582 6.10105 -0.15458 6.32983 0.463685L7.44113 3.46694C7.51306 3.66132 7.66632 3.81458 7.8607 3.8865L10.864 4.99781C11.4822 5.22659 11.4822 6.10105 10.864 6.32983L7.8607 7.44113C7.66632 7.51306 7.51306 7.66632 7.44113 7.8607L6.32983 10.864C6.10105 11.4822 5.22659 11.4822 4.99781 10.864L3.8865 7.8607C3.81458 7.66632 3.66132 7.51306 3.46694 7.44113L0.463683 6.32983C-0.154582 6.10105 -0.15458 5.22659 0.463685 4.99781L3.46694 3.8865C3.66132 3.81458 3.81458 3.66132 3.8865 3.46694L4.99781 0.463683Z"
                    fill="#FFBB00"
                  />
                </svg>
              </div>

              <div className="inline-flex items-center gap-1 sm:gap-1.5 relative flex-[0_0_auto]">
                <div
                  className={`relative w-fit font-raleway font-bold text-[32px] tracking-[0] leading-[1.2] whitespace-nowrap transition-colors duration-300 max-[1024px]:text-[28px] ${
                    isBlinking ? 'text-red-500' : 'text-[#ffba00]'
                  }`}>
                  {minutes}
                </div>
                <div
                  className={`relative w-fit font-raleway font-bold text-[32px] tracking-[0] leading-[1.2] whitespace-nowrap transition-colors duration-300 max-[1024px]:text-[28px] ${
                    isBlinking ? 'text-red-500' : 'text-[#ffba00]'
                  }`}>
                  :
                </div>
                <div
                  className={`relative w-fit font-raleway font-bold text-[32px] tracking-[0] leading-[1.2] whitespace-nowrap transition-colors duration-300 max-[1024px]:text-[28px] ${
                    isBlinking ? 'text-red-500' : 'text-[#ffba00]'
                  }`}>
                  {seconds}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-[12px] sm:h-[12px] w-[8px] h-[8px] max-[1024px]:w-[8px] max-[1024px]:h-[8px]">
                  <path
                    d="M4.99781 0.463683C5.22659 -0.154582 6.10105 -0.15458 6.32983 0.463685L7.44113 3.46694C7.51306 3.66132 7.66632 3.81458 7.8607 3.8865L10.864 4.99781C11.4822 5.22659 11.4822 6.10105 10.864 6.32983L7.8607 7.44113C7.66632 7.51306 7.51306 7.66632 7.44113 7.8607L6.32983 10.864C6.10105 11.4822 5.22659 11.4822 4.99781 10.864L3.8865 7.8607C3.81458 7.66632 3.66132 7.51306 3.46694 7.44113L0.463683 6.32983C-0.154582 6.10105 -0.15458 5.22659 0.463685 4.99781L3.46694 3.8865C3.66132 3.81458 3.81458 3.66132 3.8865 3.46694L4.99781 0.463683Z"
                    fill="#FFBB00"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* МАСШТАБИРУЕМЫЙ КОНТЕЙНЕР */}
      <div
        className="transition-all duration-300 ease-out min-w-[320px]"
        style={{
          transform: shouldScale ? `scale(${scale})` : 'none',
          transformOrigin: 'top center',
          width: shouldScale ? '1920px' : '100%',
          maxWidth: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: shouldScale ? `${headerHeight * (1 / scale - 1)}px` : '0px',
        }}>
        {/* Main Content */}
        <div
          className="pb-[18px] px-4 sm:px-6 lg:px-8 max-[1024px]:px-4"
          style={{
            paddingTop: `${headerHeight}px`,
          }}>
          {/* Title - на мобильных по центру, на десктопе слева */}
          <div className="w-full max-w-[1216px] mx-auto mb-[110px] mt-[81px] max-[1024px]:mb-0 max-[1024px]:mt-[20px] max-[1024px]:px-0 max-[1024px]:mt-[35px]">
            <p className="font-montserrat font-bold text-transparent text-[24px] sm:text-[28px] md:text-[32px] lg:text-[40px] tracking-[0.40px] leading-[44.0px] text-left max-[1024px]:text-center max-[1024px]:text-[20px] max-[1024px]:leading-[1.3] max-[1024px]:w-full">
              <span className="text-white tracking-[0.16px]">Выбери подходящий для себя </span>
              <span className="text-accent tracking-[0.16px]">тариф</span>
            </p>
          </div>

          {/* Main container */}
          <div className="w-full max-w-[1216px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 w-full max-[1024px]:gap-0 max-[1024px]:items-center">
              {/* Left Image - размер 100x200 на мобильных */}
              <div className="w-full lg:w-[381px] flex-shrink-0 relative max-[1024px]:flex max-[1024px]:justify-center max-[1024px]:mb-4 max-[1024px]:mt-[20px]">
                <div
                  className="w-[381px] h-[767px] bg-cover bg-center bg-no-repeat rounded-[60px] max-[1024px]:w-[100px] max-[1024px]:h-[200px] max-[1024px]:rounded-[20px]"
                  style={{
                    backgroundImage:
                      'url(https://c.animaapp.com/xZME2bu5/img/freepik-export-20240531103402aths-1.png)',
                    backgroundSize: '100% 100%',
                  }}
                />
              </div>

              {/* Right Content */}
              <div className="flex-1 w-full lg:max-w-[748px] max-[1024px]:max-w-full max-[1024px]:flex max-[1024px]:flex-col max-[1024px]:items-center">
                {/* Best Tariff Card - Desktop version */}
                <div className="hidden max-[1024px]:hidden lg:block">
                  {bestTariff && (
                    <div
                      onClick={() => setSelectedTariffId(bestTariff.id)}
                      className={`relative w-full lg:w-[748px] h-auto lg:h-[190px] bg-[#313637] rounded-[34px] border-2 transition-all duration-300 cursor-pointer p-4 sm:p-6 lg:p-[30px] ${
                        selectedTariffId === bestTariff.id ? 'border-accent' : 'border-[#484d4e]'
                      }`}>
                      <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10">
                        <div className="flex flex-col items-center gap-4">
                          <div className="font-montserrat font-medium text-white text-[20px] sm:text-[22px] lg:text-[26px]">
                            {bestTariff.period}
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className={`font-montserrat font-semibold text-[36px] sm:text-[40px] lg:text-[50px] leading-[50px] transition-colors duration-300 ${
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
                </div>

                {/* Mobile version - карточки с фиксированной шириной 343px на 375 и 288px на 320 */}
                <div className="block lg:hidden w-full max-[1024px]:flex max-[1024px]:justify-center">
                  <div className="flex flex-col gap-2 max-[1024px]:gap-2 max-[1024px]:items-center" style={{ width: 'min(100%, 343px)', maxWidth: '343px', minWidth: '288px' }}>
                    {/* Best Tariff on mobile */}
                    {bestTariff && (
                      <div
                        onClick={() => setSelectedTariffId(bestTariff.id)}
                        className={`relative w-full min-h-[131px] bg-[#313637] border-2 transition-all duration-300 cursor-pointer rounded-[20px] p-[20px_16px_20px_30px] ${
                          selectedTariffId === bestTariff.id ? 'border-accent' : 'border-[#484d4e]'
                        }`}
                        style={{ width: '100%' }}>
                        <div className="flex flex-row justify-between items-center w-full h-full">
                          <div className="flex flex-col justify-center items-start gap-4">
                            <div className="font-montserrat font-medium text-white text-[18px] leading-[22px] whitespace-nowrap">
                              {bestTariff.period}
                            </div>
                            <div className="flex flex-col items-end">
                              <div
                                className={`font-montserrat font-semibold text-[34px] leading-[34px] transition-colors duration-300 ${
                                  selectedTariffId === bestTariff.id ? 'text-accent' : 'text-white'
                                }`}>
                                {isEnded ? `${bestTariff.full_price} ₽` : `${bestTariff.price} ₽`}
                              </div>
                              {!isEnded && (
                                <div className="relative mt-1">
                                  <div className="font-montserrat font-normal text-[#919191] text-[16px] leading-[19px] whitespace-nowrap text-right">
                                    {bestTariff.full_price} ₽
                                  </div>
                                  <div className="absolute w-full h-[1px] bg-[#919191] left-0 top-1/2 transform -translate-y-1/2" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-end max-w-[120px] h-full">
                            <p className="font-montserrat font-normal text-white text-[14px] leading-[18px] text-left">
                              {bestTariff.text}
                            </p>
                          </div>
                        </div>
                        {!isEnded && (
                          <div className="absolute flex justify-center items-center px-[6px] py-[3px] gap-2.5 w-[48px] h-[27px] left-[233px] top-0 bg-[#fd5656] rounded-[0px_0px_8px_8px]">
                            <div className="font-gilroy font-medium text-white text-[16px] leading-[21px]">
                              -{calculateDiscount(bestTariff.full_price, bestTariff.price)}%
                            </div>
                          </div>
                        )}
                        {bestTariff.is_best && (
                          <div className="absolute font-montserrat font-medium text-accent text-[16px] leading-[21px] tracking-[0.03em] right-[16px] top-[6px]">
                            хит!
                          </div>
                        )}
                      </div>
                    )}

                    {/* Other Tariffs on mobile */}
                    {otherTariffs.map((tariff) => (
                      <div
                        key={tariff.id}
                        onClick={() => setSelectedTariffId(tariff.id)}
                        className={`relative w-full min-h-[131px] bg-[#313637] border-2 transition-all duration-300 cursor-pointer rounded-[20px] p-[20px_16px_20px_30px] ${
                          selectedTariffId === tariff.id ? 'border-accent' : 'border-[#484d4e]'
                        }`}
                        style={{ width: '100%' }}>
                        <div className="flex flex-row justify-between items-center w-full h-full">
                          <div className="flex flex-col justify-center items-start gap-4">
                            <div className="font-montserrat font-medium text-white text-[18px] leading-[22px] whitespace-nowrap">
                              {tariff.period}
                            </div>
                            <div className="flex flex-col items-end">
                              <div
                                className={`font-montserrat font-semibold text-[34px] leading-[34px] transition-colors duration-300 ${
                                  selectedTariffId === tariff.id ? 'text-accent' : 'text-white'
                                }`}>
                                {isEnded ? `${tariff.full_price} ₽` : `${tariff.price} ₽`}
                              </div>
                              {!isEnded && (
                                <div className="relative mt-1">
                                  <div className="font-montserrat font-normal text-[#919191] text-[16px] leading-[19px] whitespace-nowrap text-right">
                                    {tariff.full_price} ₽
                                  </div>
                                  <div className="absolute w-full h-[1px] bg-[#919191] left-0 top-1/2 transform -translate-y-1/2" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-end max-w-[120px] h-full">
                            <p className="font-montserrat font-normal text-white text-[14px] leading-[18px] text-left">
                              {tariff.text}
                            </p>
                          </div>
                        </div>
                        {!isEnded && (
                          <div className="absolute flex justify-center items-center px-[6px] py-[3px] gap-2.5 w-[48px] h-[27px] right-[30px] top-0 bg-[#fd5656] rounded-[0px_0px_8px_8px]">
                            <div className="font-gilroy font-medium text-white text-[16px] leading-[21px]">
                              -{calculateDiscount(tariff.full_price, tariff.price)}%
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop small cards grid */}
                <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-[14px]">
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

                {/* Info Box - на десктопе max-w-[499px], на мобильных max-w-[343px] */}
                <div className="w-full bg-[#2d3233] rounded-[20px] p-4 sm:p-5 mt-3 max-[1024px]:mt-3" style={{ maxWidth: 'min(100%, 499px)', width: '100%' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-1 flex items-center justify-center">
                      <span className="text-[#fdb056] text-xl sm:text-2xl font-bold">!</span>
                    </div>
                    <p className="font-montserrat font-light text-white text-[14px] sm:text-[16px] leading-[20.8px] tracking-[-0.01em] max-[1024px]:text-[12px]">
                      Следуя плану на 3 месяца и более, люди получают в 2 раза лучший результат, чем
                      за 1 месяц
                    </p>
                  </div>
                </div>

                {/* Checkbox and Button - на десктопе max-w-[499px], на мобильных max-w-[343px] */}
                <div className="flex flex-col items-start gap-5 sm:gap-6 mt-6 max-[1024px]:mt-6 max-[1024px]:items-center" style={{ maxWidth: 'min(100%, 499px)', width: '100%' }}>
                  <div className="inline-flex items-start sm:items-center gap-3">
                    <button
                      onClick={handleCheckboxChange}
                      className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 focus:outline-none mt-1 sm:mt-0 max-[1024px]:w-5 max-[1024px]:h-5"
                      aria-label="Согласие с условиями">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <rect
                          x="0.5"
                          y="0.5"
                          width="31"
                          height="31"
                          stroke={checkboxError ? '#FD5656' : '#D4D4D4'}
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

                    <p className="font-montserrat font-normal text-[14px] sm:text-[16px] text-txtgray tracking-[0] leading-[17.6px] max-w-[513px] max-[1024px]:text-[12px] max-[1024px]:text-center">
                      <span className="text-[#cdcdcd]">Я согласен с </span>
                      <span className="underline">офертой рекуррентных платежей</span>
                      <span className="text-[#cdcdcd]"> и </span>
                      <span className="underline">Политикой конфиденциальности</span>
                    </p>
                  </div>
                  {checkboxError && (
                    <div className="text-red-500 text-sm animate-slide-down max-[1024px]:text-xs">
                      Пожалуйста, примите условия перед покупкой
                    </div>
                  )}
                </div>

                {/* Кнопка Купить */}
                <button
                  onClick={() => selectedTariff && handleBuy(selectedTariff.id)}
                  className={`bg-accent rounded-[20px] font-montserrat font-bold text-[#191e1f] transition-all mt-5 flex items-center justify-center ${
                    !isCheckboxAccepted ? 'animate-pulse-glow' : 'hover:scale-105'
                  }`}
                  style={{
                    maxWidth: 'min(100%, 499px)',
                    width: '100%',
                    height: 'min(63px)',
                    fontSize: 'clamp(14px, 4vw, 18px)'
                  }}>
                  Купить
                </button>

                {/* Текст под кнопкой */}
                <p className="font-montserrat font-normal text-[#9a9a9a] text-xs sm:text-sm leading-[1.3] mt-5 max-w-3xl max-[1024px]:text-[10px] max-[1024px]:leading-[1.3] max-[1024px]:mt-5 max-[1024px]:text-center" style={{ maxWidth: 'min(100%, 499px)', width: '100%' }}>
                  Нажимая кнопку «Купить», Пользователь соглашается на разовое списание денежных
                  средств для получения пожизненного доступа к приложению. Пользователь соглашается,
                  что данные кредитной/дебетовой карты будут сохранены для осуществления покупок
                  дополнительных услуг сервиса в случае желания пользователя.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Guarantee */}
        <div className="w-full">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-[1024px]:px-4">
            <div className="w-full max-w-[1176px] mx-auto">
              <div className="border border-[#484d4e] rounded-[20px] sm:rounded-[30px] p-4 sm:p-5 max-[1024px]:p-3">
                <div className="flex justify-center lg:justify-start">
                  <div className="inline-block bg-[#2d3233] rounded-[20px] sm:rounded-[30px] border border-[#81fe95] px-4 sm:px-8 py-2 sm:py-4 max-[1024px]:px-3 max-[1024px]:py-1.5">
                    <div className="font-montserrat font-medium text-[#81fe95] text-[20px] sm:text-[24px] lg:text-[28px] leading-[33.6px] whitespace-nowrap max-[1024px]:text-[14px]">
                      гарантия возврата 30 дней
                    </div>
                  </div>
                </div>
                <div className="mt-[20px] sm:mt-[30px] max-[1024px]:mt-[15px]">
                  <p className="font-montserrat font-light text-[#DCDCDC] text-[16px] sm:text-[20px] lg:text-[24px] leading-[31.2px] w-full max-w-[1176px] max-[1024px]:text-[12px] max-[1024px]:leading-[1.4]">
                    Мы уверены, что наш план сработает для тебя и ты увидишь видимые результаты уже
                    через 4 недели! Мы даже готовы полностью вернуть твои деньги в течение 30 дней с
                    момента покупки, если ты не получишь видимых результатов.
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
