// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { IntegrationLogService } from '../../integrationLog.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IntegrationLog } from '../../integrationLog.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  tabs = [
    { key: 'ACCEPT', label: 'Confirmation' },
    { key: 'DriverAssignment', label: 'Allotment' },
    { key: 'startDuty', label: 'LocationOut' },
    { key: 'arrived', label: 'Reached' },
    { key: 'startTrip', label: 'Pickup' },
    { key: 'endTrip', label: 'DropOff' }
  ];

  selectedTab: string = 'ACCEPT';

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponentIL>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: IntegrationLogService,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {
    this.reservationID = data.reservationID;
    this.advanceTableForm = this.createContactForm();
  }

  ngOnInit() {
    this.loadData();
  }


  getTabStatusClass(tabKey: string) {
    const item = this.advanceTable.find(x =>
      x.eventName?.toUpperCase() === tabKey
    );

    if (!item) return 'tab-default';
    return item.eventStatus === 'Success' ? 'tab-success' : 'tab-failure';
  }

  getFilteredData() {
    return this.advanceTable.filter(x =>
      x.eventName?.toUpperCase() === this.selectedTab
    );
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
            x.request = typeof x.request === 'string' ? JSON.parse(x.request) : x.request;
            x.response = typeof x.response === 'string' ? JSON.parse(x.response) : x.response;
          } catch {
          }
        });
      });
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

