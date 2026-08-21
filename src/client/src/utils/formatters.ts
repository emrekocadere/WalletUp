import i18n from '@/i18n';
import { getIntlLocale } from '@/i18n/languages';

const currentLocale = () => getIntlLocale(i18n.language);

export const formatBalance = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat(currentLocale(), {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  try {
    return new Intl.DateTimeFormat(currentLocale(), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
};

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
  try {
    return new Intl.NumberFormat(currentLocale(), options).format(value);
  } catch {
    return value.toString();
  }
};

export const formatCurrency = (amount: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat(currentLocale(), {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};
export const getCurrencySymbol = (currencyCode: string = 'USD'): string => {
  try {
    // Use Intl to get the currency symbol
    const formatted = new Intl.NumberFormat(currentLocale(), {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(1);

    // Extract symbol (usually the first non-numeric character)
    const symbol = formatted.replace(/\d/g, '').trim();
    return symbol || currencyCode;
  } catch {
    // Fallback mapping for common currencies
    const commonSymbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CHF': 'CHF',
      'CAD': '$',
      'AUD': '$',
      'INR': '₹',
      'TRY': '₺',
      'CNY': '¥',
    };
    return commonSymbols[currencyCode] || currencyCode;
  }
};
