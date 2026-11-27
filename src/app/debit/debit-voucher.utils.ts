// @ts-nocheck
/** Indian numbering amount in words (Rupees … Only). */
export function amountInWords(amount: number): string {
  if (amount == null || isNaN(Number(amount))) {
    return 'Zero Rupees Only';
  }

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
    'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety',
  ];

  function numToWords(n: number): string {
    if (n < 20) {
      return ones[n];
    }
    if (n < 100) {
      return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    }
    if (n < 1000) {
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
    }
    if (n < 100000) {
      return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
    }
    if (n < 10000000) {
      return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
    }
    return (
      numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '')
    );
  }

  const n = Number(amount);
  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  let words = `${numToWords(rupees)} Rupees`;
  if (paise > 0) {
    words += ` and ${numToWords(paise)} Paise`;
  }
  return `${words} Only`;
}

export function formatVoucherDate(value: any): string {
  if (!value) {
    return '';
  }
  const text = String(value).trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
    return text;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    const p = text.substring(0, 10).split('-');
    return `${p[2]}/${p[1]}/${p[0]}`;
  }
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) {
    return text;
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function pickDebitField(item: any, ...keys: string[]): any {
  if (!item) {
    return null;
  }
  for (const k of keys) {
    const v = item[k];
    if (v != null && v !== '') {
      return v;
    }
  }
  return null;
}