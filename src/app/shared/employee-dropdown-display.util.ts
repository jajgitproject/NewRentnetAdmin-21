/** Employee dropdown / autocomplete display — name, employment status, mobile. */

export function getEmployeeFullName(employee: any): string {
  if (!employee) {
    return '';
  }
  const fromParts = [
    employee.firstName ?? employee.FirstName ?? employee.employeeFirstName,
    employee.lastName ?? employee.LastName ?? employee.employeeLastName,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (fromParts) {
    return fromParts;
  }
  const apiName = String(employee.name ?? employee.Name ?? '').trim();
  if (!apiName) {
    return '';
  }
  // API Name is often "Full Name - mobile"; keep only the name segment for dropdown labels.
  const dashIdx = apiName.indexOf(' - ');
  if (dashIdx > 0) {
    return apiName.slice(0, dashIdx).trim();
  }
  return apiName;
}

function mobileAlreadyInLabel(name: string, status: string, mobile: string): boolean {
  if (!mobile) {
    return true;
  }
  const mobileNorm = mobile.toLowerCase();
  const haystack = [name, status].filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(mobileNorm);
}

export function getEmployeeEmploymentStatus(employee: any): string {
  return String(employee?.employmentStatus ?? employee?.EmploymentStatus ?? '').trim();
}

export function getEmployeeMobile(employee: any): string {
  return String(employee?.mobile ?? employee?.Mobile ?? '').trim();
}

/** e.g. "Jane Doe - Active - 9876543210" */
export function formatEmployeeDropdownLabel(employee: any): string {
  if (!employee) {
    return '';
  }
  const name = getEmployeeFullName(employee);
  const status = getEmployeeEmploymentStatus(employee);
  const mobile = getEmployeeMobile(employee);
  const parts: string[] = [];
  if (name) {
    parts.push(name);
  }
  if (status) {
    parts.push(status);
  }
  if (mobile && !mobileAlreadyInLabel(name, status, mobile)) {
    parts.push(mobile);
  }
  return parts.join(' - ');
}

export function isEmployeeExited(employee: any): boolean {
  if (!employee) {
    return false;
  }
  const status = getEmployeeEmploymentStatus(employee).replace(/\u200b/g, '').trim().toLowerCase();
  if (status === 'exited') {
    return true;
  }
  const label = formatEmployeeDropdownLabel(employee);
  return /\s-\s*exited\s*-\s/i.test(label);
}

export function isEmployeeDropdownSelection(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

export function displayEmployeeDropdownValue(value: unknown): string {
  if (value == null || value === '') {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (isEmployeeDropdownSelection(value)) {
    return formatEmployeeDropdownLabel(value);
  }
  return String(value);
}

/** Legacy reporting-manager label (employee page) for backward-compatible validation. */
export function legacyReportingManagerLabel(employee: any): string {
  if (!employee) {
    return '';
  }
  const office = employee.employeeOfficeID ?? employee.EmployeeOfficeID ?? '';
  return `${employee.firstName ?? ''} ${employee.lastName ?? ''} ${office}`.replace(/\s+/g, ' ').trim();
}

export function employeeMatchesDropdownInput(employee: any, input: string): boolean {
  const normalized = String(input ?? '').trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  return (
    formatEmployeeDropdownLabel(employee).toLowerCase() === normalized
    || legacyReportingManagerLabel(employee).toLowerCase() === normalized
  );
}

export function findEmployeeByDropdownInput<T extends Record<string, unknown>>(
  value: unknown,
  list: T[] | null | undefined
): T | undefined {
  if (!list?.length) {
    return undefined;
  }
  if (isEmployeeDropdownSelection(value)) {
    const id = value.employeeID ?? value.EmployeeID;
    if (id != null && id !== '') {
      const byId = list.find((e) => String(e.employeeID ?? e.EmployeeID) === String(id));
      if (byId) {
        return byId;
      }
    }
    return value as T;
  }
  const text = String(value ?? '').trim();
  if (!text) {
    return undefined;
  }
  return list.find((e) => employeeMatchesDropdownInput(e, text));
}

export function filterEmployeesForAutocomplete<T extends Record<string, unknown>>(
  list: T[] | null | undefined,
  term: string
): T[] {
  if (!list?.length) {
    return [];
  }
  const filterValue = String(term ?? '').trim().toLowerCase();
  if (!filterValue || filterValue.length < 3) {
    return [];
  }
  return list.filter((employee) => {
    const label = formatEmployeeDropdownLabel(employee).toLowerCase();
    const name = getEmployeeFullName(employee).toLowerCase();
    const mobile = getEmployeeMobile(employee).toLowerCase();
    const status = getEmployeeEmploymentStatus(employee).toLowerCase();
    const legacy = legacyReportingManagerLabel(employee).toLowerCase();
    return (
      label.includes(filterValue)
      || name.includes(filterValue)
      || mobile.includes(filterValue)
      || status.includes(filterValue)
      || legacy.includes(filterValue)
    );
  });
}
