export interface Tariff {
  id: string;
  period: string;
  price: number;
  full_price: number;
  is_best: boolean;
  text: string;
}

export interface TariffCardProps {
  tariff: Tariff;
  isSelected: boolean;
  discountPercentage: number;
  onSelect: (id: string) => void;
  onBuy: (id: string) => void;
  isTimerEnded: boolean;
  isCheckboxAccepted: boolean;
  onCheckboxError: () => void;
}
