// @ts-nocheck
import { EmployeeDropDown } from '../employee/employeeDropDown.model';

function employeeFirstLast(employee: EmployeeDropDown | Record<string, unknown> | null | undefined): string {
  if (!employee) {
    return '';
  }
  const e = employee as Record<string, unknown>;
  const first = String(e['firstName'] ?? e['employeeFirstName'] ?? e['FirstName'] ?? '').trim();
  const last = String(e['lastName'] ?? e['employeeLastName'] ?? e['LastName'] ?? '').trim();
  return `${first} ${last}`.trim();
}

/** `FirstName LastName - EmploymentStatus - Mobile` (uses first/last, not API `name`). */
export function formatEmployeeDropdownLabel(employee: EmployeeDropDown | Record<string, unknown> | null | undefined): string {
  if (!employee) {
    return '';
  }
  const e = employee as Record<string, unknown>;
  const fullName = employeeFirstLast(employee as EmployeeDropDown);
  const status = String(e['employmentStatus'] ?? e['EmploymentStatus'] ?? '').trim() || 'Active';
  const mobile = String(e['mobile'] ?? e['Mobile'] ?? '').trim();
  const segments = [fullName, status];
  if (mobile) {
    segments.push(mobile);
  }
  return segments.filter(Boolean).join(' - ');
}

export function isEmployeeExited(employee: EmployeeDropDown | Record<string, unknown> | null | undefined): boolean {
  if (!employee) {
    return false;
  }
  const e = employee as Record<string, unknown>;
  const status = String(e['employmentStatus'] ?? e['EmploymentStatus'] ?? '')
    .trim()
    .toLowerCase();
  return status === 'exited' || status === 'exit';
}

export function isEmployeeDropdownSelection(value: unknown): value is EmployeeDropDown {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

export function displayEmployeeDropdownValue(value: EmployeeDropDown | string | null | undefined): string {
  if (value == null || value === '') {
    return '';
  }
  if (isEmployeeDropdownSelection(value)) {
    return formatEmployeeDropdownLabel(value);
  }
  return String(value);
}

/** Legacy Employee page reporting manager: `firstName lastName employeeOfficeID`. */
export function legacyReportingManagerLabel(employee: EmployeeDropDown | Record<string, unknown> | null | undefined): string {
  if (!employee) {
    return '';
  }
  const e = employee as Record<string, unknown>;
  const name = employeeFirstLast(employee as EmployeeDropDown);
  const office = String(e['employeeOfficeID'] ?? e['EmployeeOfficeID'] ?? '').trim();
  return office ? `${name} ${office}`.trim() : name;
}

function legacyEmployeeNameOnlyLabel(employee: EmployeeDropDown | Record<string, unknown> | null | undefined): string {
  return employeeFirstLast(employee as EmployeeDropDown);
}

function normalizeSearchTerm(term: string | null | undefined): string {
  return (term ?? '').toString().trim().toLowerCase();
}

export function employeeMatchesDropdownInput(
  employee: EmployeeDropDown | Record<string, unknown>,
  input: string | null | undefined
): boolean {
  if (!employee || input == null) {
    return false;
  }
  const term = normalizeSearchTerm(input);
  if (!term) {
    return false;
  }
  const candidates = [
    formatEmployeeDropdownLabel(employee),
    legacyReportingManagerLabel(employee),
    legacyEmployeeNameOnlyLabel(employee),
  ].map((s) => s.toLowerCase());
  return candidates.some((label) => label === term || label.includes(term));
}

export function findEmployeeByDropdownInput(
  value: EmployeeDropDown | string | null | undefined,
  list: EmployeeDropDown[]
): EmployeeDropDown | null {
  if (!list?.length) {
    if (isEmployeeDropdownSelection(value)) {
      return value;
    }
    return null;
  }
  if (isEmployeeDropdownSelection(value)) {
    const id = Number(
      (value as Record<string, unknown>)['employeeID'] ??
        (value as Record<string, unknown>)['EmployeeID'] ??
        0
    );
    if (id > 0) {
      const byId = list.find(
        (e) =>
          e.employeeID === id ||
          Number((e as Record<string, unknown>)['EmployeeID']) === id
      );
      if (byId) {
        return byId;
      }
    }
    return value;
  }
  const term = (value ?? '').toString().trim();
  if (!term) {
    return null;
  }
  const found =
    list.find(
      (e) =>
        formatEmployeeDropdownLabel(e) === term ||
        legacyEmployeeNameOnlyLabel(e) === term ||
        legacyReportingManagerLabel(e) === term ||
        employeeMatchesDropdownInput(e, term)
    ) ?? null;
  return found;
}

export function filterEmployeesForAutocomplete(list: EmployeeDropDown[], term: string): EmployeeDropDown[] {
  const filterValue = normalizeSearchTerm(term);
  if (!filterValue || filterValue.length < 3) {
    return [];
  }
  return (list || []).filter((emp) => {
    const haystack = [
      formatEmployeeDropdownLabel(emp),
      legacyReportingManagerLabel(emp),
      legacyEmployeeNameOnlyLabel(emp),
      emp.mobile,
      emp.employmentStatus,
      emp.email,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(filterValue);
  });
}
