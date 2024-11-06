function formatNumber(value: number) {
  if (value >= 1_000_000_000) {
    const result = (value / 1_000_000_000).toFixed(1);
    return result.endsWith('.0')
      ? `${parseInt(result)}B`
      : `${parseFloat(result)}B`;
  } else if (value >= 1_000_000) {
    const result = (value / 1_000_000).toFixed(1);
    return result.endsWith('.0')
      ? `${parseInt(result)}M`
      : `${parseFloat(result)}M`;
  } else if (value >= 1_000) {
    const result = (value / 1_000).toFixed(1);
    return result.endsWith('.0')
      ? `${parseInt(result)}K`
      : `${parseFloat(result)}K`;
  } else {
    const result = value.toFixed(2);
    return result.endsWith('.0')
      ? `${parseInt(result)}`
      : `${parseFloat(result)}`;
  }
}

export default function RangeNumber({
  from,
  to,
}: {
  from: number;
  to: number;
}) {
  return (
    <div className="flex gap-1 justify-center">
      <p className="font-extrabold desktop:text-[2.5rem] laptop:text-[1.875rem] text-[1.75rem] text-[#00152A]">
        {from && to ? `${formatNumber(from)} - ${formatNumber(to)}` : '–'}
      </p>
    </div>
  );
}
