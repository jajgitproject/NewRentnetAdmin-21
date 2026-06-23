export function resolveViewBillRoute(templateAddress: string | null | undefined, invoiceType: string | null | undefined): string {
  const fromTemplate = tryResolveFromTemplateAddress(templateAddress);
  if (fromTemplate) {
    return fromTemplate;
  }

  switch (invoiceType) {
    case 'InvoiceGeneral':
      return 'generalBillDetails';
    case 'InvoiceSingleDuty':
      return 'jajSingleDutySingleBillForLocal';
    case 'InvoiceMultyDuty':
    case 'InvoiceMultiDuty':
      return 'jajInvoiceMultiDuties';
    default:
      return 'generalBillDetails';
  }
}

function tryResolveFromTemplateAddress(templateAddress: string | null | undefined): string | null {
  const key = (templateAddress || '').trim().replace(/^\//, '');
  if (!key) {
    return null;
  }

  const lower = key.toLowerCase();
  if (lower === 'generalbill' || lower === 'generalbilldetails' || lower.includes('generalbill')) {
    return 'generalBillDetails';
  }
  if (
    lower === 'jajsingledutysinglebillforlocal'
    || lower === 'singledutysinglebill'
    || lower === 'singledutysinglebillforoutstation'
    || lower.includes('singleduty')
    || lower.includes('singlebill')
  ) {
    return 'jajSingleDutySingleBillForLocal';
  }
  if (
    lower === 'jajinvoicemultiduties'
    || lower === 'invoicemultiduties'
    || lower.includes('multidut')
    || lower.includes('invoicemultidut')
  ) {
    return 'jajInvoiceMultiDuties';
  }

  return key;
}
