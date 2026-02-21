export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  slices: DonutSlice[];
  grossTotal: number;
  centerLabel: string;
  centerValue: string;
  formatValue: (amount: number) => string;
}

export interface SavingsWaterfallChartProps {
  netMonthly: number;
  totalMonthlyCost: number;
  monthlySavings: number;
  isNegativeSavings: boolean;
  formatCurrency: (amount: number) => string;
}