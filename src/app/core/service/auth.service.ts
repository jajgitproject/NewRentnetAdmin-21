import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { RuntimeConfigService } from './runtime-config.service';
// Location-based login disabled for HTTP/VPN internal access. Re-enable when HTTPS is available.
// import { LoginLocationPayload } from './geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  constructor(
    private http: HttpClient,
    private runtimeConfig: RuntimeConfigService
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
    // if (location) {
    //   body.loginLatitude = location.loginLatitude;
    //   body.loginLongitude = location.loginLongitude;
    //   body.locationAccuracyMeters = location.locationAccuracyMeters;
    //   body.locationCapturedAt = location.locationCapturedAt;
    //   body.LoginLatitude = location.loginLatitude;
    //   body.LoginLongitude = location.loginLongitude;
    //   body.LocationAccuracyMeters = location.locationAccuracyMeters;
    //   body.LocationCapturedAt = location.locationCapturedAt;
    // }
    return this.http.post<any>(this.apiUrl + '/authenticate', body).pipe(
      map((user) => {
        let parsed: any = user;
        if (typeof user === 'string') {
          try { parsed = JSON.parse(user); } catch { parsed = user; }
        }
        const normalized = this.normalizeLoginResponse(parsed);
        if (this.isValidSession(normalized)) {
          localStorage.setItem('currentUser', JSON.stringify(normalized));
          this.syncExpirationDateFromEmployee(normalized);
          this.currentUserSubject.next(normalized);
        }
        return normalized;
      })
    );
  }

  /**
   * API may return PascalCase (.NET default) or camelCase (System.Text.Json / some proxies).
   * The app expects Token and employee with PascalCase nested fields.
   */
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
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessPages');
    this.currentUserSubject.next(null);
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

