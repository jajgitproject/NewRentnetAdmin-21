import { Injectable, Injector } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { RuntimeConfigService } from './runtime-config.service';
import { TabSessionCoordinatorService } from './tab-session-coordinator.service';
import { SessionTokenService } from './session-token.service';
// Login geolocation disabled (EmployeeLoginSessionSettings.RequireLoginLocation = false on API).

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  constructor(
    private http: HttpClient,
    private runtimeConfig: RuntimeConfigService,
    private tabSessionCoordinator: TabSessionCoordinatorService,
    private injector: Injector
  ) {
    const stored = localStorage.getItem('currentUser');
    let normalized: User | null = null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        normalized = this.normalizeLoginResponse(parsed) as User;
        if (!this.isValidSession(normalized)) {
          localStorage.removeItem('currentUser');
          normalized = null;
        } else {
          const updated = JSON.stringify(normalized);
          if (updated !== stored) {
            localStorage.setItem('currentUser', updated);
          }
          this.syncExpirationDateFromEmployee(normalized);
        }
      } catch {
        localStorage.removeItem('currentUser');
        normalized = null;
      }
    }
    this.currentUserSubject = new BehaviorSubject<User | null>(normalized);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /** Key that ties the OTP-verified flag to one specific login session. */
  private otpSessionKey(user?: any): string | null {
    const u = (user ?? this.currentUserValue) as any;
    if (!u) {
      return null;
    }
    const sessionGuid = u.SessionGuid ?? u.sessionGuid;
    if (sessionGuid) {
      return String(sessionGuid);
    }
    const token = u.Token ?? u.token;
    // Fall back to a token fragment so the flag cannot outlive the session.
    return token ? 'tok:' + String(token).slice(-32) : null;
  }

  markOtpVerified(): void {
    const key = this.otpSessionKey();
    if (key) {
      localStorage.setItem('otpVerifiedSession', key);
    }
  }

  isOtpVerified(): boolean {
    const key = this.otpSessionKey();
    if (!key) {
      return false;
    }
    return localStorage.getItem('otpVerifiedSession') === key;
  }

  private get apiUrl(): string {
    return this.runtimeConfig.getBaseUrl() + 'Auth';
  }

  deactivateAccount(user: any) {
    return this.http.post<any>(this.apiUrl + 'deactivate-account', user);
  }

  login(
    email: string,
    password: string,
    userType: string,
  ) {
    const body: Record<string, unknown> = {
      email, password, userType,
      Email: email, Password: password, UserType: userType,
      loginFrom: 'WebAdmin',
      LoginFrom: 'WebAdmin',
    };
    return this.http.post<any>(this.apiUrl + '/authenticate', body).pipe(
      map((user) => {
        const normalized = this.parseAuthenticateBody(user);
        if (this.isValidSession(normalized)) {
          localStorage.setItem('currentUser', JSON.stringify(normalized));
          this.syncExpirationDateFromEmployee(normalized);
          this.currentUserSubject.next(normalized);
          this.tabSessionCoordinator.registerTab();
        }
        return normalized;
      }),
      tap((normalized) => {
        if (this.isValidSession(normalized)) {
          try {
            this.injector.get(SessionTokenService).startProactiveRefreshScheduling();
          } catch {
            // SessionTokenService unavailable during early bootstrap.
          }
        }
      })
    );
  }

  updateToken(token: string): void {
    if (!token) return;

    const current = this.currentUserValue as any;
    if (!current) return;

    const wasOtpVerified = this.isOtpVerified();

    const updated = this.normalizeLoginResponse({
      ...current,
      Token: token,
      token,
    });

    if (!this.isValidSession(updated)) return;

    localStorage.setItem('currentUser', JSON.stringify(updated));
    this.currentUserSubject.next(updated as User);
    if (wasOtpVerified) {
      this.markOtpVerified();
    }
  }

  /**
   * API may return PascalCase (.NET default) or camelCase (System.Text.Json / some proxies).
   * The app expects Token and employee with PascalCase nested fields.
   */
  private parseAuthenticateBody(user: any): any {
    if (!user) {
      return user;
    }

    let parsed: any = user;
    if (typeof user === 'string') {
      try {
        parsed = JSON.parse(user);
      } catch {
        return this.normalizeLoginResponse({ Status: 'Failure', Message: user });
      }
    }

    const wrapped = parsed?.LoginDetails ?? parsed?.loginDetails;
    if (typeof wrapped === 'string' && wrapped.trim()) {
      try {
        parsed = JSON.parse(wrapped);
      } catch {
        parsed = { Status: 'Failure', Message: wrapped };
      }
    }

    return this.normalizeLoginResponse(parsed);
  }

  private normalizeLoginResponse(user: any): any {
    if (!user || typeof user !== 'object') {
      return user;
    }
    const rawEmployee = user.employee ?? user.Employee;
    const token = user.Token ?? user.token;
    const sessionGuid = user.SessionGuid ?? user.sessionGuid;

    const mapBranchInfo = (branch: any) => {
      if (!branch || typeof branch !== 'object') {
        return null;
      }
      const branchID = branch.BranchID ?? branch.branchID;
      const branchName = branch.BranchName ?? branch.branchName;
      if (branchID == null && !branchName) {
        return null;
      }
      return {
        BranchID: branchID,
        BranchName: branchName,
      };
    };

    const rawBranches = rawEmployee?.branches ?? rawEmployee?.Branches ?? [];
    const branches = Array.isArray(rawBranches)
      ? rawBranches.map(mapBranchInfo).filter(Boolean)
      : [];

    const employee =
      rawEmployee && typeof rawEmployee === 'object'
        ? {
            ...rawEmployee,
            PasswordExpirationDate:
              rawEmployee.PasswordExpirationDate ??
              rawEmployee.passwordExpirationDate,
            RoleID: rawEmployee.RoleID ?? rawEmployee.roleID,
            Role: rawEmployee.Role ?? rawEmployee.role,
            CanCreateReservation:
              rawEmployee.CanCreateReservation ??
              rawEmployee.canCreateReservation,
            CanThisRoleCreateBackDateBooking:
              rawEmployee.CanThisRoleCreateBackDateBooking ??
              rawEmployee.canThisRoleCreateBackDateBooking,
            CanThisRoleCreateBillOnClosingScreen:
              rawEmployee.CanThisRoleCreateBillOnClosingScreen ??
              rawEmployee.canThisRoleCreateBillOnClosingScreen,
            CanThisRoleViewBillOnClosingScreen:
              rawEmployee.CanThisRoleViewBillOnClosingScreen ??
              rawEmployee.canThisRoleViewBillOnClosingScreen,
            CanThisRoleDoGoodForBillingOnClosingScreen:
              rawEmployee.CanThisRoleDoGoodForBillingOnClosingScreen ??
              rawEmployee.canThisRoleDoGoodForBillingOnClosingScreen,
            CanThisRoleViewDummyInvoice:
              rawEmployee.CanThisRoleViewDummyInvoice ??
              rawEmployee.canThisRoleViewDummyInvoice,
            CanActAsContractTariffAuditor:
              rawEmployee.CanActAsContractTariffAuditor ??
              rawEmployee.canActAsContractTariffAuditor,
            CanActAsContractTariffVerifier:
              rawEmployee.CanActAsContractTariffVerifier ??
              rawEmployee.canActAsContractTariffVerifier,
            CanResetOdometer:
              rawEmployee.CanResetOdometer ?? rawEmployee.canResetOdometer,
            CanDeleteFuelEntry:
              rawEmployee.CanDeleteFuelEntry ?? rawEmployee.canDeleteFuelEntry,
            CanFindFuelEntry:
              rawEmployee.CanFindFuelEntry ?? rawEmployee.canFindFuelEntry,
            CanEditDSAfterGoodForBilling:
              rawEmployee.CanEditDSAfterGoodForBilling ??
              rawEmployee.canEditDSAfterGoodForBilling,
            EmployeeEntityID:
              rawEmployee.EmployeeEntityID ?? rawEmployee.employeeEntityID,
            EmployeeID: rawEmployee.EmployeeID ?? rawEmployee.employeeID,
            OTP: rawEmployee.OTP ?? rawEmployee.otp,
            Mobile: rawEmployee.Mobile ?? rawEmployee.mobile,
            FirstName: rawEmployee.FirstName ?? rawEmployee.firstName,
            LastName: rawEmployee.LastName ?? rawEmployee.lastName,
            Gender: rawEmployee.Gender ?? rawEmployee.gender,
            Email: rawEmployee.Email ?? rawEmployee.email,
            EmployeeEntityPasswordID:
              rawEmployee.EmployeeEntityPasswordID ??
              rawEmployee.employeeEntityPasswordID,
            PasswordType: rawEmployee.PasswordType ?? rawEmployee.passwordType,
            ShowAllLocation:
              rawEmployee.ShowAllLocation ?? rawEmployee.showAllLocation ?? false,
            DefaultBranch: mapBranchInfo(
              rawEmployee.DefaultBranch ?? rawEmployee.defaultBranch
            ),
            Branches: branches,
          }
        : rawEmployee;

    return {
      ...user,
      Token: token,
      SessionGuid: sessionGuid,
      employee,
      Message: user.Message ?? user.message,
      Status: user.Status ?? user.status,
    };
  }

  logout() {
    return this.http.post<any>(this.apiUrl + '/logout', this.getSessionPayload()).pipe(
      catchError(() => of(null)),
      map(() => {
        this.clearLocalSession();
        return { success: false };
      })
    );
  }

  clearLocalSession(): void {
    const sessionGuid = this.getSessionGuidFromStorage();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessPages');
    localStorage.removeItem('otpVerifiedSession');
    this.currentUserSubject.next(null);
    this.tabSessionCoordinator.clearCoordinatorState(sessionGuid);
  }

  private getSessionGuidFromStorage(): string | null {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    try {
      const user = JSON.parse(raw);
      const sessionGuid = user?.SessionGuid ?? user?.sessionGuid;
      return sessionGuid ? String(sessionGuid) : null;
    } catch {
      return null;
    }
  }

  private isValidSession(user: any): boolean {
    if (!user || typeof user !== 'object') {
      return false;
    }
    const status = user.Status ?? user.status;
    const token = user.Token ?? user.token;
    const employee = user.employee ?? user.Employee;
    return status === 'Success' && !!token && !!employee;
  }

  private syncExpirationDateFromEmployee(user: any): void {
    const employee = user?.employee ?? user?.Employee;
    const expirationDate =
      employee?.PasswordExpirationDate ?? employee?.passwordExpirationDate;
    if (expirationDate) {
      localStorage.setItem('expirationDate', expirationDate);
    }
  }

  private getSessionPayload(): Record<string, unknown> {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return {};
    try {
      const user = JSON.parse(raw);
      const employee = user?.employee ?? user?.Employee;
      const sessionGuid = user?.SessionGuid ?? user?.sessionGuid;
      const employeeID = employee?.EmployeeID ?? employee?.employeeID;
      return { sessionGuid, SessionGuid: sessionGuid, employeeID, EmployeeID: employeeID };
    } catch {
      return {};
    }
  }
}

