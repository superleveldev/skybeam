const defaultOptions: Intl.NumberFormatOptions = {
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  style: 'currency',
};

export const formatCurrency = ({
  number,
  format = 'en-US',
  options: _options = defaultOptions,
}: {
  number: number;
  format?: string;
  options?: Intl.NumberFormatOptions;
}) => {
  const options = { ..._options };
  const formatter = new Intl.NumberFormat(format, options);
  return formatter.format(number);
};
