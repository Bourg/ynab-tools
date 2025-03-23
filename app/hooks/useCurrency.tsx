import { useCallback, useMemo } from 'react';

import type { CurrencyFormat } from 'ynab';

export function useCurrency(format: CurrencyFormat | null | undefined) {
  const formatter = useMemo(() => {
    if (format == null) {
      return null;
    }

    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: format.iso_code,
    });
  }, [format]);

  return useCallback(
    (milliunits: number) => {
      if (formatter == null) {
        return `${milliunits} milliunits`;
      }

      return formatter.format(milliunits / 1000);
    },
    [formatter],
  );
}
