export interface EmployeeLoginHoursSummary {
  employeeID: number;
  employeeName: string;
  employeeLocation?: string;
  periodKey: string;
  sessionCount: number;
  grossMinutes: number;
  inactivityMinutesDeducted: number;
  netMinutes: number;
  netHours: number;
  status?: string;
}

export interface EmployeeLoginSessionRow {
  employeeLoginSessionID: number;
  sessionGuid: string;
  employeeID: number;
  employeeName: string;
  loginAt: string;
  logoutAt?: string;
  effectiveEndAt: string;
  durationMinutes: number;
  grossDurationMinutes?: number;
  actualLogoutAt?: string;
  inactivityMinutesDeducted?: number;
  sessionEndReason?: string;
  employeeLocation?: string;
  status?: string;
  isArchived?: boolean;
}

export interface EmployeeLoginHoursDaily {
  employeeID: number;
  employeeName: string;
  employeeLocation?: string;
  workDateIST: string;
  sessionCount: number;
  grossMinutes: number;
  inactivityMinutesDeducted: number;
  netMinutes: number;
  netHours: number;
  status?: string;
}
