// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ClossingScreenService } from './clossingScreen.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingHistory, ClosingDataModel, ClosingDetailShowModel, ClosingScreenCurrentDuty, ClosureTypeModel, CurrentDuty, CustomerInfo, DutySlipByAppModel, DutySlipForBillingModel, DutySlipMap, KMForAppModel, KMForDriverModel, KMPreviousBookingModel, ReservationSalesPersonModel } from './clossingScreen.model';
import { MatAccordion } from '@angular/material/expansion';
import { FormDialogComponent } from '../reachedByExecutive/dialogs/form-dialog/form-dialog.component';
import { DITFormDialogComponent } from '../dutyInterstateTax/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as InterstateTaxEntryFormDialogComponent } from '../interstateTaxEntry/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as  ApprovalFormDialogComponent} from '../dutyInterstateTaxApproval/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as DutyTollParking} from '../dutyTollParkingEntry/dialogs/form-dialog/form-dialog.component';
import moment from 'moment';
import { MatRadioButton } from '@angular/material/radio';
import { DutyTollParkingEntryService } from '../dutyTollParkingEntry/dutyTollParkingEntry.service';
import { DutyTollParkingEntry } from '../dutyTollParkingEntry/dutyTollParkingEntry.model';
//import { AdditionalDialogComponent } from '../additionalKmsDetails/dialogs/form-dialog/form-dialog.component';
import { AdditionalKmsDetailsService } from '../additionalKmsDetails/additionalKmsDetails.service';
import { AdditionalKmsDetails } from '../additionalKmsDetails/additionalKmsDetails.model';
import { AdditionalDialogComponent } from '../additionalKmsDetails/dialogs/form-dialog/form-dialog.component';
import { DutyInterstateTax } from '../dutyInterstateTax/dutyInterstateTax.model';
import { DutyInterstateTaxService } from '../dutyInterstateTax/dutyInterstateTax.service';
import { FormDialogDisputeComponent } from '../dispute/dialogs/form-dialog/form-dialog.component';
import { Dispute } from '../dispute/dispute.model';
import { DisputeService } from '../dispute/dispute.service';
import Swal from 'sweetalert2';
import { FormDialogComponent as DutyExpenseFormDialogComponent } from '../dutyExpense/dialogs/form-dialog/form-dialog.component';
import { DutyExpenseModel } from '../dutyExpense/dutyExpense.model';
import { DutyExpenseService } from '../dutyExpense/dutyExpense.service';
import { KamCardService } from '../kamCard/kamCard.service';
import { KamCard } from '../kamCard/kamCard.model';
import { SpecialInstructionDetailsService } from '../specialInstructionDetails/specialInstructionDetails.service';
import { SpecialInstructionDetails } from '../specialInstructionDetails/specialInstructionDetails.model';
import { InternalNoteDetails } from '../internalNoteDetails/internalNoteDetails.model';
import { InternalNoteDetailsService } from '../internalNoteDetails/internalNoteDetails.service';
import { AdvanceDetailsService } from '../advanceDetails/advanceDetails.service';
import { AdvanceDetails } from '../advanceDetails/advanceDetails.model';
import { LumpsumRateDetailsService } from '../lumpsumRateDetails/lumpsumRateDetails.service';
import { LumpsumRateDetails } from '../lumpsumRateDetails/lumpsumRateDetails.model';
import { AdditionalSMSDetailsService } from '../additionalSMSDetails/additionalSMSDetails.service';
import { AdditionalSMSDetails } from '../additionalSMSDetails/additionalSMSDetails.model';
import { BillToOther } from '../billToOther/billToOther.model';
import { BillToOtherService } from '../billToOther/billToOther.service';
import { SettledRateDetailsService } from '../settledRateDetails/settledRateDetails.service';
import { SettledRateDetails } from '../settledRateDetails/settledRateDetails.model';
import { FormDialogComponent as DutyGSTPercentageFormDialogComponent } from '../dutyGSTPercentage/dialogs/form-dialog/form-dialog.component';
import { DutyGSTPercentage } from '../dutyGSTPercentage/dutyGSTPercentage.model';
import { DutyGSTPercentageService } from '../dutyGSTPercentage/dutyGSTPercentage.service';
import { FormDialogComponent as DutyStateFormDialogComponent  } from '../dutyState/dialogs/form-dialog/form-dialog.component';
import { DutyState } from '../dutyState/dutyState.model';
import { DutyStateService } from '../dutyState/dutyState.service';
import { DutySACModel } from '../dutySAC/dutySAC.model';
import { DutySACService } from '../dutySAC/dutySAC.service';
import { FormDialogComponent as DutySACFormDialogComponent } from '../dutySAC/dialogs/form-dialog/form-dialog.component';
import { SingleDutySingleBillForLocalComponent } from '../SingleDutySingleBillForLocal/SingleDutySingleBillForLocal.component';
import { DiscountDetails } from '../discountDetails/discountDetails.model';
import { DiscountDetailsService } from '../discountDetails/discountDetails.service';
import { RSPFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { RSPDeleteDialogComponent } from './dialogs/delete/delete.component';
import { DispatchByExecutiveService } from '../dispatchByExecutive/dispatchByExecutive.service';
import { BillingHistoryComponent } from '../billingHistory/billingHistory.component';
import { DisputeHistoryComponent } from '../disputeHistory/disputeHistory.component';
import { DiscountDetailsDialogComponent } from '../discountDetails/dialogs/discountDetails/discountDetails.component';

@Component({
  standalone: false,
  selector: 'app-clossingScreen',
  templateUrl: './clossingScreen.component.html',
  styleUrls: ['./clossingScreen.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ClossingScreenComponent implements OnInit {	
  displayedColumns = [
    'salesPerson',
    'status',
    'actions'
  ];
  advanceTableCI: CustomerInfo | null;
  ReservationID: any;
  CustomerGroupID: any;
  CustomerID: any;
  DutySlipID: any;
  dataSourceCurrentDuty:ClosingScreenCurrentDuty[]=[];
  @Output() newDataAddedEvent = new EventEmitter<boolean>();
  advanceTableAD: AdditionalKmsDetails | null;
  dutySlipForBillingList: DutySlipForBillingModel | null;
  advanceTable: CurrentDuty | null;
  advanceTableApp: CurrentDuty | null;
  advanceTableBilling: CurrentDuty | null;
  advanceTableGPS: CurrentDuty | null;
  advanceTableDriverTab: CurrentDuty | null;
  advanceTableAppTab: CurrentDuty | null;
  advanceTableGPSTab: CurrentDuty | null;
  advanceTableBillingTab: CurrentDuty | null;
  reservationCloseDetail: any;
  isAppCardVisible: boolean = false;
  isDriverCardVisible: boolean = false;
  isGPSCardVisible: boolean = false;
  panelExpanded: boolean = false;
  showHideaddDiscount:boolean = false;
  advanceTableForm:FormGroup;
  advanceTableCS: ClosingDetailShowModel | null;
  locationOrHubID: any;
  PackageID: any;
  PackageTypeID: any;
  DutySlipForBillingID: any;

  locationOutLatByDriver: any;
  locationOutLongByDriver: any;
  pickUpLatByDriver: any;
  pickUpLongByDriver: any;
  reportingToGuestLatByDriver: any;
  reportingToGuestLongByDriver: any;
  dropOffLatByDriver: any;
  dropOffLongByDriver: any;

  locationOutLatByApp: any;
  locationOutLongByApp: any;
  pickUpLatByApp: any;
  pickUpLongByApp: any;
  reportingToGuestLatByApp: any;
  reportingToGuestLongByApp: any;
  dropOffLatByApp: any;
  dropOffLongByApp: any;

  locationOutLatByGPS: any;
  locationOutLongByGPS: any;
  pickUpLatByGPS: any;
  pickUpLongByGPS: any;
  reportingToGuestLatByGPS: any;
  reportingToGuestLongByGPS: any;
  dropOffLatByGPS: any;
  dropOffLongByGPS: any;

  appData: any;
  driverData: any;
  gpsData: any;
  RegistrationNumber: any;
  DropOffDate: any;
  PickupDate: any;
  diff: number;
  datetime: any;

  dataSource: Dispute[] | null;
  disputeAdvanceTable:Dispute | null;
 showHideDispute:boolean=false;
 dutySlipID: number;

 advanceTableDE:DutyExpenseModel | null;
 advanceTableDutyState:DutyState | null;
 showHideDutyState:boolean=false;

  pickUpTime: Date;
  dropOffTime: Date;
  locationOutTime: Date;
  locationInTime: Date;
  timeDifference: number;

  selectedOption:string;
  locationInLatByApp: any;
  locationInLongByApp: any;
  CustomerSignatureByDriver: any;
  dutySlipMap: DutySlipMap;
  mapOfDutySlip: string;
  InventoryID: any;
  closureStatus: any;
  locationOutLatForBilling: string;
  locationOutLongForBilling: string;
  pickUpLatForBilling: string;
  pickUpLongForBilling: string;
  reportingToGuestLatForBilling: string;
  reportingToGuestLongForBilling: string;
  dropOffLatForBilling: string;
  dropOffLongForBilling: string;

  tollParkingAdvanceTable: DutyTollParkingEntry | null;
  closingDataAdvanceTable: ClosingDataModel | null;
  SearchActivationStatus : boolean=true;
  SearchExpense : string = '';
  PageNumber: number = 0;
  SearchDutyTollParkingID: number=0;
  showHideTollParkingCard:boolean = false;
  showAdditionalKms:boolean = false;
  showDutyExpense:boolean = false;

  advanceTableDIT: DutyInterstateTax | null;
  showHideaddDIT:boolean=false;
  dutyInterstateTaxID: number=0;
  outputForPickupLocationOut: any;
  outputForDropOffPickup: string;
  outputForlocationInDropOff: string;
  outputForPickupLocationOutApp: string;
  outputForDropOffPickupApp: string;
  outputForlocationInDropOffApp: string;
  outputForlocationInDropOffGPS: string;
  outputForDropOffPickupGPS: string;
  outputForPickupLocationOutGPS: string;
  outputForlocationInDropOffBilling: string;
  outputForDropOffPickupBilling: string;
  outputForPickupLocationOutBilling: string;
  locationInLatByBilling: any;
  locationInLongByBilling: any;
  locationOutLatByBilling: any;
  locationOutLongByBilling: any;
  pickUpLatByBilling: any;
  pickUpLongByBilling: any;
  reportingToGuestLatByBilling: any;
  reportingToGuestLongByBilling: any;
  dropOffLatByBilling: any;
  dropOffLongByBilling: any;
  locationInLatForBilling: string;
  locationInLongForBilling: string;
  radioText: string;
  distanceDifferenceForPickupLocationOutApp: string;
  distanceDiffForPickupLocationOut: string;
  distanceDiffForDropOffPickup: string;
  distanceDiffForlocationInDropOff: string;
  distanceDiffForDropOffPickupApp: string;
  distanceDiffForlocationInDropOffApp: string;
  distanceDiffForPickupLocationOutGPS: string;
  distanceDiffForDropOffPickupGPS: string;
  distanceDiffForlocationInDropOffGPS: string;
  distanceDiffForPickupLocationOutBilling: string;
  distanceDiffForDropOffPickupBilling: string;
  distanceDiffForlocationInDropOffBilling: string;
  totalForManual: any;
  totalForApp: any;
  totalForGtrack: any;
  totalForBilling: any;
  totalTimeForApp: any;
  totalTimeForManual: any;
  totalTimeForGtrack: any;
  totalTimeForBilling: any;
  totalTime: any;
  totalDistance: any;

  advanceTableKC: KamCard | null;
  showKamCard: boolean = false;
  specialInstrucationDetailsList: SpecialInstructionDetails | null;
  showSpecialInstructoins : boolean = false;
  advanceTableIN: InternalNoteDetails | null;
  showInternalNote : boolean = false;
  advanceTableADs: AdvanceDetails | null;
  showAdvanceDetails : boolean = false;
  advanceTableLR: LumpsumRateDetails | null;
  showLumpsumRate : boolean = false;
  advanceTableASEW: AdditionalSMSDetails | null;
  showAdditionalSMS : boolean = false;
  advanceTableBD: BillToOther | null;
  showBillToOther : boolean = false;
  advanceTableSRD: SettledRateDetails | null;
  showSettledRate : boolean = false;
  advanceTableDGP: DutyGSTPercentage | null;
  showDGP : boolean = false;
  advanceTableSAC: DutySACModel | null;
  showSAC : boolean = false;

  isEditingKms = false;
  isEditingMinutes = false;
  reservationID: any;
  
  advanceTableKMForApp:KMForAppModel | null;
  advanceTableKmForDriver:KMForDriverModel | null;
  allotmentID: any;
  totalKMForManul: any;
  totalKMForApp: any;
  advanceTableKMForPreviousBooking:KMPreviousBookingModel | null;
  PickupTime: Date;
  DropOffTime: Date;
  LocationOutDate: Date;
  LocationOutTime: Date;
  PickupAddress: string;
  DropOffAddress: any;
  LocationOutAddress: any;
  LocationInDate: any;
  LocationInTime: any;
  closureTypeValue: ClosureTypeModel | null;
  dutySlipByAppData: DutySlipByAppModel | null;

  advanceTableDD: DiscountDetails | null;
  advanceTableSP: ReservationSalesPersonModel | null;
  showHideSalesPerson: boolean=false;
  dutySlipReceived: any;
  IntervalInTime:any;
  advanceTableBH : BillingHistory | null;
  patchVerifyGoodForBilling :boolean = true;
  selectedTab: string = 'App';


  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public clossingScreenService: ClossingScreenService,
    private snackBar: MatSnackBar,
    public disputeService: DisputeService,
    private fb: FormBuilder,
    public _generalService: GeneralService,  
    public additionalKmsDetailsService: AdditionalKmsDetailsService,
    public route:ActivatedRoute,
    public dutyTollParkingEntryService:DutyTollParkingEntryService,
    public dutyInterstateTaxService:DutyInterstateTaxService,
    public dutyExpenseService: DutyExpenseService,
    public kamCardService: KamCardService,
    public specialInstructionDetailsService: SpecialInstructionDetailsService,
    public internalNoteDetailsService: InternalNoteDetailsService,
    public advanceDetailsService: AdvanceDetailsService,
    public lumpsumRateDetailsService: LumpsumRateDetailsService,
    public additionalSMSDetailsService:AdditionalSMSDetailsService,
    public billToOtherService: BillToOtherService,
    public settledRateDetailsService: SettledRateDetailsService,
    public dutyGSTPercentageService: DutyGSTPercentageService, 
   public dutyStateService: DutyStateService,
   public dutySACService: DutySACService,
   public discountDetails: DiscountDetailsService,
    public advanceTableService: DispatchByExecutiveService,
   public router:Router,
  ) {
    this.advanceTableForm = this.createContactForm();
    //this.advanceTable = new ClossingScreen({});
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  @ViewChild('manualRadio') manualRadio: MatRadioButton;
  @ViewChild('appRadio') appRadio: MatRadioButton;
  @ViewChild('gTrackRadio') gTrackRadio: MatRadioButton;
  @ViewChild('billingRadio') billingRadio: MatRadioButton;

  // toggleBillingManualVisibility(): void {
  //   if (this.manualRadio.checked) {
  //     this.billingRadio._elementRef.nativeElement.textContent = "Billing (Manual)";
  //   } else if (this.appRadio.checked) {
  //     this.billingRadio._elementRef.nativeElement.textContent = "Billing (App)";
  //   } else if (this.gTrackRadio.checked) {
  //     this.billingRadio._elementRef.nativeElement.textContent = "Billing (Gtrack)";
  //   }
  // }
  
  toggleBillingManualVisibility()
  {
    if (this.manualRadio.checked) 
    {
      this.radioText = "Manual";
      this.KMForPreviousBooking();
      this.loadDataForDriver();
      // this.advanceTableForm.patchValue({locationOutAddressStringForBilling:this.advanceTable[0].locationOutAddressStringByDriver});
      // this.advanceTableForm.patchValue({pickUpAddressStringForBilling:this.advanceTable[0].pickUpAddressStringByDriver});
      // this.advanceTableForm.patchValue({dropOffAddressStringForBilling:this.advanceTable[0].dropOffAddressStringByDriver});
      // this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling:this.advanceTable[0].reportingToGuestAddressStringByDriver});
      // this.advanceTableForm.patchValue({locationInAddressStringForBilling:this.advanceTable[0].locationOutAddressStringByDriver});  
      this.loadDataKmForDriver();
      //this.KMForPreviousBooking();
    } 
    else if (this.appRadio.checked)
    {
      this.radioText = "App";
      this.loadDataForApp();
      //this.onKeyUp();
      // this.advanceTableForm.patchValue({locationOutAddressStringForBilling:this.advanceTableApp[0].locationOutAddressStringByApp});
      // this.advanceTableForm.patchValue({pickUpAddressStringForBilling:this.advanceTableApp[0].pickUpAddressStringByApp});
      // this.advanceTableForm.patchValue({dropOffAddressStringForBilling:this.advanceTableApp[0].dropOffAddressStringByApp});
      // this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling:this.advanceTableApp[0].reportingToGuestAddressStringByApp});
      // this.advanceTableForm.patchValue({locationInAddressStringForBilling:this.advanceTableApp[0].locationOutAddressStringByApp});
      this.loadDataKmForApp();
      //this.onKeyUp();
      //this.loadDataForApp();
    }
    else if (this.gTrackRadio.checked)
    {
      this.radioText = "Gtrack";
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling:this.advanceTableGPS[0].locationOutAddressStringByGPS});
      this.advanceTableForm.patchValue({pickUpAddressStringForBilling:this.advanceTableGPS[0].pickUpAddressStringByGPS});
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling:this.advanceTableGPS[0].dropOffAddressStringByGPS});
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling:this.advanceTableGPS[0].reportingToGuestAddressStringByGPS});
      this.advanceTableForm.patchValue({locationInAddressStringForBilling:this.advanceTableGPS[0].locationOutAddressStringByGPS});
    }
    else if (this.billingRadio.checked)
    {
      this.radioText = "";
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedReservationID = paramsData.reservationID;
      this.ReservationID = this._generalService.decrypt(decodeURIComponent(encryptedReservationID));
      const dutySlipID = paramsData.dutySlipID;
      this.DutySlipID = this._generalService.decrypt(decodeURIComponent(dutySlipID));
        
    });
   this.BookingDataOnClosing();
    //this.LoadLTR();
  }


  onlocationToPickupTripKmChange()
  {
    this.advanceTableForm.patchValue({pickUpKMForBilling:Number(this.advanceTableApp[0].locationOutKMForBilling) + Number(this.advanceTableApp[0].locationToPickupTripKm)});
    this.loadDataForApp();
    this.onKeyUp();
  }

  public BookingDataOnClosing() 
   {
      this.clossingScreenService.getClosingData(this.ReservationID).subscribe
      (
        data =>   
        {
          this.closingDataAdvanceTable = data;
          this.allotmentID = this.closingDataAdvanceTable.allotmentID;
        this.dutySlipID = this.closingDataAdvanceTable.dutySlipID;
        this.CustomerID = this.closingDataAdvanceTable.customerID;
        this.PackageID = this.closingDataAdvanceTable.packageID;
        this.PackageTypeID = this.closingDataAdvanceTable.packageTypeID
        this.DutySlipForBillingID = this.closingDataAdvanceTable.dutySlipForBillingID;
        this.RegistrationNumber = this.closingDataAdvanceTable.registrationNumber;
        this.InventoryID = this.closingDataAdvanceTable.inventoryID;
        this.DropOffDate = this.closingDataAdvanceTable.dropOffDate;
        this.PickupDate = this.closingDataAdvanceTable.pickupDate;
        this.closureStatus = this.closingDataAdvanceTable.closureStatus;
        this.PickupTime = this.closingDataAdvanceTable.pickupTime;
        this.DropOffTime = this.closingDataAdvanceTable.dropOffTime;
        this.LocationOutDate = this.closingDataAdvanceTable.locationOutDate;
        this.LocationOutTime = this.closingDataAdvanceTable.locationOutTime;
        this.PickupAddress = this.closingDataAdvanceTable.pickupAddress;
        this.DropOffAddress = this.closingDataAdvanceTable.dropOffAddress;
        this.LocationOutAddress = this.closingDataAdvanceTable.locationOutAddress;
        this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID});
        this.advanceTableForm.patchValue({packageID:this.PackageID});
        this.advanceTableForm.patchValue({dutyTypeID:this.PackageTypeID});
        this.advanceTableForm.patchValue({dutySlipForBillingID:this.DutySlipForBillingID});
        this.getIntervalInTime();
        this.loadDataForBilling();
        this.tollParkingLoadData();
        this.GetClosureType();
        this.GetDutySlipByAppDateTime();
        
        this.GetDutySlipMap();
        this.loadDataForAppTab();
        this.loadDataForCustomer();
        this.loadDataForReservation();
        this.disputeLoadData();
        this.loadData();
        //this.loadDataForBillingTab();
        this.loadDataForCurrentDuty();
        //this.onAppKMClick();
        
        this.InterStateTaxLoadData();
        this.loadDataForGPS();
        this.dutyExpenseLoadData();
        this.kamCardLoadData();
        this.specialInstructoinsLoadData();
        this.internalNoteLoadData();
        this.advanceDetailsLoadData();
        this.lumpsumRateDetailsLoadData();
        this.additionalSMSEmailWhatsAppDetailsLoadData();
        this.billToOtherLoadData();
        this.settledRateLoadData();
        this.DutyGSTPercentageLoadData();
        this.loadDutyStateData();
        this.DutySACLoadData();
        this.loadDataKmForDriver();
        this.loadDataKmForApp();
        this.onTimeSelection();
        this.addtionOfManulKM();
        this.addtionOfAppKM();
        this.KMForPreviousBooking();
        this.discountDetailsLoadData();
        this.salesPersonLoadData();
        },
        (error: HttpErrorResponse) => { this.closingDataAdvanceTable = null;}
      );
  }

  onpickupToDropOffTripKmChange()
  {
    this.advanceTableForm.patchValue({dropOffKMForBilling:Number(this.advanceTableApp[0].pickUpKMForBilling) + Number(this.advanceTableApp[0].pickupToDropOffTripKm)});
    this.loadDataForApp();
    this.onKeyUp();
  }

  ondropOffToLocationInTripKmChange()
  {
    this.advanceTableForm.patchValue({locationInKMForBilling:Number(this.advanceTableApp[0].dropOffKMForBilling) + Number(this.advanceTableApp[0].dropOffToLocationInTripKm)});
    this.loadDataForApp();
    this.onKeyUp();
  }

  onlocationOutKMForDriver()
  {
    if(this.manualRadio.checked === true)
    {
      this.advanceTableForm.patchValue({hubToStartKM:Number(this.advanceTableForm.value.pickUpKMForBilling) - Number(this.advanceTableForm.value.locationOutKMForBilling)});
      this.addtionOfManulKM();
    }
    else if(this.appRadio.checked === true)
    {
      this.advanceTableForm.patchValue({locationToPickupTripKm:Number(this.advanceTableForm.value.pickUpKMForBilling) - Number(this.advanceTableForm.value.locationOutKMForBilling)});
      this.addtionOfAppKM();
    }
    this.onKeyUp();
  }

  onPickupDriverKMChange()
  {
    if(this.manualRadio.checked === true)
    {
      this.advanceTableForm.patchValue({hubToStartKM:Number(this.advanceTableForm.value.pickUpKMForBilling) - Number(this.advanceTableForm.value.locationOutKMForBilling)});
      this.advanceTableForm.patchValue({startToEndKM:Number(this.advanceTableForm.value.dropOffKMForBilling) - Number(this.advanceTableForm.value.pickUpKMForBilling)});
     // this.onKeyUp();
      this.addtionOfManulKM();
    }
    else if(this.appRadio.checked === true)
    {
      this.advanceTableForm.patchValue({pickupToDropOffTripKm:Number(this.advanceTableForm.value.dropOffKMForBilling) - Number(this.advanceTableForm.value.pickUpKMForBilling)});
      this.advanceTableForm.patchValue({locationToPickupTripKm:Number(this.advanceTableForm.value.pickUpKMForBilling) - Number(this.advanceTableForm.value.locationOutKMForBilling)});
      this.addtionOfAppKM();
    }
    this.onKeyUp();
  }

  ondropOffKMForDriverChange()
  {
    if(this.manualRadio.checked === true)
    {
      this.advanceTableForm.patchValue({endToHubKM:Number(this.advanceTableForm.value.locationInKMForBilling) - Number(this.advanceTableForm.value.dropOffKMForBilling)});
      this.advanceTableForm.patchValue({startToEndKM:Number(this.advanceTableForm.value.dropOffKMForBilling) - Number(this.advanceTableForm.value.pickUpKMForBilling)});
      //this.onKeyUp();
      this.addtionOfManulKM();
    }
   else if(this.appRadio.checked === true)
   {
    this.advanceTableForm.patchValue({dropOffToLocationInTripKm:Number(this.advanceTableForm.value.locationInKMForBilling) - Number(this.advanceTableForm.value.dropOffKMForBilling)});
    this.advanceTableForm.patchValue({pickupToDropOffTripKm:Number(this.advanceTableForm.value.dropOffKMForBilling) - Number(this.advanceTableForm.value.pickUpKMForBilling)});
    this.addtionOfAppKM();
   }
   this.onKeyUp();
  }

  onlocationInKMForDriverChange()
  {
    if(this.manualRadio.checked === true)
    {
      this.advanceTableForm.patchValue({endToHubKM:Number(this.advanceTableForm.value.locationInKMForBilling) - Number(this.advanceTableForm.value.dropOffKMForBilling)});
      //this.onKeyUp();
      this.addtionOfManulKM();
    }
    else if(this.appRadio.checked === true)
    {
      this.advanceTableForm.patchValue({dropOffToLocationInTripKm:Number(this.advanceTableForm.value.locationInKMForBilling) - Number(this.advanceTableForm.value.dropOffKMForBilling)});
      this.addtionOfAppKM();
    }
    this.onKeyUp();
  }

  // appRadioSelection()
  // {
  //   this.advanceTableForm.controls["locationOutKMForBilling"].disable();
  //   this.advanceTableForm.controls["pickUpKMForBilling"].disable();
  //   this.advanceTableForm.controls["dropOffKMForBilling"].disable();

  //   this.advanceTableForm.controls["locationOutKMForBillingManual"].disable();
  //   this.advanceTableForm.controls["pickUpKMForBillingManual"].disable();
  //   this.advanceTableForm.controls["dropOffKMForBillingManual"].disable();

  //   this.advanceTableForm.controls["locationOutKMForBillingGPS"].disable();
  //   this.advanceTableForm.controls["pickUpKMForBillingGPS"].disable();
  //   this.advanceTableForm.controls["dropOffKMForBillingGPS"].disable();

  //   var locOut=this.advanceTableForm.get("locationOutKMForBilling").value;
  //   var pickup=this.advanceTableForm.get("pickUpKMForBilling").value;
  //   var dropOff=this.advanceTableForm.get("dropOffKMForBilling").value;

  //   this.advanceTableForm.patchValue({locationOutKMForBillingApp:locOut});
  //   this.advanceTableForm.patchValue({pickUpKMForBillingApp:pickup});
  //   this.advanceTableForm.patchValue({dropOffKMForBillingApp:dropOff});
  // }

  tabChanged(event: any): void {
    // Load data only if it hasn't been loaded yet
    switch(event.index) {
      case 0:
        if (!this.appData) {
          this.loadDataForAppTab();
        }
        break;
      case 1:
        if (!this.driverData) {
          this.loadDataForDriverTab();
        }
        break;  
      case 2:
        if (!this.gpsData) {
          this.loadDataForGPSTab();
        }
        break;
      // default:
      //   break;
    }
  }

  onTabChangeByRadio(event: any): void {
    switch (event.value) {
      case 'App':
        if (!this.appData) {
          this.loadDataForAppTab();
        }
        break;
  
      case 'Driver':
        if (!this.driverData) {
          this.loadDataForDriverTab();
        }
        break;
  
      case 'GPS':
        if (!this.gpsData) {
          this.loadDataForGPSTab();
        }
        break;
    }
  }


  ViewBill()
  {
    let baseUrl = this._generalService.FormURL;
    const url = this.router.serializeUrl(this.router.createUrlTree(['/SingleDutySingleBillForLocal'], { queryParams: {
      dutySlipID:this.DutySlipID,
      reservationID:this.ReservationID,
      vehicleName:this.reservationCloseDetail.vehicle
    } }));
    window.open(baseUrl + url, '_blank');
    // this.dialog.open(SingleDutySingleBillForLocalComponent, {
    //   width: '1000px',
    //   height:'90%',
    //   data: {
    //     //controlPanelData: item,
    //     dutySlipID:this.dutySlipID,
    //     reservationID:this.reservationID
    //   }
    // });
    
  }

  public LoadLTR() 
  {
    this.clossingScreenService.PackageTypeForLTR(this.PackageTypeID).subscribe
      (
        (data:any) => {
          var packageTypeID = data.packageTypeID;
          var packageType = data.packageType;
          if(packageType === 'Long Term Rental')
          {
            if (packageType === 'Long Term Rental') {
              let baseUrl = this._generalService.FormURL;
              const url = this.router.serializeUrl(
                this.router.createUrlTree(['/dutySlipLTRStatement'], {
                  queryParams: {
                    dutySlipID: this.DutySlipID,
                    reservationID: this.ReservationID,
                    customerID: this.CustomerID,
                    pickupDate:this.PickupDate,
                    packageID:this.PackageID
                  }
                })
              );
      
              window.open(baseUrl + url, '_blank'); // Open URL in a new tab
            }
          }   
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  // LTR()
  // {
  //   let baseUrl = this._generalService.FormURL;
  //   const url = this.router.serializeUrl(this.router.createUrlTree(['/dutySlipLTRStatement'], { queryParams: {
  //     dutySlipID:this.DutySlipID,
  //     reservationID:this.ReservationID
  //   } }));
  //   window.open(baseUrl + url, '_blank');    
  // }

  submit(){}
public CalculateBill()
{
  this.clossingScreenService.calculateBill(this.DutySlipID)  
  .subscribe(
    response => 
    {
      //this.refresh();
      // this.loadDataForDriver();
      // this.loadDataForApp();
      // this.loadDataForGPS();
      // this.loadDataForBilling();
      //this.KMForPreviousBooking();
       this.showNotification(
        'snackbar-success',
        'Updated...!!!',
        'bottom',
        'center'
      );
    },
    error =>
    {
      //this.refresh();
      // this.loadDataForDriver();
      // this.loadDataForApp();
      // this.loadDataForGPS();
      // this.loadDataForBilling();
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      ); 
    }
  )

}

public GenerateBill()
{
  this.clossingScreenService.generateBill(this.DutySlipID)  
  .subscribe(
    response => 
    {
      //this.refresh();
      // this.loadDataForDriver();
      // this.loadDataForApp();
      // this.loadDataForGPS();
      // this.loadDataForBilling();
      // this.KMForPreviousBooking();
       this.showNotification(
        'snackbar-success',
        'Updated...!!!',
        'bottom',
        'center'
      );
    },
    error =>
    {
      //this.refresh();
      // this.loadDataForDriver();
      // this.loadDataForApp();
      // this.loadDataForGPS();
      // this.loadDataForBilling();
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      ); 
    }
  )

}
public ClossingDetails(): boolean
{

  if (!this.advanceTableForm.value.dsClosing) {
    Swal.fire({
      title: '',
      text: 'Please Select DS Closing Option.',
      icon: 'warning',
    });
    return false;
  }
  if (this.advanceTableForm.value.physicalDutySlipReceived === null) {
    Swal.fire({
      title: '',
      text: 'Please Select Duty Slip Received Option.',
      icon: 'warning',
    });
    return false;
  }
  //-------------Location OUT ---------------
 
  if (!this.advanceTableForm.value.locationOutAddressStringForBilling) {
    Swal.fire({
      title: '',
      text: 'Please Select Location Out Address.',
      icon: 'warning',
    });
    return false;
  }
  
//----------Pick UP ----------------------

  if (!this.advanceTableForm.value.pickUpAddressStringForBilling) {
    Swal.fire({
      title: '',
      text: 'Please Select Pick up Address.',
      icon: 'warning',
    });
    return false;
  }

//--------------Drop Off-------------------

  if (!this.advanceTableForm.value.dropOffAddressStringForBilling) {
    Swal.fire({
      title: '',
      text: 'Please Select Drop Off Address.',
      icon: 'warning',
    });
    return false;
  }
 
  //-----------Location In----------------------

  if (!this.advanceTableForm.value.locationInAddressStringForBilling) {
    Swal.fire({
      title: '',
      text: 'Please Select Location In Address.',
      icon: 'warning',
    });
    return false;
  }
  return true;
}

  public Put(): void
  { 
    if (!this.checkChronologyAndValues()) {
      return; // Stop if validation fails
    }
    if(this.advanceTableBilling[0].dsClosing === null)
    {
        if (this.ClossingDetails()) 
          {
          if(this.manualRadio.checked === true || this.appRadio.checked === true || this.gTrackRadio.checked === true || this.billingRadio.checked === true)
      {
        
          if(this.manualRadio.checked === true)
            {
              this.advanceTableForm.patchValue({closureType:'Manual'});
              this.advanceTableForm.patchValue({reservationID:this.ReservationID});
              this.advanceTableForm.patchValue({allotmentID:this.allotmentID});
              this.advanceTableForm.patchValue({closureStatus:'Closed'});
              this.advanceTableForm.patchValue({closureMethod:'Driver'});
              this.advanceTableForm.patchValue({actionTaken:'Save'});
              this.advanceTableForm.patchValue({actionDetails:'Record Saved'});
            }

          else if(this.appRadio.checked === true)
              {
                this.advanceTableForm.patchValue({closureType:'App'});
                this.advanceTableForm.patchValue({reservationID:this.ReservationID});
                this.advanceTableForm.patchValue({allotmentID:this.allotmentID});
                this.advanceTableForm.patchValue({closureStatus:'Closed'});
                this.advanceTableForm.patchValue({closureMethod:'App'});
              }
          
          else if(this.gTrackRadio.checked === true)
                {
                  this.advanceTableForm.patchValue({closureType:'Gtrack'});
                  this.advanceTableForm.patchValue({reservationID:this.ReservationID});
                  this.advanceTableForm.patchValue({allotmentID:this.allotmentID});
                  this.advanceTableForm.patchValue({closureStatus:'Closed'});
                  this.advanceTableForm.patchValue({closureMethod:'GPS'});
                }

          else if(this.billingRadio.checked === true)
                  {
                    this.advanceTableForm.patchValue({closureType:'Billing'});
                    this.advanceTableForm.patchValue({reservationID:this.ReservationID});
                    this.advanceTableForm.patchValue({allotmentID:this.allotmentID});
                    this.advanceTableForm.patchValue({closureStatus:'Closed'});
                    this.advanceTableForm.patchValue({closureMethod:'Billing'});
                  }
          this.clossingScreenService.update(this.advanceTableForm.value)  
          .subscribe(
            response => 
            {
              this.patchVerifyGoodForBilling =true;
             
              this.loadDataForBilling();
              this.showNotification(
                'snackbar-success',
                'Saved...!!!',
                'bottom',
                'center'
              );
              this.advanceTableForm.patchValue({goodForBilling:false});
              this.advanceTableForm.patchValue({verifyDuty:false});
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
          )
        }
        else
        {
          Swal.fire({
          title:
            'Please select a closing type',
          icon: 'warning',
        }).then((result) => {
          if (result.value) {
            
          }
        });
        }

      }
    }
    else
    {
      if (this.ClossingDetails()) 
        {
        if(this.manualRadio.checked === true || this.appRadio.checked === true || this.gTrackRadio.checked === true || this.billingRadio.checked === true)
    {
        if(this.manualRadio.checked === true)
          {
            this.advanceTableForm.patchValue({closureType:'Manual'});
            this.advanceTableForm.patchValue({reservationID:this.ReservationID});
            this.advanceTableForm.patchValue({allotmentID:this.allotmentID});
            this.advanceTableForm.patchValue({closureStatus:'Closed'});
            this.advanceTableForm.patchValue({closureMethod:'Driver'});
            this.advanceTableForm.patchValue({actionTaken:'Update'});
            this.advanceTableForm.patchValue({actionDetails:'Record Updated'});
           
          }

        else if(this.appRadio.checked === true)
            {
              this.advanceTableForm.patchValue({closureType:'App'});
              this.advanceTableForm.patchValue({reservationID:this.ReservationID});
              this.advanceTableForm.patchValue({allotmentID:this.allotmentID});
              this.advanceTableForm.patchValue({closureStatus:'Closed'});
              this.advanceTableForm.patchValue({closureMethod:'App'});
              this.advanceTableForm.patchValue({actionTaken:'Update'});
            this.advanceTableForm.patchValue({actionDetails:'Record Updated'});
            
            }
        
        else if(this.gTrackRadio.checked === true)
              {
                this.advanceTableForm.patchValue({closureType:'Gtrack'});
                this.advanceTableForm.patchValue({reservationID:this.ReservationID});
                this.advanceTableForm.patchValue({allotmentID:this.allotmentID});
                this.advanceTableForm.patchValue({closureStatus:'Closed'});
                this.advanceTableForm.patchValue({closureMethod:'GPS'});
                
              }

        else if(this.billingRadio.checked === true)
                {
                  this.advanceTableForm.patchValue({closureType:'Billing'});
                  this.advanceTableForm.patchValue({reservationID:this.ReservationID});
                  this.advanceTableForm.patchValue({allotmentID:this.allotmentID});
                  this.advanceTableForm.patchValue({closureStatus:'Closed'});
                  this.advanceTableForm.patchValue({closureMethod:'Billing'});
                  
                }
        this.clossingScreenService.update(this.advanceTableForm.value)  
        .subscribe(
          response => 
          {
            this.patchVerifyGoodForBilling = false;  
            
            this.loadDataForBilling();
            this.showNotification(
              'snackbar-success',
              'Updated...!!!',
              'bottom',
              'center'
            );
            if(response)
            {
              this.advanceTableForm.patchValue({goodForBilling : false});
              this.advanceTableForm.patchValue({verifyDuty : false});
            }
            
            
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
        )
      }
      else
      {
        Swal.fire({
        title:
          'Please select a closing type',
        icon: 'warning',
      }).then((result) => {
        if (result.value) {
          
        }
      });
      }

    }
    }
 
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutySlipForBillingID: [''],
      dutySlipID: [''],
      locationOutLocationOrHubID: [''],
      locationInLocationOrHubID: [''],
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

      endToHubKM: [''],
      hubToStartKM: [''],
      startToEndKM:[''],

      locationToPickupTripKm: [''],
      pickupToDropOffTripKm: [''],
      dropOffToLocationInTripKm:[''],

      goodForBilling: [''],
      verifyDuty: [''],
      dsClosing:[''],
      runningDetails:[''],
      vendorRemark:[''],
      physicalDutySlipReceived:[''],
      actionTaken:[''],
      actionDetails:['']
    });
  } 

  dutyInterstateTax()
  {
    const dialogRef = this.dialog.open(DITFormDialogComponent, 
      {
        data: 
        {
          // advanceTable: this.advanceTable,
          // action: 'add',
          reservationID:this.ReservationID,
          dutySlipID:this.DutySlipID
        }
      }); 
      dialogRef.afterClosed().subscribe((res: any) => {
        this.InterStateTaxLoadData();
      })   
  }
  
  public InterStateTaxLoadData()
  {
     this.dutyInterstateTaxService.getTableData(this.dutyInterstateTaxID,this.DutySlipID,this.SearchActivationStatus, this.PageNumber).subscribe
   (
    //  (data :DutyInterstateTax)=>   
    //  {
    //   this.advanceTableDIT = data;
    //  },
    data=>
    {
      if(data!=null)
        {
          this.showHideaddDIT=true;
        }
    },
     (error: HttpErrorResponse) => { this.advanceTableDIT = null;}
   );
  }

  dutyInterstateTaxApproval()
  {
    const dialogRef = this.dialog.open(ApprovalFormDialogComponent, 
      {
        data: 
        {
          // advanceTable: this.advanceTable,
          action: 'edit',
          reservationID:this.ReservationID,
          dutySlipID:this.DutySlipID
        }
      });   
  }

  openDutyTollParkingEntry()
{
  const dialogRef=this.dialog.open(DutyTollParking,
    {
      data:
      {
        dutySlipID:this.DutySlipID,
        action:'add'
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.tollParkingLoadData();
  });
}

// openDutyTollParkingApproval()
// {
//   const dialogRef=this.dialog.open(DutyTollParking,
//     {
//       data:
//       {
//         dutySlipID:this.DutySlipID,
//         action:'edit'
//       }
//     });
// }

openInterstateTax(){
  this.dialog.open(InterstateTaxEntryFormDialogComponent,{
    width:'60%',
    data:{
      action:'add',
      inventoryID:this.InventoryID,
      registrationNumber:this.RegistrationNumber
    }
  })
}

  // public GetLocationOut() 
  // {
  //    this.clossingScreenService.LocationOut(this.DutySlipID).subscribe
  //    (
  //      (data: ClosingDetailShowModel)=>   
  //      {
  //        this.advanceTableCS = data;
  //        this.advanceTableForm.patchValue({locationOutDateForBilling:this.advanceTableCS[0].locationOutDate});
  //        this.advanceTableForm.patchValue({locationOutTimeForBilling:this.advanceTableCS[0].locationOutTime});
  //        this.advanceTableForm.patchValue({locationOutKMForBilling:this.advanceTableCS[0].locationOutKM});
  //        this.advanceTableForm.patchValue({locationOutAddressStringForBilling:this.advanceTableCS[0].locationOutAddressString});

  //        this.advanceTableForm.patchValue({pickUpDateForBilling:this.advanceTableCS[0].pickUpDate});
  //        this.advanceTableForm.patchValue({pickUpTimeForBilling:this.advanceTableCS[0].pickUpTime});
  //        this.advanceTableForm.patchValue({pickUpKMForBilling:this.advanceTableCS[0].pickUpKM});
  //        this.advanceTableForm.patchValue({pickUpAddressStringForBilling:this.advanceTableCS[0].pickUpAddressString});

  //        this.advanceTableForm.patchValue({dropOffDateForBilling:this.advanceTableCS[0].dropOffDate});
  //        this.advanceTableForm.patchValue({dropOffTimeForBilling:this.advanceTableCS[0].dropOffTime});
  //        this.advanceTableForm.patchValue({dropOffKMForBilling:this.advanceTableCS[0].dropOffKM});
  //        this.advanceTableForm.patchValue({dropOffAddressStringForBilling:this.advanceTableCS[0].dropOffAddressString});

  //        this.advanceTableForm.patchValue({locationInDateForBilling:this.advanceTableCS[0].locationInDate});
  //        this.advanceTableForm.patchValue({locationInTimeForBilling:this.advanceTableCS[0].locationInTime});
  //        this.advanceTableForm.patchValue({locationInKMForBilling:this.advanceTableCS[0].locationInKM});
  //        this.advanceTableForm.patchValue({locationInAddressStringForBilling:this.advanceTableCS[0].locationInAddressString});

  //       //  this.advanceTableForm.patchValue({locationOutEntryMethodForBilling:this.advanceTableCS[0].locationOutEntryMethod});
  //       //  this.advanceTableForm.patchValue({pickupEntryMethodForBilling:this.advanceTableCS[0].pickupEntryMethod});
  //       //  this.advanceTableForm.patchValue({dropOffEntryMethodForBilling:this.advanceTableCS[0].dropOffEntryMethod});
  //       //  this.advanceTableForm.patchValue({locationInEntryMethodForBilling:this.advanceTableCS[0].locationInEntryMethod});

  //       this.onKeyUp()    
  //      },
  //      (error: HttpErrorResponse) => { this.advanceTable = null;}
  //    );
  // }

  public loadDataLocationOutOrHubID() 
  {
     this.clossingScreenService.LocationOutOrHubID(this.DutySlipID).subscribe
     (
       (data)=>   
       {
         this.locationOrHubID=data;
         if(this.locationOrHubID===null)
          {
         this.advanceTableForm.patchValue({locationOutLocationOrHubID: 0});
         this.advanceTableForm.patchValue({locationInLocationOrHubID:0});
         }
         else{
          this.advanceTableForm.patchValue({locationOutLocationOrHubID:this.locationOrHubID });
          this.advanceTableForm.patchValue({locationInLocationOrHubID:this.locationOrHubID});
         }
      
       },
       (error: HttpErrorResponse) => { this.advanceTableCI = null;}
     );
 }

  public loadDataForCustomer() 
  {
     this.clossingScreenService.getTableDataForCustomer(this.CustomerID).subscribe
     (
       (data: CustomerInfo)=>   
       {
         this.advanceTableCI = data;        
       },
       (error: HttpErrorResponse) => { this.advanceTableCI = null;}
     );
 }

 public loadDataForReservation() 
  {
    this.clossingScreenService.getTableDataForReservation(this.ReservationID).subscribe((res: any) => {
      if(res && res?.length > 0) {
        this.reservationCloseDetail = res[0];
      }
    }, (error: HttpErrorResponse) => {
    });
 }

 public loadDataKmForApp() 
 {
    this.clossingScreenService.getKmForApp(this.DutySlipID).subscribe
    (
      data =>   
      {
        this.advanceTableKMForApp = data;
        this.advanceTableForm.patchValue({locationToPickupTripKm:this.advanceTableKMForApp.locationToPickupTripKm});
        this.advanceTableForm.patchValue({pickupToDropOffTripKm:this.advanceTableKMForApp.pickupToDropOffTripKm});
        this.advanceTableForm.patchValue({dropOffToLocationInTripKm:this.advanceTableKMForApp.dropOffToLocationInTripKm});
        if(this.appRadio.checked)
        {
          this.onlocationToPickupTripKmChange();
          this.onpickupToDropOffTripKmChange();
          this.ondropOffToLocationInTripKmChange();
          //this.onKeyUp();      
        }
        this.addtionOfAppKM();
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
}

public loadDataKmForDriver() 
 {
    this.clossingScreenService.getKmForDriver(this.DutySlipID).subscribe
    (
      data =>   
      {
        this.advanceTableKmForDriver = data;
        this.advanceTableForm.patchValue({hubToStartKM:this.advanceTableKmForDriver.hubToStartKM});
        this.advanceTableForm.patchValue({startToEndKM:this.advanceTableKmForDriver.startToEndKM});
        this.advanceTableForm.patchValue({endToHubKM:this.advanceTableKmForDriver.endToHubKM});
        this.advanceTableForm.patchValue({locationOutKMForDriver:this.advanceTableKmForDriver.locationOutKMByDriver});
        this.advanceTableForm.patchValue({pickUpKMForDriver:this.advanceTableKmForDriver.pickUpKMByDriver});
        this.advanceTableForm.patchValue({dropOffKMForDriver:this.advanceTableKmForDriver.dropOffKMByDriver});
        this.advanceTableForm.patchValue({locationInKMForDriver:this.advanceTableKmForDriver.locationInKMByDriver});
        //this.onKeyUp();
        this.addtionOfManulKM();
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
}

public loadDataForAppTab() 
{
   this.clossingScreenService.getTableDataForApp(this.DutySlipID).subscribe
   (
     (data: CurrentDuty)=>   
     {
       this.advanceTableAppTab = data;    
     },
     (error: HttpErrorResponse) => { this.advanceTable = null;}
   );
}

public loadDataForDriverTab() 
{  
   this.clossingScreenService.getTableDataForDriver(this.DutySlipID).subscribe
   (
     (data: CurrentDuty)=>   
     {
       this.advanceTableDriverTab = data;     
     },
     (error: HttpErrorResponse) => { this.advanceTable = null;}
   );
}

public loadDataForGPSTab() 
{
   this.clossingScreenService.getTableDataForGPS(this.DutySlipID).subscribe
   (
     (data: CurrentDuty)=>   
     {
       this.advanceTableGPSTab = data;
     },
     (error: HttpErrorResponse) => { this.advanceTable = null;}
   );
}

public loadDataForCurrentDuty() 
{
   this.clossingScreenService.getCurrentDuty(this.DutySlipID).subscribe
   (
     data=>   
     {
       this.dataSourceCurrentDuty = data;    
     },
     (error: HttpErrorResponse) => { this.advanceTable = null;}
   );
}

public loadDataForBillingTab() 
{
   this.clossingScreenService.getTableDataForBilling(this.DutySlipID).subscribe
   (
     (data: CurrentDuty)=>   
     {
       this.advanceTableBillingTab = data; 
     },
     (error: HttpErrorResponse) => { this.advanceTable = null;}
   );
}

public loadDataForBilling()
{
   this.clossingScreenService.getTableDataForBilling(this.DutySlipID).subscribe
   (
     data=>  
     {
       this.advanceTableBilling = data;
       if(this.advanceTableBilling[0].closureType === "Manual")
        {
          this.manualRadio.checked = true;
        }
        if(this.advanceTableBilling[0].closureType === "App")
        {
          this.appRadio.checked = true;
        }
        if(this.advanceTableBilling[0].closureType === "Gtrack")
        {
          this.gTrackRadio.checked = true;
        }
       if(this.advanceTableBilling[0].locationOutLatLongForBilling)
        {
       var value = this.advanceTableBilling[0].locationOutLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      this.locationOutLatForBilling=lat;
      this.locationOutLongForBilling=long;
    }
   
    if(this.advanceTableBilling[0].pickUpLatLongForBilling)
      {
      var value = this.advanceTableBilling[0].pickUpLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      this.pickUpLatForBilling=lat1;
      this.pickUpLongForBilling=long1;
      }
   
    if(this.advanceTableBilling[0].reportingToGuestLatLongForBilling)
      {
      var value = this.advanceTableBilling[0].reportingToGuestLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat2 = value.split(' ')[2];
      var long2 = value.split(' ')[1];
   
      this.reportingToGuestLatForBilling=lat2;
      this.reportingToGuestLongForBilling=long2;
      }
   
      if(this.advanceTableBilling[0].dropOffLatLongForBilling)
        {
      var value = this.advanceTableBilling[0].dropOffLatLongForBilling.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      this.dropOffLatForBilling=lat3;
      this.dropOffLongForBilling=long3;
    }
    
      if(this.advanceTableBilling[0].locationOutDateForBilling !==null)
      {
        this.advanceTableForm.patchValue({locationOutDateForBilling:this.advanceTableBilling[0].locationOutDateForBilling});
        this.advanceTableForm.patchValue({locationOutTimeForBilling:this.advanceTableBilling[0].locationOutTimeForBilling});
        this.advanceTableForm.patchValue({locationOutKMForBilling:this.advanceTableBilling[0].locationOutKMForBilling});
        if(this.locationOutLatForBilling)
        {
          this.advanceTableForm.patchValue({locationOutLatLongForBilling:this.locationOutLatForBilling + ',' + this.locationOutLongForBilling });
        }
        else{
          this.advanceTableForm.patchValue({locationOutLatLongForBilling:null });
        }     
        this.advanceTableForm.patchValue({locationOutAddressStringForBilling:this.advanceTableBilling[0].locationOutAddressStringForBilling});
      }

      if(this.advanceTableBilling[0].pickUpDateForBilling !==null)
      {
        this.advanceTableForm.patchValue({pickUpDateForBilling:this.advanceTableBilling[0].pickUpDateForBilling});
        this.advanceTableForm.patchValue({pickUpTimeForBilling:this.advanceTableBilling[0].pickUpTimeForBilling});
        this.advanceTableForm.patchValue({pickUpKMForBilling:this.advanceTableBilling[0].pickUpKMForBilling});
        if(this.pickUpLatForBilling)
        {
          this.advanceTableForm.patchValue({pickUpLatLongForBilling:this.pickUpLatForBilling + ',' + this.pickUpLongForBilling });
        }
        else{
          this.advanceTableForm.patchValue({pickUpLatLongForBilling:null});
        }        
        this.advanceTableForm.patchValue({pickUpAddressStringForBilling:this.advanceTableBilling[0].pickUpAddressStringForBilling});
      }

      if(this.advanceTableBilling[0].dropOffDateForBilling !==null)
      {
        //this.minDateForDropOff = new Date(this.advanceTableForm.value.pickUpDateForBilling); 
        this.advanceTableForm.patchValue({dropOffDateForBilling:this.advanceTableBilling[0].dropOffDateForBilling});
        this.advanceTableForm.patchValue({dropOffTimeForBilling:this.advanceTableBilling[0].dropOffTimeForBilling});
        this.advanceTableForm.patchValue({dropOffKMForBilling:this.advanceTableBilling[0].dropOffKMForBilling});
        if(this.dropOffLatForBilling)
        {
          this.advanceTableForm.patchValue({dropOffLatLongForBilling:this.dropOffLatForBilling + ',' + this.dropOffLongForBilling });
        }
        else{
          this.advanceTableForm.patchValue({dropOffLatLongForBilling:null });
        }     
        this.advanceTableForm.patchValue({dropOffAddressStringForBilling:this.advanceTableBilling[0].dropOffAddressStringForBilling});
      }

      if(this.advanceTableBilling[0].reportingToGuestDateForBilling !==null)
      {
        this.advanceTableForm.patchValue({reportingToGuestDateForBilling:this.advanceTableBilling[0].reportingToGuestDateForBilling});
        this.advanceTableForm.patchValue({reportingToGuestTimeForBilling:this.advanceTableBilling[0].reportingToGuestTimeForBilling});
        this.advanceTableForm.patchValue({reportingToGuestKMForBilling:this.advanceTableBilling[0].reportingToGuestKMForBilling});
        if(this.reportingToGuestLatForBilling)
        {
          this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:this.reportingToGuestLatForBilling + ',' + this.reportingToGuestLongForBilling });
        }
        else{
          this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null});
        }
        
        this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling:this.advanceTableBilling[0].reportingToGuestAddressStringForBilling});
      }

      if(this.advanceTableBilling[0].locationInDateForBilling !==null)
      {
        // this.minDateForLI = new Date(this.advanceTableForm.value.dropOffDateForBilling);
        // this.minTimeForLI = new Date(this.advanceTableForm.value.dropOffTimeForBilling);
        this.advanceTableForm.patchValue({locationInDateForBilling:this.advanceTableBilling[0].locationInDateForBilling});
        this.advanceTableForm.patchValue({locationInTimeForBilling:this.advanceTableBilling[0].locationInTimeForBilling});
        this.advanceTableForm.patchValue({locationInKMForBilling:this.advanceTableBilling[0].locationInKMForBilling});
        this.advanceTableForm.patchValue({locationInLatLongForBilling:this.locationOutLatForBilling + ',' + this.locationOutLongForBilling });
        this.advanceTableForm.patchValue({locationInAddressStringForBilling:this.advanceTableBilling[0].locationOutAddressStringForBilling});
      }
      // this.advanceTableForm.patchValue({goodForBilling:this.advanceTableBilling[0].goodForBilling});
      // this.advanceTableForm.patchValue({verifyDuty:this.advanceTableBilling[0].verifyDuty});
      

      this.advanceTableForm.patchValue({dsClosing:this.advanceTableBilling[0].dsClosing});
      this.advanceTableForm.patchValue({runningDetails:this.advanceTableBilling[0].runningDetails});
      this.advanceTableForm.patchValue({vendorRemark:this.advanceTableBilling[0].vendorRemark});
      this.advanceTableForm.patchValue({physicalDutySlipReceived:this.advanceTableBilling[0].physicalDutySlipReceived});
      this.loadDataLocationOutOrHubID();
   
      var locOut=this.advanceTableForm.get("locationOutKMForBilling").value;
      var pickup=this.advanceTableForm.get("pickUpKMForBilling").value;
      var dropOff=this.advanceTableForm.get("dropOffKMForBilling").value;
   
      this.advanceTableForm.patchValue({locationOutKMForBillingApp:locOut});
      this.advanceTableForm.patchValue({pickUpKMForBillingApp:pickup});
      this.advanceTableForm.patchValue({dropOffKMForBillingApp:dropOff});
      //this.CustomerSignatureByDriver=this.advanceTableApp[0].customerSignatureImage;
      //this.radioText=this.advanceTableBilling[0].closureType;

      if(this.advanceTableBilling[0].pickUpDateForBilling && this.advanceTableBilling[0].dropOffDateForBilling)
        {
          this.ondropOffBillingKMChange();
        }
      else
      {
        this.outputForDropOffPickupBilling = '0 HRS';
        this.distanceDiffForDropOffPickupBilling = '0 KM';
      }

      if(this.advanceTableBilling[0].locationOutDateForBilling && this.advanceTableBilling[0].pickUpDateForBilling)
        {
          this.onpickupBillingKMChange();
        }
      else
      {
        this.outputForPickupLocationOutBilling = '0 HRS';
        this.distanceDiffForPickupLocationOutBilling = '0 KM'; 
      }

      if(this.advanceTableBilling[0].dropOffDateForBilling && this.advanceTableBilling[0].locationInDateForBilling)
        {
          this.onLocationInBillingKMChange();
        }
      else
      {
        this.outputForlocationInDropOffBilling = '0 HRS';
        this.distanceDiffForlocationInDropOffBilling = '0 KM'; 
      } 
      this.calculateTimeAndDistanceForBilling(); 
      this.completeTimeAndDistance();
      if(this.advanceTableForm.value.dsClosing === null)
      {
        this.advanceTableForm.controls["goodForBilling"].disable();
        this.advanceTableForm.controls["verifyDuty"].disable();
      }
      else{
        this.advanceTableForm.controls["goodForBilling"].enable();
        this.advanceTableForm.controls["verifyDuty"].enable();
      }
      if(this.patchVerifyGoodForBilling)
      {
        this.advanceTableForm.patchValue({verifyDuty:this.advanceTableBilling[0].verifyDuty});
        this.advanceTableForm.patchValue({goodForBilling:this.advanceTableBilling[0].goodForBilling});
        //this.advanceTableForm.controls["goodForBilling"].disable();
        
      }
      if(this.manualRadio.checked === true)
      {
        this.addtionOfManulKM();
      }
      else if(this.appRadio.checked === true)
      {
        this.addtionOfAppKM();
      }
      this.onKeyUp();
      
     },
     (error: HttpErrorResponse) => { this.advanceTableBilling = null;}
   );
}

public loadDataForApp()
{
   this.clossingScreenService.getTableDataForApp(this.DutySlipID).subscribe
   (
     data=>  
     {
       this.advanceTableApp = data;
       if(this.advanceTableApp[0].locationOutLatLongByApp)
        {
       var value = this.advanceTableApp[0].locationOutLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      this.locationOutLatByApp=lat;
      this.locationOutLongByApp=long;
    }
   
    if(this.advanceTableApp[0].pickUpLatLongByApp)
      {
      var value = this.advanceTableApp[0].pickUpLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      this.pickUpLatByApp=lat1;
      this.pickUpLongByApp=long1;
      }
   
    if(this.advanceTableApp[0].reportingToGuestLatLongByApp)
      {
      var value = this.advanceTableApp[0].reportingToGuestLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat2 = value.split(' ')[2];
      var long2 = value.split(' ')[1];
   
      this.reportingToGuestLatByApp=lat2;
      this.reportingToGuestLongByApp=long2;
      }
   
      if(this.advanceTableApp[0].dropOffLatLongByApp)
        {
      var value = this.advanceTableApp[0].dropOffLatLongByApp.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      this.dropOffLatByApp=lat3;
      this.dropOffLongByApp=long3;
    }
   
      if(this.advanceTableApp[0].locationInLatLongByApp)
      {
        var value = this.advanceTableApp[0].locationInLatLongByApp.replace(
          '(',
          ''
        );
        value = value.replace(')', '');
        var lat4 = value.split(' ')[2];
        var long4 = value.split(' ')[1];
   
        this.locationInLatByApp=lat4;
        this.locationInLongByApp=long4;
      }
     if(this.advanceTableApp[0].locationOutDateByApp !== null)
     {
      this.advanceTableForm.patchValue({locationOutDateForBilling:this.advanceTableApp[0].locationOutDateByApp});
      this.advanceTableForm.patchValue({locationOutTimeForBilling:this.advanceTableApp[0].locationOutTimeByApp});
      this.advanceTableForm.patchValue({locationOutKMForBilling:this.advanceTableApp[0].locationOutKMByApp});
      if(this.advanceTableApp[0].locationOutLatLongByApp)
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:this.locationOutLatByApp + ',' + this.locationOutLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({locationOutLatLongForBilling:null });
      }     
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling:this.advanceTableApp[0].locationOutAddressStringByApp});
    }

    if(this.advanceTableApp[0].pickUpDateByApp !== null)
    {
      this.advanceTableForm.patchValue({pickUpDateForBilling:this.advanceTableApp[0].pickUpDateByApp});
      this.advanceTableForm.patchValue({pickUpTimeForBilling:this.advanceTableApp[0].pickUpTimeByApp});
      this.advanceTableForm.patchValue({pickUpKMForBilling:this.advanceTableApp[0].pickUpKMByApp});
      if(this.advanceTableApp[0].pickUpLatLongByApp)
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:this.pickUpLatByApp + ',' + this.pickUpLongByApp});
      }
      else
      {
        this.advanceTableForm.patchValue({pickUpLatLongForBilling:null});
      }
      this.advanceTableForm.patchValue({pickUpAddressStringForApp:this.advanceTableApp[0].pickUpAddressStringByApp});
    }

    if(this.advanceTableApp[0].dropOffDateByApp !== null)
    {
      this.advanceTableForm.patchValue({dropOffDateForBilling:this.advanceTableApp[0].dropOffDateByApp});
      this.advanceTableForm.patchValue({dropOffTimeForBilling:this.advanceTableApp[0].dropOffTimeByApp});
      this.advanceTableForm.patchValue({dropOffKMForBilling:this.advanceTableApp[0].dropOffKMByApp});
      if(this.advanceTableApp[0].dropOffLatLongByApp)
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:this.dropOffLatByApp + ',' + this.dropOffLongByApp });
      }
      else
      {
        this.advanceTableForm.patchValue({dropOffLatLongForBilling:null });
      }
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling:this.advanceTableApp[0].dropOffAddressStringByApp});
    }

    if(this.advanceTableApp[0].reportingToGuestDateByApp !== null)
    {
      this.advanceTableForm.patchValue({reportingToGuestDateForBilling:this.advanceTableApp[0].reportingToGuestDateByApp});
      this.advanceTableForm.patchValue({reportingToGuestTimeForBilling:this.advanceTableApp[0].reportingToGuestTimeByApp});
      this.advanceTableForm.patchValue({reportingToGuestKMForBilling:this.advanceTableApp[0].reportingToGuestKMByApp});
      if(this.advanceTableApp[0].reportingToGuestLatLongByApp)
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:this.reportingToGuestLatByApp + ',' + this.reportingToGuestLongByApp });
      }
      else
      {
        this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null });
      }
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling:this.advanceTableApp[0].reportingToGuestAddressStringByApp});
    }

    if(this.advanceTableApp[0].locationInDateByApp !== null)
    {
      this.advanceTableForm.patchValue({locationInDateForBilling:this.advanceTableApp[0].locationInDateByApp});
      this.advanceTableForm.patchValue({locationInTimeForBilling:this.advanceTableApp[0].locationInTimeByApp});
      this.advanceTableForm.patchValue({locationInKMForBilling:this.advanceTableApp[0].locationInKMByApp});
      if(this.advanceTableApp[0].locationInLatLongByApp)
      {
        this.advanceTableForm.patchValue({locationInLatLongForBilling:this.locationInLatByApp + ',' + this.locationInLongByApp });
      }
      else
      {
        this.advanceTableForm.patchValue({locationInLatLongForBilling:null});
      }
      this.advanceTableForm.patchValue({locationInAddressStringForBilling:this.advanceTableApp[0].locationInAddressStringByApp});
    }
      this.loadDataLocationOutOrHubID();
   
      var locOut=this.advanceTableForm.get("locationOutKMForBilling").value;
      var pickup=this.advanceTableForm.get("pickUpKMForBilling").value;
      var dropOff=this.advanceTableForm.get("dropOffKMForBilling").value;
   
      this.advanceTableForm.patchValue({locationOutKMForBillingApp:locOut});
      this.advanceTableForm.patchValue({pickUpKMForBillingApp:pickup});
      this.advanceTableForm.patchValue({dropOffKMForBillingApp:dropOff});
      this.CustomerSignatureByDriver=this.advanceTableApp[0].customerSignatureImage;

      if(this.advanceTableApp[0].pickUpDateByApp && this.advanceTableApp[0].dropOffDateByApp)
        {
          this.ondropOffAppKMChange();
        }
      else
      {
        this.outputForDropOffPickupApp = '0 HRS';
        this.distanceDiffForDropOffPickupApp = '0 KM';
      }

      if(this.advanceTableApp[0].locationOutDateByApp && this.advanceTableApp[0].pickUpDateByApp)
        {
          this.onpickupAppKMChange();
        }
      else
      {
        this.outputForPickupLocationOutApp = '0 HRS';
        this.distanceDifferenceForPickupLocationOutApp = '0 KM';
      }

      if(this.advanceTableApp[0].dropOffDateByApp && this.advanceTableApp[0].locationInDateByApp)
        {
          this.onLocationInAppKMChange();
        }
      else
      {
        this.outputForlocationInDropOffApp = '0 HRS';
        this.distanceDiffForlocationInDropOffApp = '0 KM';
      }

      this.calculateTimeAndDistanceForApp();
      this.completeTimeAndDistance();
      this.onTimeSelection();
      this.addtionOfAppKM();
      this.onKeyUp();
     },
     (error: HttpErrorResponse) => { this.advanceTableApp = null;}
   );
}
 
public loadDataForDriver()
{
   this.clossingScreenService.getTableDataForDriver(this.DutySlipID).subscribe
   (
     data=>  
     {
       this.advanceTable = data;
       if(this.advanceTable[0].locationOutDateByDriver === null)
        {
          this.KMForPreviousBooking();
          this.onKeyUp();
        }
    
    else
    {
      if(this.advanceTable[0].locationOutLatLongByDriver)
        {
       var value = this.advanceTable[0].locationOutLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      this.locationOutLatByDriver=lat;
      this.locationOutLongByDriver=long;
    }
    if(this.advanceTable[0].pickUpLatLongByDriver){

      var value = this.advanceTable[0].pickUpLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      this.pickUpLatByDriver=lat1;
      this.pickUpLongByDriver=long1;
    }
    if(this.advanceTable[0].reportingToGuestLatLongByDriver)
      {

      var value = this.advanceTable[0].reportingToGuestLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat2 = value.split(' ')[2];
      var long2 = value.split(' ')[1];
   
      this.reportingToGuestLatByDriver=lat2;
      this.reportingToGuestLongByDriver=long2;
   
    }

    if(this.advanceTable[0].dropOffLatLongByDriver)
      {

      var value = this.advanceTable[0].dropOffLatLongByDriver.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      this.dropOffLatByDriver=lat3;
      this.dropOffLongByDriver=long3;
    }
    
      this.advanceTableForm.patchValue({locationOutDateForBilling:this.advanceTable[0].locationOutDateByDriver});
      this.advanceTableForm.patchValue({locationOutTimeForBilling:this.advanceTable[0].locationOutTimeByDriver});
      this.advanceTableForm.patchValue({locationOutKMForBilling:this.advanceTable[0].locationOutKMByDriver});
      this.advanceTableForm.patchValue({locationOutLatLongForBilling:this.locationOutLatByDriver + ',' + this.locationOutLongByDriver });
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling:this.advanceTable[0].locationOutAddressStringByDriver});
   
      this.advanceTableForm.patchValue({pickUpDateForBilling:this.advanceTable[0].pickUpDateByDriver});
      this.advanceTableForm.patchValue({pickUpTimeForBilling:this.advanceTable[0].pickUpTimeByDriver});
      this.advanceTableForm.patchValue({pickUpKMForBilling:this.advanceTable[0].pickUpKMByDriver});
      this.advanceTableForm.patchValue({pickUpLatLongForBilling:this.pickUpLatByDriver + ',' + this.pickUpLongByDriver });
      this.advanceTableForm.patchValue({pickUpAddressStringForBilling:this.advanceTable[0].pickUpAddressStringByDriver});
   
      this.advanceTableForm.patchValue({dropOffDateForBilling:this.advanceTable[0].dropOffDateByDriver});
      this.advanceTableForm.patchValue({dropOffTimeForBilling:this.advanceTable[0].dropOffTimeByDriver});
      this.advanceTableForm.patchValue({dropOffKMForBilling:this.advanceTable[0].dropOffKMByDriver});
      this.advanceTableForm.patchValue({dropOffLatLongForBilling:this.dropOffLatByDriver + ',' + this.dropOffLongByDriver });
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling:this.advanceTable[0].dropOffAddressStringByDriver});
   
      this.advanceTableForm.patchValue({reportingToGuestDateForBilling:this.advanceTable[0].reportingToGuestDateByDriver});
      this.advanceTableForm.patchValue({reportingToGuestTimeForBilling:this.advanceTable[0].reportingToGuestTimeByDriver});
      this.advanceTableForm.patchValue({reportingToGuestKMForBilling:this.advanceTable[0].reportingToGuestKMByDriver});
      this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:this.reportingToGuestLatByDriver + ',' + this.reportingToGuestLongByDriver });
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling:this.advanceTable[0].reportingToGuestAddressStringByDriver});
   
      this.advanceTableForm.patchValue({locationInDateForBilling:this.advanceTable[0].locationInDateByDriver});
      this.advanceTableForm.patchValue({locationInTimeForBilling:this.advanceTable[0].locationInTimeByDriver});
      this.advanceTableForm.patchValue({locationInKMForBilling:this.advanceTable[0].locationInKMByDriver});
      this.advanceTableForm.patchValue({locationInLatLongForBilling:this.locationOutLatByDriver + ',' + this.locationOutLongByDriver });
      this.advanceTableForm.patchValue({locationInAddressStringForBilling:this.advanceTable[0].locationOutAddressStringByDriver});

      this.loadDataLocationOutOrHubID();
   
      var locOut=this.advanceTableForm.get("locationOutKMForBilling").value;
      var pickup=this.advanceTableForm.get("pickUpKMForBilling").value;
      var dropOff=this.advanceTableForm.get("dropOffKMForBilling").value;
   
      this.CustomerSignatureByDriver=this.advanceTable[0].customerSignatureImage;
   
      this.advanceTableForm.patchValue({locationOutKMForBillingManual:locOut});
      this.advanceTableForm.patchValue({pickUpKMForBillingManual:pickup});
      this.advanceTableForm.patchValue({dropOffKMForBillingManual:dropOff});

      if(this.advanceTable[0].locationOutDateByDriver && this.advanceTable[0].pickUpDateByDriver)
        {
          this.onpickupDriverKMChange();
        }
      else
      {
        this.outputForPickupLocationOut = '0 HRS';
        this.distanceDiffForPickupLocationOut = '0 KM';
      }

      if(this.advanceTable[0].pickUpDateByDriver && this.advanceTable[0].dropOffDateByDriver)
        {
          this.ondropOffDriverKMChange();
        }
      else
      {
        this.outputForDropOffPickup = '0 HRS';
        this.distanceDiffForDropOffPickup = '0 KM';
      }

      if(this.advanceTable[0].dropOffDateByDriver && this.advanceTable[0].locationInDateByDriver)
        {
          this.onLocationInDriverKMChange();
        }
      else
      {
        this.outputForlocationInDropOff = '0 HRS';
        this.distanceDiffForlocationInDropOff = '0 Km';
      }

    }
      
      this.calculateTimeAndDistanceForManual();
      this.completeTimeAndDistance();
      this.onTimeSelection();
      this.onKeyUp();
       
     },
     (error: HttpErrorResponse) => { this.advanceTable = null;}
   );
}

public loadDataForGPS()
{
   this.clossingScreenService.getTableDataForGPS(this.DutySlipID).subscribe
   (
     (data: CurrentDuty)=>  
     {
       this.advanceTableGPS = data;
       if(this.advanceTableGPS[0].locationOutLatLongByGPS)
        {
       var value = this.advanceTableGPS[0].locationOutLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat = value.split(' ')[2];
      var long = value.split(' ')[1];
   
      this.locationOutLatByGPS=lat;
      this.locationOutLongByGPS=long;
    }
    if(this.advanceTableGPS[0].pickUpLatLongByGPS)
      {
      var value = this.advanceTableGPS[0].pickUpLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat1 = value.split(' ')[2];
      var long1 = value.split(' ')[1];
   
      this.pickUpLatByGPS=lat1;
      this.pickUpLongByGPS=long1;
      }

      if(this.advanceTableGPS[0].reportingToGuestLatLongByGPS)
        {
            var value = this.advanceTableGPS[0].reportingToGuestLatLongByGPS.replace(
              '(',
              ''
            );
            value = value.replace(')', '');
            var lat2 = value.split(' ')[2];
            var long2 = value.split(' ')[1];
        
            this.reportingToGuestLatByGPS=lat2;
            this.reportingToGuestLongByGPS=long2;
          }
   
      if(this.advanceTableGPS[0].dropOffLatLongByGPS)
        {
      var value = this.advanceTableGPS[0].dropOffLatLongByGPS.replace(
        '(',
        ''
      );
      value = value.replace(')', '');
      var lat3 = value.split(' ')[2];
      var long3 = value.split(' ')[1];
   
      this.dropOffLatByGPS=lat3;
      this.dropOffLongByGPS=long3;
    }
    if(this.advanceTableGPS[0].locationOutDateByGPS !==null)
    {
      this.advanceTableForm.patchValue({locationOutDateForBilling:this.advanceTableGPS[0].locationOutDateByGPS});
      this.advanceTableForm.patchValue({locationOutTimeForBilling:this.advanceTableGPS[0].locationOutTimeByGPS});
      this.advanceTableForm.patchValue({locationOutKMForBilling:this.advanceTableGPS[0].locationOutKMByGPS});
      this.advanceTableForm.patchValue({locationOutLatLongForBilling:this.locationOutLatByGPS + ',' + this.locationOutLongByGPS });
      this.advanceTableForm.patchValue({locationOutAddressStringForBilling:this.advanceTableGPS[0].locationOutAddressStringByGPS});
    }

    if(this.advanceTableGPS[0].pickUpDateByGPS !==null)
    {
      this.advanceTableForm.patchValue({pickUpDateForBilling:this.advanceTableGPS[0].pickUpDateByGPS});
      this.advanceTableForm.patchValue({pickUpTimeForBilling:this.advanceTableGPS[0].pickUpTimeByGPS});
      this.advanceTableForm.patchValue({pickUpKMForBilling:this.advanceTableGPS[0].pickUpKMByGPS});
      this.advanceTableForm.patchValue({pickUpLatLongForBilling:this.pickUpLatByGPS + ',' + this.pickUpLongByGPS });
      this.advanceTableForm.patchValue({pickUpAddressStringForBilling:this.advanceTableGPS[0].pickUpAddressStringByGPS});
    }

    if(this.advanceTableGPS[0].dropOffDateByGPS !==null)
    {
      this.advanceTableForm.patchValue({dropOffDateForBilling:this.advanceTableGPS[0].dropOffDateByGPS});
      this.advanceTableForm.patchValue({dropOffTimeForBilling:this.advanceTableGPS[0].dropOffTimeByGPS});
      this.advanceTableForm.patchValue({dropOffKMForBilling:this.advanceTableGPS[0].dropOffKMByGPS});
      this.advanceTableForm.patchValue({dropOffLatLongForBilling:this.dropOffLatByGPS + ',' + this.dropOffLongByGPS });
      this.advanceTableForm.patchValue({dropOffAddressStringForBilling:this.advanceTableGPS[0].dropOffAddressStringByGPS});
    }

    if(this.advanceTableGPS[0].reportingToGuestDateByGPS !==null)
    {
      this.advanceTableForm.patchValue({reportingToGuestDateForBilling:this.advanceTableGPS[0].reportingToGuestDateByGPS});
      this.advanceTableForm.patchValue({reportingToGuestTimeForBilling:this.advanceTableGPS[0].reportingToGuestTimeByGPS});
      this.advanceTableForm.patchValue({reportingToGuestKMForBilling:this.advanceTableGPS[0].reportingToGuestKMByGPS});
      this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:this.reportingToGuestLatByGPS + ',' + this.reportingToGuestLongByGPS });
      this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling:this.advanceTableGPS[0].reportingToGuestAddressStringByGPS});
    }

    if(this.advanceTableGPS[0].locationInDateByGPS !==null)
    {
      this.advanceTableForm.patchValue({locationInDateForBilling:this.advanceTableGPS[0].locationInDateByGPS});
      this.advanceTableForm.patchValue({locationInTimeForBilling:this.advanceTableGPS[0].locationInTimeByGPS});
      this.advanceTableForm.patchValue({locationInKMForBilling:this.advanceTableGPS[0].locationInKMByGPS});
      this.advanceTableForm.patchValue({locationInLatLongForBilling:this.locationOutLatByGPS + ',' + this.locationOutLongByGPS });
      this.advanceTableForm.patchValue({locationInAddressStringForBilling:this.advanceTableGPS[0].locationOutAddressStringByGPS});
    }
      this.loadDataLocationOutOrHubID();
   
      var locOut=this.advanceTableForm.get("locationOutKMForBilling").value;
      var pickup=this.advanceTableForm.get("pickUpKMForBilling").value;
      var dropOff=this.advanceTableForm.get("dropOffKMForBilling").value;
   
      this.CustomerSignatureByDriver=this.advanceTableGPS[0].customerSignatureImage;
   
      this.advanceTableForm.patchValue({locationOutKMForBillingManual:locOut});
      this.advanceTableForm.patchValue({pickUpKMForBillingManual:pickup});
      this.advanceTableForm.patchValue({dropOffKMForBillingManual:dropOff});

      if(this.advanceTableGPS[0].locationOutDateByGPS && this.advanceTableGPS[0].pickUpDateByGPS)
        {
          this.onpickupGPSKMChange();
        }
      else
      {
        this.distanceDiffForPickupLocationOutGPS = '0 KM';
        this.outputForPickupLocationOutGPS = '0 HRS';
      }

      if(this.advanceTableGPS[0].dropOffDateByGPS && this.advanceTableGPS[0].pickUpDateByGPS)
        {
          this.ondropOffGPSKMChange();
        }
      else
      {
        this.distanceDiffForDropOffPickupGPS = '0 KM';
        this.outputForDropOffPickupGPS = '0 HRS';
      }

      if(this.advanceTableGPS[0].dropOffDateByGPS && this.advanceTableGPS[0].locationInDateByGPS)
        {
          this.onLocationInGPSKMChange();
        }
      else
        {
          this.distanceDiffForlocationInDropOffGPS = '0 KM';
          this.outputForlocationInDropOffGPS = '0 HRS';
        }
      
      this.calculateTimeAndDistanceForGtrack();
      this.completeTimeAndDistance();
     },
     (error: HttpErrorResponse) => { this.advanceTable = null;}
   );
}

onManualKMClick()
{
  //this.advanceTableForm.reset();
  this.loadDataForDriver();
  
  // this.advanceTableForm.patchValue({closureStatus:'Closed'});
  // this.advanceTableForm.patchValue({closureMethod:'Driver'});
 
  // this.advanceTableForm.controls["locationOutKMForBilling"].disable();
  // this.advanceTableForm.controls["pickUpKMForBilling"].disable();
  // this.advanceTableForm.controls["dropOffKMForBilling"].disable();

  // this.advanceTableForm.controls["locationOutKMForBillingManual"].enable();
  //   this.advanceTableForm.controls["pickUpKMForBillingManual"].enable();
  //   this.advanceTableForm.controls["dropOffKMForBillingManual"].enable();

  //   this.advanceTableForm.controls["locationOutKMForBillingApp"].disable();
  //   this.advanceTableForm.controls["pickUpKMForBillingApp"].disable();
  //   this.advanceTableForm.controls["dropOffKMForBillingApp"].disable();

  //   this.advanceTableForm.controls["locationOutKMForBillingGPS"].disable();
  //   this.advanceTableForm.controls["pickUpKMForBillingGPS"].disable();
  //   this.advanceTableForm.controls["dropOffKMForBillingGPS"].disable();

  }

onAppKMClick()
{
  this.advanceTableForm.reset();
  this.loadDataForApp();
  this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID});
  this.advanceTableForm.patchValue({packageID:this.PackageID});
  this.advanceTableForm.patchValue({dutyTypeID:this.PackageTypeID});
  this.advanceTableForm.patchValue({dutySlipForBillingID:this.DutySlipForBillingID});
  this.advanceTableForm.patchValue({closureStatus:'Closed'});
  this.advanceTableForm.patchValue({closureMethod:'App'});

    this.advanceTableForm.controls["locationOutKMForBilling"].disable();
    this.advanceTableForm.controls["pickUpKMForBilling"].disable();
    this.advanceTableForm.controls["dropOffKMForBilling"].disable();

    this.advanceTableForm.controls["locationOutKMForBillingApp"].enable();
    this.advanceTableForm.controls["pickUpKMForBillingApp"].enable();
    this.advanceTableForm.controls["dropOffKMForBillingApp"].enable();

    this.advanceTableForm.controls["locationOutKMForBillingManual"].disable();
    this.advanceTableForm.controls["pickUpKMForBillingManual"].disable();
    this.advanceTableForm.controls["dropOffKMForBillingManual"].disable();

    this.advanceTableForm.controls["locationOutKMForBillingGPS"].disable();
    this.advanceTableForm.controls["pickUpKMForBillingGPS"].disable();
    this.advanceTableForm.controls["dropOffKMForBillingGPS"].disable();
}

onGPSKMClick()
{
  this.advanceTableForm.reset();
  this.loadDataForGPS();
  this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID});
  this.advanceTableForm.patchValue({packageID:this.PackageID});
  this.advanceTableForm.patchValue({dutyTypeID:this.PackageTypeID});
  this.advanceTableForm.patchValue({dutySlipForBillingID:this.DutySlipForBillingID});
  this.advanceTableForm.patchValue({closureStatus:'Closed'});
  this.advanceTableForm.patchValue({closureMethod:'GPS'});

  this.advanceTableForm.controls["locationOutKMForBilling"].disable();
    this.advanceTableForm.controls["pickUpKMForBilling"].disable();
    this.advanceTableForm.controls["dropOffKMForBilling"].disable();

    this.advanceTableForm.controls["locationOutKMForBillingApp"].disable();
    this.advanceTableForm.controls["pickUpKMForBillingApp"].disable();
    this.advanceTableForm.controls["dropOffKMForBillingApp"].disable();

    this.advanceTableForm.controls["locationOutKMForBillingManual"].disable();
    this.advanceTableForm.controls["pickUpKMForBillingManual"].disable();
    this.advanceTableForm.controls["dropOffKMForBillingManual"].disable();

    this.advanceTableForm.controls["locationOutKMForBillingGPS"].enable();
    this.advanceTableForm.controls["pickUpKMForBillingGPS"].enable();
    this.advanceTableForm.controls["dropOffKMForBillingGPS"].enable();

}

// openDisputes()
// {
//   const dialogRef = this.dialog.open(FormDialogDisputeComponent, 
//     {
//       data: 
//       {
//         dutySlipID:this.DutySlipID,
//         record: this.disputeAdvanceTable
//       }
//     }); 
//     dialogRef.afterClosed().subscribe((res: any) => {
//       this.disputeLoadData();
//   });  
// }

openBillingHistory()
{  
  const dialogRef = this.dialog.open(BillingHistoryComponent, 
    {
      height:'65%',
      width:'50%',
      data: 
      {
        dutySlipID:this.DutySlipID
      }
    });
}

openDutyExpense()
{
  const dialogRef = this.dialog.open(DutyExpenseFormDialogComponent, 
    {
      data: 
      {
        dutySlipID:this.DutySlipID,
        record:this.advanceTableDE
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.dutyExpenseLoadData();
  });  
}

public dutyExpenseLoadData() 
{
   this.dutyExpenseService.getTableData(this.DutySlipID,this.SearchActivationStatus, this.PageNumber).subscribe
   (
  data=>
    {
      if(data!=null)
        {
          this.showDutyExpense=true;
        }
        this.advanceTableDE=data;
    },
     (error: HttpErrorResponse) => { this.advanceTableDE = null;}
   );
}

GetDutySlipMap()
{
  this.clossingScreenService.getDutySlipMap(this.DutySlipID).subscribe(
    data=>
      {
    
        this.dutySlipMap=data;
        this.mapOfDutySlip=this.dutySlipMap.dutySlipMap;
      }
  )
}

showMap()
{
    window.open(this.mapOfDutySlip, '_blank');
}

closePanels()
{
  this.panelExpanded=false;
}

 scrollToLinkButton() {
    const element = document.getElementById('linkButtonSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

public tollParkingLoadData() 
   {
      this.dutyTollParkingEntryService.getTableData(this.SearchDutyTollParkingID,this.DutySlipID,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          if(data!= null)
            {
              this.showHideTollParkingCard=true;
            }
          this.tollParkingAdvanceTable = data;
        },
        (error: HttpErrorResponse) => { this.tollParkingAdvanceTable = null;}
      );
  }

  openAdditionalKms() {
    this.isEditingKms = true;
    this.isEditingMinutes = false;
    this.openAdditionalKMMinutes('additionalKMs');
  }

  openAdditionalMinutes() {
    this.isEditingMinutes = true;
    this.isEditingKms = false;
    this.openAdditionalKMMinutes('additionalMinutes');
  }

  openAdditionalKMMinutes(type: string) {
    const dialogRef = this.dialog.open(AdditionalDialogComponent, {
      data: {
        dutySlipID: this.DutySlipID,
        record: this.advanceTableAD,
        type: type
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      this.isEditingKms = false;
      this.isEditingMinutes = false;
      this.loadData();
    });
  }

  openAdditional()
{
  const dialogRef = this.dialog.open(AdditionalDialogComponent, 
    {
      data: 
      {
        dutySlipID: this.DutySlipID,
        //action: 'edit',
        record: this.advanceTableAD
      }
    });   
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadData();
    })
}

public loadData() {
  this.showAdditionalKms = false;
  this.additionalKmsDetailsService.getAdditionalKmsDetails(this.DutySlipID).subscribe(
    data => {   
       if(data !== null && data.length > 0) {
        this.advanceTableAD = data;  
        this.showAdditionalKms = this.advanceTableAD[0].additionalKMs !== 0;
       } 
    },
    (error: HttpErrorResponse) => { 
       this.advanceTableAD = null;
       this.showAdditionalKms = false;
    }
  );
}
newDataAdded(msg: boolean) {
  this.newDataAddedEvent.emit(msg);
  }

  public disputeLoadData() {
    this.showHideDispute = false;
    this.disputeService.getTableData(this.DutySlipForBillingID, this.PageNumber, 'Descending').subscribe
      (
        data => {

          if (data !== null && data.length > 0) {
            let firstRecord = [];
            firstRecord.push(data[0]);
            this.disputeAdvanceTable = data;
            this.showHideDispute = this.disputeAdvanceTable[0].disputeKMs !== 0;
          }
        },
        (error: HttpErrorResponse) => {
          this.disputeAdvanceTable = null;
          this.showHideDispute = false;
        }
      );
  }

// Distance and Time Calculation For Driver
onpickupDriverKMChange()
{
const locoutDriverDate = new Date(this.advanceTableForm.value.locationOutDateForDriver);
const locoutDriverTime = new Date(this.advanceTableForm.value.locationOutTimeForDriver);
const locoutDriverKM = this.advanceTableForm.value.locationOutKMForDriver;

const pickupDriverDate = new Date(this.advanceTableForm.value.pickUpDateForDriver);
const pickupDriverTime = new Date(this.advanceTableForm.value.pickUpTimeForDriver);
const pickupDriverKM = this.advanceTableForm.value.pickUpKMForDriver;

const locoutDateTime = new Date(locoutDriverDate);
locoutDateTime.setHours(locoutDriverTime.getHours());
locoutDateTime.setMinutes(locoutDriverTime.getMinutes());

const pickupDateTime = new Date(pickupDriverDate);
pickupDateTime.setHours(pickupDriverTime.getHours());
pickupDateTime.setMinutes(pickupDriverTime.getMinutes());

const timeDifference =pickupDateTime.getTime() - locoutDateTime.getTime();

//this.outputForPickupLocationOut = Math.floor(timeDifference / (1000 * 60 * 60));
const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =pickupDriverKM - locoutDriverKM;
this.outputForPickupLocationOut = `${hours}.${minutes} HRS`;
this.distanceDiffForPickupLocationOut = `${distanceDifference} KM`;

}

ondropOffDriverKMChange()
{
const pickupDriverDate = new Date(this.advanceTableForm.value.pickUpDateForDriver);
const pickupDriverTime = new Date(this.advanceTableForm.value.pickUpTimeForDriver);
const pickupDriverKM = this.advanceTableForm.value.pickUpKMForDriver;

const dropOffDriverDate = new Date(this.advanceTableForm.value.dropOffDateForDriver);
const dropOffDriverTime = new Date(this.advanceTableForm.value.dropOffTimeForDriver);
const dropOffDriverKM = this.advanceTableForm.value.dropOffKMForDriver;

const pickupDateTime = new Date(pickupDriverDate);
pickupDateTime.setHours(pickupDriverTime.getHours());
pickupDateTime.setMinutes(pickupDriverTime.getMinutes());

const dropOffDateTime = new Date(dropOffDriverDate);
dropOffDateTime.setHours(dropOffDriverTime.getHours());
dropOffDateTime.setMinutes(dropOffDriverTime.getMinutes());

const timeDifference =dropOffDateTime.getTime() - pickupDateTime.getTime();

const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =dropOffDriverKM - pickupDriverKM;
this.outputForDropOffPickup = `${hours}.${minutes} HRS`;
this.distanceDiffForDropOffPickup = `${distanceDifference} KM`;

}

onLocationInDriverKMChange()
{
const dropOffDriverDate = new Date(this.advanceTableForm.value.dropOffDateForDriver);
const dropOffDriverTime = new Date(this.advanceTableForm.value.dropOffTimeForDriver);
const dropOffDriverKM = this.advanceTableForm.value.dropOffKMForDriver;

const locinDriverDate = new Date(this.advanceTableForm.value.locationInDateForDriver);
const locinDriverTime = new Date(this.advanceTableForm.value.locationInTimeForDriver);
const locinDriverKM = this.advanceTableForm.value.locationInKMForDriver;

const locinDateTime = new Date(locinDriverDate);
locinDateTime.setHours(locinDriverTime.getHours());
locinDateTime.setMinutes(locinDriverTime.getMinutes());

const dropOffDateTime = new Date(dropOffDriverDate);
dropOffDateTime.setHours(dropOffDriverTime.getHours());
dropOffDateTime.setMinutes(dropOffDriverTime.getMinutes());

const timeDifference =locinDateTime.getTime() - dropOffDateTime.getTime();

const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =locinDriverKM - dropOffDriverKM;
this.outputForlocationInDropOff = `${hours}.${minutes} HRS`;
this.distanceDiffForlocationInDropOff = `${distanceDifference} KM`;
this.calculateTimeAndDistanceForManual();
this.completeTimeAndDistance();
}

// Calculate Time & Distance
calculateTimeAndDistanceForManual()
{
  this.totalTimeForManual = (parseFloat(this.outputForPickupLocationOut) + parseFloat(this.outputForDropOffPickup) + parseFloat(this.outputForlocationInDropOff)).toFixed(2) + " HRS";
  //this.totalTimeForManual = parseFloat(this.totalTimeForManual.toFixed(2));
  this.totalForManual= parseInt(this.distanceDiffForPickupLocationOut) + parseInt(this.distanceDiffForDropOffPickup) + parseInt(this.distanceDiffForlocationInDropOff) +" KM";
}

// Distance and Time Calculation For App
onpickupAppKMChange()
{
const locoutAppDate = new Date(this.advanceTableForm.value.locationOutDateForApp);
const locoutAppTime = new Date(this.advanceTableForm.value.locationOutTimeForApp);
const locoutAppKM = this.advanceTableForm.value.locationOutKMForApp;

const pickupAppDate = new Date(this.advanceTableForm.value.pickUpDateForApp);
const pickupAppTime = new Date(this.advanceTableForm.value.pickUpTimeForApp);
const pickupAppKM = this.advanceTableForm.value.pickUpKMForApp;

const locoutDateTime = new Date(locoutAppDate);
locoutDateTime.setHours(locoutAppTime.getHours());
locoutDateTime.setMinutes(locoutAppTime.getMinutes());

const pickupDateTime = new Date(pickupAppDate);
pickupDateTime.setHours(pickupAppTime.getHours());
pickupDateTime.setMinutes(pickupAppTime.getMinutes());

const timeDifference =pickupDateTime.getTime() - locoutDateTime.getTime();

const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =pickupAppKM - locoutAppKM;
this.outputForPickupLocationOutApp = `${hours}.${minutes} HRS`;
this.distanceDifferenceForPickupLocationOutApp = `${distanceDifference} KM`;

}

ondropOffAppKMChange()
{
const pickupAppDate = new Date(this.advanceTableForm.value.pickUpDateForApp);
const pickupAppTime = new Date(this.advanceTableForm.value.pickUpTimeForApp);
const pickupAppKM = this.advanceTableForm.value.pickUpKMForApp;

const dropOffAppDate = new Date(this.advanceTableForm.value.dropOffDateForApp);
const dropOffAppTime = new Date(this.advanceTableForm.value.dropOffTimeForApp);
const dropOffAppKM = this.advanceTableForm.value.dropOffKMForApp;

const pickupDateTime = new Date(pickupAppDate);
pickupDateTime.setHours(pickupAppTime.getHours());
pickupDateTime.setMinutes(pickupAppTime.getMinutes());

const dropOffDateTime = new Date(dropOffAppDate);
dropOffDateTime.setHours(dropOffAppTime.getHours());
dropOffDateTime.setMinutes(dropOffAppTime.getMinutes());

const timeDifference =dropOffDateTime.getTime() - pickupDateTime.getTime();

const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =dropOffAppKM - pickupAppKM;
this.outputForDropOffPickupApp = `${hours}.${minutes} HRS`;
this.distanceDiffForDropOffPickupApp = `${distanceDifference} KM`;

}

onLocationInAppKMChange()
{
const dropOffAppDate = new Date(this.advanceTableForm.value.dropOffDateForApp);
const dropOffAppTime = new Date(this.advanceTableForm.value.dropOffTimeForApp);
const dropOffAppKM = this.advanceTableForm.value.dropOffKMForApp;

const locinAppDate = new Date(this.advanceTableForm.value.locationInDateForApp);
const locinAppTime = new Date(this.advanceTableForm.value.locationInTimeForApp);
const locinAppKM = this.advanceTableForm.value.locationInKMForApp;

const locinDateTime = new Date(locinAppDate);
locinDateTime.setHours(locinAppTime.getHours());
locinDateTime.setMinutes(locinAppTime.getMinutes());

const dropOffDateTime = new Date(dropOffAppDate);
dropOffDateTime.setHours(dropOffAppTime.getHours());
dropOffDateTime.setMinutes(dropOffAppTime.getMinutes());

const timeDifference =locinDateTime.getTime() - dropOffDateTime.getTime();

const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =locinAppKM - dropOffAppKM;
this.outputForlocationInDropOffApp = `${hours}.${minutes} HRS`;
this.distanceDiffForlocationInDropOffApp = `${distanceDifference} KM`;
this.calculateTimeAndDistanceForApp();
this.completeTimeAndDistance();
}

// Calculate Time & Distance
calculateTimeAndDistanceForApp()
{
  this.totalTimeForApp = (parseFloat(this.outputForPickupLocationOutApp) + parseFloat(this.outputForDropOffPickupApp) + parseFloat(this.outputForlocationInDropOffApp)).toFixed(2) + " HRS";
   this.totalForApp= parseInt(this.distanceDifferenceForPickupLocationOutApp) + parseInt(this.distanceDiffForDropOffPickupApp) + parseInt(this.distanceDiffForlocationInDropOffApp) +" KM";
}

// Distance and Time Calculation For GPS
onpickupGPSKMChange()
{
const locoutGPSDate = new Date(this.advanceTableForm.value.locationOutDateForGPS);
const locoutGPSTime = new Date(this.advanceTableForm.value.locationOutTimeForGPS);
const locoutGPSKM = this.advanceTableForm.value.locationOutKMForGPS;

const pickupGPSDate = new Date(this.advanceTableForm.value.pickUpDateForGPS);
const pickupGPSTime = new Date(this.advanceTableForm.value.pickUpTimeForGPS);
const pickupGPSKM = this.advanceTableForm.value.pickUpKMForGPS;

const locoutDateTime = new Date(locoutGPSDate);
locoutDateTime.setHours(locoutGPSTime.getHours());
locoutDateTime.setMinutes(locoutGPSTime.getMinutes());

const pickupDateTime = new Date(pickupGPSDate);
pickupDateTime.setHours(pickupGPSTime.getHours());
pickupDateTime.setMinutes(pickupGPSTime.getMinutes());

const timeDifference =pickupDateTime.getTime() - locoutDateTime.getTime();

const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =pickupGPSKM - locoutGPSKM;
this.outputForPickupLocationOutGPS = `${hours}.${minutes} HRS`;
this.distanceDiffForPickupLocationOutGPS = `${distanceDifference} KM`;

}

ondropOffGPSKMChange()
{
const pickupGPSDate = new Date(this.advanceTableForm.value.pickUpDateForGPS);
const pickupGPSTime = new Date(this.advanceTableForm.value.pickUpTimeForGPS);
const pickupGPSKM = this.advanceTableForm.value.pickUpKMForGPS;

const dropOffGPSDate = new Date(this.advanceTableForm.value.dropOffDateForGPS);
const dropOffGPSTime = new Date(this.advanceTableForm.value.dropOffTimeForGPS);
const dropOffGPSKM = this.advanceTableForm.value.dropOffKMForGPS;

const pickupDateTime = new Date(pickupGPSDate);
pickupDateTime.setHours(pickupGPSTime.getHours());
pickupDateTime.setMinutes(pickupGPSTime.getMinutes());

const dropOffDateTime = new Date(dropOffGPSDate);
dropOffDateTime.setHours(dropOffGPSTime.getHours());
dropOffDateTime.setMinutes(dropOffGPSTime.getMinutes());

const timeDifference =dropOffDateTime.getTime() - pickupDateTime.getTime();

const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =dropOffGPSKM - pickupGPSKM;
this.outputForDropOffPickupGPS = `${hours}.${minutes} HRS`;
this.distanceDiffForDropOffPickupGPS = `${distanceDifference} KM`;

}

onLocationInGPSKMChange()
{
const dropOffGPSDate = new Date(this.advanceTableForm.value.dropOffDateForGPS);
const dropOffGPSTime = new Date(this.advanceTableForm.value.dropOffTimeForGPS);
const dropOffGPSKM = this.advanceTableForm.value.dropOffKMForGPS;

const locinGPSDate = new Date(this.advanceTableForm.value.locationInDateForGPS);
const locinGPSTime = new Date(this.advanceTableForm.value.locationInTimeForGPS);
const locinGPSKM = this.advanceTableForm.value.locationInKMForGPS;

const locinDateTime = new Date(locinGPSDate);
locinDateTime.setHours(locinGPSTime.getHours());
locinDateTime.setMinutes(locinGPSTime.getMinutes());

const dropOffDateTime = new Date(dropOffGPSDate);
dropOffDateTime.setHours(dropOffGPSTime.getHours());
dropOffDateTime.setMinutes(dropOffGPSTime.getMinutes());

const timeDifference =locinDateTime.getTime() - dropOffDateTime.getTime();

const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =locinGPSKM - dropOffGPSKM;
this.outputForlocationInDropOffGPS = `${hours}.${minutes} HRS`;
this.distanceDiffForlocationInDropOffGPS = `${distanceDifference} KM`;
this.calculateTimeAndDistanceForGtrack();
this.completeTimeAndDistance();
}

// Calculate Time & Distance
calculateTimeAndDistanceForGtrack()
{
  this.totalTimeForGtrack = (parseFloat(this.outputForPickupLocationOutGPS) + parseFloat(this.outputForDropOffPickupGPS) + parseFloat(this.outputForlocationInDropOffGPS)).toFixed(2) + " HRS";
  this.totalForGtrack= parseInt(this.distanceDiffForPickupLocationOutGPS) + parseInt(this.distanceDiffForDropOffPickupGPS) + parseInt(this.distanceDiffForlocationInDropOffGPS) +" KM";
}

// Distance and Time Calculation For Billing
onpickupBillingKMChange()
{
const locoutBillingDate = new Date(this.advanceTableForm.value.locationOutDateForBilling);
const locoutBillingTime = new Date(this.advanceTableForm.value.locationOutTimeForBilling);
const locoutBillingKM = this.advanceTableForm.value.locationOutKMForBilling;

const pickupBillingDate = new Date(this.advanceTableForm.value.pickUpDateForBilling);
const pickupBillingTime = new Date(this.advanceTableForm.value.pickUpTimeForBilling);
const pickupBillingKM = this.advanceTableForm.value.pickUpKMForBilling;

const locoutDateTime = new Date(locoutBillingDate);
locoutDateTime.setHours(locoutBillingTime.getHours());
locoutDateTime.setMinutes(locoutBillingTime.getMinutes());

const pickupDateTime = new Date(pickupBillingDate);
pickupDateTime.setHours(pickupBillingTime.getHours());
pickupDateTime.setMinutes(pickupBillingTime.getMinutes());

const timeDifference =pickupDateTime.getTime() - locoutDateTime.getTime();

const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =pickupBillingKM - locoutBillingKM;
this.outputForPickupLocationOutBilling = `${hours}.${minutes} HRS`;
this.distanceDiffForPickupLocationOutBilling = `${distanceDifference} KM`;

}

ondropOffBillingKMChange()
{
const pickupBillingDate = new Date(this.advanceTableForm.value.pickUpDateForBilling);
const pickupBillingTime = new Date(this.advanceTableForm.value.pickUpTimeForBilling);
const pickupBillingKM = this.advanceTableForm.value.pickUpKMForBilling;

const dropOffBillingDate = new Date(this.advanceTableForm.value.dropOffDateForBilling);
const dropOffBillingTime = new Date(this.advanceTableForm.value.dropOffTimeForBilling);
const dropOffBillingKM = this.advanceTableForm.value.dropOffKMForBilling;

const pickupDateTime = new Date(pickupBillingDate);
pickupDateTime.setHours(pickupBillingTime.getHours());
pickupDateTime.setMinutes(pickupBillingTime.getMinutes());

const dropOffDateTime = new Date(dropOffBillingDate);
dropOffDateTime.setHours(dropOffBillingTime.getHours());
dropOffDateTime.setMinutes(dropOffBillingTime.getMinutes());

const timeDifference =dropOffDateTime.getTime() - pickupDateTime.getTime();

const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =dropOffBillingKM - pickupBillingKM;
this.outputForDropOffPickupBilling = `${hours}.${minutes} HRS`;
this.distanceDiffForDropOffPickupBilling = `${distanceDifference} KM`;

}

onLocationInBillingKMChange()
{
const dropOffBillingDate = new Date(this.advanceTableForm.value.dropOffDateForBilling);
const dropOffBillingTime = new Date(this.advanceTableForm.value.dropOffTimeForBilling);
const dropOffBillingKM = this.advanceTableForm.value.dropOffKMForBilling;

const locinBillingDate = new Date(this.advanceTableForm.value.locationInDateForBilling);
const locinBillingTime = new Date(this.advanceTableForm.value.locationInTimeForBilling);
const locinBillingKM = this.advanceTableForm.value.locationInKMForBilling;

const locinDateTime = new Date(locinBillingDate);
locinDateTime.setHours(locinBillingTime.getHours());
locinDateTime.setMinutes(locinBillingTime.getMinutes());

const dropOffDateTime = new Date(dropOffBillingDate);
dropOffDateTime.setHours(dropOffBillingTime.getHours());
dropOffDateTime.setMinutes(dropOffBillingTime.getMinutes());

const timeDifference =locinDateTime.getTime() - dropOffDateTime.getTime();

const hours = Math.floor(timeDifference / (1000 * 60 * 60));
const minutes = String(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2,'0');
const distanceDifference =locinBillingKM - dropOffBillingKM;
this.outputForlocationInDropOffBilling = `${hours}.${minutes} HRS`;
this.distanceDiffForlocationInDropOffBilling = `${distanceDifference} KM`; 
this.calculateTimeAndDistanceForBilling();
this.completeTimeAndDistance();
}

// Calculate Time & Distance
calculateTimeAndDistanceForBilling()
{
  this.totalTimeForBilling = (parseFloat(this.outputForPickupLocationOutBilling) + parseFloat(this.outputForDropOffPickupBilling) + parseFloat(this.outputForlocationInDropOffBilling)).toFixed(2) + " HRS";
  this.totalForBilling = parseInt(this.distanceDiffForPickupLocationOutBilling) + parseInt(this.distanceDiffForDropOffPickupBilling) + parseInt(this.distanceDiffForlocationInDropOffBilling) + " KM";
}

completeTimeAndDistance()
{
  this.totalTime = (parseFloat(this.totalTimeForManual) + parseFloat(this.totalTimeForApp) + parseFloat(this.totalTimeForGtrack) + parseFloat(this.totalTimeForBilling)).toFixed(2) + " HRS";
  this.totalDistance = parseInt(this.totalForManual) + parseInt(this.totalForApp) + parseInt(this.totalForGtrack) + parseInt(this.totalForBilling) + " KM";
}

//======= Kam Card =======//
kamCardLoadData() 
{
 this.kamCardService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
(
 (data :KamCard)=>   
 {  
  if(data !== null){
    this.showKamCard = true;
  }
  this.advanceTableKC = data;
 },
 (error: HttpErrorResponse) => { this.advanceTableKC = null;}
);
}

//======= Special Instructoins =======//
specialInstructoinsLoadData() 
{
  this.specialInstructionDetailsService.getspecialInstructionDetails(this.ReservationID).subscribe
  (
   (data :SpecialInstructionDetails)=>   
   {  
    if(data !== null){
      this.showSpecialInstructoins = true;
    }
    this.specialInstrucationDetailsList = data;
   },
   (error: HttpErrorResponse) => { this.specialInstrucationDetailsList = null;}
  );
}

//======= Internal Note Details =======//
internalNoteLoadData() 
{
  this.internalNoteDetailsService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
  (
    (data :InternalNoteDetails)=>   
      {  
       if(data !== null){
         this.showInternalNote = true;
       }
       this.advanceTableIN = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableIN = null;}
     );
}

//======= Advance Details =======//
advanceDetailsLoadData() 
{
  this.advanceDetailsService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
  (
    (data :AdvanceDetails)=>   
      {  
       if(data !== null){
         this.showAdvanceDetails = true;
       }
       this.advanceTableADs = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableADs = null;}
     );
}

//======= Lumpsum Rate Details =======//
lumpsumRateDetailsLoadData() 
{
  this.lumpsumRateDetailsService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
  (
    (data :LumpsumRateDetails)=>   
      {  
       if(data !== null){
         this.showLumpsumRate = true;
       }
       this.advanceTableLR = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableLR = null;}
     );
}

//======= Additional SMS/Email/WhatsApp Details =======//
additionalSMSEmailWhatsAppDetailsLoadData() 
{
  this.additionalSMSDetailsService.getAdditionalSmsDetails(this.ReservationID).subscribe
  (
    (data :AdditionalSMSDetails)=>   
      {  
       if(data !== null){
         this.showAdditionalSMS = true;
       }
       this.advanceTableASEW = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableASEW = null;}
     );
}

//======= Bill To Other =======//
billToOtherLoadData() 
{
  this.billToOtherService.getBillingToOther(this.ReservationID).subscribe
  (
    (data :BillToOther)=>   
      {  
       if(data !== null){
         this.showBillToOther = true;
       }
       this.advanceTableBD = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableBD = null;}
     );
}

//======= Settled Rate To Other =======//
settledRateLoadData() 
{
  this.settledRateDetailsService.GetClosingSettledRate(this.DutySlipID,this.SearchActivationStatus, this.PageNumber).subscribe
  (
    (data :SettledRateDetails)=>   
      {  
       if(data !== null){
         this.showSettledRate = true;
       }
       this.advanceTableSRD = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableSRD = null;}
     );
}

//======= Duty GST Percentage =======//
openDutyGSTPercentage()
{
  const dialogRef = this.dialog.open(DutyGSTPercentageFormDialogComponent, 
    {
      data: 
      {
        dutySlipID:this.DutySlipID,
        record: this.advanceTableDGP
      }
    }); 
    dialogRef.afterClosed().subscribe((res: any) => {
      this.DutyGSTPercentageLoadData();
  });  
}

DutyGSTPercentageLoadData() 
{
  this.dutyGSTPercentageService.getTableData(this.DutySlipID).subscribe
  (
    data=>   
      {  
       if(data !== null){
         this.showDGP = true;
       }
       this.advanceTableDGP = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableDGP = null;}
     );
}

//======= Duty State=======//
openDutyState()
{
  const dialogRef = this.dialog.open(DutyStateFormDialogComponent, 
    {
      data: 
      {
        dutySlipID:this.DutySlipID,
        record:this.advanceTableDutyState
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
       this.loadDutyStateData();
  });  
}

 loadDutyStateData() 
   {
      this.dutyStateService.getTableData(this.DutySlipID).subscribe
      (
        data =>   
        {
          if(data !== null){
            this.showHideDutyState = true;
          }
          this.advanceTableDutyState = data;         
        },
        (error: HttpErrorResponse) => { this.advanceTableDutyState = null;}
      );
  }

  //======= Duty SAC =======//
  openDutySAC()
{
  if (!this.advanceTableSAC) {
    const dialogRef = this.dialog.open(DutySACFormDialogComponent, 
      {
        data: 
        {
          dutySlipID: this.DutySlipID,
          record: this.advanceTableSAC,
        }
      }); 

    dialogRef.afterClosed().subscribe((res: any) => {
      this.DutySACLoadData();
    });
  }
  else
    {
      Swal.fire({
      title:
        'Already added.',
      icon: 'warning',
    }).then((result) => {
      if (result.value) {
        
      }
    });
    }
}

DutySACLoadData() 
{
  this.dutySACService.getTableData(this.DutySlipID).subscribe
  (
    data=>   
      {  
       if(data !== null){
         this.showSAC = true;
       }
       this.advanceTableSAC = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableSAC = null;}
     );
}

///-----TollParking
showAndScrollToElement() {
  this.showHideTollParkingCard = true;
  setTimeout(() => {
    const element = document.getElementById('tollParkingEntry');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}
///-----Dispute
showAndScrollOpenDisputes() {
  this.showHideDispute = true;
  setTimeout(() => {
    const element = document.getElementById('openDisputes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}
//------DutyInterStateTax
showAndScrollDutyInterstateTax() {
  this.showHideaddDIT = true;
  setTimeout(() => {
    const element = document.getElementById('dutyInterstateTax');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

//------OpenDutyExpense
showAndScrollOpenDutyExpense() {
  this.showDutyExpense = true;
  setTimeout(() => {
    const element = document.getElementById('dutyExpense');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}
//------DutyGSTPercentage
showAndScrollDutyGSTPercentage() {
  this.showDGP = true;
  setTimeout(() => {
    const element = document.getElementById('dutyGSTPercentage');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

//------DutyState
showAndScrollDutyState() {
  this.showHideDutyState = true;
  setTimeout(() => {
    const element = document.getElementById('dutyState');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}
//------DutySAC
showAndScrollDutySAC() {
  this.showSAC = true;
  setTimeout(() => {
    const element = document.getElementById('dutySAC');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

//------AdditionalKm
showAndScrollAdditionalKm() {
  this.showAdditionalKms = true;
  setTimeout(() => {
    const element = document.getElementById('AdditionalKms');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

  // onTimeSelection()
  // {
  //   // ------------LocationOutDateTime--------------
  //   var locOutTime=this.advanceTableForm.get("locationOutTimeForDriver").value;
  //   var locOutTimeConversion=moment(locOutTime).format('HH:mm:ss');
  //   var locOutDate=this.advanceTableForm.get("locationOutDateForDriver").value;
  //   var locOutDateConversion=moment(locOutDate).format('yyyy-MM-DD');
  //   var locationOutDateTime=locOutDateConversion+' '+locOutTimeConversion;
  //   // ------------PickupDateTime--------------
  //   var pickUpTime=this.advanceTableForm.get("pickUpTimeForDriver").value;
  //   var pickUpTimeConversion=moment(pickUpTime).format('HH:mm:ss');
  //   var pickUpDate=this.advanceTableForm.get("pickUpDateForDriver").value;
  //   var pickUpDateConversion=moment(pickUpDate).format('yyyy-MM-DD');
  //   var pickUpDateTime=pickUpDateConversion+' '+pickUpTimeConversion;
  //   // ------------DropoffDateTime--------------
  //   var dropOffTime=this.advanceTableForm.get("dropOffTimeForDriver").value;
  //   var dropOffTimeConversion=moment(dropOffTime).format('HH:mm:ss');
  //   var dropOffDate=this.advanceTableForm.get("dropOffDateForDriver").value;
  //   var dropOffDateConversion=moment(dropOffDate).format('yyyy-MM-DD');
  //   var dropOffDateTime=dropOffDateConversion+' '+dropOffTimeConversion;
  //   // ------------LocationInDateTime--------------
  //   var locInTime=this.advanceTableForm.get("locationInTimeForDriver").value;
  //   var locInTimeConversion=moment(locInTime).format('HH:mm:ss');
  //   var locInDate=this.advanceTableForm.get("locationInDateForDriver").value;
  //   var locInDateConversion=moment(locInDate).format('yyyy-MM-DD');
  //   var locInDateTime=locInDateConversion+' '+locInTimeConversion;
  //   var diff1=new Date(locInDateTime).getTime() - new Date(dropOffDateTime).getTime();
  //   var diff2=new Date(dropOffDateTime).getTime() - new Date(pickUpDateTime).getTime();
  //   var diff3=new Date(pickUpDateTime).getTime() - new Date(locationOutDateTime).getTime();
  //   var datetime=diff1+diff2+diff3;
  //   this.datetime = datetime/(1000 * 60 * 60);
  // }

  //---------- Location Out Date For Billing ----------
  onLocOutDatepickerChange(event: any): void  {
   //this.minDateForPickup=new Date(this.advanceTableForm.value.locationOutDateForBilling);
         
    const inputElement = event.targetElement;
    if (inputElement)
    {
      this.onBlurLocOutDateUpdateDate({ target: inputElement});
      
    }
    
    
  }

  onBlurLocOutDateUpdateDate(event: any): void {
    //let value= this._generalService.resetDateiflessthan12(event.target.value);
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

  //---------- Pickup Date For Billing ----------
  onPickupDatepickerChange(event: any): void {
    //this.minDateForDropOff=new Date(this.advanceTableForm.value.pickUpDateForBilling);
    //this.dropOffTimeValidator();
    const inputElement = event.targetElement;
    if (inputElement) 
    {
      this.onBlurPickupUpdateDate({ target: inputElement});
      
    }
    
  }
  
  onBlurPickupUpdateDate(event: any): void {
    //let value= this._generalService.resetDateiflessthan12(event.target.value);
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
    //this.minDateForLI=new Date(this.advanceTableForm.value.dropOffDateForBilling);
    //this.locInTimeValidator();
    const inputElement = event.targetElement;
    if (inputElement) 
    {
      this.onBlurDropOffUpdateDate({ target: inputElement});
      
    }
    
  }
  
  onBlurDropOffUpdateDate(event: any): void {
    //let value= this._generalService.resetDateiflessthan12(event.target.value);
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


  //   this.minTimeForLI = this.combineDateAndTime(
  //     this.advanceTableForm.value.dropOffDateForBilling,
  //     this.advanceTableForm.value.dropOffTimeForBilling
  //   );
  // }
  onBlurLocInUpdateDate(event: any): void {
    //let value= this._generalService.resetDateiflessthan12(event.target.value);
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

combineDateAndTime(dateStr: string, timeObj: Date): Date | null {
  if (!dateStr || !timeObj || isNaN(new Date(dateStr).getTime()) || isNaN(timeObj.getTime())) {
    return null;
  }

  const date = new Date(dateStr);
  date.setHours(timeObj.getHours());
  date.setMinutes(timeObj.getMinutes());
  date.setSeconds(timeObj.getSeconds());
  date.setMilliseconds(0);

  return date;
}


  onTimeSelection() 
  {
        // this.pickupTimeValidator();
        // this.dropOffTimeValidator();
        // this.locInTimeValidator();
    // ------------LocationOutDateTime--------------
    var locOutTime = this.advanceTableForm.get("locationOutTimeForBilling").value;
    var locOutTimeConversion = moment(locOutTime).format('HH:mm:ss');
    var locOutDate = this.advanceTableForm.get("locationOutDateForBilling").value;
    var locOutDateConversion = moment(locOutDate).format('yyyy-MM-DD');
    var locationOutDateTime = locOutDateConversion + ' ' + locOutTimeConversion;
  
    // ------------PickupDateTime--------------
    var pickUpTime = this.advanceTableForm.get("pickUpTimeForBilling").value;
    var pickUpTimeConversion = moment(pickUpTime).format('HH:mm:ss');
    var pickUpDate = this.advanceTableForm.get("pickUpDateForBilling").value;
    var pickUpDateConversion = moment(pickUpDate).format('yyyy-MM-DD');
    var pickUpDateTime = pickUpDateConversion + ' ' + pickUpTimeConversion;
  
    // ------------DropoffDateTime--------------
    var dropOffTime = this.advanceTableForm.get("dropOffTimeForBilling").value;
    var dropOffTimeConversion = moment(dropOffTime).format('HH:mm:ss');
    var dropOffDate = this.advanceTableForm.get("dropOffDateForBilling").value;
    var dropOffDateConversion = moment(dropOffDate).format('yyyy-MM-DD');
    var dropOffDateTime = dropOffDateConversion + ' ' + dropOffTimeConversion;
  
    // ------------LocationInDateTime--------------
    var locInTime = this.advanceTableForm.get("locationInTimeForBilling").value;
    var locInTimeConversion = moment(locInTime).format('HH:mm:ss');
    var locInDate = this.advanceTableForm.get("locationInDateForBilling").value;
    var locInDateConversion = moment(locInDate).format('yyyy-MM-DD');
    var locInDateTime = locInDateConversion + ' ' + locInTimeConversion;
  
    // Calculate differences
    var diff3 = new Date(pickUpDateTime).getTime() - new Date(locationOutDateTime).getTime();
    var diff2 = new Date(dropOffDateTime).getTime() - new Date(pickUpDateTime).getTime();
    var diff1 = new Date(locInDateTime).getTime() - new Date(dropOffDateTime).getTime();
    
    var totalMilliseconds = diff1 + diff2 + diff3;
  
    // Convert to total minutes
    var totalMinutes = totalMilliseconds / (1000 * 60);
  
    // Extract hours and minutes
    var hours = Math.floor(totalMinutes / 60);
    var minutes = Math.floor(totalMinutes % 60);
  
    // Combine hours and minutes in desired format
    this.datetime = hours + "." + minutes;
  }
  
  onKeyUp()
  {
    var diff1=this.advanceTableForm.value.locationInKMForBilling - this.advanceTableForm.value.dropOffKMForBilling;
    var diff2=this.advanceTableForm.value.dropOffKMForBilling - this.advanceTableForm.value.pickUpKMForBilling;
    var diff3=this.advanceTableForm.value.pickUpKMForBilling - this.advanceTableForm.value.locationOutKMForBilling;
    this.diff=diff1+diff2+diff3;
  }

  addtionOfManulKM()
  {
    this.totalKMForManul = this.advanceTableForm.value.hubToStartKM + this.advanceTableForm.value.startToEndKM + this.advanceTableForm.value.endToHubKM;
  }

  addtionOfAppKM()
  {
    this.totalKMForApp = this.advanceTableForm.value.locationToPickupTripKm + this.advanceTableForm.value.pickupToDropOffTripKm + this.advanceTableForm.value.dropOffToLocationInTripKm;
  }

  KMForPreviousBooking() 
  {
    this.clossingScreenService.getKmForPervious(this.ReservationID,this.RegistrationNumber).subscribe
    (
      data=>   
        {  
          this.advanceTableKMForPreviousBooking = data;
          this.advanceTableForm.patchValue({locationOutKMForBilling:this.advanceTableKMForPreviousBooking.locationInKM});
           this.getIntervalInTime();
          //this.advanceTableForm.patchValue({pickUpKMForBilling:this.advanceTableKMForPreviousBooking.pickUpKM});
          //this.advanceTableForm.patchValue({dropOffKMForBilling:this.advanceTableKMForPreviousBooking.dropOffKM});
          //this.advanceTableForm.patchValue({reportingToGuestKMForBilling:this.advanceTableKMForPreviousBooking.reportingToGuestKM});
          //this.advanceTableForm.patchValue({locationInKMForBilling:this.advanceTableKMForPreviousBooking.locationInKM});
          // this.advanceTableForm.patchValue({reportingToGuestDateForBilling:this.PickupDate});
          // this.advanceTableForm.patchValue({reportingToGuestTimeForBilling:this.PickupTime});
         // this.advanceTableForm.patchValue({dropOffDateForBilling:this.DropOffDate});
          //this.advanceTableForm.patchValue({dropOffTimeForBilling:this.DropOffTime});
        
         // this.advanceTableForm.patchValue({locationOutDateForBilling:this.LocationOutDate});
          //this.advanceTableForm.patchValue({locationOutTimeForBilling:this.LocationOutTime});
         
          this.advanceTableForm.patchValue({reportingToGuestAddressStringForBilling:this.PickupAddress});
          this.advanceTableForm.patchValue({dropOffAddressStringForBilling:this.DropOffAddress});
          this.advanceTableForm.patchValue({locationOutAddressStringForBilling:this.LocationOutAddress});
          this.advanceTableForm.patchValue({locationInAddressStringForBilling:this.LocationOutAddress});
          this.advanceTableForm.patchValue({locationOutLatLongForBilling:null});
          this.advanceTableForm.patchValue({reportingToGuestLatLongForBilling:null});
          this.advanceTableForm.patchValue({pickUpLatLongForBilling:null});
          this.advanceTableForm.patchValue({dropOffLatLongForBilling:null});
          this.advanceTableForm.patchValue({locationInLatLongForBilling:null});
          // this.advanceTableForm.patchValue({locationInDateForBilling:this.LocationInDate});
          // this.advanceTableForm.patchValue({locationInTimeForBilling:this.LocationInTime});
          this.onKeyUp();
        },
        (error: HttpErrorResponse) => { this.advanceTableKMForPreviousBooking = null;}
      );
  }

  GetClosureType() 
  {
    this.clossingScreenService.getClosureType(this.DutySlipID).subscribe
    (
      data=>   
        { 
          this.closureTypeValue = data;
          if(this.closureTypeValue.closureType === "Manual" || this.closureTypeValue.closureType === "App" || this.closureTypeValue.closureType === "GTrack")
            {
              this.loadDataForBilling();
              this.loadDataKmForDriver();
            }
            else
            {
              this.loadDataForDriver();
              this.onKeyUp();  
            }
        },
        (error: HttpErrorResponse) => { this.closureTypeValue = null;}
      );
  }

  GetDutySlipByAppDateTime() 
  {
    this.clossingScreenService.getDutySlipByAppDateTime(this.DutySlipID).subscribe
    (
      data=>   
        { 
          this.dutySlipByAppData = data;
        },
        (error: HttpErrorResponse) => { this.closureTypeValue = null;}
      );
  }

  //------addDiscount-----------

  addDiscount()
{
  const dialogRef = this.dialog.open(DiscountDetailsDialogComponent, 
    {
      data: 
        {
          // advanceTable: this.advanceTable,
          // action: 'add'
          reservationID:this.ReservationID
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.discountDetailsLoadData();
})
}

addSalesPerson()
{
  const dialogRef = this.dialog.open(RSPFormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTableSP,
           action: 'add',
          reservationID:this.ReservationID
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.salesPersonLoadData();
})
}

updateSalesPerson(row)
{
  const dialogRef = this.dialog.open(RSPFormDialogComponent, 
    {
      data: 
        {
           advanceTable: row,
           action: 'edit',
          reservationID:this.ReservationID
        }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.salesPersonLoadData();
})
}

deleteSalesPerson(row)
{
  const dialogRef = this.dialog.open(RSPDeleteDialogComponent, 
  {
    data: row
  });
  dialogRef.afterClosed().subscribe((res: any) => {
    this.salesPersonLoadData();
})
}

public salesPersonLoadData() 
{
   this.clossingScreenService.getSalesPerson(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
 (
   (data :ReservationSalesPersonModel)=>   
   {
    if(data !== null){
      this.showHideSalesPerson = true;
    }
     this.advanceTableSP = data;
   },
   (error: HttpErrorResponse) => { this.advanceTableSP = null;}
 );
 
}

public discountDetailsLoadData() 
{
   this.discountDetails.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
 (
   (data :DiscountDetails)=>   
   {
    if(data !== null){
      this.showHideaddDiscount = true;
    }
     this.advanceTableDD = data;
   },
   (error: HttpErrorResponse) => { this.advanceTableDD = null;}
 );
 
}

showAndScrollAddDiscount() {
  this.showHideaddDiscount = true;
  setTimeout(() => {
    const element = document.getElementById('addDiscount');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

showAndScrollSalesPerson() {
  this.showHideSalesPerson = true;
  setTimeout(() => {
    const element = document.getElementById('salesPerson');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

 onContextMenu(event: MouseEvent, item: ReservationSalesPersonModel) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  getDutySlipReceived()
  {
    this.clossingScreenService.getDutySlipReceived(this.DutySlipID).subscribe(
      data => 
      {
        this.dutySlipReceived = data.dutySlipReceived;
        this.advanceTableForm.patchValue({physicalDutySlipReceived :this.dutySlipReceived})
      }
    );
  }

  getIntervalInTime()
  {
    this.advanceTableService.GetLocationOutIntervalInMinutes(this.CustomerID).subscribe(
      data=>
      {
        this.IntervalInTime = data.locationOutIntervalInMinutes;
        if (this.PickupTime && this.PickupDate) {
          const pickupDate = new Date(this.PickupDate);
          const eventTime = new Date(this.PickupTime);
          const combinedDateTime = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), eventTime.getHours(), eventTime.getMinutes());
          if(this.IntervalInTime===0 || this.IntervalInTime===null)
          {
            combinedDateTime.setMinutes(combinedDateTime.getMinutes() - 90);
          }
          else
          {
            combinedDateTime.setMinutes(combinedDateTime.getMinutes() - this.IntervalInTime);
          }
          
          const locOutDateTime=new Date(combinedDateTime);
          this.advanceTableForm.patchValue({locationOutDateForBilling:locOutDateTime});
          this.advanceTableForm.patchValue({locationOutTimeForBilling:locOutDateTime});
          this.advanceTableForm.patchValue({pickUpDateForBilling:pickupDate});
          this.advanceTableForm.patchValue({pickUpTimeForBilling:eventTime});
           this.advanceTableForm.patchValue({pickUpAddressStringForBilling:this.PickupAddress});
          //  this.minDateForPickup = new Date(this.advanceTableForm.value.locationOutDateForBilling); 
          //  this.minDateForDropOff = new Date(this.advanceTableForm.value.pickUpDateForBilling); 
          //  this.minTimeForPickup = new Date(this.advanceTableForm.value.locationOutTimeForBilling); 
          //  this.minTimeForDropOff = new Date(this.advanceTableForm.value.pickUpTimeForBilling); 
        
        }
      }
    );
  }

  onGFBChange(event: any) 
  {
    if(this.advanceTableForm.value.verifyDuty===false)
    {
      Swal.fire('Error', 'Please Verify Duty Before Good For Billing.', 'warning');
      this.advanceTableForm.patchValue({goodForBilling :false});
    return false;
    }
    const isChecked = event.target.checked;
    if (!this.advanceTableBH) {
      this.advanceTableBH = {} as BillingHistory;
    }
    if(isChecked === true)
    {
      let at = "Checked";
      this.advanceTableForm.patchValue({actionTaken : "GoodForBilling"});
      this.advanceTableForm.patchValue({actionDetails : at});
      this.advanceTableBH.verifyDuty = this.advanceTableForm.value.verifyDuty;
      this.advanceTableBH.goodForBilling = isChecked;
      this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
      this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
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
    if(isChecked !==null)
    {
      this.SaveDataInBillingHistory();
    }
    
  }

  SaveDataInBillingHistory()
  {
    this.advanceTableForm.patchValue({dutySlipForBillingID : this.advanceTableBilling[0].dutySlipForBillingID})
    this.advanceTableForm.patchValue({dutySlipID : this.DutySlipID});
    this.advanceTableBH.dutySlipForBillingID=this.advanceTableForm.value.dutySlipForBillingID;
    this.advanceTableBH.dutySlipID=this.DutySlipID;
    this.advanceTableBH.userID=this._generalService.getUserID();;
    this.clossingScreenService.addBillingHistory(this.advanceTableBH)  
  .subscribe(
  response => 
  {
    
    
    this.showNotification(
      'snackbar-success',
      'Updated...!!!',
      'bottom',
      'center'
    );
},
  error =>
  {
    this.showNotification(
      'snackbar-danger',
      'Operation Failed...!!!',
      'bottom',
      'center'
    );
      })
  }

  onVDChange(event: any) 
  {
    const isChecked = event.target.checked;
    if (!this.advanceTableBH) {
      this.advanceTableBH = {} as BillingHistory;
    }
    if(isChecked === true)
    {
      let at = "Checked";
      this.advanceTableForm.patchValue({actionTaken : "Verify Duty"});
      this.advanceTableForm.patchValue({actionDetails : at});
      this.advanceTableBH.verifyDuty = isChecked;
      this.advanceTableBH.goodForBilling = this.advanceTableForm.value.goodForBilling;
      this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
      this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
    }
    if(isChecked === false)
    {
      let at = "Unchecked";
      this.advanceTableForm.patchValue({actionTaken : "Verify Duty"});
      this.advanceTableForm.patchValue({actionDetails : at});
      this.advanceTableBH.verifyDuty = isChecked;
      this.advanceTableForm.patchValue({goodForBilling : false});
      this.advanceTableBH.actionTaken = this.advanceTableForm.value.actionTaken;
      this.advanceTableBH.actionDetails = this.advanceTableForm.value.actionDetails;
    }
    if(isChecked !==null)
    {
      this.SaveDataInBillingHistory();
    }
    
  }

  openDisputes() {
    // console.log(this.disputeAdvanceTable);
    // console.log(this.DutySlipForBillingID, this.disputeTypeID);
    const dialogRef = this.dialog.open(FormDialogDisputeComponent,
      {
        data:
        {
          dutySlipID: this.DutySlipID,
          dutySlipForBillingID: this.DutySlipForBillingID,
          dutyTypeID: this.PackageTypeID,
          reservationID: this.ReservationID,
          record: this.disputeAdvanceTable
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.disputeLoadData();
    });
  }

disputeHistoryDetails() {
  this.dialog.open(DisputeHistoryComponent, {
    width: '500px',
    data: {
      dutySlipForBillingID: this.DutySlipForBillingID,
    }
  });
}
isPickupTimeInvalid(): boolean {
  const date = new Date(this.PickupTime);
  return isNaN(date.getTime()); // true if date is invalid
}

dateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

checkChronologyAndValues(): boolean {
  const form = this.advanceTableForm.value;
  // Date-only validations
  const pickupDate = this.dateOnly(new Date(form.pickUpDateForBilling));
  const locationOutDate = this.dateOnly(new Date(form.locationOutDateForBilling));
  const dropOffDate = this.dateOnly(new Date(form.dropOffDateForBilling));
  const locationInDate = this.dateOnly(new Date(form.locationInDateForBilling));

  if (pickupDate < locationOutDate) {
    Swal.fire('Error', 'Pickup Date cannot be before Location Out Date.', 'warning');
    return false;
  }

  if (dropOffDate < pickupDate) {
    Swal.fire('Error', 'Drop-off Date cannot be before Pickup Date.', 'warning');
    return false;
  }

  if (locationInDate < dropOffDate) {
    Swal.fire('Error', 'Location In Date cannot be before Drop-off Date.', 'warning');
    return false;
  }

  // Date+Time validations
  const getDateTime = (dateInput: any, timeInput: any): Date | null => {
  try {
    let date: Date;
    let time: Date;

    // Normalize Date input
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      return null;
    }

    // Normalize Time input
    if (timeInput instanceof Date) {
      time = timeInput;
    } else if (typeof timeInput === 'string') {
      time = new Date(timeInput);
    } else {
      return null;
    }

    // Compose final DateTime
    const final = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );

    return isNaN(final.getTime()) ? null : final;
  } catch (err) {
    return null;
  }
};


debugger;
console.log("Form values for DateTime check:", {
  locationOutDate: form.locationOutDateForBilling,
  locationOutTime: form.locationOutTimeForBilling,
  pickupDate: form.pickUpDateForBilling,
  pickupTime: form.pickUpTimeForBilling,
  dropOffDate: form.dropOffDateForBilling,
  dropOffTime: form.dropOffTimeForBilling,
  locationInDate: form.locationInDateForBilling,
  locationInTime: form.locationInTimeForBilling
});

  const locationOutDT = getDateTime(form.locationOutDateForBilling, form.locationOutTimeForBilling);
const pickupDT = getDateTime(form.pickUpDateForBilling, form.pickUpTimeForBilling);
const dropOffDT = getDateTime(form.dropOffDateForBilling, form.dropOffTimeForBilling);
const locationInDT = getDateTime(form.locationInDateForBilling, form.locationInTimeForBilling);

if (!locationOutDT || !pickupDT || !dropOffDT || !locationInDT) {
  Swal.fire('Error', 'One or more DateTime fields are invalid or missing.', 'warning');
  return false;
}

  if (pickupDT < locationOutDT) {
    Swal.fire('Error', 'Pickup DateTime cannot be before Location Out DateTime.', 'warning');
    return false;
  }

  if (dropOffDT < pickupDT) {
    Swal.fire('Error', 'Drop-off DateTime cannot be before Pickup DateTime.', 'warning');
    return false;
  }

  if (locationInDT < dropOffDT) {
    Swal.fire('Error', 'Location In DateTime cannot be before Drop-off DateTime.', 'warning');
    return false;
  }

  // KM validations
  const locationOutKM = Number(form.locationOutKMForBilling);
  const pickupKM = Number(form.pickUpKMForBilling);
  const dropOffKM = Number(form.dropOffKMForBilling);
  const locationInKM = Number(form.locationInKMForBilling);

  if (pickupKM < locationOutKM) {
    Swal.fire('Error', 'Pickup KM cannot be less than Location Out KM.', 'warning');
    return false;
  }

  if (dropOffKM < pickupKM) {
    Swal.fire('Error', 'Drop-off KM cannot be less than Pickup KM.', 'warning');
    return false;
  }

  if (locationInKM < dropOffKM) {
    Swal.fire('Error', 'Location In KM cannot be less than Drop-off KM.', 'warning');
    return false;
  }

  return true;
}


}






