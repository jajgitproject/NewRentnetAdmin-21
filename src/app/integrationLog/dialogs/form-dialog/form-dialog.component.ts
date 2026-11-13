
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { IntegrationLogService } from '../../integrationLog.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IntegrationLog } from '../../integrationLog.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogComponentIL {

  advanceTableForm: FormGroup;
  advanceTable: IntegrationLog[] = [];
  reservationID: number;
  latestEvents: any = {};
  filteredData: any[] = [];
  private readonly multiLogTabs = new Set(['GETOTP', 'ATTENDANCE']);

  tabs = [
    { key: 'ACCEPT', label: 'Confirmation' },
    { key: 'GETOTP', label: 'OTP' },
    { key: 'DriverAssignment', label: 'Allotment' },
    { key: 'startDuty', label: 'LocationOut' },
    { key: 'arrived', label: 'Reached' },
    { key: 'startTrip', label: 'Pickup' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'Tracking', label: 'Tracking' },
    { key: 'endTrip', label: 'DropOff' },
    { key: 'endDuty', label: 'CloseDuty' },
    { key: 'ProcessInvoiceRawData', label: 'Invoice' }
  ];

  selectedTab: string = 'ACCEPT';

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponentIL>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: IntegrationLogService,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.reservationID = data.reservationID;
    this.advanceTableForm = this.createContactForm();
  }

  ngOnInit() {
    this.loadData();
  }


 getTabStatusClass(tabKey: string) {
  const key = tabKey.toUpperCase();
  const entry = this.latestEvents[key];

  if (!entry) {
    return 'tab-default';
  }

  if (this.multiLogTabs.has(key) && Array.isArray(entry)) {
    if (entry.length === 0) {
      return 'tab-default';
    }

    if (entry.some((row) => row.eventStatus !== 'Success')) {
      return 'tab-failure';
    }

    return 'tab-success';
  }

  return entry.eventStatus === 'Success' ? 'tab-success' : 'tab-failure';
}

updateFilteredData() {
  const key = this.selectedTab.toUpperCase();
  const entry = this.latestEvents[key];

  if (this.multiLogTabs.has(key)) {
    this.filteredData = Array.isArray(entry) ? [...entry] : [];
    return;
  }

  this.filteredData = entry ? [entry] : [];
}

  getOtpCallLabel(item: any, index: number): string {
    const phase = this.inferGetOtpPhase(item?.request);
    if (phase) {
      return phase;
    }

    if (this.filteredData.length > 1) {
      return 'OTP call ' + (index + 1);
    }

    return 'OTP';
  }

  private inferGetOtpPhase(request: any): string | null {
    if (!request) {
      return null;
    }

    const riders = Array.isArray(request) ? request : [request];
    if (riders.length === 0) {
      return null;
    }

    const first = riders[0];
    if (!first || typeof first !== 'object') {
      return null;
    }

    const signIn = first.signInOtp ?? first.singInOtp;
    if (signIn === null || signIn === undefined || signIn === '') {
      return 'Start trip';
    }

    if (Array.isArray(request)) {
      return 'Accept';
    }

    return null;
  }

  getAttendanceLabel(item: any): string {
    const request = item?.request;
    const eventName = request?.eventName || 'Attendance';
    const rider = request?.rider?.name || request?.rider?.email || '';
    return rider ? eventName + ' - ' + rider : eventName;
  }

  getStatusClass(status: string) {
    return status === 'Success' ? 'text-success' : 'text-danger';
  }



  createContactForm(): FormGroup {
    return this.fb.group({
      apiIntegrationLogID: [''],
      reservationID: [''],
      travelRequestNo: [''],
      request: [''],
      response: [''],
      eventName: [''],
      eventStatus: [''],
      sentDateTime: [''],
      userID: [''],
    });
  }



loadData() {
  this.advanceTableService.GetIntegrationLogData(this.reservationID)
    .subscribe(data => {

      this.advanceTable = Array.isArray(data) ? data : [data];

      this.advanceTable.forEach(x => {
        try {
          x.request = typeof x.request === 'string'
            ? JSON.parse(x.request)
            : x.request;

          x.response = typeof x.response === 'string'
            ? JSON.parse(x.response)
            : x.response;
        } catch {}
      });

      this.buildLatestEvents();
      this.cdr.detectChanges();
    });
}


buildLatestEvents() {

  this.latestEvents = {};

  this.advanceTable.forEach(item => {

    const key = item.eventName?.toUpperCase();
    if (!key) {
      return;
    }

    if (this.multiLogTabs.has(key)) {
      if (!Array.isArray(this.latestEvents[key])) {
        this.latestEvents[key] = [];
      }

      this.latestEvents[key].push(item);
      return;
    }

    if (
      !this.latestEvents[key] ||
      item.apiIntegrationLogID > this.latestEvents[key].apiIntegrationLogID
    ) {
      this.latestEvents[key] = item;
    }

  });

  this.multiLogTabs.forEach((multiKey) => {
    const rows = this.latestEvents[multiKey];
    if (Array.isArray(rows)) {
      rows.sort((a, b) => a.apiIntegrationLogID - b.apiIntegrationLogID);
    }
  });

  this.selectedTab = 'ACCEPT';
  this.updateFilteredData();

  console.log('Selected Tab:', this.selectedTab);
  console.log('Filtered Data:', this.filteredData);
}


selectTab(tabKey: string) {
  this.selectedTab = tabKey;
  this.updateFilteredData();
}

resend(item: any) {

  const payload = {
    reservationID: item.reservationID,
    eventName: item.eventName,
    travelRequestNo: item.travelRequestNo,
    aggregator: item.aggregator,
    sentBy: this._generalService.getUserID(),
    requestJson: typeof item.request === 'string'
      ? item.request
      : JSON.stringify(item.request)
  };

  this.advanceTableService.resendApi(payload)
    .subscribe({
      next: (res: any) => {

        const isSuccess =
          res?.status === true ||
          res?.status === 'true' ||
          res?.success === true ||
          res?.success === 'true';

        this.snackBar.open(
          isSuccess ? 'Success' : 'Failure',
          'Close',
          {
            duration: 3000,
            panelClass: isSuccess ? ['snackbar-success'] : ['snackbar-error']
          }
        );

        this._generalService.sendUpdate(
          `Resend:${payload.aggregator}:${isSuccess ? 'Success' : 'Failure'}`
        );

        this.loadData();
      },

      error: (err: any) => {
        this.snackBar.open(
          'Failure',
          'Close',
          {
            duration: 3000,
            panelClass: ['snackbar-error']
          }
        );

        this._generalService.sendUpdate(
          `Resend:${payload.aggregator}:Failure`
        );
      }
    });
}

  submit() {}
}

