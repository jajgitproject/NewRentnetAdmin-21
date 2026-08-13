
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';
import { IntegrationLog } from '../integrationLog/integrationLog.model';
import { IntegrationLogService } from '../integrationLog/integrationLog.service';
import { GeneralService } from '../general/general.service';
@Component({
  standalone: false,
  selector: 'app-integrationLogDetail',
  templateUrl: './integrationLogDetail.component.html',
  styleUrls: ['./integrationLogDetail.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class IntegrationLogDetailComponent implements OnInit {

  advanceTableForm: FormGroup;
  advanceTable: IntegrationLog[] = [];
  reservationID: number;
  latestEvents: any = {};
  filteredData: any[] = [];
  

  tabs = [
    { key: 'ACCEPT', label: 'Confirmation' },
    { key: 'DriverAssignment', label: 'Allotment' },
    { key: 'startDuty', label: 'LocationOut' },
    { key: 'arrived', label: 'Reached' },
    { key: 'startTrip', label: 'Pickup' },
    { key: 'Tracking', label: 'Tracking' },
    { key: 'endTrip', label: 'DropOff' },
    { key: 'endDuty', label: 'CloseDuty' },
    { key: 'ProcessInvoiceRawData', label: 'Invoice' }
  ];

  selectedTab: string = 'ACCEPT';
  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
  public advanceTableService: IntegrationLogService,
  private fb: FormBuilder,
  public _generalService: GeneralService,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef
) {
  this.advanceTableForm = this.createContactForm();
}

  ngOnInit() {
  }

  refresh() {
    this.selectedFilter='search';
    this.searchTerm='';
    this.loadData();
  }

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

 getTabStatusClass(tabKey: string) {

  const item = this.latestEvents[tabKey.toUpperCase()];

  if (!item) {
    return 'tab-default';
  }

  return item.eventStatus === 'Success'
    ? 'tab-success'
    : 'tab-failure';
}

updateFilteredData() {

  const item =
    this.latestEvents[this.selectedTab.toUpperCase()];

  this.filteredData = item ? [item] : [];
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
  if(this.selectedFilter==='ReservationID')
  {
    this.reservationID=this.searchTerm;
  }
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

    if (
      !this.latestEvents[key] ||
      item.apiIntegrationLogID > this.latestEvents[key].apiIntegrationLogID
    ) {
      this.latestEvents[key] = item;
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




