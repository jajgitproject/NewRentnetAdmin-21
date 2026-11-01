export function resolveDutyNightActivationStatus(value: unknown): boolean {
  if (value === true || value === 1 || value === '1') {
    return true;
  }
  if (value === false || value === 0 || value === '0' || value === 'false' || value === 'False') {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().toLowerCase() === 'true';
  }
  return !!value;
}

export function readDutyNightActivationStatus(record: Record<string, unknown> | null | undefined): boolean {
  if (record == null) {
    return false;
  }
  const raw = record.activationStatus ?? record.ActivationStatus;
  return resolveDutyNightActivationStatus(raw);
}

export function isDutyNightRecordActive(record: Record<string, unknown> | null | undefined): boolean {
  return readDutyNightActivationStatus(record);
}

export function normalizeDutyNightRecord<T extends Record<string, unknown>>(record: T): T {
  if (record == null) {
    return record;
  }
  return {
    ...record,
    activationStatus: readDutyNightActivationStatus(record),
  };
}

export function normalizeDutyNightRecords(data: unknown): any[] {
  if (data == null) {
    return [];
  }
  const records = Array.isArray(data) ? data : [data];
  return records
    .filter((record) => record != null)
    .map((record) => normalizeDutyNightRecord(record as Record<string, unknown>))
    .sort((a, b) => {
      const aTime = new Date((a as any).changeDateTime || (a as any).ChangeDateTime || 0).getTime();
      const bTime = new Date((b as any).changeDateTime || (b as any).ChangeDateTime || 0).getTime();
      return bTime - aTime;
    });
}
