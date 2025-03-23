import type { CurrencyFormat } from 'ynab';

new Intl.NumberFormat(undefined, {});

export function currency(value: number, format: CurrencyFormat | null) {
  if (format == null) {
    return `${value} milliunits`;
  }

  return `${value}`;
}
