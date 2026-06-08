export interface EmployeeLoginHoursSummary {
  employeeID: number;
  employeeName: string;
  periodKey: string;
  sessionCount: number;
  grossMinutes: number;
  overlapMinutes: number;
  inactivityMinutesDeducted: number;
  netMinutes: number;
  netHours: number;
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
  loginLatitude: number;
  loginLongitude: number;
}
