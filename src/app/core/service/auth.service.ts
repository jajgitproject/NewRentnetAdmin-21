import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { RuntimeConfigService } from './runtime-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private API_URL:string = '';

  constructor(
    private http: HttpClient,
    private runtimeConfig: RuntimeConfigService
  ) {
    this.API_URL = this.runtimeConfig.getBaseUrl() + 'Auth';
    const stored = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      stored ? (JSON.parse(stored) as User) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  deactivateAccount(user: any) {
    return this.http.post<any>(this.API_URL + 'deactivate-account', user);
  }

  login(email: string, password: string,userType: string) {
    return this.http
      .post<any>(this.API_URL + "/authenticate", {email,password,userType})
      .pipe(
        map((user) => {
          const normalized = this.normalizeLoginResponse(user);
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(normalized));
          this.currentUserSubject.next(normalized);
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
            EmployeeEntityID:
              rawEmployee.EmployeeEntityID ?? rawEmployee.employeeEntityID,
            EmployeeID: rawEmployee.EmployeeID ?? rawEmployee.employeeID,
            OTP: rawEmployee.OTP ?? rawEmployee.otp,
            Mobile: rawEmployee.Mobile ?? rawEmployee.mobile,
            FirstName: rawEmployee.FirstName ?? rawEmployee.firstName,
            EmployeeEntityPasswordID:
              rawEmployee.EmployeeEntityPasswordID ??
              rawEmployee.employeeEntityPasswordID,
            PasswordType: rawEmployee.PasswordType ?? rawEmployee.passwordType,
          }
        : rawEmployee;

    return {
      ...user,
      Token: token,
      employee,
      Message: user.Message ?? user.message,
    };
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return of({ success: false });
  }
}

