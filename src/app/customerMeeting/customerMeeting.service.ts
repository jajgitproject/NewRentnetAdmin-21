// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { CustomerMeeting, CustomerMeetingStatus, CustomerMeetingRemark } from './customerMeeting.model';
import { CustomerGroupMeetingDropDown } from './customerGroupMeetingDropDown.model';
import { CustomerMeetingDropDown } from './customerMeetingDropDown.model';

@Injectable()
export class CustomerMeetingService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerMeeting';
  }

  getTableData(
    userID: number,
    customerGroupID: number,
    modeOfMeeting: string,
    meetingDate: string,
    meetingStatus: string,
    employeeName: string,
    pageNumber: number,
    orderByColumn: string = 'CustomerMeetingID',
    order: string = 'Descending'
  ): Observable<any> {
    const groupId = customerGroupID || 0;
    const mode = !modeOfMeeting ? 'null' : modeOfMeeting;
    const date = !meetingDate ? 'null' : meetingDate;
    const status = !meetingStatus ? 'null' : meetingStatus;
    const employee = !employeeName ? 'null' : employeeName;

    return this.httpClient.get(
      `${this.API_URL}/${userID}/${groupId}/${mode}/${date}/${status}/${employee}/${pageNumber}/${orderByColumn}/${order}`
    );
  }

  add(advanceTable: CustomerMeeting) {
    advanceTable.customerMeetingID = -1;
    advanceTable.userID = this.generalService.getUserID();
    advanceTable.employeeID = this.generalService.getUserID();
    if (advanceTable.meetingDate) {
      advanceTable.meetingDateString = advanceTable.meetingDate.toString();
    }
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  updateStatus(statusModel: CustomerMeetingStatus) {
    statusModel.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(`${this.API_URL}/UpdateStatus`, statusModel);
  }

  getCustomerGroupForDropDown(userID: number): Observable<CustomerGroupMeetingDropDown[]> {
    return this.httpClient.get<CustomerGroupMeetingDropDown[]>(
      `${this.API_URL}/GetCustomerGroupForDropDown/${userID}`
    );
  }

  getCustomerGroupForDropDownPrefix(userID: number, prefix: string): Observable<CustomerGroupMeetingDropDown[]> {
    const term = (prefix || '').trim();
    if (term.length < 3) {
      return of([]);
    }
    return this.httpClient.get<CustomerGroupMeetingDropDown[]>(
      `${this.API_URL}/GetCustomerGroupForDropDownPrefix/${userID}/${encodeURIComponent(term)}`
    );
  }

  getModeOfMeetingForDropDown(): Observable<CustomerMeetingDropDown[]> {
    return this.httpClient.get<CustomerMeetingDropDown[]>(`${this.API_URL}/GetModeOfMeetingForDropDown`);
  }

  getMeetingStatusForDropDown(): Observable<CustomerMeetingDropDown[]> {
    return this.httpClient.get<CustomerMeetingDropDown[]>(`${this.API_URL}/GetMeetingStatusForDropDown`);
  }

  getById(customerMeetingID: number): Observable<any> {
    const meetingId = Number(customerMeetingID) || 0;
    return this.httpClient.get<any>(`${this.API_URL}/${meetingId}`);
  }

  addRemark(remarkModel: CustomerMeetingRemark) {
    const userID = this.generalService.getUserID();
    const payload = {
      CustomerMeetingID: Number(remarkModel.customerMeetingID),
      RemarkByID: userID,
      Remark: remarkModel.remark,
      UserID: userID,
      ActivationStatus: true
    };
    return this.httpClient.post<any>(`${this.API_URL}/AddRemark`, payload);
  }

  getRemarksByCustomerMeetingID(customerMeetingID: number): Observable<CustomerMeetingRemark[]> {
    const meetingId = Number(customerMeetingID) || 0;
    return this.httpClient.get<CustomerMeetingRemark[]>(
      `${this.API_URL}/GetRemarksByCustomerMeetingID/${meetingId}`
    );
  }

  extractRemarks(data: any): any[] {
    if (Array.isArray(data)) {
      return data;
    }
    if (Array.isArray(data?.remarks)) {
      return data.remarks;
    }
    if (Array.isArray(data?.Remarks)) {
      return data.Remarks;
    }
    return [];
  }
}
