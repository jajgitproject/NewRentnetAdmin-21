// @ts-nocheck
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { EmployeeDropDown } from '../employee/employeeDropDown.model';
import {
  displayEmployeeDropdownValue,
  employeeMatchesDropdownInput,
  filterEmployeesForAutocomplete,
  findEmployeeByDropdownInput,
  formatEmployeeDropdownLabel,
  isEmployeeDropdownSelection,
  isEmployeeExited,
} from './employee-dropdown-display.util';

export {
  displayEmployeeDropdownValue,
  formatEmployeeDropdownLabel,
  isEmployeeExited,
  isEmployeeDropdownSelection,
  findEmployeeByDropdownInput,
};

export function createDisplayEmployeeFn(): (value: EmployeeDropDown | string | null) => string {
  return (value) => displayEmployeeDropdownValue(value);
}

export function employeeNameControlValidator(getList: () => EmployeeDropDown[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value == null || (typeof value === 'string' && !value.trim())) {
      return null;
    }
    if (isEmployeeDropdownSelection(value)) {
      const id = Number(value.employeeID);
      if (id > 0) {
        return null;
      }
      const list = getList() || [];
      const label = formatEmployeeDropdownLabel(value);
      if (list.some((employee) => employeeMatchesDropdownInput(employee, label))) {
        return null;
      }
      return { employeeNameInvalid: true };
    }
    if (typeof value !== 'string') {
      return { employeeNameInvalid: true };
    }
    const match = (getList() || []).some((employee) => employeeMatchesDropdownInput(employee, value));
    return match ? null : { employeeNameInvalid: true };
  };
}

export function isSelectedEmployeeExitedFromForm(
  form: FormGroup | undefined,
  controlName: string,
  list: EmployeeDropDown[]
): boolean {
  const value = form?.get(controlName)?.value;
  if (isEmployeeDropdownSelection(value)) {
    return isEmployeeExited(value);
  }
  const emp = findEmployeeByDropdownInput(value, list || []);
  return emp ? isEmployeeExited(emp) : false;
}

export function initEmployeeNamePrefixSearch(
  generalService: GeneralService,
  form: FormGroup,
  controlName: string,
  ctx: {
    getEmployeeList: () => EmployeeDropDown[];
    setEmployeeList: (list: EmployeeDropDown[]) => void;
    setFilteredOptions: (options: Observable<EmployeeDropDown[]>) => void;
  }
): void {
  const control = form.controls[controlName];
  if (!control) {
    return;
  }
  const raw = control.value;
  const prefix =
    typeof raw === 'string'
      ? raw
      : isEmployeeDropdownSelection(raw)
        ? formatEmployeeDropdownLabel(raw)
        : '';
  if (prefix.length < 3) {
    ctx.setEmployeeList([]);
    ctx.setFilteredOptions(of([]));
    control.setValidators([Validators.required]);
    control.updateValueAndValidity({ emitEvent: false });
    return;
  }
  if (isEmployeeDropdownSelection(raw)) {
    return;
  }
  generalService.searchEmployeesByPrefix(prefix).subscribe((data) => {
    const current = control.value;
    const currentPrefix =
      typeof current === 'string'
        ? current
        : isEmployeeDropdownSelection(current)
          ? formatEmployeeDropdownLabel(current)
          : '';
    if (currentPrefix !== prefix) {
      return;
    }
    const list = data || [];
    ctx.setEmployeeList(list);
    control.setValidators([Validators.required, employeeNameControlValidator(() => list)]);
    control.updateValueAndValidity({ emitEvent: false });
    ctx.setFilteredOptions(of(filterEmployeesForAutocomplete(list, prefix)));
  });
}

export function patchEmployeeNameForEditById(
  generalService: GeneralService,
  employeeId: number | undefined,
  form: FormGroup,
  controlName: string,
  ctx: {
    getEmployeeList: () => EmployeeDropDown[];
    setEmployeeList: (list: EmployeeDropDown[]) => void;
    setFilteredOptions: (options: Observable<EmployeeDropDown[]>) => void;
    onEmployeeId: (id: number) => void;
  }
): void {
  if (!employeeId) {
    return;
  }
  generalService.getEmployeeID(employeeId).subscribe(
    (data) => {
      const employee = Array.isArray(data) ? data[0] : data;
      if (!employee) {
        return;
      }
      const applyPatch = (resolved: EmployeeDropDown) => {
        const list = [resolved, ...(ctx.getEmployeeList() || [])];
        ctx.setEmployeeList(list);
        form.patchValue({ [controlName]: resolved, employeeID: employeeId }, { emitEvent: false });
        ctx.onEmployeeId(employeeId);
        form.controls[controlName].setValidators([
          Validators.required,
          employeeNameControlValidator(() => list),
        ]);
        form.controls[controlName].updateValueAndValidity({ emitEvent: false });
        ctx.setFilteredOptions(of(list));
      };
      const prefix = String(employee.firstName || employee.lastName || '')
        .trim()
        .slice(0, 3);
      if (prefix.length < 3) {
        applyPatch(employee);
        return;
      }
      generalService.searchEmployeesByPrefix(prefix).subscribe(
        (searchHits) => {
          const enriched =
            (searchHits || []).find((e) => Number(e.employeeID) === Number(employeeId)) || employee;
          applyPatch(enriched);
        },
        () => applyPatch(employee)
      );
    },
    () => {
      /* keep string label from row if lookup fails */
    }
  );
}

export function onEmployeeAutocompleteSelected(
  form: FormGroup,
  controlName: string,
  selectedEmployee: EmployeeDropDown,
  onEmployeeId: (id: number) => void
): void {
  if (!isEmployeeDropdownSelection(selectedEmployee)) {
    return;
  }
  const row = selectedEmployee as unknown as Record<string, unknown>;
  const resolvedId = Number(
    selectedEmployee.employeeID ?? row['oldKAMID'] ?? row['newKAMID'] ?? 0
  );
  form.patchValue(
    { [controlName]: selectedEmployee, employeeID: resolvedId > 0 ? resolvedId : selectedEmployee.employeeID },
    { emitEvent: false }
  );
  form.controls[controlName]?.markAsTouched();
  form.controls[controlName]?.updateValueAndValidity({ emitEvent: false });
  onEmployeeId(resolvedId > 0 ? resolvedId : selectedEmployee.employeeID);
}

export function mergeEmployeeIntoSavePayload(
  raw: Record<string, unknown>,
  employeeValueKey: string,
  list: EmployeeDropDown[],
  fallbackEmployeeId?: number
): void {
  const empValue = raw[employeeValueKey];
  const employee =
    findEmployeeByDropdownInput(empValue as EmployeeDropDown | string, list || []) ||
    (isEmployeeDropdownSelection(empValue) ? (empValue as EmployeeDropDown) : null);
  if (employee) {
    const id = Number(employee.employeeID);
    if (id > 0) {
      raw['employeeID'] = id;
    }
    raw[employeeValueKey] = employeeDisplayNameForApi(employee);
  } else if (fallbackEmployeeId && Number(fallbackEmployeeId) > 0) {
    raw['employeeID'] = Number(fallbackEmployeeId);
  }
}

/** Normalize id/date fields before POST/PUT (avoid empty strings breaking API binding). */
export function normalizeCustomerExecutiveApiPayload(raw: Record<string, unknown>): Record<string, unknown> {
  const customerId = Number(raw['customerID']);
  if (Number.isFinite(customerId) && customerId > 0) {
    raw['customerID'] = customerId;
  }
  const employeeId = Number(raw['employeeID'] ?? raw['EmployeeID']);
  if (Number.isFinite(employeeId) && employeeId > 0) {
    raw['employeeID'] = employeeId;
  } else {
    delete raw['employeeID'];
  }
  if (raw['fromDate'] && !(raw['fromDate'] instanceof Date)) {
    raw['fromDate'] = new Date(raw['fromDate'] as string);
  }
  if (raw['toDate'] === '' || raw['toDate'] == null) {
    raw['toDate'] = null;
    raw['toDateString'] = null;
  } else if (raw['toDate'] && !(raw['toDate'] instanceof Date)) {
    raw['toDate'] = new Date(raw['toDate'] as string);
  }
  return raw;
}

export function resolveRowPrimaryKey(
  raw: Record<string, unknown>,
  advanceTable: Record<string, unknown> | null | undefined,
  primaryKeyField: string,
  aliases: string[] = []
): void {
  const current = raw[primaryKeyField];
  if (current != null && Number(current) > 0) {
    return;
  }
  const keys = [primaryKeyField, ...aliases];
  const sources = [advanceTable, raw].filter((s): s is Record<string, unknown> => !!s);
  for (const source of sources) {
    for (const key of keys) {
      const val = source[key];
      if (val != null && Number(val) > 0) {
        raw[primaryKeyField] = Number(val);
        return;
      }
    }
  }
}

export function coerceEmployeeFieldToApiString(
  raw: Record<string, unknown>,
  field: string,
  list: EmployeeDropDown[]
): void {
  const val = raw[field];
  if (isEmployeeDropdownSelection(val)) {
    raw[field] = employeeDisplayNameForApi(val as EmployeeDropDown);
    return;
  }
  if (typeof val === 'string') {
    const emp = findEmployeeByDropdownInput(val, list || []);
    raw[field] = emp ? employeeDisplayNameForApi(emp) : val.split(' - ')[0]?.trim() || val;
  }
}

export function finalizeCustomerEmployeeSavePayload(
  raw: Record<string, unknown>,
  opts: {
    employeeField: string;
    employeeList: EmployeeDropDown[];
    employeesID?: number;
    customerID?: number;
    advanceTable?: unknown;
    primaryKeyField?: string;
    primaryKeyAliases?: string[];
  }
): Record<string, unknown> {
  mergeEmployeeIntoSavePayload(raw, opts.employeeField, opts.employeeList, opts.employeesID);
  coerceEmployeeFieldToApiString(raw, opts.employeeField, opts.employeeList);
  if (opts.customerID != null && String(opts.customerID).trim() !== '') {
    raw['customerID'] = Number(opts.customerID);
  }
  const empId = Number(raw['employeeID'] ?? 0);
  if (empId <= 0 && opts.employeesID && Number(opts.employeesID) > 0) {
    raw['employeeID'] = Number(opts.employeesID);
  }
  if (opts.primaryKeyField) {
    resolveRowPrimaryKey(
      raw,
      opts.advanceTable as Record<string, unknown> | null | undefined,
      opts.primaryKeyField,
      opts.primaryKeyAliases
    );
  }
  return normalizeCustomerExecutiveApiPayload(raw);
}

export function finalizeChangeKamSavePayload(
  raw: Record<string, unknown>,
  ctx: {
    kamList: EmployeeDropDown[];
    employeeList: EmployeeDropDown[];
    oldKAMID?: number;
    newKAMID?: number;
  }
): Record<string, unknown> {
  mergeEmployeeIntoSavePayload(raw, 'oldCustomerkamEmployee', ctx.kamList, ctx.oldKAMID);
  mergeEmployeeIntoSavePayload(raw, 'newCustomerkamEmployee', ctx.employeeList, ctx.newKAMID);
  coerceEmployeeFieldToApiString(raw, 'oldCustomerkamEmployee', ctx.kamList);
  coerceEmployeeFieldToApiString(raw, 'newCustomerkamEmployee', ctx.employeeList);
  raw['oldKAMID'] = Number(ctx.oldKAMID ?? raw['oldKAMID'] ?? 0);
  raw['newKAMID'] = Number(ctx.newKAMID ?? raw['newKAMID'] ?? raw['employeeID'] ?? 0);
  raw['customerKeyAccountManagerID'] = Number(raw['customerKeyAccountManagerID'] ?? 0);
  return raw;
}

/** Read CustomerID query param from hash, search, or full href. */
export function readCustomerIdFromBrowserUrl(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const fromParams = (params: URLSearchParams): string | null =>
    params.get('CustomerID') ?? params.get('customerID');

  const hash = window.location.hash || '';
  const hashQuery = hash.indexOf('?');
  if (hashQuery >= 0) {
    const id = fromParams(new URLSearchParams(hash.substring(hashQuery + 1)));
    if (id) {
      return id;
    }
  }
  const search = window.location.search || '';
  if (search) {
    const id = fromParams(new URLSearchParams(search.startsWith('?') ? search : `?${search}`));
    if (id) {
      return id;
    }
  }
  const hrefMatch = window.location.href.match(/[?&](CustomerID|customerID)=([^&#]+)/i);
  return hrefMatch?.[2] ? decodeURIComponent(hrefMatch[2]) : null;
}

/** Decrypt or parse a CustomerID route/query value to a numeric id. */
export function resolveCustomerIdFromQueryValue(
  generalService: GeneralService,
  raw: unknown
): number {
  if (raw == null || String(raw).trim() === '') {
    return 0;
  }
  const attempts: string[] = [];
  const base = String(raw).trim();
  attempts.push(base);
  try {
    attempts.push(decodeURIComponent(base));
  } catch {
    /* ignore */
  }
  try {
    attempts.push(decodeURIComponent(decodeURIComponent(base)));
  } catch {
    /* ignore */
  }

  const seen = new Set<string>();
  for (const attempt of attempts) {
    const normalized = attempt.replace(/ /g, '+');
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);

    const decrypted = generalService.decrypt(normalized);
    const fromDecrypt = Number(String(decrypted).trim());
    if (Number.isFinite(fromDecrypt) && fromDecrypt > 0) {
      return fromDecrypt;
    }
    if (/^\d+$/.test(normalized)) {
      const plain = Number(normalized);
      if (Number.isFinite(plain) && plain > 0) {
        return plain;
      }
    }
  }
  return 0;
}

/** Primary key for a Change KAM grid row (KeyAccountManagerUpdate audit record). */
export function resolveChangeKamRecordId(row: Record<string, unknown> | null | undefined): number {
  if (!row) {
    return 0;
  }
  return Number(
    row['customerKeyAccountManagerID'] ??
      row['keyAccountManagerUpdateID'] ??
      row['changeKamForCustomersID'] ??
      0
  );
}

/** Map list API fields to the edit form model shape. */
export function normalizeChangeKamGridRowForEdit(row: Record<string, unknown>): Record<string, unknown> {
  const oldId = Number(row['oldKAMID'] ?? row['oldKeyAccountManagerID'] ?? 0);
  const newId = Number(row['newKAMID'] ?? row['newKeyAccountManagerID'] ?? 0);
  return {
    ...row,
    customerKeyAccountManagerID: resolveChangeKamRecordId(row),
    oldKAMID: oldId,
    newKAMID: newId,
    newKAMActivationFromDate: row['newKAMActivationFromDate'] ?? row['startDate'],
    oldCustomerkamEmployee: row['oldCustomerkamEmployee'] ?? row['oldKeyAccountManagerName'],
    newCustomerkamEmployee: row['newCustomerkamEmployee'] ?? row['newKeyAccountManagerName'],
  };
}

export function employeeStubFromIdAndDisplayName(employeeID: number, displayName: string): EmployeeDropDown {
  const trimmed = (displayName || '').trim();
  const space = trimmed.indexOf(' ');
  const firstName = space > 0 ? trimmed.slice(0, space) : trimmed;
  const lastName = space > 0 ? trimmed.slice(space + 1) : '';
  return {
    employeeID,
    firstName,
    lastName,
    mobile: '',
    email: '',
    employmentStatus: 'Active',
  } as EmployeeDropDown;
}

/** Map KAM-change API rows to EmployeeDropDown for shared autocomplete UI. */
export function normalizeKamChangeRow(row: Record<string, unknown>): EmployeeDropDown {
  const first = String(row['employeeFirstName'] ?? row['firstName'] ?? '').trim();
  const last = String(row['employeeLastName'] ?? row['lastName'] ?? '').trim();
  const employeeId = Number(row['employeeID'] ?? row['oldKAMID'] ?? row['OldKAMID'] ?? 0);
  return {
    employeeID: employeeId,
    firstName: first,
    lastName: last,
    mobile: String(row['mobile'] ?? ''),
    email: String(row['email'] ?? ''),
    employmentStatus: String(row['employmentStatus'] ?? 'Active'),
  } as EmployeeDropDown;
}

export function employeeDisplayNameForApi(employee: EmployeeDropDown): string {
  return `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
}

/** Client-side prefix filter for preloaded KAM assignment lists (e.g. change-KAM old value). */
export function filterPreloadedEmployeesForControl(
  form: FormGroup,
  controlName: string,
  list: EmployeeDropDown[],
  setFilteredOptions: (options: Observable<EmployeeDropDown[]>) => void
): void {
  const control = form.controls[controlName];
  if (!control) {
    return;
  }
  const raw = control.value;
  const prefix =
    typeof raw === 'string'
      ? raw
      : isEmployeeDropdownSelection(raw)
        ? formatEmployeeDropdownLabel(raw)
        : '';
  if (prefix.length < 3) {
    setFilteredOptions(of([]));
    return;
  }
  if (isEmployeeDropdownSelection(raw)) {
    return;
  }
  setFilteredOptions(of(filterEmployeesForAutocomplete(list || [], prefix)));
}
