// @ts-nocheck
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DutySlipForBillingService } from './dutySlipForBilling.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BillingHistory } from './dutySlipForBilling.model';
import { ClosingModel } from '../clossingOne/clossingOne.model';
import { Dispute } from '../dispute/dispute.model';
import { ClossingOneService } from '../clossingOne/clossingOne.service';
import { SummaryOfDutyData } from '../summaryOfDuty/summary-of-duty.model';
import {
  SummaryOfDutyDialogComponent,
  SummaryOfDutyDialogData
} from '../summaryOfDuty/summary-of-duty-dialog.component';
import {
  billingDateOnly,
  getBillingTripLegsFromForm,
  resolveBillingTripLegDateTimes,
} from '../shared/billing-datetime-chronology.util';



@Component({
  standalone: false,
  selector: 'app-dutySlipForBilling',
  templateUrl: './dutySlipForBilling.component.html',
  styleUrls: ['./dutySlipForBilling.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DutySlipForBillingComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() advanceTableClosingOne : ClosingModel | null;
  @Input() disputeAdvanceTable : Dispute[] | null;
  @Input() RegistrationNumber;
  @Input() InvoiceID;
  @Input() IRN;
  @Input() hasActiveEInvoice = false;
  @Input() DSClosing;
  @Input() canThisRoleDoGoodForBillingOnClosingScreen = false;
  @Input() canThisRoleViewDummyInvoice = false;
  @Input() canEditDSAfterGoodForBilling = false;
  @Output() dataSaved: EventEmitter<void> = new EventEmitter();
  @Output() dutyStatusChanged = new EventEmitter<{verifyDuty: boolean, goodForBilling: boolean,message: string}>();
  //@Output() dutyMessage = new EventEmitter<string>();
 advanceTableForm:FormGroup;
 panelExpanded: boolean = false;
 selectedKMType: string = '';
 datetime: string = '';
 /** Total KM chain diff (Garage to Garage); null when not computable. */
 diff: number | null = null;
 /** Point-to-point time (pickup → drop-off). */
 datetimeP2P: string = '';
 /** Point-to-point KM (dropOff − pickUp). */
 diffP2P: number | null = null;
 totalKMForManul: any;
 totalKMForApp: any;
 /** Date/time and duty-slip status fields stay editable for all closure types (App, Driver, GPS, Manual). */
 private readonly alwaysEditableControls = [
   'locationOutDateForBilling',
   'locationOutTimeForBilling',
   'reportingToGuestDateForBilling',
   'reportingToGuestTimeForBilling',
   'pickUpDateForBilling',
   'pickUpTimeForBilling',
   'dropOffDateForBilling',
   'dropOffTimeForBilling',
   'locationInDateForBilling',
   'locationInTimeForBilling',
 ];
 /** Address fields editable for all closure types (App, Driver, GPS, Manual). */
 private readonly alwaysEditableAddressControls = [
   'locationOutAddressStringForBilling',
   'reportingToGuestAddressStringForBilling',
   'pickUpAddressStringForBilling',
   'dropOffAddressStringForBilling',
   'locationInAddressStringForBilling',
 ];
 /** KM, lat/long, and remark fields editable only when Manual KM is selected. */
 private readonly manualKmOnlyControls = [
   'runningDetails',
   'vendorRemark',
   'locationOutKMForBilling',
   'locationOutLatLongForBilling',
   'reportingToGuestKMForBilling',
   'reportingToGuestLatLongForBilling',
   'pickUpKMForBilling',
   'pickUpLatLongForBilling',
   'dropOffKMForBilling',
   'dropOffLatLongForBilling',
   'locationInKMForBilling',
   'locationInLatLongForBilling',
 ];
 advanceTableBH : BillingHistory | null;
 CustomerSignatureImage :string = null;
 buttonText: string = 'Save';
  selectedClosureType: string;
  DutySlipID: number;

  saveDisabled: boolean = true;
  Action: string;
  Message: string;
  //DSClosing: any = null;
  showSpinner:boolean = false;
  showSpinnerForVDGB:boolean = false;
  showCalculateBillOverlay = false;
  /** Bill breakdown for Summary of Duty; null uses child demo until mapped from Calculate Bill API. */
  summaryOfDutyData: SummaryOfDutyData | null = null;
  totalDriverAllowanceDays: number | null = null;
  totalNights: number | null = null;
  private loadedDriverAllowanceDays: number | null = null;
  private loadedNights: number | null = null;
  private suppressInitialDutyStatusEmit = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dutySlipForBillingService: DutySlipForBillingService,
    public clossingOneService: ClossingOneService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public _generalService: GeneralService,  
  ) {
      this.advanceTableForm = this.createContactForm();
    }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hasActiveEInvoice'] || changes['canEditDSAfterGoodForBilling'] || changes['advanceTableClosingOne']) {
      this.applyDutySlipEditLockState();
    }
  }

  ngOnInit() 
  {
    this.advanceTableForm.valueChanges.subscribe(value => {
    if (this.suppressInitialDutyStatusEmit) {
      return;
    }
    this.dutyStatusChanged.emit({
      verifyDuty: value.verifyDuty,
      goodForBilling: value.goodForBilling,
      message: value.message
    });
  });
  
    this.Action = this.advanceTableClosingOne.action;
    this.DutySlipID = this.advanceTableClosingOne.closingDutySlipModel.dutySlipID;
    this.advanceTableForm.patchValue({dutySlipForBillingID : this.advanceTableClosingOne.closingDutySlipForBillingModel.dutySlipForBillingID});
    this.advanceTableForm.patchValue({dutySlipID : this.advanceTableClosingOne.closingDutySlipModel.dutySlipID});
    this.advanceTableForm.patchValue({allotmentID : this.advanceTableClosingOne.closingDutySlipModel.allotmentID});
    this.advanceTableForm.patchValue({reservationID : this.advanceTableClosingOne.closingDutySlipModel.reservationID});
    this.advanceTableForm.patchValue({closureStatus:'Closed'});
    this.advanceTableForm.patchValue({dutyTypeID : this.advanceTableClosingOne.closingReservationForPickupDataModel.packageTypeID});
    this.advanceTableForm.patchValue({packageID : this.advanceTableClosingOne.closingReservationForPickupDataModel.packageID});
    if (this.advanceTableClosingOne.closingDutySlipModel.customerSignatureImage) {
      this.CustomerSignatureImage = this._generalService.resolveStaticImageUrl(
        this.advanceTableClosingOne.closingDutySlipModel.customerSignatureImage
      );
      this.advanceTableClosingOne.closingDutySlipModel.customerSignatureImage =
        this.CustomerSignatureImage;
    }
    
    if (this.advanceTableClosingOne.closingDutySlipForBillingModel.dsClosing !== null) {
      this.buttonText = 'Update';
      this.LoadDataForBilling();
    } else {
      this.syncVerifyDutyAndGoodForBillingState();
    }

    this.onKeyUp();
    this.onTimeSelection();
    this.applyClosingFieldDefaults();
    this.applyDutySlipEditLockState();
    this.loadClosingAllowances();
  }

  ngAfterViewInit(): void {
    this.suppressInitialDutyStatusEmit = false;
  }

  submit()
  {

  }

  get isManualClosureMode(): boolean {
    const closureType =
      this.advanceTableForm?.get('closureType')?.value
      ?? this.advanceTableClosingOne?.closingDutySlipForBillingModel?.closureType;
    return closureType === 'Manual';
  }

  toggleBillingManualVisibility(event:any) {
    if (event.value === 'Driver') 
    {
      this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType = event.value;
      this.advanceTableForm.patchValue({closureType : event.value});
      this.advanceTableForm.patchValue({closureMethod:event.value});
      this.InitDriver();
    } 
    else if (event.value === 'App') 
    {
      this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType = event.value;
      this.advanceTableForm.patchValue({closureType : event.value});
      this.advanceTableForm.patchValue({closureMethod:event.value});
      this.InitApp();
    } 
    else if (event.value === 'GPS') 
    {
      this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType = event.value;
      this.advanceTableForm.patchValue({closureType : event.value});
      this.advanceTableForm.patchValue({closureMethod:event.value});
      this.InitGPS();
    }
    else if (event.value === 'Manual') 
    {
      this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType = event.value;
      this.advanceTableForm.patchValue({closureType : event.value});
      this.advanceTableForm.patchValue({closureMethod:event.value});
      this.InitManual();
      if(this.advanceTableClosingOne.closingDutySlipForBillingModel.dsClosing)
      {
      this.LoadDataForBilling();
      }
 
    }
    this.applyManualEditMode();
  }

   InitApp()
  {
    let locationOutLatByApp:string;
    let locationOutLongByApp : string;
    let reportingToGuestLatByApp:string;
    let reportingToGuestLongByApp : string;
    let pickUpLatByApp:string;
    let pickUpLongByApp : string;
    let dropOffLatByApp:string;
    let dropOffLongByApp : string;
    let locationInLatByApp:string;
    let locationInLongByApp : string;

    if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp)
    {
       var value = this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationOutLatByApp=lat;
      locationOutLongByApp=long;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      pickUpLatByApp=lat1;
      pickUpLongByApp=long1;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat2 = value.split(' ')[2];
      var long2 = value.split(' ')[1];
   
      reportingToGuestLatByApp=lat2;
      reportingToGuestLongByApp=long2;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      dropOffLatByApp=lat3;
      dropOffLongByApp=long3;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat4 = value.split(' ')[2];
      var long4 = value.split(' ')[1];
  
      locationInLatByApp=lat4;
      locationInLongByApp=long4;
    }

      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationOutDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutDateByApp});
      this.advanceTableForm.patchValue({locationOutTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutTimeByApp});
      this.advanceTableForm.patchValue({locationOutKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutKMByAppActual});
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp)
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:locationOutLatByApp + ',' + locationOutLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({reportingToGuestDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestDateByApp});
      this.advanceTableForm.patchValue({reportingToGuestTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestTimeByApp});
      this.advanceTableForm.patchValue({reportingToGuestKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestKMByAppActual});
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp)
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:reportingToGuestLatByApp + ',' + reportingToGuestLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null });
      } 

      if(this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate !== null)
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupTime});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpDateByApp});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpTimeByApp});
      }
      
      this.advanceTableForm.patchValue({pickUpKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickupKMByAppActual});
      this.advanceTableForm.patchValue({pickUpAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp)
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:pickUpLatByApp + ',' + pickUpLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({dropOffDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffDateByApp});
      this.advanceTableForm.patchValue({dropOffTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffTimeByApp});
      this.advanceTableForm.patchValue({dropOffKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffKMByAppActual});
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp)
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:dropOffLatByApp + ',' + dropOffLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:null });
      }

      
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationInDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInDateByApp});
      this.advanceTableForm.patchValue({locationInTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInTimeByApp});
      this.advanceTableForm.patchValue({locationInKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInKMByAppActual});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp !== null)
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp});
      }
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp)
      {
        this.advanceTableForm.patchValue({locationInLatLongForBilling:locationInLatByApp + ',' + locationInLongByApp});
      }
      else
      {
        if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp !== null)
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:locationOutLatByApp + ',' + locationOutLongByApp });
        }
        else
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:null });
        }
      }
    
    
    this.onKeyUp();
    this.onTimeSelection();
  }

  InitDriver()
  {
    let locationOutLatByApp:string;
    let locationOutLongByApp : string;
    let reportingToGuestLatByApp:string;
    let reportingToGuestLongByApp : string;
    let pickUpLatByApp:string;
    let pickUpLongByApp : string;
    let dropOffLatByApp:string;
    let dropOffLongByApp : string;
    let locationInLatByApp:string;
    let locationInLongByApp : string;

    if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp)
    {
       var value = this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationOutLatByApp=lat;
      locationOutLongByApp=long;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      pickUpLatByApp=lat1;
      pickUpLongByApp=long1;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat2 = value.split(' ')[2];
      var long2 = value.split(' ')[1];
   
      reportingToGuestLatByApp=lat2;
      reportingToGuestLongByApp=long2;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      dropOffLatByApp=lat3;
      dropOffLongByApp=long3;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat4 = value.split(' ')[2];
      var long4 = value.split(' ')[1];
  
      locationInLatByApp=lat4;
      locationInLongByApp=long4;
    }

      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationOutDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutDateByApp});
      this.advanceTableForm.patchValue({locationOutTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutTimeByApp});
      this.advanceTableForm.patchValue({locationOutKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutKMByApp});
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLatLongByApp)
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:locationOutLatByApp + ',' + locationOutLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({reportingToGuestDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestDateByApp});
      this.advanceTableForm.patchValue({reportingToGuestTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestTimeByApp});
      this.advanceTableForm.patchValue({reportingToGuestKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestKMByApp});
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.reportingToGuestLatLongByApp)
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:reportingToGuestLatByApp + ',' + reportingToGuestLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null });
      } 

      if(this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate !== null)
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupTime});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpDateByApp});
      this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpTimeByApp});
      }
      
      this.advanceTableForm.patchValue({pickUpKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpKMByApp});
      this.advanceTableForm.patchValue({pickUpAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.pickUpLatLongByApp)
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:pickUpLatByApp + ',' + pickUpLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({dropOffDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffDateByApp});
      this.advanceTableForm.patchValue({dropOffTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffTimeByApp});
      this.advanceTableForm.patchValue({dropOffKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffKMByApp});
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffAddressStringByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.dropOffLatLongByApp)
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:dropOffLatByApp + ',' + dropOffLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:null });
      }


      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationInDateForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInDateByApp});
      this.advanceTableForm.patchValue({locationInTimeForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInTimeByApp});
      this.advanceTableForm.patchValue({locationInKMForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInKMByApp});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp !== null)
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp});
      }
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInLatLongByApp)
      {
        this.advanceTableForm.patchValue({locationInLatLongForBilling:locationInLatByApp + ',' + locationInLongByApp});
      }
      else
      {
        if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationOutAddressStringByApp !== null)
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:locationOutLatByApp + ',' + locationOutLongByApp });
        }
        else
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:null });
        }
      }

    this.onKeyUp();
    this.onTimeSelection();
  }

  InitGPS()
  {
    let locationOutLatByGPS:string;
    let locationOutLongByGPS : string;
    let reportingToGuestLatByGPS:string;
    let reportingToGuestLongByGPS : string;
    let pickUpLatByGPS:string;
    let pickUpLongByGPS : string;
    let dropOffLatByGPS:string;
    let dropOffLongByGPS : string;
    let locationInLatByGPS:string;
    let locationInLongByGPS : string;

    if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLatLongByGPS)
    {
       var value = this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationOutLatByGPS=lat;
      locationOutLongByGPS=long;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpLatLongByGPS)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      pickUpLatByGPS=lat1;
      pickUpLongByGPS=long1;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestLatLongByGPS)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat2 = value.split(' ')[2];
      var long2 = value.split(' ')[1];
   
      reportingToGuestLatByGPS=lat2;
      reportingToGuestLongByGPS=long2;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffLatLongByGPS)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      dropOffLatByGPS=lat3;
      dropOffLongByGPS=long3;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInLatLongByGPS)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat4 = value.split(' ')[2];
      var long4 = value.split(' ')[1];
  
      locationInLatByGPS=lat4;
      locationInLongByGPS=long4;
    }

      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationOutDateForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutDateByGPS});
      this.advanceTableForm.patchValue({locationOutTimeForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutTimeByGPS});
      this.advanceTableForm.patchValue({locationOutKMForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutKMByGPS});
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutAddressStringByGPS});
      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLatLongByGPS)
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:locationOutLatByGPS + ',' + locationOutLongByGPS});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({reportingToGuestDateForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestDateByGPS});
      this.advanceTableForm.patchValue({reportingToGuestTimeForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestTimeByGPS});
      this.advanceTableForm.patchValue({reportingToGuestKMForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestKMByGPS});
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestAddressStringByGPS});
      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.reportingToGuestLatLongByGPS)
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:reportingToGuestLatByGPS + ',' + reportingToGuestLongByGPS});
      }
      else
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null });
      } 

      if(this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate !== null)
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupTime});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpDateByGPS});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpTimeByGPS});
      }

      
      this.advanceTableForm.patchValue({pickUpKMForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpKMByGPS});
      this.advanceTableForm.patchValue({pickUpAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpAddressStringByGPS});
      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.pickUpLatLongByGPS)
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:pickUpLatByGPS + ',' + pickUpLongByGPS});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({dropOffDateForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffDateByGPS});
      this.advanceTableForm.patchValue({dropOffTimeForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffTimeByGPS});
      this.advanceTableForm.patchValue({dropOffKMForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffKMByGPS});
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffAddressStringByGPS});
      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.dropOffLatLongByGPS)
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:dropOffLatByGPS + ',' + dropOffLongByGPS});
      }
      else
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:null });
      }


      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationInDateForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInDateByGPS});
      this.advanceTableForm.patchValue({locationInTimeForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInTimeByGPS});
      this.advanceTableForm.patchValue({locationInKMForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInKMByGPS});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp !== null)
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInAddressStringByGPS});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutAddressStringByGPS});
      }
      if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationInLatLongByGPS)
      {
        this.advanceTableForm.patchValue({locationInLatLongForBilling:locationInLatByGPS + ',' + locationInLongByGPS});
      }
      else
      {
        if(this.advanceTableClosingOne.closingDutySlipByGPSModel.locationOutLatLongByGPS !== null)
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:locationOutLatByGPS + ',' + locationOutLongByGPS});
        }
        else
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:null });
        }
      }
    
    this.onKeyUp();
    this.onTimeSelection();
  }

  InitManual()
  {
    let locationOutLatByDriver:string;
    let locationOutLongByDriver : string;
    let reportingToGuestLatByDriver:string;
    let reportingToGuestLongByDriver : string;
    let pickUpLatByDriver:string;
    let pickUpLongByDriver : string;
    let dropOffLatByDriver:string;
    let dropOffLongByDriver : string;
    let locationInLatByDriver:string;
    let locationInLongByDriver : string;

    if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLatLongByDriver)
    {
       var value = this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationOutLatByDriver=lat;
      locationOutLongByDriver=long;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpLatLongByDriver)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      pickUpLatByDriver=lat1;
      pickUpLongByDriver=long1;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestLatLongByDriver)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat2 = value.split(' ')[2];
      var long2 = value.split(' ')[1];
   
      reportingToGuestLatByDriver=lat2;
      reportingToGuestLongByDriver=long2;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffLatLongByDriver)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      dropOffLatByDriver=lat3;
      dropOffLongByDriver=long3;
    }
   
    if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInLatLongByDriver)
    {
      var value = this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat4 = value.split(' ')[2];
      var long4 = value.split(' ')[1];
  
      locationInLatByDriver=lat4;
      locationInLongByDriver=long4;
    }


      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationOutDateForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutDateByDriver});
      this.advanceTableForm.patchValue({locationOutTimeForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutTimeByDriver});
      this.advanceTableForm.patchValue({locationOutKMForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutKMByDriver});
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutAddressStringByDriver});
      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLatLongByDriver)
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:locationOutLatByDriver + ',' + locationOutLongByDriver});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({reportingToGuestDateForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestDateByDriver});
      this.advanceTableForm.patchValue({reportingToGuestTimeForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestTimeByDriver});
      this.advanceTableForm.patchValue({reportingToGuestKMForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestKMByDriver});
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestAddressStringByDriver});
      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.reportingToGuestLatLongByDriver)
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:reportingToGuestLatByDriver + ',' + reportingToGuestLongByDriver});
      }
      else
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null });
      } 

      if(this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate !== null)
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupTime});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpDateByDriver});
        this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpTimeByDriver});
      }
      
      this.advanceTableForm.patchValue({pickUpKMForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpKMByDriver});
      this.advanceTableForm.patchValue({pickUpAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpAddressStringByDriver});
      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.pickUpLatLongByDriver)
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:pickUpLatByDriver + ',' + pickUpLongByDriver});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:null });
      } 

      this.advanceTableForm.patchValue({dropOffDateForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffDateByDriver});
      this.advanceTableForm.patchValue({dropOffTimeForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffTimeByDriver});
      this.advanceTableForm.patchValue({dropOffKMForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffKMByDriver});
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffAddressStringByDriver});
      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.dropOffLatLongByDriver)
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:dropOffLatByDriver + ',' + dropOffLongByDriver});
      }
      else
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:null });
      }


      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLocationOrHubID)
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLocationOrHubID});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInLocationOrHubID : 0});
      }
      this.advanceTableForm.patchValue({locationInDateForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInDateByDriver});
      this.advanceTableForm.patchValue({locationInTimeForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInTimeByDriver});
      this.advanceTableForm.patchValue({locationInKMForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInKMByDriver});
      if(this.advanceTableClosingOne.closingDutySlipByAppModel.locationInAddressStringByApp !== null)
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInAddressStringByDriver});
      }
      else
      {
        this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutAddressStringByDriver});
      }

      
      if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationInLatLongByDriver)
      {
        this.advanceTableForm.patchValue({locationInLatLongForBilling:locationInLatByDriver + ',' + locationInLongByDriver});
      }
      else
      {
        if(this.advanceTableClosingOne.closingDutySlipByDriverModel.locationOutLatLongByDriver !== null)
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:locationOutLatByDriver + ',' + locationOutLongByDriver});
        }
        else
        {
          this.advanceTableForm.patchValue({locationInLatLongForBilling:null });
        }
      }
    this.applyReportingFromPickupFallbackToForm();
    this.onKeyUp();
    this.onTimeSelection();
  }

  get isEInvoiceBlockingEdits(): boolean {
    return this.hasActiveEInvoice === true || this.advanceTableClosingOne?.hasActiveEInvoice === true;
  }

  /** Effective DS Edit permission (Input and/or session). */
  get hasDsEditPermission(): boolean {
    return this.canEditDSAfterGoodForBilling === true || this.readDsEditFromSession();
  }

  get canEditClosingAllowances(): boolean {
    return this.isDutyCalculated && !this.isDutySlipEditBlocked;
  }

  private toAllowanceNumber(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0;
  }

  private applyClosingFieldDefaults(): void {
    if (!this.advanceTableForm) {
      return;
    }
    this.advanceTableForm.patchValue(
      {
        dsClosing: 'Closed',
        physicalDutySlipReceived: true,
      },
      { emitEvent: false }
    );
    if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
      this.advanceTableClosingOne.closingDutySlipForBillingModel.dsClosing = 'Closed';
      this.advanceTableClosingOne.closingDutySlipForBillingModel.physicalDutySlipReceived = true;
    }
    this.advanceTableForm.get('dsClosing')?.disable({ emitEvent: false });
    this.advanceTableForm.get('physicalDutySlipReceived')?.disable({ emitEvent: false });
  }

  private validateClosingStatusForGfb(): boolean {
    const form = this.advanceTableForm.getRawValue();
    if (!form.dsClosing) {
      Swal.fire('', 'Please Select DS Closing Option.', 'warning');
      return false;
    }
    if (
      form.physicalDutySlipReceived === ''
      || form.physicalDutySlipReceived === null
      || form.physicalDutySlipReceived === undefined
    ) {
      Swal.fire('', 'Please Select Duty Slip Received Option.', 'warning');
      return false;
    }
    return true;
  }

  private syncClosingModelFromResponse(response: any): void {
    const dsClosing = response?.dsClosing ?? response?.DsClosing;
    const physicalDutySlipReceived =
      response?.physicalDutySlipReceived ?? response?.PhysicalDutySlipReceived;
    if (dsClosing !== undefined && dsClosing !== null) {
      this.advanceTableForm.patchValue({ dsClosing }, { emitEvent: false });
      if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
        this.advanceTableClosingOne.closingDutySlipForBillingModel.dsClosing = dsClosing;
      }
    }
    if (physicalDutySlipReceived !== undefined && physicalDutySlipReceived !== null) {
      this.advanceTableForm.patchValue({ physicalDutySlipReceived }, { emitEvent: false });
      if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
        this.advanceTableClosingOne.closingDutySlipForBillingModel.physicalDutySlipReceived =
          !!physicalDutySlipReceived;
      }
    }
    this.applyClosingFieldDefaults();
  }

  private applyClosingAllowanceValues(response: any): void {
    this.totalDriverAllowanceDays = this.toAllowanceNumber(
      response?.totalDriverAllowanceDays ?? response?.TotalDriverAllowanceDays
    );
    this.totalNights = this.toAllowanceNumber(
      response?.totalNights ?? response?.TotalNights
    );
    this.loadedDriverAllowanceDays = this.totalDriverAllowanceDays;
    this.loadedNights = this.totalNights;
  }

  private mapClosingAllowancesFromSummary(response: any): void {
    if (response == null) {
      this.totalDriverAllowanceDays = 0;
      this.totalNights = 0;
      this.loadedDriverAllowanceDays = 0;
      this.loadedNights = 0;
      return;
    }

    const driver =
      response?.invoiceDriverAllownceModel
      ?? response?.InvoiceDriverAllownceModel;
    const night =
      response?.invoiceNightModel
      ?? response?.InvoiceNightModel;

    this.totalDriverAllowanceDays = this.toAllowanceNumber(
      driver?.totalDriverAllowanceDays ?? driver?.TotalDriverAllowanceDays
    );
    this.totalNights = this.toAllowanceNumber(
      night?.totalNights ?? night?.TotalNights
    );
    this.loadedDriverAllowanceDays = this.totalDriverAllowanceDays;
    this.loadedNights = this.totalNights;
  }

  loadClosingAllowances(): void {
    if (this.DutySlipID == null || this.DutySlipID === '') {
      return;
    }

    this.clossingOneService.getDutyBillingSummary(this.DutySlipID).subscribe(
      (response) => this.mapClosingAllowancesFromSummary(response),
      () => {
        if (!this.isDutyCalculated) {
          this.totalDriverAllowanceDays = 0;
          this.totalNights = 0;
          this.loadedDriverAllowanceDays = 0;
          this.loadedNights = 0;
        }
      }
    );
  }

  private haveClosingAllowancesChanged(): boolean {
    const driver = this.toAllowanceNumber(this.totalDriverAllowanceDays);
    const night = this.toAllowanceNumber(this.totalNights);
    return (
      driver !== this.toAllowanceNumber(this.loadedDriverAllowanceDays)
      || night !== this.toAllowanceNumber(this.loadedNights)
    );
  }

  private saveClosingAllowancesIfChanged(onComplete?: () => void): void {
    if (!this.canEditClosingAllowances || !this.haveClosingAllowancesChanged()) {
      onComplete?.();
      return;
    }

    this.clossingOneService.updateClosingAllowances(this.DutySlipID, {
      totalDriverAllowanceDays: this.toAllowanceNumber(this.totalDriverAllowanceDays),
      totalNights: this.toAllowanceNumber(this.totalNights),
    }).subscribe(
      (response) => {
        this.applyClosingAllowanceValues(response);
        onComplete?.();
      },
      (error) => {
        this.showSpinner = false;
        this.showNotification(
          'snackbar-danger',
          this.extractApiErrorMessage(error, 'Failed to save driver/night allowance.'),
          'bottom',
          'center'
        );
      }
    );
  }

  private readDsEditFromSession(): boolean {
    const fromStorage = localStorage.getItem('canEditDSAfterGoodForBilling');
    if (this.isTruthyFlag(fromStorage)) {
      return true;
    }
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const employee = currentUser?.employee ?? currentUser?.Employee ?? {};
      return this.isTruthyFlag(
        employee?.canEditDSAfterGoodForBilling ?? employee?.CanEditDSAfterGoodForBilling
      );
    } catch {
      return false;
    }
  }

  private isTruthyFlag(value: unknown): boolean {
    if (value === true || value === 1) {
      return true;
    }
    if (value == null) {
      return false;
    }
    const normalized = value.toString().trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }

  private isBillingFlagTrue(value: unknown): boolean {
    return value === true || value === 1 || value === '1'
      || value === 'true' || value === 'True' || value === 'TRUE';
  }

  private toFormIntOrNull(value: unknown): number | null {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  private toFormIntOrZero(value: unknown): number {
    return this.toFormIntOrNull(value) ?? 0;
  }

  private isValidBillingDate(value: unknown): boolean {
    if (value === '' || value === null || value === undefined) {
      return false;
    }
    const date = value instanceof Date ? value : new Date(value as any);
    return !Number.isNaN(date.getTime());
  }

  /** Pickup = reporting when reporting leg was never captured separately. */
  private applyReportingFromPickupFallbackToForm(): void {
    const form = this.advanceTableForm.getRawValue();
    if (this.isValidBillingDate(form.reportingToGuestDateForBilling)) {
      return;
    }
    if (!this.isValidBillingDate(form.pickUpDateForBilling)) {
      return;
    }

    const patch: Record<string, unknown> = {
      reportingToGuestDateForBilling: form.pickUpDateForBilling,
      reportingToGuestTimeForBilling: this.isValidBillingDate(form.pickUpTimeForBilling)
        ? form.pickUpTimeForBilling
        : form.pickUpDateForBilling,
    };

    if (!form.reportingToGuestKMForBilling && form.pickUpKMForBilling) {
      patch.reportingToGuestKMForBilling = form.pickUpKMForBilling;
    }
    if (!form.reportingToGuestAddressStringForBilling && form.pickUpAddressStringForBilling) {
      patch.reportingToGuestAddressStringForBilling = form.pickUpAddressStringForBilling;
    }
    if (!form.reportingToGuestLatLongForBilling && form.pickUpLatLongForBilling) {
      patch.reportingToGuestLatLongForBilling = form.pickUpLatLongForBilling;
    }

    this.advanceTableForm.patchValue(patch);
  }

  private extractApiErrorMessage(error: any, fallback: string): string {
    const body = error?.error ?? error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body?.message || body?.Message) {
      return body.message ?? body.Message;
    }
    const errors = body?.errors ?? body?.Errors;
    if (errors && typeof errors === 'object') {
      const messages: string[] = [];
      for (const key of Object.keys(errors)) {
        const entry = errors[key];
        if (Array.isArray(entry)) {
          messages.push(...entry.filter((m) => !!m).map((m) => String(m)));
        } else if (entry) {
          messages.push(String(entry));
        }
      }
      if (messages.length) {
        return messages.join(' ');
      }
    }
    if (body?.title || body?.Title) {
      return body.title ?? body.Title;
    }
    return fallback;
  }

  private getBillingFlag(primary: unknown, fallback?: unknown): boolean {
    if (primary !== undefined && primary !== null && primary !== '') {
      return this.isBillingFlagTrue(primary);
    }
    return this.isBillingFlagTrue(fallback);
  }

  get isGoodForBillingBlockingEdits(): boolean {
    const billing = this.advanceTableClosingOne?.closingDutySlipForBillingModel;
    const dutySlip = this.advanceTableClosingOne?.closingDutySlipModel;
    const isGfb = this.getBillingFlag(
      billing?.goodForBilling ?? (billing as any)?.GoodForBilling,
      dutySlip?.goodForBilling ?? (dutySlip as any)?.GoodForBilling
        ?? this.advanceTableForm?.get('goodForBilling')?.value
    );
    return isGfb && !this.hasDsEditPermission;
  }

  get isDutySlipEditBlocked(): boolean {
    return this.isEInvoiceBlockingEdits || this.isGoodForBillingBlockingEdits;
  }

  private applyDutySlipEditLockState(): void {
    if (!this.advanceTableForm) {
      return;
    }
    if (this.isDutySlipEditBlocked) {
      this.advanceTableForm.disable({ emitEvent: false });
      return;
    }
    this.advanceTableForm.enable({ emitEvent: false });
    this.applyManualEditMode();
    this.applyClosingFieldDefaults();
    this.syncVerifyDutyAndGoodForBillingState();
  }

  /** Date/time and addresses always editable; KM/lat-long only when Manual KM. DS Closing fields are always locked. */
  private applyManualEditMode(): void {
    if (!this.advanceTableForm || this.isDutySlipEditBlocked) {
      return;
    }
    for (const name of this.alwaysEditableControls) {
      this.advanceTableForm.get(name)?.enable({ emitEvent: false });
    }
    for (const name of this.alwaysEditableAddressControls) {
      this.advanceTableForm.get(name)?.enable({ emitEvent: false });
    }
    const allowManualKmEdit = this.isManualClosureMode;
    for (const name of this.manualKmOnlyControls) {
      const control = this.advanceTableForm.get(name);
      if (!control) {
        continue;
      }
      if (allowManualKmEdit) {
        control.enable({ emitEvent: false });
      } else {
        control.disable({ emitEvent: false });
      }
    }
    // Closure type radio must stay selectable so users can switch to Manual.
    this.advanceTableForm.get('closureType')?.enable({ emitEvent: false });
  }

  private guardDutySlipEdit(): boolean {
    if (this.isEInvoiceBlockingEdits) {
      this.showNotification(
        'snackbar-warning',
        'E-Invoice (IRN) is already generated and active. Changes are not allowed.',
        'bottom',
        'center'
      );
      return false;
    }
    if (this.isGoodForBillingBlockingEdits) {
      this.showNotification(
        'snackbar-warning',
        'Duty slip is marked Good for Billing. Your role is not allowed to make changes.',
        'bottom',
        'center'
      );
      return false;
    }
    return true;
  }

  get isDutyCalculated(): boolean {
    const dsClosing =
      this.advanceTableClosingOne?.closingDutySlipForBillingModel?.dsClosing ??
      this.advanceTableForm?.get('dsClosing')?.value;
    return dsClosing !== null && dsClosing !== undefined && dsClosing !== '';
  }

  /** DS Edit may toggle GFB even without the dedicated GFB role flag. */
  get canToggleGoodForBilling(): boolean {
    return this.canThisRoleDoGoodForBillingOnClosingScreen || this.hasDsEditPermission;
  }

  private syncVerifyDutyAndGoodForBillingState(): void {
    if (this.isDutySlipEditBlocked) {
      this.advanceTableForm.get('verifyDuty')?.disable({ emitEvent: false });
      this.advanceTableForm.get('goodForBilling')?.disable({ emitEvent: false });
      return;
    }
    if (!this.isDutyCalculated) {
      this.advanceTableForm.controls['goodForBilling'].disable();
      this.advanceTableForm.controls['verifyDuty'].disable();
      return;
    }
    if (this.isEInvoiceBlockingEdits) {
      this.advanceTableForm.get('verifyDuty')?.disable();
      this.advanceTableForm.get('goodForBilling')?.disable();
      return;
    }
    this.advanceTableForm.get('verifyDuty')?.enable({ emitEvent: false });
    if (this.canToggleGoodForBilling) {
      this.advanceTableForm.get('goodForBilling')?.enable({ emitEvent: false });
    } else {
      this.advanceTableForm.get('goodForBilling')?.disable({ emitEvent: false });
    }
  }

  public LoadDataForBilling()
  {
    this.syncVerifyDutyAndGoodForBillingState();
    let locationOutLatForBilling:string;
    let locationOutLongForBilling : string;
    let reportingToGuestLatForBilling:string;
    let reportingToGuestLongForBilling : string;
    let pickUpLatForBilling:string;
    let pickUpLongForBilling : string;
    let dropOffLatForBilling:string;
    let dropOffLongForBilling : string;
    let locationInLatForBilling:string;
    let locationInLongForBilling : string;

    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutLatLongForBilling)
    {
       var value = this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationOutLatForBilling=lat;
      locationOutLongForBilling=long;
    }

    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestLatLongForBilling)
    {
       var value = this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      reportingToGuestLatForBilling=lat;
      reportingToGuestLongForBilling=long;
    }

    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpLatLongForBilling)
    {
       var value = this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      pickUpLatForBilling=lat;
      pickUpLongForBilling=long;
    }

    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffLatLongForBilling)
    {
       var value = this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      dropOffLatForBilling=lat;
      dropOffLongForBilling=long;
    }

    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInLatLongForBilling)
    {
       var value = this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      locationInLatForBilling=lat;
      locationInLongForBilling=long;
    }

    this.advanceTableForm.patchValue({locationOutDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutDateForBilling});
    this.advanceTableForm.patchValue({locationOutTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutTimeForBilling});
    this.advanceTableForm.patchValue({locationOutKMForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutKMForBilling});
    this.advanceTableForm.patchValue({locationOutAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutAddressStringForBilling});
    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutLatLongForBilling)
    {
      this.advanceTableForm.patchValue({locationOutLatLongForBilling:locationOutLatForBilling + ',' + locationOutLongForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({locationOutLatLongForBilling:null});
    }

    this.advanceTableForm.patchValue({reportingToGuestDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestDateForBilling});
    this.advanceTableForm.patchValue({reportingToGuestTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestTimeForBilling});
    this.advanceTableForm.patchValue({reportingToGuestKMForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestKMForBilling});
    this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestAddressStringForBilling});
    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.reportingToGuestLatLongForBilling)
    {
      this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:reportingToGuestLatForBilling + ',' + reportingToGuestLongForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null});
    }

    if(this.advanceTableClosingOne.closingReservationForPickupDataModel.pickupDate !== null)
    {
      this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpDateForBilling});
      this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpTimeForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({pickUpDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpDateForBilling});
      this.advanceTableForm.patchValue({pickUpTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpTimeForBilling});
    }

    this.advanceTableForm.patchValue({pickUpKMForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpKMForBilling});
    this.advanceTableForm.patchValue({pickUpAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpAddressStringForBilling});
    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.pickUpLatLongForBilling)
    {
      this.advanceTableForm.patchValue({pickUpLatLongForBilling:pickUpLatForBilling + ',' + pickUpLongForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({pickUpLatLongForBilling:null});
    }

    this.applyReportingFromPickupFallbackToForm();

    this.advanceTableForm.patchValue({dropOffDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffDateForBilling});
    this.advanceTableForm.patchValue({dropOffTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffTimeForBilling});
    this.advanceTableForm.patchValue({dropOffKMForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffKMForBilling});
    this.advanceTableForm.patchValue({dropOffAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffAddressStringForBilling});
    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.dropOffLatLongForBilling)
    {
      this.advanceTableForm.patchValue({dropOffLatLongForBilling:dropOffLatForBilling + ',' + dropOffLongForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({dropOffLatLongForBilling:null});
    }

    this.advanceTableForm.patchValue({locationInDateForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInDateForBilling});
    this.advanceTableForm.patchValue({locationInTimeForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInTimeForBilling});
    this.advanceTableForm.patchValue({locationInKMForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInKMForBilling});
    this.advanceTableForm.patchValue({locationInAddressStringForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInAddressStringForBilling});
    if(this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInLatLongForBilling)
    {
      this.advanceTableForm.patchValue({locationInLatLongForBilling:locationInLatForBilling + ',' + locationInLongForBilling});
    }
    else
    {
      this.advanceTableForm.patchValue({locationInLatLongForBilling:null});
    }

    this.advanceTableForm.patchValue({
      locationOutLocationOrHubID: this.toFormIntOrNull(
        this.advanceTableClosingOne.closingDutySlipForBillingModel.locationOutLocationOrHubID
      )
    });
    this.advanceTableForm.patchValue({
      locationInLocationOrHubID: this.toFormIntOrZero(
        this.advanceTableClosingOne.closingDutySlipForBillingModel.locationInLocationOrHubID
      )
    });
    this.advanceTableForm.patchValue({closureType : this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType});
    this.advanceTableForm.patchValue({dutyTypeID : this.advanceTableClosingOne.closingReservationForPickupDataModel.packageTypeID});
    this.advanceTableForm.patchValue({packageID : this.advanceTableClosingOne.closingReservationForPickupDataModel.packageID});
    this.advanceTableForm.patchValue({closureStatus : this.advanceTableClosingOne.closingDutySlipModel.closureStatus});
    this.advanceTableForm.patchValue({closureMethod : this.advanceTableClosingOne.closingDutySlipModel.closureMethod});
    const billing = this.advanceTableClosingOne.closingDutySlipForBillingModel;
    const dutySlip = this.advanceTableClosingOne.closingDutySlipModel;
    const verifyDuty = this.getBillingFlag(
      billing?.verifyDuty ?? (billing as any)?.VerifyDuty,
      dutySlip?.verifyDuty ?? (dutySlip as any)?.VerifyDuty
    );
    const goodForBilling = this.getBillingFlag(
      billing?.goodForBilling ?? (billing as any)?.GoodForBilling,
      dutySlip?.goodForBilling ?? (dutySlip as any)?.GoodForBilling
    );
    // Keep model in sync so lock getters stay correct after refresh.
    if (billing) {
      billing.verifyDuty = verifyDuty;
      billing.goodForBilling = goodForBilling;
    }
    this.advanceTableForm.patchValue({ verifyDuty });
    this.advanceTableForm.patchValue({dsClosing : this.advanceTableClosingOne.closingDutySlipForBillingModel.dsClosing});
    this.advanceTableForm.patchValue({runningDetails : this.advanceTableClosingOne.closingDutySlipForBillingModel.runningDetails});
    this.advanceTableForm.patchValue({vendorRemark : this.advanceTableClosingOne.closingDutySlipForBillingModel.vendorRemark});
    this.advanceTableForm.patchValue({physicalDutySlipReceived : this.advanceTableClosingOne.closingDutySlipForBillingModel?.physicalDutySlipReceived});
    this.advanceTableForm.patchValue({goodForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.goodForBilling});
    this.selectedClosureType = this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType;
    //this.advanceTableForm.patchValue({actionTaken : this.advanceTableClosingOne.closingDutySlipModel.actionTaken});
    //this.advanceTableForm.patchValue({actionDetails : this.advanceTableClosingOne.closingDutySlipModel.actionDetails});
    this.onKeyUp();
    this.onTimeSelection();
    this.applyClosingFieldDefaults();
    this.applyDutySlipEditLockState();
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutySlipForBillingID: [null],
      dutySlipID: [null],
      locationOutLocationOrHubID: [null],
      locationInLocationOrHubID: [0],
      closureType:[''],
      reservationID:[''],
      allotmentID:[''],

      locationOutDateForBilling: [''],
      locationOutTimeForBilling: [''],
      locationOutKMForBilling: [''],
      locationOutLatLongForBilling: [''],
      locationOutAddressStringForBilling: [''],

      reportingToGuestDateForBilling: [''],
      reportingToGuestTimeForBilling: [''],
      reportingToGuestKMForBilling: [''],
      reportingToGuestLatLongForBilling: [''],
      reportingToGuestAddressStringForBilling: [''],
      
      pickUpDateForBilling: [''],
      pickUpTimeForBilling: [''],
      pickUpKMForBilling: [''],
      pickUpLatLongForBilling: [''],
      pickUpAddressStringForBilling: [''],

      dropOffDateForBilling: [''],
      dropOffTimeForBilling: [''],
      dropOffKMForBilling: [''],
      dropOffLatLongForBilling: [''],
      dropOffAddressStringForBilling: [''],

      locationInDateForBilling: [''],
      locationInTimeForBilling: [''],
      locationInKMForBilling: [''],
      locationInLatLongForBilling: [''],
      locationInAddressStringForBilling: [''],
      
      dutyTypeID: [''],
      packageID: [''],
      closureStatus: [''],
      closureMethod:[''],

      goodForBilling: [''],
      verifyDuty: [''],
      dsClosing: ['Closed'],
      runningDetails:[''],
      vendorRemark:[''],
      physicalDutySlipReceived:[true],
      actionTaken:[''],
      actionDetails:['']
    });
  } 
  
//---------- Location Out Date For Billing ----------
  onLocOutDatepickerChange(event: any): void  {         
    const inputElement = event.targetElement;
    if (inputElement)
    {
      this.onBlurLocOutDateUpdateDate({ target: inputElement});
      
    }
    
    
  }

  onBlurLocOutDateUpdateDate(event: any): void {
    let value = event.target.value;
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('locationOutDateForBilling')?.setValue(formattedDate);    
    } 
    else 
    {
      this.advanceTableForm.get('locationOutDateForBilling')?.setErrors({ invalidDate: true });
    }
    this.onTimeSelection();
  }

  onTimeSelection() {
    const locOutTime = this.advanceTableForm.get('locationOutTimeForBilling')?.value;
    const locOutDate = this.advanceTableForm.get('locationOutDateForBilling')?.value;
    const pickUpTime = this.advanceTableForm.get('pickUpTimeForBilling')?.value;
    const pickUpDate = this.advanceTableForm.get('pickUpDateForBilling')?.value;
    const dropOffTime = this.advanceTableForm.get('dropOffTimeForBilling')?.value;
    const dropOffDate = this.advanceTableForm.get('dropOffDateForBilling')?.value;
    const locInTime = this.advanceTableForm.get('locationInTimeForBilling')?.value;
    const locInDate = this.advanceTableForm.get('locationInDateForBilling')?.value;

    const hasAll = this.hasAllRequiredDateTimeFields();

    if (!hasAll) {
      this.datetime = '';
      this.datetimeP2P = '';
      return;
    }

    if (
      !moment(locOutDate).isValid() ||
      !moment(locOutTime).isValid() ||
      !moment(pickUpDate).isValid() ||
      !moment(pickUpTime).isValid() ||
      !moment(dropOffDate).isValid() ||
      !moment(dropOffTime).isValid() ||
      !moment(locInDate).isValid() ||
      !moment(locInTime).isValid()
    ) {
      this.datetime = '';
      this.datetimeP2P = '';
      return;
    }

    // Moment uses YYYY (not lowercase yyyy) for 4-digit year
    const locOutTimeConversion = moment(locOutTime).format('HH:mm');
    const locOutDateConversion = moment(locOutDate).format('YYYY-MM-DD');
    const locationOutDateTime = locOutDateConversion + ' ' + locOutTimeConversion;

    const pickUpTimeConversion = moment(pickUpTime).format('HH:mm');
    const pickUpDateConversion = moment(pickUpDate).format('YYYY-MM-DD');
    const pickUpDateTime = pickUpDateConversion + ' ' + pickUpTimeConversion;

    const dropOffTimeConversion = moment(dropOffTime).format('HH:mm');
    const dropOffDateConversion = moment(dropOffDate).format('YYYY-MM-DD');
    const dropOffDateTime = dropOffDateConversion + ' ' + dropOffTimeConversion;

    const locInTimeConversion = moment(locInTime).format('HH:mm');
    const locInDateConversion = moment(locInDate).format('YYYY-MM-DD');
    const locInDateTime = locInDateConversion + ' ' + locInTimeConversion;

    const t0 = new Date(locationOutDateTime).getTime();
    const t1 = new Date(pickUpDateTime).getTime();
    const t2 = new Date(dropOffDateTime).getTime();
    const t3 = new Date(locInDateTime).getTime();
    if (![t0, t1, t2, t3].every((t) => Number.isFinite(t))) {
      this.datetime = '';
      this.datetimeP2P = '';
      return;
    }

    const formatHoursMinutes = (totalMilliseconds: number): string => {
      const totalMinutes = totalMilliseconds / (1000 * 60);
      if (!Number.isFinite(totalMinutes)) {
        return '';
      }
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.floor(totalMinutes % 60);
      return hours + '.' + minutes;
    };

    // Garage to Garage: locOut → pickUp → dropOff → locIn
    const g2gMs = (t1 - t0) + (t2 - t1) + (t3 - t2);
    this.datetime = Number.isFinite(g2gMs) ? formatHoursMinutes(g2gMs) : '';

    // Point to Point: pickUp → dropOff
    const p2pMs = t2 - t1;
    this.datetimeP2P = Number.isFinite(p2pMs) ? formatHoursMinutes(p2pMs) : '';
  }

  /** True when all eight required location-out / pickup / drop-off / location-in date+time fields are present. */
  hasAllRequiredDateTimeFields(): boolean {
    const locOutTime = this.advanceTableForm.get('locationOutTimeForBilling')?.value;
    const locOutDate = this.advanceTableForm.get('locationOutDateForBilling')?.value;
    const pickUpTime = this.advanceTableForm.get('pickUpTimeForBilling')?.value;
    const pickUpDate = this.advanceTableForm.get('pickUpDateForBilling')?.value;
    const dropOffTime = this.advanceTableForm.get('dropOffTimeForBilling')?.value;
    const dropOffDate = this.advanceTableForm.get('dropOffDateForBilling')?.value;
    const locInTime = this.advanceTableForm.get('locationInTimeForBilling')?.value;
    const locInDate = this.advanceTableForm.get('locationInDateForBilling')?.value;

    return (
      locOutTime != null &&
      locOutDate != null &&
      locOutTime !== '' &&
      locOutDate !== '' &&
      pickUpTime != null &&
      pickUpDate != null &&
      pickUpTime !== '' &&
      pickUpDate !== '' &&
      dropOffTime != null &&
      dropOffDate != null &&
      dropOffTime !== '' &&
      dropOffDate !== '' &&
      locInTime != null &&
      locInDate != null &&
      locInTime !== '' &&
      locInDate !== ''
    );
  }

  onKeyUp() {
    const v = this.advanceTableForm.getRawValue();
    const toNum = (x: any): number | null => {
      if (x === null || x === undefined || x === '') {
        return null;
      }
      const n = Number(x);
      return Number.isFinite(n) ? n : null;
    };
    const locationIn = toNum(v.locationInKMForBilling);
    const dropOff = toNum(v.dropOffKMForBilling);
    const pickUp = toNum(v.pickUpKMForBilling);
    const locationOut = toNum(v.locationOutKMForBilling);
    if (locationIn === null || dropOff === null || pickUp === null || locationOut === null) {
      this.diff = null;
      this.diffP2P = null;
      return;
    }
    const diff1 = locationIn - dropOff;
    const diff2 = dropOff - pickUp;
    const diff3 = pickUp - locationOut;
    const sum = diff1 + diff2 + diff3;
    this.diff = Number.isFinite(sum) ? sum : null;
    this.diffP2P = Number.isFinite(diff2) ? diff2 : null;
  }

  addtionOfManulKM()
  {
    this.totalKMForManul = this.advanceTableForm.value.hubToStartKM + this.advanceTableForm.value.startToEndKM + this.advanceTableForm.value.endToHubKM;
  }

  addtionOfAppKM()
  {
    this.totalKMForApp = this.advanceTableForm.value.locationToPickupTripKm + this.advanceTableForm.value.pickupToDropOffTripKm + this.advanceTableForm.value.dropOffToLocationInTripKm;
  }

  //---------- Pickup Date For Billing ----------
  onPickupDatepickerChange(event: any): void {
    const inputElement = event.targetElement;
    if (inputElement) 
    {
      this.onBlurPickupUpdateDate({ target: inputElement});
      
    }
    
  }
  
  onBlurPickupUpdateDate(event: any): void {
    let value = event.target.value;    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('pickUpDateForBilling')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('pickUpDateForBilling')?.setErrors({ invalidDate: true });
    }
    this.onTimeSelection();
  }

  //---------- Drop Off Date For Billing ----------
  onDropOffDatepickerChange(event: any): void {
    const inputElement = event.targetElement;
    if (inputElement) 
    {
      this.onBlurDropOffUpdateDate({ target: inputElement});
      
    }
    
  }
  
  onBlurDropOffUpdateDate(event: any): void {
    let value = event.target.value;    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('dropOffDateForBilling')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('dropOffDateForBilling')?.setErrors({ invalidDate: true });
    }
    this.onTimeSelection();
  }

  //---------- Drop Off Date For Billing ----------
  onLocInDatepickerChange(event: any): void {
    const inputElement = event.targetElement;
    
    if (inputElement) 
    {
      this.onBlurLocInUpdateDate({ target: inputElement});
    }
    
  }

  onBlurLocInUpdateDate(event: any): void {
    let value = event.target.value;    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('locationInDateForBilling')?.setValue(formattedDate);    
    }
    else 
    {
      this.advanceTableForm.get('locationInDateForBilling')?.setErrors({ invalidDate: true });
    }
    this.onTimeSelection();
  }


  onGFBChange(event: any) 
    {
      if(this.advanceTableForm.value.verifyDuty===false || this.advanceTableForm.value.verifyDuty==='' || this.advanceTableForm.value.verifyDuty===null)
      {
        Swal.fire('', 'Please Verify Duty Before Good For Billing.', 'warning');
        this.advanceTableForm.patchValue({goodForBilling :false});
      return false;
      }
      const isChecked = event.checked;
      if (!this.advanceTableBH) {
        this.advanceTableBH = {} as BillingHistory;
      }
      if(isChecked === true)
      {
        this.applyClosingFieldDefaults();
        if (!this.validateClosingStatusForGfb()) {
          this.advanceTableForm.patchValue({ goodForBilling: false });
          return false;
        }
        let at = "Checked";
        this.advanceTableForm.patchValue({actionTaken : "GoodForBilling"});
        this.advanceTableForm.patchValue({actionDetails : at});
        this.advanceTableBH.verifyDuty = this.advanceTableForm.value.verifyDuty;
        this.advanceTableBH.goodForBilling = isChecked;
        this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
        this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
        this.updateDutyStatus(true, true, () => {
          this.CalculateBill(false, true);
        });
      }
      if(isChecked === false)
      {
        let at = "Unchecked";
        this.advanceTableForm.patchValue({actionTaken : "GoodForBilling"});
        this.advanceTableForm.patchValue({actionDetails : at})
        this.advanceTableBH.verifyDuty = this.advanceTableForm.value.verifyDuty;
        this.advanceTableBH.goodForBilling = isChecked;
        this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
        this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
      }
      if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
        this.advanceTableClosingOne.closingDutySlipForBillingModel.goodForBilling = isChecked;
        this.advanceTableClosingOne.closingDutySlipForBillingModel.verifyDuty =
          this.advanceTableForm.value.verifyDuty;
      }
      if(isChecked !==null)
      {
        this.SaveDataInBillingHistory();
      }
      this.applyDutySlipEditLockState();
  }

  // onVDChange(event: any) 
  //   {
  //     const isChecked = event.checked;
  //     if (!this.advanceTableBH) {
  //       this.advanceTableBH = {} as BillingHistory;
  //     }
  //     if(this.disputeAdvanceTable === null)
  //   {
  //     if(isChecked === true)
  //     {
  //       let at = "Checked";
  //       this.advanceTableForm.patchValue({actionTaken : "Verify Duty"});
  //       this.advanceTableForm.patchValue({actionDetails : at});
  //       this.advanceTableBH.verifyDuty = isChecked;
  //       this.advanceTableForm.patchValue({goodForBilling : false});
  //       this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
  //       this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
  //     }
  //   }
  //     else if(this.disputeAdvanceTable !== null && this.disputeAdvanceTable.approvalStatus !== true){
  //         Swal.fire({
  //                 title:
  //                   'Please approve dispute status before verify duty.',
  //                 icon: 'warning',
  //               }).then((result) => {
  //                 if (result.value) {
          
  //                 }
  //               });
  //     }
  //     if(isChecked === false)
  //     {
  //       let at = "Unchecked";
  //       this.advanceTableForm.patchValue({actionTaken : "Verify Duty"});
  //       this.advanceTableForm.patchValue({actionDetails : at});
  //       this.advanceTableBH.verifyDuty = isChecked;
  //       this.advanceTableForm.patchValue({goodForBilling : false});
  //       this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
  //       this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
  //     }
  //     if(isChecked !==null)
  //     {
  //       this.SaveDataInBillingHistory();
  //     }
      
  // }

  onVDChange(event: any) {
    
  const isChecked = event.checked;

  if (!this.advanceTableBH) {
    this.advanceTableBH = {} as BillingHistory;
  }

  if (isChecked) {
    if (!this.disputeAdvanceTable || this.disputeAdvanceTable.length === 0) {
      // No disputes, allow verify duty
      this.setVerifyDuty(true, "Checked");
      this.updateDutyStatus(true,false,() => {
    this.CalculateBillForVerifyDuty();
});
    } else {
      // Disputes exist: all approvalStatus must be true
      const allApproved = this.disputeAdvanceTable.every(
        (d: any) => d.approvalStatus === true
      );

      if (allApproved) {
        this.setVerifyDuty(true, "Checked");
        this.updateDutyStatus(true,false,() => {
    this.CalculateBillForVerifyDuty();
});
      }
       else {
        // Show alert and revert checkbox
        Swal.fire({
          title: 'Unapproved Disputes found!.',
          icon: 'warning',
        });

        // Revert checkbox in form
        this.advanceTableForm.patchValue({ verifyDuty: false });
      }
    }
  } else {
    // Checkbox unchecked by user
    this.setVerifyDuty(false, "Unchecked");
  }

  
}



setVerifyDuty(value: boolean, details: string) {
  this.advanceTableForm.patchValue({
    actionTaken: "Verify Duty",
    actionDetails: details,
    goodForBilling: false,
    verifyDuty: value
  });

  this.advanceTableBH.verifyDuty = value;
  this.advanceTableBH.goodForBilling = false;
  this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
  this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
  if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
    this.advanceTableClosingOne.closingDutySlipForBillingModel.verifyDuty = value;
    this.advanceTableClosingOne.closingDutySlipForBillingModel.goodForBilling = false;
  }
  this.SaveDataInBillingHistory();
}

public resetVerificationForEcoStateChange(): void {
  const verifyDuty = !!this.advanceTableForm?.get('verifyDuty')?.value;
  const goodForBilling = !!this.advanceTableForm?.get('goodForBilling')?.value;
  if (!verifyDuty && !goodForBilling) {
    return;
  }
  if (!this.advanceTableBH) {
    this.advanceTableBH = {} as BillingHistory;
  }
  this.setVerifyDuty(false, 'Unchecked');
  if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
    this.advanceTableClosingOne.closingDutySlipForBillingModel.verifyDuty = false;
    this.advanceTableClosingOne.closingDutySlipForBillingModel.goodForBilling = false;
  }
  this.showNotification(
    'snackbar-warning',
    'Eco State changed — Verify Duty and Good for Billing have been reset. Please Calculate Bill again.',
    'bottom',
    'center'
  );
}


  SaveDataInBillingHistory()
  {
    if (!this.guardDutySlipEdit()) {
      return;
    }
    if (!this.showCalculateBillOverlay) {
      this.showSpinnerForVDGB = true;
    }
    this.advanceTableBH.dutySlipForBillingID=this.advanceTableForm.value.dutySlipForBillingID;
    this.advanceTableBH.dutySlipID=this.advanceTableForm.value.dutySlipID;
    this.advanceTableBH.userID=this._generalService.getUserID();;
    this.dutySlipForBillingService.addBillingHistory(this.advanceTableBH)  
  .subscribe(
    response => 
    {   
      if (!this.showCalculateBillOverlay) {
        this.showSpinnerForVDGB = false;
      }
      if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
        if (response?.goodForBilling !== undefined && response?.goodForBilling !== null) {
          this.advanceTableClosingOne.closingDutySlipForBillingModel.goodForBilling = !!response.goodForBilling;
        }
        if (response?.verifyDuty !== undefined && response?.verifyDuty !== null) {
          this.advanceTableClosingOne.closingDutySlipForBillingModel.verifyDuty = !!response.verifyDuty;
        }
      }
      this.applyDutySlipEditLockState();
      if(response.actionTaken !== "Verify Duty")
      {
        this.showNotification(
          'snackbar-success',
          'Updated...!!!',
          'bottom',
          'center'
        );
      }
    },
    error =>
    {
      if (!this.showCalculateBillOverlay) {
        this.showSpinnerForVDGB = false;
      }
      this.showNotification(
        'snackbar-danger',
        'Operation Failed...!!!',
        'bottom',
        'center'
      );
    })
  }

   showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  dateOnly(date: Date): Date {
    return billingDateOnly(date) ?? new Date(NaN);
  }

  private showChronologyValidationError(message: string): void {
    Swal.fire('Error', message, 'warning').then(() => {
      this.showSpinner = false;
    });
  }

  checkChronologyAndValues(): boolean {
    const form = this.advanceTableForm.getRawValue();
    const legs = getBillingTripLegsFromForm(form);

    const locationOutDate = billingDateOnly(form.locationOutDateForBilling);
    const pickupDate = billingDateOnly(form.pickUpDateForBilling);
    const dropOffDate = billingDateOnly(form.dropOffDateForBilling);
    const locationInDate = billingDateOnly(form.locationInDateForBilling);

    if (!locationOutDate) {
      this.showChronologyValidationError('Location Out date is missing or invalid.');
      return false;
    }
    if (!pickupDate) {
      this.showChronologyValidationError('Pickup date is missing or invalid.');
      return false;
    }
    if (!dropOffDate) {
      this.showChronologyValidationError('Drop-off date is missing or invalid.');
      return false;
    }
    if (!locationInDate) {
      this.showChronologyValidationError('Location In date is missing or invalid.');
      return false;
    }

    if (pickupDate < locationOutDate) {
      this.showChronologyValidationError('Pickup Date cannot be before Location Out Date.');
      return false;
    }

    if (dropOffDate < pickupDate) {
      this.showChronologyValidationError('Drop-off Date cannot be before Pickup Date.');
      return false;
    }

    if (locationInDate < dropOffDate) {
      this.showChronologyValidationError('Location In Date cannot be before Drop-off Date.');
      return false;
    }

    const resolved = resolveBillingTripLegDateTimes(legs);
    if (!resolved.ok) {
      this.showChronologyValidationError(resolved.message);
      return false;
    }

    const [locationOutDT, pickupDT, dropOffDT, locationInDT] = resolved.dateTimes;

    if (pickupDT < locationOutDT) {
      this.showChronologyValidationError('Pickup DateTime cannot be before Location Out DateTime.');
      return false;
    }

    if (dropOffDT < pickupDT) {
      this.showChronologyValidationError('Drop-off DateTime cannot be before Pickup DateTime.');
      return false;
    }

    if (locationInDT < dropOffDT) {
      this.showChronologyValidationError('Location In DateTime cannot be before Drop-off DateTime.');
      return false;
    }

    // KM validations
    const locationOutKM = Number(form.locationOutKMForBilling);
    const pickupKM = Number(form.pickUpKMForBilling);
    const dropOffKM = Number(form.dropOffKMForBilling);
    const locationInKM = Number(form.locationInKMForBilling);

    if (pickupKM < locationOutKM) {
      this.showChronologyValidationError('Pickup KM cannot be less than Location Out KM.');
      return false;
    }

    if (dropOffKM < pickupKM) {
      this.showChronologyValidationError('Drop-off KM cannot be less than Pickup KM.');
      return false;
    }

    if (locationInKM < dropOffKM) {
      this.showChronologyValidationError('Location In KM cannot be less than Drop-off KM.');
      return false;
    }

    return true;
  }

  public ClossingDetails(): boolean
  {
    const form = this.advanceTableForm.getRawValue();

    if (!form.dsClosing) {
      Swal.fire({
        title: '',
        text: 'Please Select DS Closing Option.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
    if (form.physicalDutySlipReceived === "") {
      Swal.fire({
        title: '',
        text: 'Please Select Duty Slip Received Option.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
    //-------------Location OUT ---------------
   
    if (!form.locationOutAddressStringForBilling) {
      Swal.fire({
        title: '',
        text: 'Please Select Location Out Address.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
    
  //----------Pick UP ----------------------
  
    if (!form.pickUpAddressStringForBilling) {
      Swal.fire({
        title: '',
        text: 'Please Select Pick up Address.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
  
  //--------------Drop Off-------------------
  
    if (!form.dropOffAddressStringForBilling) {
      Swal.fire({
        title: '',
        text: 'Please Select Drop Off Address.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
   
    //-----------Location In----------------------
  
    if (!form.locationInAddressStringForBilling) {
      Swal.fire({
        title: '',
        text: 'Please Select Location In Address.',
        icon: 'warning',
      }).then(() => {
        this.showSpinner = false; // ✅ spinner stop after Swal close
      });
      return false;
    }
    return true;
  }

  public Put(): void
  {
    if (!this.guardDutySlipEdit()) {
      return;
    }
    this.showSpinner = true;
    if (!this.checkChronologyAndValues()) {
      this.showSpinner = false;
      return;
    }
    this.applyClosingFieldDefaults();
    //this.saveDisabled = true;
      if (!this.ClossingDetails())
      {
        return;
      } 
      this.advanceTableForm.patchValue({actionDetails :'Unchecked',actionTaken : "Verify Duty"});
      //this.saveDisabled = true;      
      this.dutySlipForBillingService.update(this.advanceTableForm.getRawValue())  
      .subscribe(
        response => 
        {
          this.DSClosing = response.dsClosing;
          this.buttonText = 'Update';
          this.syncClosingModelFromResponse(response);
          this.syncVerifyDutyAndGoodForBillingState();
          if(response.goodForBilling === true || response.verifyDuty === true)
          {
            this.advanceTableForm.controls["goodForBilling"].setValue(false);
            this.advanceTableForm.controls["verifyDuty"].setValue(false);
          }
          const finishPutSuccess = () => {
            this.showSpinner = false;
            this.showNotification(
              'snackbar-success',
              'Saved...!!!',
              'bottom',
              'center'
            );
          };
          this.saveClosingAllowancesIfChanged(finishPutSuccess);
        },
        error =>
        {
          this.showSpinner = false;
          this.showNotification(
            'snackbar-danger',
            this.extractApiErrorMessage(error, 'Operation Failed.....!!!'),
            'bottom',
            'center'
          ); 
          //this.saveDisabled = true;
        }
      )
    
  }
      

  private openSummaryOfDutyDialog(): void {
    const rid = this.advanceTableClosingOne?.closingDutySlipModel?.reservationID;
    const parts: string[] = [];
    if (this.DutySlipID != null && this.DutySlipID !== '') {
      parts.push(`Duty slip ID: ${this.DutySlipID}`);
    }
    if (rid != null && rid !== '') {
      parts.push(`Reservation ID: ${rid}`);
    }
    const dialogData: SummaryOfDutyDialogData = {
      summary: this.summaryOfDutyData,
      subtitle: parts.length ? parts.join(' · ') : undefined
    };
    this.dialog.open(SummaryOfDutyDialogComponent, {
      width: '90vw',
      maxWidth: '90vw',
      maxHeight: '90vh',
      autoFocus: false,
      restoreFocus: true,
      panelClass: 'summary-of-duty-dialog-panel',
      data: dialogData
    });
  }

  //---------Calculate Bill------------------------
  /**
   * @param showSummaryPopup when true, opens Summary of Duty dialog after success
   * @param openDummyInvoiceAfter when true (GFB path), opens Dummy Invoice in a new tab and never shows Summary
   */
  public CalculateBill(showSummaryPopup = false, openDummyInvoiceAfter = false)
  {
    // GFB path already persisted status; skip edit guard so calc still runs after GFB lock.
    if (!openDummyInvoiceAfter && !this.guardDutySlipEdit()) {
      return;
    }
    if (showSummaryPopup || openDummyInvoiceAfter) {
      this.showCalculateBillOverlay = true;
    } else {
      this.showSpinnerForVDGB = true;
    }

    this.clossingOneService.calculateBillWithSummary(this.DutySlipID).subscribe(
      response => 
      {
        this.Message = response.message ?? '';
        this.summaryOfDutyData = response.summary;
        this.dutyStatusChanged.emit({
        verifyDuty: this.advanceTableForm.value.verifyDuty,
        goodForBilling: this.advanceTableForm.value.goodForBilling,
        message: this.Message
      });
        if (showSummaryPopup || openDummyInvoiceAfter) {
          this.showCalculateBillOverlay = false;
        } else {
          this.showSpinnerForVDGB = false;
        }
        this.showNotification(
          'snackbar-success',
          'Duty Calculated...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
        this.loadClosingAllowances();
        if (openDummyInvoiceAfter) {
          this.openDummyInvoice();
        } else if (showSummaryPopup) {
          this.openSummaryOfDutyDialog();
        }
      },
      error =>
      {
        // #region agent log
        fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'50bd31'},body:JSON.stringify({sessionId:'50bd31',runId:'pre-fix',hypothesisId:'D',location:'dutySlipForBilling.CalculateBill:error',message:'CalculateBill failed',data:{dutySlipId:this.DutySlipID,error:String(error),openDummyInvoiceAfter},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        if (showSummaryPopup || openDummyInvoiceAfter) {
          this.showCalculateBillOverlay = false;
        } else {
          this.showSpinnerForVDGB = false;
        }
        const errorMessage = this.extractApiErrorMessage(error, 'Operation Failed.....!!!');
        Swal.fire({
          title: errorMessage,
          icon: 'error'
        }).then(() => {
            this.advanceTableForm.patchValue({ verifyDuty: true });
            this.advanceTableForm.patchValue({ goodForBilling: false });
            this.onGFBChange({ checked: false });
            this.saveDisabled = true;
          });
      })  
  }

  ngOnChanges(changes: SimpleChanges) {
  if (changes['disputeAdvanceTable']) {

    // ✅ Check if any dispute has approvalStatus === false
    const hasUnapprovedDispute = this.disputeAdvanceTable?.some(d => d.approvalStatus === false);

    if (hasUnapprovedDispute) {
      // ✅ Uncheck fields if any unapproved dispute is found
      this.advanceTableForm.patchValue({
        verifyDuty: false,
        goodForBilling: false
      });
    }
  }
  if (changes['hasActiveEInvoice'] || changes['canThisRoleDoGoodForBillingOnClosingScreen']) {
    this.syncVerifyDutyAndGoodForBillingState();
  }
}
 GetClosingData()
  {
    this.clossingOneService.GetClosingData(this.advanceTableClosingOne.closingDutySlipModel.dutySlipID).subscribe(
      data =>
      {
        this.advanceTableClosingOne = data;
        this.syncVerifyDutyAndGoodForBillingState();
      }
    );
  }
  
onChange() {
  this.dutyStatusChanged.emit({
    verifyDuty: this.advanceTableForm.value.verifyDuty,
    goodForBilling: this.advanceTableForm.value.goodForBilling,
    message: this.Message
  });
}

 public PostDataGPS(event?: Event) 
    {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (!this.hasAllRequiredDateTimeFields()) {
        Swal.fire('', 'Please fill all date and time fields.', 'warning');
        return;
      }
      this.dutySlipForBillingService.PostDataGPS(this.advanceTableClosingOne.closingDutySlipModel.dutySlipID,this.RegistrationNumber).subscribe
      (
        data => 
          {
         //this.disputeAdvanceTable = data;
          this.showNotification(
            'snackbar-success',
            'GPS data updated.',
            'bottom',
            'center'
          ); 
          this.GetClosingData();
          this.InitGPS();       
        },
        error =>
        {
          this.showNotification(
            'snackbar-danger',
            'Operation Failed.....!!!',
            'bottom',
            'center'
          ); 
        }  
      // (error: HttpErrorResponse) => { this.disputeAdvanceTable = null;}
      );
    }

  canViewDummyInvoice(): boolean {
    return this.advanceTableForm?.get('goodForBilling')?.value === true;
  }

  openDummyInvoice(): void {
    if (!this.canViewDummyInvoice()) {
      this.showNotification(
        'snackbar-warning',
        'Please check Good For Billing before viewing the dummy invoice.',
        'bottom',
        'center'
      );
      return;
    }

    if (!this.DutySlipID) {
      this.showNotification(
        'snackbar-danger',
        'Duty slip ID is missing. Cannot open dummy invoice.',
        'bottom',
        'center'
      );
      return;
    }

    const serializedUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/DummyInvoiceForCalculationCheck'], {
        queryParams: { dutySlipID: this.DutySlipID }
      })
    );
    const fullUrl = this._generalService.buildAppWindowUrl(serializedUrl);

    const opened = window.open(fullUrl, '_blank');
    if (opened) {
      opened.focus();
      return;
    }

    this.router.navigate(['/DummyInvoiceForCalculationCheck'], {
      queryParams: { dutySlipID: this.DutySlipID }
    });
  }

  //---------Calculate Bill For VerifyDuty------------------------
  public CalculateBillForVerifyDuty()
  {
    this.clossingOneService.calculateBillWithSummary(this.DutySlipID).subscribe(
      response =>
      {
        this.Message = response.message ?? '';
        this.summaryOfDutyData = response.summary;
        this.dutyStatusChanged.emit({
          verifyDuty: this.advanceTableForm.value.verifyDuty,
          goodForBilling: this.advanceTableForm.value.goodForBilling,
          message: this.Message
        });

        this.showNotification(
          'snackbar-success',
          'Duty Calculated...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
      },
      error =>
      {
        // Calculation still runs; suppress error popup on Verify Duty only
        this.advanceTableForm.patchValue({ verifyDuty: true });
        this.advanceTableForm.patchValue({ goodForBilling: false });
        this.onGFBChange({ checked: false });
        this.saveDisabled = true;
      }
    );
  }

updateDutyStatus(verifyDuty: boolean, goodForBilling: boolean, callback?: () => void) {
  this.applyClosingFieldDefaults();
  this.advanceTableForm.patchValue({
    verifyDuty: verifyDuty,
    goodForBilling: goodForBilling
  });

  this.dutySlipForBillingService
    .update(this.advanceTableForm.getRawValue())
    .subscribe({
      next: (response) => {

        this.advanceTableForm.patchValue({
          verifyDuty: response.verifyDuty,
          goodForBilling: response.goodForBilling
        });
        this.syncClosingModelFromResponse(response);
        if (response?.dsClosing ?? response?.DsClosing) {
          this.buttonText = 'Update';
        }

        this.showNotification(
          'snackbar-success',
          'Updated Successfully',
          'bottom',
          'center'
        );

        if (callback) {
          callback();
        }
      },
      error: (err) => {
        this.showNotification(
          'snackbar-danger',
          this.extractApiErrorMessage(err),
          'bottom',
          'center'
        );
      }
    });
}
}



