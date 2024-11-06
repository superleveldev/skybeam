export function debounce(callback: (...args: any[]) => void, timer?: number) {
  let timeoutId: number | undefined = undefined;
  return (...args: any[]) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...(args as []));
    }, timer ?? 500);
  };
}
