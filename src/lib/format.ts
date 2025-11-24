export function formatCurrency(amount: number, currency: 'IDR' | 'USD' = 'IDR') {
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US'
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}
