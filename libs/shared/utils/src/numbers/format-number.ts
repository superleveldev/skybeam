import { number } from 'zod';

export const formatLargeNumber = ({
  number,
  format = 'en-US',
  options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
}: {
  number: number;
  format?: string;
  options?: Intl.NumberFormatOptions;
}) => {
  const formatter = new Intl.NumberFormat(format, options);
  return formatter.format(number);
};

export const formatToKMB = (number: number) => {
  return number.toLocaleString('en-US', {
    maximumFractionDigits: 1,
    notation: 'compact',
    compactDisplay: 'short',
  });
};

export const formatPercentage = ({
  number,
  format = 'en-US',
  options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: 'percent',
  },
}: {
  number: number;
  format?: string;
  options?: Intl.NumberFormatOptions;
}) => {
  const formatter = new Intl.NumberFormat(format, options);
  return formatter.format(number);
};
