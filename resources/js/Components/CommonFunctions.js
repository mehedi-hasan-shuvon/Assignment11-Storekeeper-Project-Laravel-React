export function formatToBanglaNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
  };