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
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { BillingHistory } from './dutySlipForBilling.model';
import { ClosingModel } from '../clossingOne/clossingOne.model';
import { ClosingDutySlipByDriverModel } from '../clossingOne/closingDutySlipByDriver.model';
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
  @Input() hasActiveInvoice = false;
  @Input() DSClosing;
  @Input() canThisRoleDoGoodForBillingOnClosingScreen = false;
  @Input() canThisRoleViewDummyInvoice = false;
  @Input() canEditDSAfterGoodForBilling = false;
  @Input() dutyBillingSummary: any = null;
  @Output() dataSaved: EventEmitter<void> = new EventEmitter();
  @Output() dutyStatusChanged = new EventEmitter<{verifyDuty: boolean, goodForBilling: boolean,message: string, invoiceCalculated?: boolean}>();
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
 /** Date/time and duty-slip status fields stay editable for all closure types (App, Driver, GPS, Manual).
  * Pickup Date stays locked to Reservation and is never in this list. Pickup Time is editable. */
 private readonly alwaysEditableControls = [
   'locationOutDateForBilling',
   'locationOutTimeForBilling',
   'reportingToGuestDateForBilling',
   'reportingToGuestTimeForBilling',
   'pickUpTimeForBilling',
   'dropOffDateForBilling',
   'dropOffTimeForBilling',
   'locationInDateForBilling',
   'locationInTimeForBilling',
 ];
 /** Pickup Date is always read-only; sourced only from Reservation. */
 private readonly lockedPickupControls = [
   'pickUpDateForBilling',
 ];
 /** Address fields editable for all closure types (App, Driver, GPS, Manual). */
 private readonly alwaysEditableAddressControls = [
   'locationOutAddressStringForBilling',
   'reportingToGuestAddressStringForBilling',
   'pickUpAddressStringForBilling',
   'dropOffAddressStringForBilling',
   'locationInAddressStringForBilling',
 ];
 /** Remark fields editable for all closure types and after Good for Billing (E-Invoice still blocks). */
 private readonly alwaysEditableRemarkControls = [
   'runningDetails',
   'vendorRemark',
 ];
 /** KM and lat/long fields editable for all closure types; stay editable after Good for Billing. */
 private readonly alwaysEditableKmControls = [
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
 /** Full-PUT fields. KM/lat-long are excluded — UpdateRemarks already writes those. */
 private readonly fullPutFieldControls = [
   ...this.alwaysEditableControls,
   ...this.alwaysEditableAddressControls,
   'locationOutLocationOrHubID',
   'locationInLocationOrHubID',
   'closureType',
   'closureStatus',
   'closureMethod',
   'dsClosing',
   'physicalDutySlipReceived',
   'dutyTypeID',
   'packageID',
   'verifyDuty',
   'goodForBilling',
 ];
 advanceTableBH : BillingHistory | null;
 CustomerSignatureImage :string = null;
 buttonText: string = 'Save';
  selectedClosureType: string;
  DutySlipID: number;

  saveDisabled: boolean = true;
  readyForBulkBilling = false;
  readyForBulkGfb = false;
  tagSaving = false;
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
  private loadedRunningDetails = '';
  private loadedVendorRemark = '';
  private loadedKmValues: Record<string, string> = {};
  private loadedTripFieldValues: Record<string, string> = {};
  private tripFieldsSnapshotReady = false;
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
    if (changes['hasActiveEInvoice'] || changes['hasActiveInvoice'] || changes['canEditDSAfterGoodForBilling'] || changes['advanceTableClosingOne']) {
      this.applyDutySlipEditLockState();
      if (this.hasActiveInvoiceLock) {
        this.readyForBulkBilling = false;
        this.readyForBulkGfb = false;
      }
    }
    if (changes['disputeAdvanceTable']) {
      const hasUnapprovedDispute = this.disputeAdvanceTable?.some(d => d.approvalStatus === false);
      if (hasUnapprovedDispute) {
        this.advanceTableForm.patchValue({
          verifyDuty: false,
          goodForBilling: false
        });
      }
    }
    if (changes['hasActiveEInvoice'] || changes['canThisRoleDoGoodForBillingOnClosingScreen']) {
      this.syncVerifyDutyAndGoodForBillingState();
    }
    if (changes['dutyBillingSummary']) {
      this.mapClosingAllowancesFromSummary(this.dutyBillingSummary);
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
    
    const billingId = Number(this.advanceTableClosingOne.closingDutySlipForBillingModel.dutySlipForBillingID);
    const hasSavedBilling = billingId > 0;
    if (hasSavedBilling) {
      this.buttonText = 'Update';
      this.LoadDataForBilling();
    } else {
      this.patchPickupFromReservation();
      this.syncVerifyDutyAndGoodForBillingState();
    }

    this.applyClosureSourceOnLoad();

    this.onKeyUp();
    this.applyRoundOffBillingTimes();
    this.onTimeSelection();
    this.applyClosingFieldDefaults();
    this.applyDutySlipEditLockState();
    this.syncLoadedTripFieldsFromForm();
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
    }
    this.applyManualEditMode();
  }

  InitApp(): void {
    this.patchFormFromAppModel({ useActualKm: true });
  }

  InitDriver(): void {
    const driver = this.advanceTableClosingOne?.closingDutySlipByDriverModel;
    if (this.hasUsableDriverData(driver)) {
      this.patchFormFromDriverModel(driver);
      return;
    }

    // Driver KM comparison column uses DutySlipByApp odometer (g2PApp / p2DApp / d2GApp).
    if (this.hasUsableAppData(this.advanceTableClosingOne?.closingDutySlipByAppModel)) {
      this.patchFormFromAppModel({ useActualKm: false });
      return;
    }

    if (!this.DutySlipID) {
      this.showNoDriverDataWarning();
      return;
    }
    this.clossingOneService.getTableDataForDriver(this.DutySlipID).subscribe({
      next: (data) => {
        const row = Array.isArray(data) ? data[0] : data;
        if (row && this.hasUsableDriverData(row)) {
          this.advanceTableClosingOne.closingDutySlipByDriverModel = new ClosingDutySlipByDriverModel(row);
          this.patchFormFromDriverModel(this.advanceTableClosingOne.closingDutySlipByDriverModel);
        } else if (this.hasUsableAppData(this.advanceTableClosingOne?.closingDutySlipByAppModel)) {
          this.patchFormFromAppModel({ useActualKm: false });
        } else {
          this.showNoDriverDataWarning();
        }
      },
      error: () => {
        if (this.hasUsableAppData(this.advanceTableClosingOne?.closingDutySlipByAppModel)) {
          this.patchFormFromAppModel({ useActualKm: false });
        } else {
          this.showNoDriverDataWarning();
        }
      },
    });
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

      // Pickup Date/Time are locked to Reservation; InitGPS must not change them (including after Get KM).
      
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
    this.applyRoundOffBillingTimes();
    this.onTimeSelection();
  }

  InitManual(): void {
    this.patchBillingTripFieldsFromForBillingModel();
    this.applyReportingFromPickupFallbackToForm();
    this.onKeyUp();
    this.applyRoundOffBillingTimes();
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
    if (!this.validateClosureTypeSelected(form?.closureType)) {
      return false;
    }
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

  /** Closing source must be Driver / App / GPS / Manual before save, verify, or GFB. */
  private validateClosureTypeSelected(closureType?: string | null): boolean {
    const value = (closureType ?? this.advanceTableForm?.getRawValue()?.closureType ?? '').toString().trim();
    if (value) {
      return true;
    }
    Swal.fire('', 'Please select closing source (Driver / App / GPS / Manual KM).', 'warning');
    return false;
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
    this.syncLoadedRemarksFromForm();
    this.syncLoadedTripFieldsFromForm();
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

  originalDutySlipTime(field: 'locationOutTime' | 'pickUpTime' | 'dropOffTime' | 'locationInTime'): string {
    const raw = this.advanceTableClosingOne?.closingDutySlipModel?.[field];
    if (!this.isValidBillingDate(raw)) {
      return '';
    }
    const date = raw instanceof Date ? raw : new Date(raw as any);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private isRoundOffTimeEnabled(): boolean {
    const reservation = this.advanceTableClosingOne?.closingReservationForPickupDataModel as any;
    if (!reservation) {
      return true;
    }
    const flag = reservation.roundOffTime ?? reservation.RoundOffTime;
    if (flag === false || flag === 0 || flag === '0' || flag === 'false') {
      return false;
    }
    return true;
  }

  private applyRoundOffBillingTimes(): void {
    if (!this.isRoundOffTimeEnabled() || !this.advanceTableForm) {
      return;
    }
    this.roundBillingTimePair('dropOffTimeForBilling', 'dropOffDateForBilling');
    this.roundBillingTimePair('locationInTimeForBilling', 'locationInDateForBilling');
  }

  private roundBillingTimePair(timeCtrl: string, dateCtrl: string): void {
    const timeVal = this.advanceTableForm.get(timeCtrl)?.value;
    if (!this.isValidBillingDate(timeVal)) {
      return;
    }
    const source = timeVal instanceof Date ? timeVal : new Date(timeVal);
    const rounded = this.roundMinutesToBillingQuarter(source);
    this.advanceTableForm.get(timeCtrl)?.setValue(rounded.time, { emitEvent: false });
    if (!rounded.addDays) {
      return;
    }
    const dateVal = this.advanceTableForm.get(dateCtrl)?.value;
    if (!this.isValidBillingDate(dateVal)) {
      return;
    }
    const nextDate = new Date(dateVal instanceof Date ? dateVal.getTime() : new Date(dateVal).getTime());
    nextDate.setDate(nextDate.getDate() + 1);
    this.advanceTableForm.get(dateCtrl)?.setValue(nextDate, { emitEvent: false });
  }

  private roundMinutesToBillingQuarter(source: Date): { time: Date; addDays: boolean } {
    const copy = new Date(source.getTime());
    let hours = copy.getHours();
    let minutes = copy.getMinutes();
    let addDays = false;
    if (minutes <= 6) {
      minutes = 0;
    } else if (minutes <= 22) {
      minutes = 15;
    } else if (minutes <= 37) {
      minutes = 30;
    } else if (minutes <= 52) {
      minutes = 45;
    } else {
      minutes = 0;
      hours += 1;
    }
    if (hours >= 24) {
      hours = 0;
      addDays = true;
    }
    copy.setHours(hours, minutes, 0, 0);
    return { time: copy, addDays };
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

  private formatApiErrorForSwal(message: string): string {
    const escaped = (message || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<div style="text-align:left;white-space:pre-wrap">${escaped}</div>`;
  }

  private extractApiErrorMessage(error: any, fallback = 'Operation Failed.....!!!'): string {
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
      this.disableLockedControlsWithoutFullFormDisable();
      this.applyAlwaysEditableRemarks();
      this.applyAlwaysEditableKm();
      return;
    }
    this.advanceTableForm.enable({ emitEvent: false });
    this.applyManualEditMode();
    this.applyClosingFieldDefaults();
    this.syncVerifyDutyAndGoodForBillingState();
  }

  /** Disable locked fields one-by-one. FormGroup.disable() then re-enabling KM/remarks freezes Closing One after GFB. */
  private disableLockedControlsWithoutFullFormDisable(): void {
    const keepEnabled = this.isEInvoiceBlockingEdits
      ? new Set<string>()
      : new Set<string>([
          ...this.alwaysEditableRemarkControls,
          ...this.alwaysEditableKmControls,
        ]);
    for (const name of Object.keys(this.advanceTableForm.controls)) {
      if (keepEnabled.has(name)) {
        continue;
      }
      this.advanceTableForm.get(name)?.disable({ emitEvent: false });
    }
  }

  /** Remark On DS Closing and Vendor Remark stay editable unless E-Invoice blocks the duty slip. */
  private applyAlwaysEditableRemarks(): void {
    if (!this.advanceTableForm || this.isEInvoiceBlockingEdits) {
      return;
    }
    for (const name of this.alwaysEditableRemarkControls) {
      this.advanceTableForm.get(name)?.enable({ emitEvent: false });
    }
  }

  /** KM and lat/long stay editable unless E-Invoice blocks the duty slip. */
  private applyAlwaysEditableKm(): void {
    if (!this.advanceTableForm || this.isEInvoiceBlockingEdits) {
      return;
    }
    for (const name of this.alwaysEditableKmControls) {
      this.advanceTableForm.get(name)?.enable({ emitEvent: false });
    }
  }

  /** Date/time and addresses always editable when form is not GFB-blocked; KM always editable.
   * Pickup Date stays disabled and locked to Reservation. Pickup Time stays editable. */
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
    this.applyAlwaysEditableRemarks();
    this.applyAlwaysEditableKm();
    // Closure type radio must stay selectable so users can switch closure source.
    this.advanceTableForm.get('closureType')?.enable({ emitEvent: false });
    this.disablePickupDateTimeControls();
  }

  /** Always fill Pickup Date from Reservation. Pickup Time is initialized from Reservation
   * on first close, and from saved billing data (fallback Reservation) on reload. */
  private patchPickupFromReservation(): void {
    const reservation = this.advanceTableClosingOne?.closingReservationForPickupDataModel;
    if (!reservation || !this.advanceTableForm) {
      return;
    }
    this.advanceTableForm.patchValue(
      {
        pickUpDateForBilling: reservation.pickupDate,
        pickUpTimeForBilling: reservation.pickupTime,
      },
      { emitEvent: false }
    );
  }

  private patchPickupDateFromReservation(): void {
    const reservation = this.advanceTableClosingOne?.closingReservationForPickupDataModel;
    if (!reservation || !this.advanceTableForm) {
      return;
    }
    this.advanceTableForm.patchValue(
      { pickUpDateForBilling: reservation.pickupDate },
      { emitEvent: false }
    );
  }

  private patchPickupTimeForClosing(): void {
    const reservation = this.advanceTableClosingOne?.closingReservationForPickupDataModel;
    const billing = this.advanceTableClosingOne?.closingDutySlipForBillingModel;
    if (!this.advanceTableForm) {
      return;
    }
    const savedTime = this.isValidBillingDate(billing?.pickUpTimeForBilling)
      ? billing.pickUpTimeForBilling
      : reservation?.pickupTime;
    this.advanceTableForm.patchValue(
      { pickUpTimeForBilling: savedTime },
      { emitEvent: false }
    );
  }

  private applyClosureSourceOnLoad(): void {
    const closureType =
      this.advanceTableClosingOne?.closingDutySlipForBillingModel?.closureType
      ?? this.advanceTableForm?.get('closureType')?.value;
    if (closureType === 'Driver') {
      this.InitDriver();
    } else if (closureType === 'App') {
      this.InitApp();
    } else if (closureType === 'GPS') {
      this.InitGPS();
    }
  }

  private hasUsableDriverData(driver: any): boolean {
    if (!driver) {
      return false;
    }
    const locationOutDate =
      driver.locationOutDateByDriver ?? driver.LocationOutDateByDriver;
    if (this.isValidBillingDate(locationOutDate)) {
      return true;
    }
    const kmFields = [
      driver.locationOutKMByDriver ?? driver.LocationOutKMByDriver,
      driver.pickUpKMByDriver ?? driver.PickUpKMByDriver,
      driver.dropOffKMByDriver ?? driver.DropOffKMByDriver,
      driver.locationInKMByDriver ?? driver.LocationInKMByDriver,
    ];
    return kmFields.some((value) => {
      const n = Number(value);
      return Number.isFinite(n) && n !== 0;
    });
  }

  private hasUsableAppData(app: any): boolean {
    if (!app) {
      return false;
    }
    if (this.isValidBillingDate(app.locationOutDateByApp ?? app.LocationOutDateByApp)) {
      return true;
    }
    const kmFields = [
      app.locationOutKMByApp ?? app.LocationOutKMByApp,
      app.pickUpKMByApp ?? app.PickUpKMByApp,
      app.dropOffKMByApp ?? app.DropOffKMByApp,
      app.locationInKMByApp ?? app.LocationInKMByApp,
      app.locationOutKMByAppActual ?? app.LocationOutKMByAppActual,
      app.pickupKMByAppActual ?? app.PickupKMByAppActual,
      app.dropOffKMByAppActual ?? app.DropOffKMByAppActual,
      app.locationInKMByAppActual ?? app.LocationInKMByAppActual,
    ];
    return kmFields.some((value) => {
      const n = Number(value);
      return Number.isFinite(n) && n !== 0;
    });
  }

  private showNoDriverDataWarning(): void {
    Swal.fire('', 'No driver KM data found for this duty.', 'warning');
  }

  private parseLatLongPair(latLong: string | null | undefined): { lat: string; long: string } | null {
    if (!latLong) {
      return null;
    }
    const value = latLong.replace('(', '').replace(')', '');
    const lat = value.split(' ')[2];
    const long = value.split(' ')[1];
    if (!lat || !long) {
      return null;
    }
    return { lat, long };
  }

  /**
   * Fill billing trip fields from DutySlipByApp.
   * useActualKm:true  → App KM radio (constructed Actual odometer chain)
   * useActualKm:false → Driver KM fallback (raw App odometer = comparison Driver column)
   */
  private patchFormFromAppModel(options: { useActualKm: boolean }): void {
    const app = this.advanceTableClosingOne?.closingDutySlipByAppModel;
    if (!app || !this.advanceTableForm) {
      return;
    }

    const locationOutCoords = this.parseLatLongPair(app.locationOutLatLongByApp);
    const pickUpCoords = this.parseLatLongPair(app.pickUpLatLongByApp);
    const reportingCoords = this.parseLatLongPair(app.reportingToGuestLatLongByApp);
    const dropOffCoords = this.parseLatLongPair(app.dropOffLatLongByApp);
    const locationInCoords = this.parseLatLongPair(app.locationInLatLongByApp);

    const locationOutKm = options.useActualKm ? app.locationOutKMByAppActual : app.locationOutKMByApp;
    const reportingKm = options.useActualKm ? app.reportingToGuestKMByAppActual : app.reportingToGuestKMByApp;
    const pickUpKm = options.useActualKm ? app.pickupKMByAppActual : app.pickUpKMByApp;
    const dropOffKm = options.useActualKm ? app.dropOffKMByAppActual : app.dropOffKMByApp;
    const locationInKm = options.useActualKm ? app.locationInKMByAppActual : app.locationInKMByApp;

    if (app.locationOutLocationOrHubID) {
      this.advanceTableForm.patchValue({ locationOutLocationOrHubID: app.locationOutLocationOrHubID });
    } else {
      this.advanceTableForm.patchValue({ locationOutLocationOrHubID: 0 });
    }

    this.advanceTableForm.patchValue({ locationOutDateForBilling: app.locationOutDateByApp });
    this.advanceTableForm.patchValue({ locationOutTimeForBilling: app.locationOutTimeByApp });
    this.advanceTableForm.patchValue({ locationOutKMForBilling: locationOutKm });
    this.advanceTableForm.patchValue({ locationOutAddressStringForBilling: app.locationOutAddressStringByApp });
    this.advanceTableForm.patchValue({
      locationOutLatLongForBilling: locationOutCoords
        ? `${locationOutCoords.lat},${locationOutCoords.long}`
        : null,
    });

    this.advanceTableForm.patchValue({ reportingToGuestDateForBilling: app.reportingToGuestDateByApp });
    this.advanceTableForm.patchValue({ reportingToGuestTimeForBilling: app.reportingToGuestTimeByApp });
    this.advanceTableForm.patchValue({ reportingToGuestKMForBilling: reportingKm });
    this.advanceTableForm.patchValue({ reportingToGuestAddressStringForBilling: app.reportingToGuestAddressStringByApp });
    this.advanceTableForm.patchValue({
      reportingToGuestLatLongForBilling: reportingCoords
        ? `${reportingCoords.lat},${reportingCoords.long}`
        : null,
    });

    // Pickup Date/Time are locked to Reservation; never patched from App/GPS/Driver here.
    this.advanceTableForm.patchValue({ pickUpKMForBilling: pickUpKm });
    this.advanceTableForm.patchValue({ pickUpAddressStringForBilling: app.pickUpAddressStringByApp });
    this.advanceTableForm.patchValue({
      pickUpLatLongForBilling: pickUpCoords ? `${pickUpCoords.lat},${pickUpCoords.long}` : null,
    });

    this.advanceTableForm.patchValue({ dropOffDateForBilling: app.dropOffDateByApp });
    this.advanceTableForm.patchValue({ dropOffTimeForBilling: app.dropOffTimeByApp });
    this.advanceTableForm.patchValue({ dropOffKMForBilling: dropOffKm });
    this.advanceTableForm.patchValue({ dropOffAddressStringForBilling: app.dropOffAddressStringByApp });
    this.advanceTableForm.patchValue({
      dropOffLatLongForBilling: dropOffCoords ? `${dropOffCoords.lat},${dropOffCoords.long}` : null,
    });

    if (app.locationOutLocationOrHubID) {
      this.advanceTableForm.patchValue({ locationInLocationOrHubID: app.locationOutLocationOrHubID });
    } else {
      this.advanceTableForm.patchValue({ locationInLocationOrHubID: 0 });
    }

    this.advanceTableForm.patchValue({ locationInDateForBilling: app.locationInDateByApp });
    this.advanceTableForm.patchValue({ locationInTimeForBilling: app.locationInTimeByApp });
    this.advanceTableForm.patchValue({ locationInKMForBilling: locationInKm });
    if (app.locationInAddressStringByApp !== null && app.locationInAddressStringByApp !== undefined && app.locationInAddressStringByApp !== '') {
      this.advanceTableForm.patchValue({ locationInAddressStringForBilling: app.locationInAddressStringByApp });
    } else {
      this.advanceTableForm.patchValue({ locationInAddressStringForBilling: app.locationOutAddressStringByApp });
    }

    if (locationInCoords) {
      this.advanceTableForm.patchValue({
        locationInLatLongForBilling: `${locationInCoords.lat},${locationInCoords.long}`,
      });
    } else if (locationOutCoords && app.locationOutAddressStringByApp) {
      this.advanceTableForm.patchValue({
        locationInLatLongForBilling: `${locationOutCoords.lat},${locationOutCoords.long}`,
      });
    } else {
      this.advanceTableForm.patchValue({ locationInLatLongForBilling: null });
    }

    this.onKeyUp();
    this.applyRoundOffBillingTimes();
    this.onTimeSelection();
  }

  private patchFormFromDriverModel(driver: ClosingDutySlipByDriverModel | any): void {
    if (!driver || !this.advanceTableForm) {
      return;
    }

    const locationOutCoords = this.parseLatLongPair(driver.locationOutLatLongByDriver);
    const pickUpCoords = this.parseLatLongPair(driver.pickUpLatLongByDriver);
    const reportingCoords = this.parseLatLongPair(driver.reportingToGuestLatLongByDriver);
    const dropOffCoords = this.parseLatLongPair(driver.dropOffLatLongByDriver);
    const locationInCoords = this.parseLatLongPair(driver.locationInLatLongByDriver);

    if (driver.locationOutLocationOrHubID) {
      this.advanceTableForm.patchValue({ locationOutLocationOrHubID: driver.locationOutLocationOrHubID });
    } else {
      this.advanceTableForm.patchValue({ locationOutLocationOrHubID: 0 });
    }

    this.advanceTableForm.patchValue({ locationOutDateForBilling: driver.locationOutDateByDriver });
    this.advanceTableForm.patchValue({ locationOutTimeForBilling: driver.locationOutTimeByDriver });
    this.advanceTableForm.patchValue({ locationOutKMForBilling: driver.locationOutKMByDriver });
    this.advanceTableForm.patchValue({ locationOutAddressStringForBilling: driver.locationOutAddressStringByDriver });
    this.advanceTableForm.patchValue({
      locationOutLatLongForBilling: locationOutCoords
        ? `${locationOutCoords.lat},${locationOutCoords.long}`
        : null,
    });

    this.advanceTableForm.patchValue({ reportingToGuestDateForBilling: driver.reportingToGuestDateByDriver });
    this.advanceTableForm.patchValue({ reportingToGuestTimeForBilling: driver.reportingToGuestTimeByDriver });
    this.advanceTableForm.patchValue({ reportingToGuestKMForBilling: driver.reportingToGuestKMByDriver });
    this.advanceTableForm.patchValue({
      reportingToGuestAddressStringForBilling: driver.reportingToGuestAddressStringByDriver,
    });
    this.advanceTableForm.patchValue({
      reportingToGuestLatLongForBilling: reportingCoords
        ? `${reportingCoords.lat},${reportingCoords.long}`
        : null,
    });

    // Pickup Date/Time are locked to Reservation; never patched from App/GPS/Driver here.
    this.advanceTableForm.patchValue({ pickUpKMForBilling: driver.pickUpKMByDriver });
    this.advanceTableForm.patchValue({ pickUpAddressStringForBilling: driver.pickUpAddressStringByDriver });
    this.advanceTableForm.patchValue({
      pickUpLatLongForBilling: pickUpCoords ? `${pickUpCoords.lat},${pickUpCoords.long}` : null,
    });

    this.advanceTableForm.patchValue({ dropOffDateForBilling: driver.dropOffDateByDriver });
    this.advanceTableForm.patchValue({ dropOffTimeForBilling: driver.dropOffTimeByDriver });
    this.advanceTableForm.patchValue({ dropOffKMForBilling: driver.dropOffKMByDriver });
    this.advanceTableForm.patchValue({ dropOffAddressStringForBilling: driver.dropOffAddressStringByDriver });
    this.advanceTableForm.patchValue({
      dropOffLatLongForBilling: dropOffCoords ? `${dropOffCoords.lat},${dropOffCoords.long}` : null,
    });

    if (driver.locationOutLocationOrHubID) {
      this.advanceTableForm.patchValue({ locationInLocationOrHubID: driver.locationOutLocationOrHubID });
    } else {
      this.advanceTableForm.patchValue({ locationInLocationOrHubID: 0 });
    }

    this.advanceTableForm.patchValue({ locationInDateForBilling: driver.locationInDateByDriver });
    this.advanceTableForm.patchValue({ locationInTimeForBilling: driver.locationInTimeByDriver });
    this.advanceTableForm.patchValue({ locationInKMForBilling: driver.locationInKMByDriver });

    const locationInAddress =
      driver.locationInAddressStringByDriver ?? driver.locationOutAddressStringByDriver ?? null;
    this.advanceTableForm.patchValue({ locationInAddressStringForBilling: locationInAddress });

    if (locationInCoords) {
      this.advanceTableForm.patchValue({
        locationInLatLongForBilling: `${locationInCoords.lat},${locationInCoords.long}`,
      });
    } else if (locationOutCoords) {
      this.advanceTableForm.patchValue({
        locationInLatLongForBilling: `${locationOutCoords.lat},${locationOutCoords.long}`,
      });
    } else {
      this.advanceTableForm.patchValue({ locationInLatLongForBilling: null });
    }

    this.applyReportingFromPickupFallbackToForm();
    this.onKeyUp();
    this.applyRoundOffBillingTimes();
    this.onTimeSelection();
  }

  /** Patch trip/KM/address fields from saved DutySlipForBilling row (Manual KM baseline). */
  private patchBillingTripFieldsFromForBillingModel(): void {
    const billing = this.advanceTableClosingOne?.closingDutySlipForBillingModel;
    if (!billing || !this.advanceTableForm) {
      return;
    }

    const locationOutCoords = this.parseLatLongPair(billing.locationOutLatLongForBilling);
    const reportingCoords = this.parseLatLongPair(billing.reportingToGuestLatLongForBilling);
    const pickUpCoords = this.parseLatLongPair(billing.pickUpLatLongForBilling);
    const dropOffCoords = this.parseLatLongPair(billing.dropOffLatLongForBilling);
    const locationInCoords = this.parseLatLongPair(billing.locationInLatLongForBilling);

    this.advanceTableForm.patchValue({ locationOutDateForBilling: billing.locationOutDateForBilling });
    this.advanceTableForm.patchValue({ locationOutTimeForBilling: billing.locationOutTimeForBilling });
    this.advanceTableForm.patchValue({ locationOutKMForBilling: billing.locationOutKMForBilling });
    this.advanceTableForm.patchValue({ locationOutAddressStringForBilling: billing.locationOutAddressStringForBilling });
    this.advanceTableForm.patchValue({
      locationOutLatLongForBilling: locationOutCoords
        ? `${locationOutCoords.lat},${locationOutCoords.long}`
        : null,
    });

    this.advanceTableForm.patchValue({ reportingToGuestDateForBilling: billing.reportingToGuestDateForBilling });
    this.advanceTableForm.patchValue({ reportingToGuestTimeForBilling: billing.reportingToGuestTimeForBilling });
    this.advanceTableForm.patchValue({ reportingToGuestKMForBilling: billing.reportingToGuestKMForBilling });
    this.advanceTableForm.patchValue({
      reportingToGuestAddressStringForBilling: billing.reportingToGuestAddressStringForBilling,
    });
    this.advanceTableForm.patchValue({
      reportingToGuestLatLongForBilling: reportingCoords
        ? `${reportingCoords.lat},${reportingCoords.long}`
        : null,
    });

    this.patchPickupDateFromReservation();
    this.patchPickupTimeForClosing();

    this.advanceTableForm.patchValue({ pickUpKMForBilling: billing.pickUpKMForBilling });
    this.advanceTableForm.patchValue({ pickUpAddressStringForBilling: billing.pickUpAddressStringForBilling });
    this.advanceTableForm.patchValue({
      pickUpLatLongForBilling: pickUpCoords ? `${pickUpCoords.lat},${pickUpCoords.long}` : null,
    });

    this.advanceTableForm.patchValue({ dropOffDateForBilling: billing.dropOffDateForBilling });
    this.advanceTableForm.patchValue({ dropOffTimeForBilling: billing.dropOffTimeForBilling });
    this.advanceTableForm.patchValue({ dropOffKMForBilling: billing.dropOffKMForBilling });
    this.advanceTableForm.patchValue({ dropOffAddressStringForBilling: billing.dropOffAddressStringForBilling });
    this.advanceTableForm.patchValue({
      dropOffLatLongForBilling: dropOffCoords ? `${dropOffCoords.lat},${dropOffCoords.long}` : null,
    });

    this.advanceTableForm.patchValue({ locationInDateForBilling: billing.locationInDateForBilling });
    this.advanceTableForm.patchValue({ locationInTimeForBilling: billing.locationInTimeForBilling });
    this.advanceTableForm.patchValue({ locationInKMForBilling: billing.locationInKMForBilling });
    this.advanceTableForm.patchValue({ locationInAddressStringForBilling: billing.locationInAddressStringForBilling });
    this.advanceTableForm.patchValue({
      locationInLatLongForBilling: locationInCoords
        ? `${locationInCoords.lat},${locationInCoords.long}`
        : null,
    });

    this.advanceTableForm.patchValue({
      locationOutLocationOrHubID: this.toFormIntOrNull(billing.locationOutLocationOrHubID),
    });
    this.advanceTableForm.patchValue({
      locationInLocationOrHubID: this.toFormIntOrZero(billing.locationInLocationOrHubID),
    });
  }

  /** Pickup Date must remain non-editable for every closure type. Pickup Time stays editable. */
  private disablePickupDateTimeControls(): void {
    if (!this.advanceTableForm) {
      return;
    }
    for (const name of this.lockedPickupControls) {
      this.advanceTableForm.get(name)?.disable({ emitEvent: false });
    }
  }

  private guardDutySlipEdit(options?: { skipGfbLock?: boolean }): boolean {
    if (this.isEInvoiceBlockingEdits) {
      this.showNotification(
        'snackbar-warning',
        'E-Invoice (IRN) is already generated and active. Changes are not allowed.',
        'bottom',
        'center'
      );
      return false;
    }
    if (!options?.skipGfbLock && this.isGoodForBillingBlockingEdits) {
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

  applyExternalEInvoiceState(state: { hasActiveEInvoice: boolean; hasActiveInvoice?: boolean; irn?: string | null }): void {
    this.hasActiveEInvoice = state.hasActiveEInvoice === true;
    if (state.hasActiveInvoice !== undefined) {
      this.hasActiveInvoice = state.hasActiveInvoice === true;
    }
    if (state.irn !== undefined) {
      this.IRN = state.irn;
    }
    if (this.advanceTableClosingOne) {
      this.advanceTableClosingOne.hasActiveEInvoice = this.hasActiveEInvoice;
      this.advanceTableClosingOne.hasActiveInvoice = this.hasActiveInvoice;
      if (state.irn !== undefined) {
        this.advanceTableClosingOne.irn = state.irn;
      }
    }
    this.applyDutySlipEditLockState();
  }

  private async refreshEInvoiceStateBeforeSave(options?: { skipGfbLock?: boolean }): Promise<boolean> {
    const dutySlipId = this.DutySlipID
      ?? this.advanceTableClosingOne?.closingDutySlipModel?.dutySlipID
      ?? this.advanceTableForm?.get('dutySlipID')?.value;
    if (dutySlipId == null || dutySlipId === '') {
      return this.guardDutySlipEdit(options);
    }
    try {
      const state = await firstValueFrom(
        this.clossingOneService.refreshActiveEInvoiceState(dutySlipId)
      );
      this.applyExternalEInvoiceState(state);
    } catch {
      // Fall back to in-memory guard when refresh fails.
    }
    return this.guardDutySlipEdit(options);
  }

  get isDutyCalculated(): boolean {
    const dsClosing =
      this.advanceTableClosingOne?.closingDutySlipForBillingModel?.dsClosing ??
      this.advanceTableForm?.get('dsClosing')?.value;
    return dsClosing !== null && dsClosing !== undefined && dsClosing !== '';
  }

  private normalizeRemark(value: unknown): string {
    return value == null ? '' : String(value).trim();
  }

  private syncLoadedRemarksFromForm(): void {
    const form = this.advanceTableForm?.getRawValue();
    this.loadedRunningDetails = this.normalizeRemark(form?.runningDetails);
    this.loadedVendorRemark = this.normalizeRemark(form?.vendorRemark);
    this.syncLoadedKmFromForm();
  }

  private normalizeKmField(value: unknown): string {
    if (value == null || value === '') {
      return '';
    }
    return String(value).trim();
  }

  private syncLoadedKmFromForm(): void {
    const form = this.advanceTableForm?.getRawValue();
    if (!form) {
      return;
    }
    for (const name of this.alwaysEditableKmControls) {
      this.loadedKmValues[name] = this.normalizeKmField(form[name]);
    }
  }

  haveKmChanged(): boolean {
    const form = this.advanceTableForm?.getRawValue();
    if (!form) {
      return false;
    }
    return this.alwaysEditableKmControls.some(
      name => this.normalizeKmField(form[name]) !== (this.loadedKmValues[name] ?? '')
    );
  }

  haveRemarksChanged(): boolean {
    const form = this.advanceTableForm?.getRawValue();
    if (!form) {
      return false;
    }
    return this.normalizeRemark(form.runningDetails) !== this.loadedRunningDetails
      || this.normalizeRemark(form.vendorRemark) !== this.loadedVendorRemark;
  }

  private normalizeTripField(name: string, value: unknown): string {
    if (value == null || value === '') {
      return '';
    }
    if (name.endsWith('DateForBilling')) {
      const dateM = moment(value as moment.MomentInput);
      return dateM.isValid() ? dateM.format('YYYY-MM-DD') : String(value).trim();
    }
    if (name.endsWith('TimeForBilling')) {
      const timeM = moment(value as moment.MomentInput);
      return timeM.isValid() ? timeM.format('HH:mm') : String(value).trim();
    }
    if (typeof value === 'boolean') {
      return value ? '1' : '0';
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
    const asString = String(value).trim();
    if (asString === 'true' || asString === '1') {
      return '1';
    }
    if (asString === 'false' || asString === '0') {
      return '0';
    }
    return asString;
  }

  private syncLoadedTripFieldsFromForm(): void {
    const form = this.advanceTableForm?.getRawValue();
    if (!form) {
      this.tripFieldsSnapshotReady = false;
      return;
    }
    this.loadedTripFieldValues = {};
    for (const name of this.fullPutFieldControls) {
      this.loadedTripFieldValues[name] = this.normalizeTripField(name, form[name]);
    }
    this.tripFieldsSnapshotReady = true;
  }

  haveTripFieldsChanged(): boolean {
    if (!this.tripFieldsSnapshotReady) {
      return true;
    }
    const form = this.advanceTableForm?.getRawValue();
    if (!form) {
      return true;
    }
    return this.fullPutFieldControls.some(
      name => this.normalizeTripField(name, form[name]) !== (this.loadedTripFieldValues[name] ?? '')
    );
  }

  /** GFB checkbox is not a data edit. Ignore Verify/GFB so a GFB click does not always look dirty. */
  private haveUnsavedBillingPutFieldsChanged(): boolean {
    if (!this.tripFieldsSnapshotReady) {
      return true;
    }
    const form = this.advanceTableForm?.getRawValue();
    if (!form) {
      return true;
    }
    return this.fullPutFieldControls.some((name) => {
      if (name === 'verifyDuty' || name === 'goodForBilling') {
        return false;
      }
      return this.normalizeTripField(name, form[name]) !== (this.loadedTripFieldValues[name] ?? '');
    });
  }

  private hasUnsavedClosingEdits(): boolean {
    return this.haveUnsavedBillingPutFieldsChanged()
      || this.haveKmChanged()
      || this.haveRemarksChanged()
      || this.haveClosingAllowancesChanged();
  }

  get canSavePartialPreGfb(): boolean {
    const billingId = this.advanceTableForm?.get('dutySlipForBillingID')?.value;
    return this.buttonText === 'Update'
      && billingId != null
      && billingId !== ''
      && Number(billingId) > 0
      && !this.isGoodForBillingBlockingEdits
      && !this.isEInvoiceBlockingEdits
      && (this.haveRemarksChanged() || this.haveKmChanged())
      && !this.haveTripFieldsChanged();
  }

  get canSavePartialAfterGfb(): boolean {
    return this.isGoodForBillingBlockingEdits
      && !this.isEInvoiceBlockingEdits
      && this.isDutyCalculated
      && (this.haveRemarksChanged() || this.haveKmChanged());
  }

  get canShowSaveButton(): boolean {
    return this.showSpinner === false
      && (
        this.Action === 'Cancelled'
        || !this.isDutyCalculated
        || !this.isDutySlipEditBlocked
        || this.canSavePartialAfterGfb
      );
  }

  get isSaveButtonDisabled(): boolean {
    if (this.canSavePartialAfterGfb) {
      return false;
    }
    return !this.advanceTableForm?.valid
      || (this.isDutyCalculated && this.isDutySlipEditBlocked);
  }

  get saveButtonLabel(): string {
    if (!this.canSavePartialAfterGfb) {
      return this.buttonText;
    }
    const remarksChanged = this.haveRemarksChanged();
    const kmChanged = this.haveKmChanged();
    if (remarksChanged && kmChanged) {
      return 'Save Remarks & KM';
    }
    if (kmChanged) {
      return 'Save KM';
    }
    return 'Save Remarks';
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
    this.patchBillingTripFieldsFromForBillingModel();
    this.applyReportingFromPickupFallbackToForm();

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
      billing.readyForBulkBilling =
        billing.readyForBulkBilling === true || (billing as any).ReadyForBulkBilling === true;
      billing.readyForBulkGfb =
        billing.readyForBulkGfb === true || (billing as any).ReadyForBulkGfb === true;
    }
    this.readyForBulkBilling = !!billing?.readyForBulkBilling && !this.hasActiveInvoiceLock;
    this.readyForBulkGfb = !!billing?.readyForBulkGfb && !goodForBilling && !this.hasActiveInvoiceLock;
    this.advanceTableForm.patchValue({ verifyDuty });
    this.advanceTableForm.patchValue({dsClosing : this.advanceTableClosingOne.closingDutySlipForBillingModel.dsClosing});
    this.advanceTableForm.patchValue({runningDetails : this.advanceTableClosingOne.closingDutySlipForBillingModel.runningDetails});
    this.advanceTableForm.patchValue({vendorRemark : this.advanceTableClosingOne.closingDutySlipForBillingModel.vendorRemark});
    this.syncLoadedRemarksFromForm();
    this.advanceTableForm.patchValue({physicalDutySlipReceived : this.advanceTableClosingOne.closingDutySlipForBillingModel?.physicalDutySlipReceived});
    this.advanceTableForm.patchValue({goodForBilling : this.advanceTableClosingOne.closingDutySlipForBillingModel.goodForBilling});
    this.selectedClosureType = this.advanceTableClosingOne.closingDutySlipForBillingModel.closureType;
    //this.advanceTableForm.patchValue({actionTaken : this.advanceTableClosingOne.closingDutySlipModel.actionTaken});
    //this.advanceTableForm.patchValue({actionDetails : this.advanceTableClosingOne.closingDutySlipModel.actionDetails});
    this.onKeyUp();
    this.applyRoundOffBillingTimes();
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
      closureType:['', Validators.required],
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


  async onGFBChange(event: any)
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
        const needsPersist = this.hasUnsavedClosingEdits();
        if (needsPersist) {
          const saved = await this.persistClosingUpdate({ fromGfb: true });
          if (!saved) {
            this.advanceTableForm.patchValue({ goodForBilling: false });
            return false;
          }
        }
        let at = "Checked";
        this.advanceTableForm.patchValue({actionTaken : "GoodForBilling"});
        this.advanceTableForm.patchValue({actionDetails : at});
        this.advanceTableBH.verifyDuty = this.advanceTableForm.value.verifyDuty;
        this.advanceTableBH.goodForBilling = isChecked;
        this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
        this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
        const calculated = await this.calculateBillAfterGfb();
        if (!calculated) {
          this.advanceTableForm.patchValue({ goodForBilling: false });
          return false;
        }
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
        if (isChecked) {
          this.readyForBulkGfb = false;
          this.advanceTableClosingOne.closingDutySlipForBillingModel.readyForBulkGfb = false;
        }
        if (!isChecked) {
          this.readyForBulkBilling = false;
          this.advanceTableClosingOne.closingDutySlipForBillingModel.readyForBulkBilling = false;
        }
      }
      if(isChecked !==null)
      {
        this.SaveDataInBillingHistory({ skipGfbLock: true });
      }
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
    if (!this.validateClosureTypeSelected()) {
      this.advanceTableForm.patchValue({ verifyDuty: false });
      return;
    }
    if (!this.disputeAdvanceTable || this.disputeAdvanceTable.length === 0) {
      // No disputes, allow verify duty
      this.setVerifyDuty(true, "Checked");
      this.CalculateBillForVerifyDuty();
    } else {
      // Disputes exist: all approvalStatus must be true
      const allApproved = this.disputeAdvanceTable.every(
        (d: any) => d.approvalStatus === true
      );

      if (allApproved) {
        this.setVerifyDuty(true, "Checked");
        this.CalculateBillForVerifyDuty();
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
    if (!value) {
      this.advanceTableClosingOne.closingDutySlipForBillingModel.readyForBulkGfb = false;
    }
  }
  if (!value) {
    this.readyForBulkGfb = false;
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


  SaveDataInBillingHistory(options?: { skipGfbLock?: boolean })
  {
    if (!this.guardDutySlipEdit(options)) {
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
      const actionTaken = response.actionTaken ?? this.advanceTableBH?.actionTaken;
      const isGfbCheck = actionTaken === 'GoodForBilling'
        && (response.goodForBilling === true || this.advanceTableBH?.goodForBilling === true);
      if (actionTaken !== 'Verify Duty' && !isGfbCheck)
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

    if (!this.validateClosureTypeSelected(form?.closureType)) {
      this.showSpinner = false;
      return false;
    }

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

  private savePartialAfterGfb(): void {
    if (this.isEInvoiceBlockingEdits) {
      this.showNotification(
        'snackbar-warning',
        'E-Invoice (IRN) is already generated and active. Changes are not allowed.',
        'bottom',
        'center'
      );
      return;
    }
    const remarksChanged = this.haveRemarksChanged();
    const kmChanged = this.haveKmChanged();
    if (!remarksChanged && !kmChanged) {
      this.showNotification(
        'snackbar-warning',
        'No remark or KM changes to save.',
        'bottom',
        'center'
      );
      return;
    }

    this.showSpinner = true;
    const form = this.advanceTableForm.getRawValue();
    this.dutySlipForBillingService.updateRemarks({
      dutySlipID: form.dutySlipID,
      dutySlipForBillingID: form.dutySlipForBillingID,
      runningDetails: form.runningDetails,
      vendorRemark: form.vendorRemark,
      locationOutKMForBilling: form.locationOutKMForBilling,
      locationOutLatLongForBilling: form.locationOutLatLongForBilling,
      reportingToGuestKMForBilling: form.reportingToGuestKMForBilling,
      reportingToGuestLatLongForBilling: form.reportingToGuestLatLongForBilling,
      pickUpKMForBilling: form.pickUpKMForBilling,
      pickUpLatLongForBilling: form.pickUpLatLongForBilling,
      dropOffKMForBilling: form.dropOffKMForBilling,
      dropOffLatLongForBilling: form.dropOffLatLongForBilling,
      locationInKMForBilling: form.locationInKMForBilling,
      locationInLatLongForBilling: form.locationInLatLongForBilling,
    }).subscribe(
      response => {
        const runningDetails = response?.runningDetails ?? form.runningDetails ?? '';
        const vendorRemark = response?.vendorRemark ?? form.vendorRemark ?? '';
        const kmPatch: Record<string, unknown> = {};
        for (const name of this.alwaysEditableKmControls) {
          kmPatch[name] = response?.[name] ?? form[name];
        }
        this.advanceTableForm.patchValue({ runningDetails, vendorRemark, ...kmPatch }, { emitEvent: false });
        if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
          const billing = this.advanceTableClosingOne.closingDutySlipForBillingModel;
          billing.runningDetails = runningDetails;
          billing.vendorRemark = vendorRemark;
          for (const name of this.alwaysEditableKmControls) {
            (billing as Record<string, unknown>)[name] = kmPatch[name];
          }
        }
        this.loadedRunningDetails = this.normalizeRemark(runningDetails);
        this.loadedVendorRemark = this.normalizeRemark(vendorRemark);
        this.syncLoadedKmFromForm();
        this.showSpinner = false;
        const successMessage = remarksChanged && kmChanged
          ? 'Remarks and KM saved...!!!'
          : kmChanged
            ? 'KM saved...!!!'
            : 'Remarks saved...!!!';
        this.showNotification(
          'snackbar-success',
          successMessage,
          'bottom',
          'center'
        );
        this.saveClosingAllowancesIfChanged();
      },
      error => {
        this.showSpinner = false;
        this.showNotification(
          'snackbar-danger',
          this.extractApiErrorMessage(error, 'Failed to save closing fields.'),
          'bottom',
          'center'
        );
      }
    );
  }

  public async Put(): Promise<void>
  {
    const allowed = await this.refreshEInvoiceStateBeforeSave();
    if (!allowed) {
      return;
    }
    // Pre-GFB updates use the same full PUT /Closing path as first save (sanitized payload).
    // Partial UpdateRemarks is only for post-GFB when the form is locked for most fields.
    const usePartial = this.canSavePartialAfterGfb;
    this.resetGoodForBillingOnUpdate();
    if (usePartial) {
      this.savePartialAfterGfb();
      return;
    }
    await this.persistClosingUpdate({ skipEInvoiceRefresh: true });
  }

  /** Update/Save unchecks GFB (Verify stays) and clears Ready. Not used by the GFB checkbox path. */
  private resetGoodForBillingOnUpdate(): boolean {
    const billing = this.advanceTableClosingOne?.closingDutySlipForBillingModel;
    const dutySlip = this.advanceTableClosingOne?.closingDutySlipModel;
    const isGfb = this.getBillingFlag(
      billing?.goodForBilling ?? (billing as any)?.GoodForBilling,
      dutySlip?.goodForBilling ?? (dutySlip as any)?.GoodForBilling
        ?? this.advanceTableForm?.get('goodForBilling')?.value
    );
    if (!isGfb) {
      return false;
    }

    if (!this.advanceTableBH) {
      this.advanceTableBH = {} as BillingHistory;
    }

    this.advanceTableForm.patchValue({
      goodForBilling: false,
      actionTaken: 'GoodForBilling',
      actionDetails: 'Unchecked',
    });
    this.advanceTableBH.verifyDuty = this.advanceTableForm.getRawValue()?.verifyDuty;
    this.advanceTableBH.goodForBilling = false;
    this.advanceTableBH.actionTaken = 'GoodForBilling';
    this.advanceTableBH.actionDetails = 'Unchecked';
    this.readyForBulkBilling = false;
    if (billing) {
      billing.goodForBilling = false;
      billing.readyForBulkBilling = false;
    }
    this.SaveDataInBillingHistory({ skipGfbLock: true });
    this.dutyStatusChanged.emit({
      verifyDuty: !!this.advanceTableForm.getRawValue()?.verifyDuty,
      goodForBilling: false,
      message: 'Good for Billing was reset.',
    });
    this.showNotification(
      'snackbar-warning',
      'Good for Billing was reset. Please set Good for Billing again.',
      'bottom',
      'center'
    );
    return true;
  }

  /**
   * Full PUT /Closing (Update). Update already reset GFB when it was checked. Does not call GTrack.
   * GFB checkbox path uses fromGfb so unsaved times/KM/remarks are saved before calculate.
   */
  private async persistClosingUpdate(options?: {
    fromGfb?: boolean;
    skipEInvoiceRefresh?: boolean;
  }): Promise<boolean> {
    const fromGfb = options?.fromGfb === true;
    const guardOptions = fromGfb ? { skipGfbLock: true } : undefined;
    if (!options?.skipEInvoiceRefresh) {
      const allowed = await this.refreshEInvoiceStateBeforeSave(guardOptions);
      if (!allowed) {
        return false;
      }
    }
    if (!this.guardDutySlipEdit(guardOptions)) {
      return false;
    }
    this.showSpinner = true;
    if (!this.checkChronologyAndValues()) {
      this.showSpinner = false;
      return false;
    }
    this.applyClosingFieldDefaults();
    if (!this.ClossingDetails()) {
      this.showSpinner = false;
      return false;
    }

    const payload = this.advanceTableForm.getRawValue();
    payload.fetchGtrackRunningDetails = false;
    payload.goodForBilling = false;

    try {
      const response = await firstValueFrom(this.dutySlipForBillingService.update(payload));
      this.DSClosing = response.dsClosing;
      this.buttonText = 'Update';
      this.syncClosingModelFromResponse(response);
      this.syncVerifyDutyAndGoodForBillingState();
      if (fromGfb) {
        this.advanceTableForm.patchValue(
          { goodForBilling: true, verifyDuty: true },
          { emitEvent: false }
        );
      }
      this.syncLoadedTripFieldsFromForm();
      this.syncLoadedKmFromForm();
      const allowancesOk = await this.saveClosingAllowancesIfChangedAsync();
      this.showSpinner = false;
      if (!fromGfb) {
        this.showNotification(
          'snackbar-success',
          'Saved...!!!',
          'bottom',
          'center'
        );
      }
      return allowancesOk;
    } catch (error) {
      this.showSpinner = false;
      this.showNotification(
        'snackbar-danger',
        this.extractApiErrorMessage(error, 'Operation Failed.....!!!'),
        'bottom',
        'center'
      );
      return false;
    }
  }

  private saveClosingAllowancesIfChangedAsync(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.canEditClosingAllowances || !this.haveClosingAllowancesChanged()) {
        resolve(true);
        return;
      }
      this.clossingOneService.updateClosingAllowances(this.DutySlipID, {
        totalDriverAllowanceDays: this.toAllowanceNumber(this.totalDriverAllowanceDays),
        totalNights: this.toAllowanceNumber(this.totalNights),
      }).subscribe(
        (response) => {
          this.applyClosingAllowanceValues(response);
          resolve(true);
        },
        (error) => {
          this.showNotification(
            'snackbar-danger',
            this.extractApiErrorMessage(error, 'Failed to save driver/night allowance.'),
            'bottom',
            'center'
          );
          resolve(false);
        }
      );
    });
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
   * @param skipEditGuard when true (GFB path), skip the edit guard so calc still runs after GFB lock.
   * Dummy Invoice is not opened here; clerks open it with View Dummy Invoice.
   * @param skipLoadClosingAllowances GFB already has Verify allowance totals; skip extra GET.
   */
  public CalculateBill(
    showSummaryPopup = false,
    skipEditGuard = false,
    skipLoadClosingAllowances = false
  ): Promise<boolean>
  {
    return new Promise((resolve) => {
    // GFB path already persisted status; skip edit guard so calc still runs after GFB lock.
    if (!skipEditGuard && !this.guardDutySlipEdit()) {
      resolve(false);
      return;
    }
    if (showSummaryPopup) {
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
        if (showSummaryPopup) {
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
        if (!skipLoadClosingAllowances) {
          this.loadClosingAllowances();
        }
        if (showSummaryPopup) {
          this.openSummaryOfDutyDialog();
        }
        resolve(true);
      },
      error =>
      {
        if (showSummaryPopup) {
          this.showCalculateBillOverlay = false;
        } else {
          this.showSpinnerForVDGB = false;
        }
        const errorMessage = this.extractApiErrorMessage(error, 'Operation Failed.....!!!');
        this.advanceTableForm.patchValue({ verifyDuty: true, goodForBilling: false });
        if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
          this.advanceTableClosingOne.closingDutySlipForBillingModel.verifyDuty = true;
          this.advanceTableClosingOne.closingDutySlipForBillingModel.goodForBilling = false;
        }
        Swal.fire({
          icon: 'error',
          html: this.formatApiErrorForSwal(errorMessage)
        }).then(() => {
            // GFB path already unchecks in onGFBChange after this promise rejects.
            // Do not call onGFBChange here — that would POST a dummy Unchecked history row.
            this.saveDisabled = true;
          });
        resolve(false);
      }
    );
    });
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

  get hasActiveInvoiceLock(): boolean {
    if (this.hasActiveInvoice === true || this.advanceTableClosingOne?.hasActiveInvoice === true) {
      return true;
    }
    const invoiceId = this.advanceTableClosingOne?.invoiceID ?? this.InvoiceID;
    return Number(invoiceId) > 0;
  }

  get canToggleReadyForBulkGfb(): boolean {
    const verifyDuty = this.advanceTableForm?.getRawValue()?.verifyDuty
      ?? this.advanceTableClosingOne?.closingDutySlipForBillingModel?.verifyDuty;
    const goodForBilling = this.advanceTableForm?.getRawValue()?.goodForBilling
      ?? this.advanceTableClosingOne?.closingDutySlipForBillingModel?.goodForBilling;
    return !!verifyDuty
      && !goodForBilling
      && !this.hasActiveInvoiceLock
      && !this.isEInvoiceBlockingEdits;
  }

  get canToggleReadyForBulkBilling(): boolean {
    return this.canViewDummyInvoice()
      && !this.hasActiveInvoiceLock
      && !this.isEInvoiceBlockingEdits;
  }

  onReadyForBulkGfbChange(event: any): void {
    const isChecked = event.checked === true;
    if (isChecked && !this.canToggleReadyForBulkGfb) {
      this.readyForBulkGfb = false;
      const goodForBilling = this.advanceTableForm?.getRawValue()?.goodForBilling
        ?? this.advanceTableClosingOne?.closingDutySlipForBillingModel?.goodForBilling;
      this.showNotification(
        'snackbar-warning',
        this.hasActiveInvoiceLock
          ? 'Invoice already exists. Ready for Bulk GFB cannot be set.'
          : goodForBilling
            ? 'Uncheck Good for Billing before Ready for Bulk GFB.'
            : 'Check Verify Duty before Ready for Bulk GFB.',
        'bottom',
        'center'
      );
      return;
    }

    const previous = this.readyForBulkGfb;
    this.readyForBulkGfb = isChecked;
    this.tagSaving = true;
    this.dutySlipForBillingService
      .setReadyForBulkGfb(this.DutySlipID, isChecked, this._generalService.getUserID())
      .subscribe({
        next: (response) => {
          this.tagSaving = false;
          this.readyForBulkGfb =
            response?.readyForBulkGfb === true || response?.ReadyForBulkGfb === true;
          if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
            this.advanceTableClosingOne.closingDutySlipForBillingModel.readyForBulkGfb =
              this.readyForBulkGfb;
          }
          this.showNotification(
            'snackbar-success',
            this.readyForBulkGfb ? 'Ready for Bulk GFB set.' : 'Ready for Bulk GFB cleared.',
            'bottom',
            'center'
          );
        },
        error: (err) => {
          this.tagSaving = false;
          this.readyForBulkGfb = previous;
          this.showNotification(
            'snackbar-danger',
            err?.error?.message || err?.error?.Message || err || 'Could not update Ready for Bulk GFB.',
            'bottom',
            'center'
          );
        },
      });
  }

  onReadyForBulkBillingChange(event: any): void {
    const isChecked = event.checked === true;
    if (isChecked && !this.canToggleReadyForBulkBilling) {
      this.readyForBulkBilling = false;
      this.showNotification(
        'snackbar-warning',
        this.hasActiveInvoiceLock
          ? 'Invoice already exists. Ready For Bulk Billing cannot be set.'
          : 'Check Good For Billing before Ready For Bulk Billing.',
        'bottom',
        'center'
      );
      return;
    }

    const previous = this.readyForBulkBilling;
    this.readyForBulkBilling = isChecked;
    this.tagSaving = true;
    this.dutySlipForBillingService
      .setReadyForBulkBilling(this.DutySlipID, isChecked, this._generalService.getUserID())
      .subscribe({
        next: (response) => {
          this.tagSaving = false;
          this.readyForBulkBilling =
            response?.readyForBulkBilling === true || response?.ReadyForBulkBilling === true;
          if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
            this.advanceTableClosingOne.closingDutySlipForBillingModel.readyForBulkBilling =
              this.readyForBulkBilling;
          }
          this.showNotification(
            'snackbar-success',
            this.readyForBulkBilling ? 'Ready For Bulk Billing set.' : 'Ready For Bulk Billing cleared.',
            'bottom',
            'center'
          );
        },
        error: (err) => {
          this.tagSaving = false;
          this.readyForBulkBilling = previous;
          this.showNotification(
            'snackbar-danger',
            err?.error?.message || err?.error?.Message || err || 'Could not update Ready For Bulk Billing.',
            'bottom',
            'center'
          );
        },
      });
  }

  /** GFB calculate: persist already ran if the form was dirty. Do not open Dummy Invoice. Skip extra allowance GET. */
  private calculateBillAfterGfb(): Promise<boolean> {
    return this.CalculateBill(false, true, true);
  }

  openDummyInvoice(event?: Event): void {
    if (!event || event.type !== 'click') {
      return;
    }
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
          message: this.Message,
          invoiceCalculated: true
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
        // Keep Verify on and GFB off locally. Do not call onGFBChange —
        // that would POST a dummy GoodForBilling Unchecked history row.
        this.advanceTableForm.patchValue({ verifyDuty: true, goodForBilling: false });
        if (this.advanceTableClosingOne?.closingDutySlipForBillingModel) {
          this.advanceTableClosingOne.closingDutySlipForBillingModel.verifyDuty = true;
          this.advanceTableClosingOne.closingDutySlipForBillingModel.goodForBilling = false;
        }
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

    const payload = this.advanceTableForm.getRawValue();
    // Update also sends actionTaken "Verify Duty"; only the checkbox should call GTrack.
    payload.fetchGtrackRunningDetails = verifyDuty === true && goodForBilling !== true;

    this.dutySlipForBillingService
      .update(payload)
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
