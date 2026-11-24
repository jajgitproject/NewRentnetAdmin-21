// @ts-nocheck
const HIDDEN_LOG_FIELDS = new Set(['DebitID', 'ActivationStatus', 'DebitCreatedByID']);

const FIELD_LABELS: Record<string, string> = {
  IncidenceID: 'Incidence No.',
  DutySlipID: 'DS No.',
  ReservationID: 'Res. No.',
  DriverID: 'Driver',
  SupplierID: 'Supplier',
  InventoryID: 'Inventory',
  LocationID: 'Location',
  DebitTypeID: 'Debit Type',
  DebitCreatedByID: 'Debit Created By',
  Date: 'Date',
  Amount: 'Amount',
  Narration: 'Narration',
  DebitFrom: 'Debit From'
};

export class DebitLogEntry {
  debitLogID: number;
  debitID: number;
  crudType: string;
  recordJson: string;
  recordCreatedEditedDeletedByID: number;
  recordCreatedEditedDeletedByName: string;
  recordCreatedEditedDeletedDate: string | Date | null;
  recordCreatedEditedDeletedTime: string | null;
  recordFields: DebitLogFieldRow[];

  constructor(item?: any) {
    this.debitLogID = item?.debitLogID ?? item?.DebitLogID ?? 0;
    this.debitID = item?.debitID ?? item?.DebitID ?? 0;
    this.crudType = item?.crudType ?? item?.CRUDType ?? '';
    this.recordJson = item?.recordJson ?? item?.RecordJson ?? '';
    this.recordCreatedEditedDeletedByID =
      item?.recordCreatedEditedDeletedByID ?? item?.RecordCreatedEditedDeletedByID ?? 0;
    this.recordCreatedEditedDeletedByName =
      item?.recordCreatedEditedDeletedByName ?? item?.RecordCreatedEditedDeletedByName ?? '';
    this.recordCreatedEditedDeletedDate =
      item?.recordCreatedEditedDeletedDate ?? item?.RecordCreatedEditedDeletedDate ?? null;
    this.recordCreatedEditedDeletedTime =
      item?.recordCreatedEditedDeletedTime ?? item?.RecordCreatedEditedDeletedTime ?? null;
    this.recordFields = DebitLogEntry.parseRecordFields(
      this.recordJson,
      this.crudType,
      this.recordCreatedEditedDeletedByName
    );
  }

  static parseRecordFields(json: string, crudType?: string, actionUserName?: string): DebitLogFieldRow[] {
    if (!json || !String(json).trim()) {
      return [];
    }
    try {
      const obj = JSON.parse(json);
      return Object.keys(obj)
        .filter((key) => !HIDDEN_LOG_FIELDS.has(key))
        .map((key) => {
          const val = obj[key];
          let displayValue = '';
          if (val && typeof val === 'object') {
            const name = val.Name ?? val.name ?? '';
            const id = val.ID ?? val.Id ?? val.id;
            displayValue = DebitLogEntry.resolveDisplayValue(key, name, id, crudType, actionUserName);
          } else {
            displayValue = val != null ? String(val) : '';
          }
          if (key === 'Date') {
            displayValue = DebitLogEntry.formatDateValue(displayValue);
          }
          const label = FIELD_LABELS[key] || key;
          return new DebitLogFieldRow(label, displayValue);
        });
    } catch (e) {
      return [new DebitLogFieldRow('Details', json)];
    }
  }

  private static resolveDisplayValue(
    key: string,
    name: string,
    id: any,
    crudType?: string,
    actionUserName?: string
  ): string {
    const trimmedName = (name || '').trim();
    if (trimmedName) {
      if (
        key === 'DebitCreatedByID' &&
        /^\d+$/.test(trimmedName) &&
        actionUserName &&
        String(crudType || '').toLowerCase() === 'create'
      ) {
        return actionUserName.trim();
      }
      return trimmedName;
    }
    if (id !== null && id !== undefined && id !== '') {
      return String(id);
    }
    return '';
  }

  static formatDateValue(value: string): string {
    if (!value || !String(value).trim()) {
      return '';
    }
    const text = String(value).trim().split('T')[0];
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (iso) {
      return `${iso[3]}-${iso[2]}-${iso[1]}`;
    }
    const dmySlash = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text);
    if (dmySlash) {
      return `${dmySlash[1].padStart(2, '0')}-${dmySlash[2].padStart(2, '0')}-${dmySlash[3]}`;
    }
    const dmyDash = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(text);
    if (dmyDash) {
      return `${dmyDash[1].padStart(2, '0')}-${dmyDash[2].padStart(2, '0')}-${dmyDash[3]}`;
    }
    const dt = new Date(value);
    if (!isNaN(dt.getTime())) {
      const dd = String(dt.getDate()).padStart(2, '0');
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const yyyy = dt.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
    return value;
  }

  get actionDateTimeDisplay(): string {
    const datePart = this.formatDatePart(this.recordCreatedEditedDeletedDate);
    const timePart = this.formatTimePart(this.recordCreatedEditedDeletedTime);
    if (!datePart && !timePart) {
      return '—';
    }
    if (datePart && timePart) {
      return `${datePart} ${timePart}`;
    }
    return datePart || timePart;
  }

  private formatDatePart(value: any): string {
    if (value == null || value === '') {
      return '';
    }
    if (value instanceof Date && !isNaN(value.getTime())) {
      const dd = String(value.getDate()).padStart(2, '0');
      const mm = String(value.getMonth() + 1).padStart(2, '0');
      const yyyy = value.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
    const text = String(value).trim();
    const dateOnly = text.split('T')[0];
    return DebitLogEntry.formatDateValue(dateOnly || text);
  }

  private formatTimePart(value: any): string {
    if (value == null || value === '') {
      return '';
    }
    if (typeof value === 'string') {
      let text = value.trim();
      if (text.includes('T')) {
        text = text.split('T')[1] || text;
      }
      if (/^\d{1,2}:\d{2}/.test(text)) {
        const parts = text.split(':');
        const h = String(parts[0] || '0').padStart(2, '0');
        const m = String(parts[1] || '0').padStart(2, '0');
        const s = String((parts[2] || '00').replace(/\.\d+$/, '')).padStart(2, '0');
        return `${h}:${m}:${s}`;
      }
      return text.length > 8 ? text.substring(0, 8) : text;
    }
    if (typeof value === 'object') {
      const h = value.hours ?? value.Hours;
      const m = value.minutes ?? value.Minutes;
      const s = value.seconds ?? value.Seconds;
      if (h !== undefined || m !== undefined || s !== undefined) {
        return [
          String(h ?? 0).padStart(2, '0'),
          String(m ?? 0).padStart(2, '0'),
          String(s ?? 0).padStart(2, '0')
        ].join(':');
      }
    }
    return '';
  }
}

export class DebitLogFieldRow {
  label: string;
  value: string;

  constructor(label: string, value: string) {
    this.label = label;
    this.value = value || '';
  }
}