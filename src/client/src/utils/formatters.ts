export const formatBalance = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('tr-TR', {
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
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatCurrency = (amount: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
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
    const formatted = new Intl.NumberFormat('en-US', {
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