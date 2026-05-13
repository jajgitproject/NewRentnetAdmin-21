// @ts-nocheck
import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ClossingOneService } from './clossingOne.service';
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
import { MatAccordion } from '@angular/material/expansion';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentDutyDetailsComponent } from '../currentDutyDetails/currentDutyDetails.component';
import { CurrentDutyDetailsService } from '../currentDutyDetails/currentDutyDetails.service';
import { FormDialogComponent as DutyTollParking } from '../dutyTollParkingEntry/dialogs/form-dialog/form-dialog.component';
import { DutyTollParkingEntryService } from '../dutyTollParkingEntry/dutyTollParkingEntry.service';
import { DutyTollParkingEntry } from '../dutyTollParkingEntry/dutyTollParkingEntry.model';
import { FormDialogDisputeComponent } from '../dispute/dialogs/form-dialog/form-dialog.component';
import { DisputeHistoryComponent } from '../disputeHistory/disputeHistory.component';
import { DisputeService } from '../dispute/dispute.service';
import { Dispute } from '../dispute/dispute.model';
import { DITFormDialogComponent } from '../dutyInterstateTax/dialogs/form-dialog/form-dialog.component';
import { DutyInterstateTaxService } from '../dutyInterstateTax/dutyInterstateTax.service';
import { DutyInterstateTax } from '../dutyInterstateTax/dutyInterstateTax.model';
import { ClosingDataModel, DutySlipMap, ReservationSalesPersonModel } from '../clossingScreen/clossingScreen.model';
import { DutyExpenseService } from '../dutyExpense/dutyExpense.service';
import { DutyGSTPercentageService } from '../dutyGSTPercentage/dutyGSTPercentage.service';
import { DutyStateService } from '../dutyState/dutyState.service';
import { DutyExpenseModel } from '../dutyExpense/dutyExpense.model';
import { DutyGSTPercentage } from '../dutyGSTPercentage/dutyGSTPercentage.model';
import { DutyState } from '../dutyState/dutyState.model';
import Swal from 'sweetalert2';
import { AdditionalKmsDetails } from '../additionalKmsDetails/additionalKmsDetails.model';
import { AdditionalKmsDetailsService } from '../additionalKmsDetails/additionalKmsDetails.service';
import { DiscountDetails } from '../discountDetails/discountDetails.model';
import { DiscountDetailsService } from '../discountDetails/discountDetails.service';
import { DutySACService } from '../dutySAC/dutySAC.service';
import { DutySACModel } from '../dutySAC/dutySAC.model';
import { FormDialogComponent as DutySACFormDialogComponent } from '../dutySAC/dialogs/form-dialog/form-dialog.component';
import { AdditionalDialogComponent } from '../additionalKmsDetails/dialogs/form-dialog/form-dialog.component';
import { DiscountDetailsDialogComponent } from '../discountDetails/dialogs/discountDetails/discountDetails.component';
import { FormDialogComponent as DutyStateFormDialogComponent } from '../dutyState/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as DutyGSTPercentageFormDialogComponent } from '../dutyGSTPercentage/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as DutyExpenseFormDialogComponent } from '../dutyExpense/dialogs/form-dialog/form-dialog.component';
import { ClosingModel } from './clossingOne.model';
import { BillingHistoryComponent } from '../billingHistory/billingHistory.component';
import { SalesPersonService } from '../salesPerson/salesPerson.service';
import { RSPFormDialogComponent } from '../salesPerson/dialogs/form-dialog/form-dialog.component';
import { SpecialInstructionDetails } from '../specialInstructionDetails/specialInstructionDetails.model';
import { SpecialInstructionDetailsService } from '../specialInstructionDetails/specialInstructionDetails.service';
import { SpecialinformationService } from '../special-information/special-information.service';
import { IternallinformationService } from '../internal-information/internal-information.service';
import { LumpsuminformationService } from '../lumpsum-information/lumpsum-information.service';
import { SettledRateClosingService } from '../settledRateClosing/settledRateClosing.service';
import { AdvanceDetailsClosingService } from '../advanceDetailsClosing/advanceDetailsClosing.service';
import { AdvanceDetailsClosing } from '../advanceDetailsClosing/advanceDetailsClosing.model';
import { SettledRateClosing } from '../settledRateClosing/settledRateClosing.model';
import { KAMDetailsClosing } from '../kamDetailsClosing/kamDetailsClosing.model';
import { KAMDetailsClosingService } from '../kamDetailsClosing/kamDetailsClosing.service';
import { AdditionalSMSEmailWhatsappService } from '../additionalSMSEmailWhatsapp/additionalSMSEmailWhatsapp.service';
import { AdditionalSMSDetails } from '../additionalSMSDetails/additionalSMSDetails.model';
import { BillToOtherService } from '../billToOther/billToOther.service';
import { BillToOther } from '../billToOther/billToOther.model';
import { DutyStateCustomer } from '../dutyStateCustomer/dutyStateCustomer.model';
import { DutyStateCustomerFormDialogComponent } from '../dutyStateCustomer/dialogs/form-dialog/form-dialog.component';
import { DutyStateCustomerService } from '../dutyStateCustomer/dutyStateCustomer.service';
import { SingleDutySingleBillForLocalService } from '../SingleDutySingleBillForLocal/SingleDutySingleBillForLocal.service';
import { PackageRateDetailsForClosingService } from '../packageRateDetailsForClosing/packageRateDetailsForClosing.service';
import { FormDialogComponent } from '../MOPDetailsShow/dialogs/mopDetails/mopDetails.component';
import { MOPModel } from '../MOPDetailsShow/mopDetailsShow.model';
import { MOPDetailsService } from '../MOPDetailsShow/mopDetailsShow.service';
import { ControlPanelDialogeService } from '../controlPanelDialoge/controlPanelDialoge.service';
import { ReservationDutyslipSearchComponent } from '../reservationDutyslipSearch/reservationDutyslipSearch.component';
import { Customer } from '../customer/customer.model';
import { DutySlipImageService } from '../dutySlipImage/dutySlipImage.service';
//import { FormDialogComponent } from './dialogs/mopDetails/mopDetails.component';
import { FormDialogComponent as DutySlipImageDialog } from '../dutySlipImage/dialogs/form-dialog/form-dialog.component';
import { DutySlipImage } from '../dutySlipImage/dutySlipImage.model';
import { OdoMeterAndManualDutySlipImageService } from '../odoMeterAndManualDutySlipImage/odoMeterAndManualDutySlipImage.service';
import { OdoMeterAndManualDutySlipImage } from '../odoMeterAndManualDutySlipImage/odoMeterAndManualDutySlipImage.model';
import { FormDialogSRDComponent } from '../settledRateDetails/dialogs/form-dialog/form-dialog.component';
import { SettledRateDetailsService } from '../settledRateDetails/settledRateDetails.service';
import { FormDialogComponent as CDTClosingDialogComponent } from '../changeDutyTypeClosing/dialogs/dialogDetails/dialogDetails.component';
import { FormDialogComponentForCity } from '../changeCity/dialogs/dialogDetails/dialogDetails.component';

@Component({
  standalone: false,
  selector: 'app-clossingOne',
  templateUrl: './clossingOne.component.html',
  styleUrls: ['./clossingOne.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class ClossingOneComponent implements OnInit, AfterViewInit, AfterViewChecked {
  // dataSavedMessage: boolean = false;
  updateData = new Subject<void>();
  AllotmentID: any;
  DutySlipID: any;
  closingDataAdvanceTable: ClosingDataModel | null = null;
  advanceTableMOP: MOPModel | null;
  tollParkingAdvanceTable: DutyTollParkingEntry[] | null;
  showHideTollParkingCard: boolean = false;
  showHideODOMeterCard: boolean = false;

  disputeAdvanceTable: Dispute[] | null = [];
  showHideDispute: boolean = false;

  advanceTableDIT: DutyInterstateTax[] | null = null;
  showHideaddDIT: boolean = false;
  showSAC: boolean = false;
  showAdditionalKms: boolean = false;
  allotmentID: number;
  dutySlipID: number;
  ReservationID: number;
  CustomerID: number;
  PackageID: number;
  PackageTypeID: number;
  DutySlipForBillingID: number;
  RegistrationNumber: string;
  InventoryID: number;
  DropOffDate: Date;
  PickupDate: Date;
  closureStatus: string;
  PickupTime: Date;
  DropOffTime: Date;
  LocationOutDate: Date;
  LocationOutTime: Date;
  PickupAddress: string;
  DropOffAddress: string;
  LocationOutAddress: string;
  CustomerContractID: number;
  PackageType: string;
  CustomerName: string = '';
  TallyCustomerID: number = 0;
  GstData:any = null;
  GstNumber: string = '';
  StateName: string = '';
  billFromTo:string;

  showDutyExpense: boolean = false;
  SearchActivationStatus: boolean = true;
  showHideaddDiscount: boolean = false;
  SearchExpense: string = '';
  PageNumber: number = 0;
  showHideDutyState: boolean = false;
  showDGP: boolean = false;
  advanceTableDE: DutyExpenseModel | null;
  advanceTableDGP: DutyGSTPercentage | null;
  advanceTableDutyState: DutyState | null;
  advanceTableSAC: DutySACModel | null;
  advanceTableAD: AdditionalKmsDetails | null;
  advanceTableDD: DiscountDetails | null;
  advanceTableSI: SpecialInstructionDetails | null;

  advanceTableClosingOne: ClosingModel | null = null;
  dataSource: Dispute[] | null;
  dataSourceforCard: any = null;
  reservationCloseDetail: any = null;
  mapOfDutySlip: string;
  panelExpanded: boolean = false;
  dutySlipMap: DutySlipMap;
  showHideSalesPerson: boolean = false;
  advanceTableSP: ReservationSalesPersonModel | null = null;
  advanceTableAdvanceDC: AdvanceDetailsClosing | null;
  showAdvanceDetails: boolean = false;
  advanceTableSRD: SettledRateClosing | null;
  showSettledRate: boolean = false;
  advanceTableKC: KAMDetailsClosing | null;
  showKamCard: boolean = false;

  advanceTableASEW: AdditionalSMSDetails | null;
  showAdditionalSMS: boolean = false;

  advanceTableBD: BillToOther | null;
  showBillToOther: boolean = false;
  showMOPOther: boolean = false;
  showHidesettledRates: boolean = false;
  showHideDutyStateCustomer: boolean = false;
  advanceTableDutyStateCustomer: DutyStateCustomer | null;
  showMOP: boolean = false;
  invoiceID: any;
  goodForBilling: boolean;
  verifyDuty: boolean;
  templateAddress: any;
  verifyDutyStatusAndCacellationStatus: any;
  goodForBillingStatusAndCancellationStatus:any;

  Message: string;
  DSClosing: any;

  reservationID: number = 0;
  dialogRequestObject: any;
  dutySlipImageAllotmentID: any;
  dutySlipImage: any;
  oDOMAndMDSAdvanceTable: OdoMeterAndManualDutySlipImage;
  allotmentStatus: string;
  dutySlipType: string;
  PickupCityID: number;
  VehicleCategoryID: number;
  VehicleID: number;

  TotalTollParInStDispute: TotalTollParInStDisputeModel | null;
  totalTollParking:number = 0;
  totalInterStateTax:number = 0;
  totalDEChargeableAmount:number;
  totalDENonChargeableAmount:number;
  private viewReady = false;
  private paramsReady = false;
  private initialLoadsStarted = false;
  private debugViewCheckCount = 0;
  private debugLastViewSnapshot = '';
  dataSourceForBillNo: any = null;


  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public clossingOneService: ClossingOneService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public _generalService: GeneralService,
    public currentDutyDetailsService: CurrentDutyDetailsService,
    public dutyTollParkingEntryService: DutyTollParkingEntryService,
    public disputeService: DisputeService,
    public dutyInterstateTaxService: DutyInterstateTaxService,
    public dutyExpenseService: DutyExpenseService,
    public dutyGSTPercentageService: DutyGSTPercentageService,
    public dutyStateService: DutyStateService,
    public dutyStateCustomerService: DutyStateCustomerService,
    public additionalKmsDetailsService: AdditionalKmsDetailsService,
    public dutySACService: DutySACService,
    public discountDetails: DiscountDetailsService,
    public router: Router,
    public salesPersonService: SalesPersonService,
    public specialInstructionDetailsService: SpecialInstructionDetailsService,
    public specialinformationService: SpecialinformationService,
    public iternallinformationService: IternallinformationService,
    public lumpsuminformationService: LumpsuminformationService,
    public advanceDetailsClosingService: AdvanceDetailsClosingService,
    public settledRateClosingService: SettledRateClosingService,
    public kamDetailsClosingService: KAMDetailsClosingService,
    public additionalSMSEmailWhatsappService: AdditionalSMSEmailWhatsappService,
    public billToOtherService: BillToOtherService,
    public singleDutySingleBillForLocalServiceService: SingleDutySingleBillForLocalService,
    public packageRateDetailsForClosingService: PackageRateDetailsForClosingService,
    public mopDetailsService: MOPDetailsService,
    public controlPanelDialogeService: ControlPanelDialogeService,
    public _dutySlipImageService: DutySlipImageService,
    public odoMeterAndManualDutySlipImageService: OdoMeterAndManualDutySlipImageService,
    public settleRateService: SettledRateDetailsService,
   
  ) {

  }
  @ViewChild(ReservationDutyslipSearchComponent) searchModal!: ReservationDutyslipSearchComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.route.queryParams.subscribe(paramsData => {
      const encryptedAllotmentID = paramsData.allotmentID;
      this.AllotmentID = this._generalService.decrypt(decodeURIComponent(encryptedAllotmentID));
      const encryptedDutySlipID = paramsData.dutySlipID;
      this.DutySlipID = this._generalService.decrypt(decodeURIComponent(encryptedDutySlipID));
      const encryptedReservationID = paramsData.reservationID;
      this.ReservationID = Number(this._generalService.decrypt(decodeURIComponent(encryptedReservationID)));
      this.allotmentStatus = this._generalService.decrypt(decodeURIComponent(paramsData.allotmentStatus));
      this.dutySlipType = this._generalService.decrypt(decodeURIComponent(paramsData.dutySlipType));
      // #region agent log
      fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run1',hypothesisId:'H3',location:'clossingOne.component.ts:ngOnInit-queryParams',message:'params decoded before initial loads',data:{allotmentID:this.AllotmentID,dutySlipID:this.DutySlipID,reservationID:this.ReservationID,showMOPOther:this.showMOPOther,totalInterStateTax:this.totalInterStateTax},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      this.paramsReady = true;
      this.startInitialLoadsIfReady();
      
    });
  this.GetClosingData();
   this.BookingDataOnClosing();
   this.GSTDataOnClosing();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.startInitialLoadsIfReady();
  }

  ngAfterViewChecked(): void {
    if (this.debugViewCheckCount >= 12) {
      return;
    }
    const snapshot = JSON.stringify({
      showMOPOther: this.showMOPOther,
      totalInterStateTax: this.totalInterStateTax,
      hasClosingData: !!this.closingDataAdvanceTable,
      hasAdvanceClosing: !!this.advanceTableClosingOne,
      hasMop: !!this.advanceTableMOP,
      disputeLen: Array.isArray(this.disputeAdvanceTable) ? this.disputeAdvanceTable.length : null
    });
    if (snapshot !== this.debugLastViewSnapshot) {
      this.debugLastViewSnapshot = snapshot;
      this.debugViewCheckCount++;
      // #region agent log
      fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run3',hypothesisId:'H8',location:'clossingOne.component.ts:ngAfterViewChecked',message:'view-check snapshot changed',data:{checkCount:this.debugViewCheckCount,showMOPOther:this.showMOPOther,totalInterStateTax:this.totalInterStateTax,hasClosingData:!!this.closingDataAdvanceTable,hasAdvanceClosing:!!this.advanceTableClosingOne,hasMop:!!this.advanceTableMOP,disputeLen:Array.isArray(this.disputeAdvanceTable)?this.disputeAdvanceTable.length:null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }
  }

  private startInitialLoadsIfReady(): void {
    if (!this.viewReady || !this.paramsReady || this.initialLoadsStarted) {
      return;
    }
    this.initialLoadsStarted = true;
    // #region agent log
    fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'post-fix',hypothesisId:'H7',location:'clossingOne.component.ts:startInitialLoadsIfReady',message:'starting initial loads after params+view ready',data:{showMOPOther:this.showMOPOther,totalInterStateTax:this.totalInterStateTax,hasClosing:!!this.advanceTableClosingOne,hasCard:!!this.dataSourceforCard},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    this.GetClosingData();
    this.disputeService.disputeData$.subscribe(data => {
      this.disputeAdvanceTable = data ?? [];
    });

    this.controlPanelDialogeService.getVerifyDutyStatus(this.ReservationID).subscribe(
      data => {
        this.verifyDutyStatusAndCacellationStatus = data.status;
      });
       this.controlPanelDialogeService.getGoodForBillingStatus(this.ReservationID).subscribe(
      data => {
        this.goodForBillingStatusAndCancellationStatus = data.status;
      });

    this.GetTotalTollParInStDispute();
    this.loadDataForCard();
    this.BookingDataOnClosing();
    this.TollParkingLoadData();
    this.DutyInterStateTaxLoadData();
    this.DisputeLoadData();
    this.dutyExpenseLoadData();
    this.DutyGSTPercentageLoadData();
    this.loadDutyStateData();
    this.loadDutyStateDataCustomer();
    this.loadDataforAdditionalKMHR();
    this.salesPersonLoadData();
    this.settledRateLoadData();
    this.MOPLoadData();
    this.loadDataForReservationDiscountClosing();
    this.loadDataForImage();
  }

  onDataSaved() {
    this.GetClosingData();
    this.DisputeLoadData();
  }

  GetClosingData() {
    this.clossingOneService.GetClosingData(this.DutySlipID).subscribe(
      data => {
        this.advanceTableClosingOne = data;
        this.invoiceID = this.advanceTableClosingOne?.invoiceID;
        this.goodForBilling = this.advanceTableClosingOne?.closingDutySlipForBillingModel?.goodForBilling;
        this.verifyDuty = this.advanceTableClosingOne?.closingDutySlipForBillingModel?.verifyDuty;
        this.DSClosing = this.advanceTableClosingOne?.closingDutySlipForBillingModel?.dsClosing;
        this.loadDataForBillNo();
      }
    );
  }

  public BookingDataOnClosing() {
    this.clossingOneService.getClosingData(this.AllotmentID).subscribe
      (
        data => {
          this.closingDataAdvanceTable = data;
          this.allotmentID = this.closingDataAdvanceTable?.allotmentID;
          this.dutySlipID = this.closingDataAdvanceTable?.dutySlipID;
          this.ReservationID = this.closingDataAdvanceTable?.reservationID;
          this.CustomerID = this.closingDataAdvanceTable?.customerID;
          this.PackageID = this.closingDataAdvanceTable?.packageID;
          this.PackageTypeID = this.closingDataAdvanceTable?.packageTypeID;
          this.CustomerContractID = this.closingDataAdvanceTable?.customerContractID;
          this.PackageType = this.closingDataAdvanceTable?.packageType;
          this.DutySlipForBillingID = this.closingDataAdvanceTable?.dutySlipForBillingID;
          this.RegistrationNumber = this.closingDataAdvanceTable?.registrationNumber;
          this.InventoryID = this.closingDataAdvanceTable?.inventoryID;
          this.DropOffDate = this.closingDataAdvanceTable?.dropOffDate;
          this.PickupDate = this.closingDataAdvanceTable?.pickupDate;
          this.closureStatus = this.closingDataAdvanceTable?.closureStatus;
          this.PickupTime = this.closingDataAdvanceTable?.pickupTime;
          this.DropOffTime = this.closingDataAdvanceTable?.dropOffTime;
          this.LocationOutDate = this.closingDataAdvanceTable?.locationOutDate;
          this.LocationOutTime = this.closingDataAdvanceTable?.locationOutTime;
          this.PickupAddress = this.closingDataAdvanceTable?.pickupAddress;
          this.DropOffAddress = this.closingDataAdvanceTable?.dropOffAddress;
          this.LocationOutAddress = this.closingDataAdvanceTable?.locationOutAddress;
          this.CustomerName = this.closingDataAdvanceTable?.customerName || '';
          this.TallyCustomerID = this.closingDataAdvanceTable?.tallyCustomerID || 0;
          this.PickupCityID = this.closingDataAdvanceTable?.pickupCityID;
          this.VehicleCategoryID = this.closingDataAdvanceTable?.vehicleCategoryID;
          this.VehicleID = this.closingDataAdvanceTable?.vehicleID;
         
          this.advanceDetailsLoadData();
          this.kamCardLoadData();
          // this.loadDataforAdditionalKMHR();
          this.DutySACLoadData();
          this.salesPersonLoadData();
          this.GetBillFromTo();
          // #region agent log
          fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run1',hypothesisId:'H3',location:'clossingOne.component.ts:BookingDataOnClosing-subscribe',message:'booking data assigned to bound fields',data:{customerName:this.CustomerName,tallyCustomerID:this.TallyCustomerID,reservationID:this.ReservationID,hasClosingData:!!this.closingDataAdvanceTable},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
        },
        (error: HttpErrorResponse) => { this.closingDataAdvanceTable = null; }
      );
  }

  public GetBillFromTo() {
    this.clossingOneService.GetBillFromTo(this.CustomerContractID, this.PackageID,this.PackageType).subscribe
      (
        data => {
          this.billFromTo = data.billFromTo || null;
         
        },
        (error: HttpErrorResponse) => { 
          this.billFromTo = null;
          
        }
      );
  }
   public GSTDataOnClosing() {
    this.clossingOneService.getClosingGSTData(this.ReservationID).subscribe
      (
        data => {
          this.GstData = data || null;
          console.log('GST Data:', this.GstData);
          this.GstNumber = this.GstData?.gstNumber || '';
          this.StateName = this.GstData?.stateName || '';
        },
        (error: HttpErrorResponse) => { 
          this.GstData = null;
          this.GstNumber = '';
          this.StateName = '';
        }
      );
  }

  //---------- Start Toll Parking ----------
  openDutyTollParkingEntry() {
    const dialogRef = this.dialog.open(DutyTollParking,
      {
        data:
        {
          action: 'add',
          dutySlipID: this.DutySlipID,
          goodForBillingStatusAndCancellationStatus: this.goodForBillingStatusAndCancellationStatus,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.TollParkingLoadData();
      window.location.reload();
    });
  }

  public TollParkingLoadData() {
    this.dutyTollParkingEntryService.GetTollParkingInfo(this.DutySlipID).subscribe
      (
        (data: DutyTollParkingEntry[]) => {
          if (data != null) {
            this.showHideTollParkingCard = true;
          }
          this.tollParkingAdvanceTable = data;
        },
        (error: HttpErrorResponse) => { this.tollParkingAdvanceTable = null; }
      );
  }
  //---------- End Toll Parking ----------

  //---------- Start Dispute ----------
  openDisputes() {
    const dialogRef = this.dialog.open(FormDialogDisputeComponent,
      {
        data:
        {
          action: 'add',
          dutySlipID: this.DutySlipID,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === true) {
        this.DisputeLoadData();
        window.location.reload();
      }
    });
  }

  public DisputeLoadData() {
    this.disputeService.getDisputeInfo(this.DutySlipID).subscribe
      (
        (data: Dispute[]) => {
          if (data != null) {
            this.showHideDispute = true;
          }
          this.disputeAdvanceTable = data ?? [];
        },
        (error: HttpErrorResponse) => { this.disputeAdvanceTable = []; }
      );
  }

  disputeHistoryDetails() {
    this.dialog.open(DisputeHistoryComponent, {
      width: '500px',
      data: {
        dutySlipID: this.DutySlipID
      }
    });
  }
  //---------- End Dispute ----------

  //---------- Start Interstate Tax ----------
  dutyInterstateTax() {
    const dialogRef = this.dialog.open(DITFormDialogComponent,
      {
        data:
        {
          action: 'add',
          dutySlipID: this.DutySlipID,
          reservationID: this.ReservationID,
          registrationNumber: this.RegistrationNumber,
          pickupDate: this.PickupDate,
          dropOffDate: this.DropOffDate,
          goodForBillingStatusAndCancellationStatus: this.goodForBillingStatusAndCancellationStatus,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.DutyInterStateTaxLoadData();
      window.location.reload();
    })
  }

  public DutyInterStateTaxLoadData() {
    this.dutyInterstateTaxService.getDutyInterstateTaxEntryDetails(this.DutySlipID).subscribe
      (
        data => {
          if (data != null) {
            this.showHideaddDIT = true;
          }
          this.advanceTableDIT = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableDIT = null; }
      );
  }
  //---------- End Interstate Tax ----------

  //---------- Start Duty Expense ----------
  openDutyExpense() {
    const dialogRef = this.dialog.open(DutyExpenseFormDialogComponent,
      {
        data:
        {
          dutySlipID: this.DutySlipID,
          record: this.advanceTableDE,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.dutyExpenseLoadData();
      window.location.reload();
    });
  }

  public dutyExpenseLoadData() {
    this.dutyExpenseService.getTableDataClosing(this.DutySlipID, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data => {
          if (data != null) {
            this.showDutyExpense = true;
          }
          this.advanceTableDE = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableDE = null; }
      );
  }
  //---------- End Duty Expense ----------

  //---------- Start Duty GST Percentage ----------
  openDutyGSTPercentage() {
    const dialogRef = this.dialog.open(DutyGSTPercentageFormDialogComponent,
      {
        data:
        {
          dutySlipID: this.DutySlipID,
          record: this.advanceTableDGP,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.DutyGSTPercentageLoadData();
      window.location.reload();
    });
  }
  DutyGSTPercentageLoadData() {
    this.dutyGSTPercentageService.getTableDataClosing(this.DutySlipID).subscribe
      (
        data => {
          if (data !== null) {
            this.showDGP = true;
          }
          this.advanceTableDGP = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableDGP = null; }
      );
  }
  //---------- End Duty GST Percentage ----------

  //---------- Start Duty State ----------
  openDutyState() {
    const dialogRef = this.dialog.open(DutyStateFormDialogComponent,
      {
        data:
        {
          dutySlipID: this.DutySlipID,
          record: this.advanceTableDutyState,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus,
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      // this.loadDutyStateData();
      window.location.reload();
    });
  }
  loadDutyStateData() {
    this.dutyStateService.getTableDataClosing(this.DutySlipID).subscribe
      (
        data => {
          if (data !== null) {
            this.showHideDutyState = true;
          }
          this.advanceTableDutyState = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableDutyState = null; }
      );
  }
  //---------- End Duty State ----------

  //======= Duty State Customer=======//
  openDutyStateCustomer() {
    const dialogRef = this.dialog.open(DutyStateCustomerFormDialogComponent,
      {
        data:
        {
          dutySlipID: this.DutySlipID,
          record: this.advanceTableDutyStateCustomer,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus,
          CustomerID: this.CustomerID
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadDutyStateDataCustomer();
      window.location.reload();
    });
  }

  loadDutyStateDataCustomer() {
    this.dutyStateCustomerService.getTableDataCustomerClosing(this.DutySlipID).subscribe
      (
        data => {
          if (data !== null) {
            this.showHideDutyStateCustomer = true;
          }
          this.advanceTableDutyStateCustomer = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableDutyStateCustomer = null; }
      );
  }

  ///end Duty State Customer=======//

  //---------- Start Add Discount ----------
  addDiscount() {
    const dialogRef = this.dialog.open(DiscountDetailsDialogComponent,
      {
        data:
        {
          // advanceTable: this.advanceTable,
          // action: 'add'
          allotmentID: this.AllotmentID,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadDataForReservationDiscountClosing();
      window.location.reload();
    })
  }

  public loadDataForReservationDiscountClosing() {
    const allotmentID = this.AllotmentID;
    this.discountDetails.getTableDataforReservationDiscountClosing(allotmentID).subscribe
      (
        (data: DiscountDetails) => {
          if (data !== null) {
            this.showHideaddDiscount = true;
          }
          this.advanceTableDD = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableDD = null; }
      );
  }
  //---------- End Add Discount ----------

  //---------- Start Additional KM & HRs ----------
  openAdditional() {
    const dialogRef = this.dialog.open(AdditionalDialogComponent,
      {
        data:
        {
          dutySlipID: this.DutySlipID,
          //action: 'edit',
          record: this.advanceTableAD,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === true) {
        this.loadDataforAdditionalKMHR();
        window.location.reload();
      }
    });
  }

  public loadDataforAdditionalKMHR() {
    this.showAdditionalKms = false;
    this.additionalKmsDetailsService.getAdditionalKmsDetails(this.DutySlipID).subscribe(
      data => {
        if (data !== null && data.length > 0) {
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

  //---------- Start Duty SAC ----------
  openDutySAC() {
    // #region agent log
   // fetch('http://127.0.0.1:7532/ingest/f2c32722-bd0e-4386-883a-e749a4372080', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'b9234c' }, body: JSON.stringify({ sessionId: 'b9234c', runId: 'pre-fix', hypothesisId: 'H8', location: 'NewRententAdmin-ng21/clossingOne.component.ts:openDutySAC:start', message: 'Duty SAC open invoked', data: { source, isArray: Array.isArray(this.advanceTableSAC), length: Array.isArray(this.advanceTableSAC) ? this.advanceTableSAC.length : null }, timestamp: Date.now() }) }).catch(() => { });
    // #endregion
    const dialogRef = this.dialog.open(DutySACFormDialogComponent,
      {
        data:
        {
          dutySlipID: this.DutySlipID,
          record: this.advanceTableSAC,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.DutySACLoadData();
      window.location.reload();
    });
  }

  //======= Duty SAC =======//

  DutySACLoadData() {
    this.dutySACService.getTableData(this.DutySlipID).subscribe
      (
        data => {
          if (data !== null) {
            this.showSAC = true;
          }
          this.advanceTableSAC = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableSAC = null; }
      );
  }
  //---------- End Duty SAC ----------
  //---------- Billing History ----------
  openBillingHistory() {
    const dialogRef = this.dialog.open(BillingHistoryComponent,
      {
        height: '65%',
        width: '50%',
        data:
        {
          dutySlipID: this.DutySlipID
        }
      });
  }
  //-------------LTR Details---------------

  public LoadLTR() {
    this.clossingOneService.PackageTypeForLTR(this.PackageTypeID).subscribe
      (
        (data: any) => {
          var packageTypeID = data.packageTypeID;
          var packageType = data.packageType;
          if (packageType === 'Long Term Rental') {
            if (packageType === 'Long Term Rental') {
              let baseUrl = this._generalService.FormURL;
              const url = this.router.serializeUrl(
                this.router.createUrlTree(['/dutySlipLTRStatement'], {
                  queryParams: {
                    dutySlipID: this.DutySlipID,
                    reservationID: this.ReservationID,
                    customerID: this.CustomerID,
                    pickupDate: this.PickupDate,
                    packageID: this.PackageID
                  }
                })
              );

              window.open(baseUrl + url, '_blank'); // Open URL in a new tab
            }
          }
          else {
            Swal.fire({
              title:
                'This page open only for Long Term Rental.',
              icon: 'warning',
            }).then((result) => {
              if (result.value) {

              }
            });
          }
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
  //-------------View Bill-------------------------

  ViewBill(templateAddress) {
    let baseUrl = this._generalService.FormURL;

    // Use templateAddress directly as the route
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/${templateAddress}`], {
        queryParams: {
          invoiceID: this.invoiceID
        }
      })
    );

    window.open(baseUrl + url, '_blank');
  }


  //  ViewBill(invoiceType)
  // {
  //   
  //   let baseUrl = this._generalService.FormURL;
  //   if(invoiceType === 'InvoiceMultyDuty')
  //   {
  //     const url = this.router.serializeUrl(this.router.createUrlTree(['/invoiceMutiDuties'], { queryParams: {
  //     invoiceID:this.invoiceID,
  //     dutySlipID:this.DutySlipID,
  //      reservationID:this.ReservationID,
  //      vehicleName:this.closingDataAdvanceTable.vehicle
  //   } }));
  //   window.open(baseUrl + url, '_blank');

  //   }
  //   else if(invoiceType === 'InvoiceSingleDuty')
  //  {
  //    const url = this.router.serializeUrl(this.router.createUrlTree(['/SingleDutySingleBillForLocal'], { queryParams: {
  //      invoiceID:this.invoiceID,
  //     dutySlipID:this.DutySlipID,
  //      reservationID:this.ReservationID,
  //      vehicleName:this.closingDataAdvanceTable.vehicle
  //     } }));
  //     window.open(baseUrl + url, '_blank');

  // } 
  // if(this.invoiceType === 'InvoiceGeneral')
  //   {
  //     const url = this.router.serializeUrl(this.router.createUrlTree(['/generalBillDetails'], { queryParams: {
  //     invoiceID:this.invoiceID,
  //     dutySlipID:this.DutySlipID,
  //      reservationID:this.ReservationID,
  //      vehicleName:this.closingDataAdvanceTable.vehicle
  //   } }));
  //   window.open(baseUrl + url, '_blank');

  //   }   
  // }
  //----------Generate Bill----------------
  public GenerateBill() {
    this.clossingOneService.generateBill(this.DutySlipID)
      .subscribe(
        response => {
          this.invoiceID = response.invoiceID;
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
          //this.ViewBill();
          this.getInvoiceType()
        },
        error => {
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
  public getInvoiceType() {
    this.controlPanelDialogeService.getInvoiceType(this.invoiceID).subscribe
      (
        data => {
          this.templateAddress = data.templateAddress;
          if (this.templateAddress !== null) {
            this.ViewBill(this.templateAddress);
          }
        },
        (error: HttpErrorResponse) => { this.dataSourceforCard = null; }
      );
  }

  public loadDataForCard() {
    this.packageRateDetailsForClosingService.getPackageRateDetailsForClosingData(this.DutySlipID, this.ReservationID).subscribe
      (
        data => {
          this.dataSourceforCard = data;
        },
        (error: HttpErrorResponse) => { this.dataSourceforCard = null; }
      );
  }
  //---------- Start Sales Person ----------

  addSalesPerson() {
    const dialogRef = this.dialog.open(RSPFormDialogComponent, {
      data: {
        advanceTable: this.advanceTableSP,
        action: 'add',
        reservationID: this.ReservationID
      }
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.salesPersonLoadData(); // ✅ This will reload the updated list
        // this.dataSavedMessage = true;
        this.updateData.next();
        window.location.reload();
      }
    });
  }

  public salesPersonLoadData() {
    this.salesPersonService.getSalesPerson(this.ReservationID, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        (data) => {
          this.advanceTableSP = data;
        },
        (error) => {
        }
      );

  }

  public loadDataClosingSalesPerson() {
    this.salesPersonService.getTableDataforClosing(this.DutySlipID).subscribe
      (
        (data: ReservationSalesPersonModel) => {
          if (data !== null) {
            this.showHideSalesPerson = true;
          }
          this.advanceTableSP = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableSP = null; }
      );

  }
  //---------- End Sales Person ----------

  //------------Notification show -----------
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  //---------Calculate Bill------------------------
  public CalculateBill() {
    if (this.advanceTableClosingOne.closingDutySlipForBillingModel.verifyDuty === null && this.advanceTableClosingOne.closingDutySlipForBillingModel.goodForBilling === null) {
      Swal.fire({
        title:
          'Please checked verify duty and good for billing before calculate.',
        icon: 'warning',
      }).then((result) => {
        if (result.value) {

        }
      });

    }
    else {
      this.clossingOneService.calculateBill(this.DutySlipID)
        .subscribe(
          response => {
            this.loadDataForCard();
            this.showNotification(
              'snackbar-success',
              'Updated...!!!',
              'bottom',
              'center'
            );
          },
          // error =>
          // {      
          //   this.showNotification(
          //     'snackbar-danger',
          //     'Operation Failed.....!!!',
          //     'bottom',
          //     'center'
          //   ); 
          // }
          error => {
            const errorMessage = error || 'Operation Failed.....!!!';
            Swal.fire({
              title: errorMessage,
              icon: 'error'
            });
          }
        )
    }

  }
  //----------------Show Map----------------
  GetDutySlipMap() {
    this.clossingOneService.getDutySlipMap(this.DutySlipID).subscribe(
      data => {

        this.dutySlipMap = data;
        this.mapOfDutySlip = this.dutySlipMap.dutySlipMap;
      }
    )
  }
  showMap() {
    window.open(this.mapOfDutySlip, '_blank');
  }
  //----------Close Panels-----------------
  closePanels() {
    this.panelExpanded = false;
  }
  submit() { }

  //======= Advance Details =======//
  advanceDetailsLoadData() {
    this.advanceDetailsClosingService.getTableData(this.ReservationID, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        (data: AdvanceDetailsClosing) => {
          if (data !== null) {
            this.showAdvanceDetails = true;
          }
          this.advanceTableAdvanceDC = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableAdvanceDC = null; }
      );
  }
  //======= Settled Rate To Other =======//
  settledRateLoadData() {
    this.settledRateClosingService.GetClosingSettledRate(this.DutySlipID, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        (data: SettledRateClosing) => {
          if (data !== null) {
            this.showSettledRate = true;
          }
          this.advanceTableSRD = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableSRD = null; }
      );
  }
  //======= Kam Card =======//
  kamCardLoadData() {
    this.kamDetailsClosingService.getTableData(this.ReservationID, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        (data: KAMDetailsClosing) => {
          if (data !== null) {
            this.showKamCard = true;
          }
          this.advanceTableKC = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableKC = null; }
      );
  }

  //---------- Start Additional SMS/Email/WhatsApp Details ----------
  AdditionalSMSEmailWhatsAppDetailsLoadData() {
    this.additionalSMSEmailWhatsappService.GetAdditionalSMSEmailMessagingData(this.DutySlipID).subscribe
      (
        (data: AdditionalSMSDetails) => {
          if (data !== null) {
            this.showAdditionalSMS = true;
          }
          this.advanceTableASEW = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableASEW = null; }
      );
  }
  //---------- End Additional SMS/Email/WhatsApp Details ----------

  //---------- Start Bill To Other Details ----------
  BillToOtherLoadData() {
    this.billToOtherService.GetAdditionalSMSEmailMessagingData(this.DutySlipID).subscribe
      (
        (data: BillToOther) => {
          if (data !== null) {
            this.showBillToOther = true;
          }
          this.advanceTableBD = data;
        },
        (error: HttpErrorResponse) => { this.advanceTableBD = null; }
      );
  }
  //---------- End Bill To Other Details ----------

  //---------UP and Down Key Work------------------  
  scrollToLinkButton() {
    const element = document.getElementById('linkButtonSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  //-----TollParking
  showAndScrollTollParking() {
    this.showHideTollParkingCard = true;
    setTimeout(() => {
      const element = document.getElementById('tollParkingEntry');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
  //-----ODO Meter
  showAndScrollODOMeter() {
    this.showHideODOMeterCard = true;
    setTimeout(() => {
      const element = document.getElementById('OdoMeterImage');
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

  //------DutyState customer
  showAndScrollDutyStateCustomer() {
    this.showHideDutyStateCustomer = true;
    setTimeout(() => {
      const element = document.getElementById('dutyStateCustomer');
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

  //------Mop
  showAndScrollMOP() {
    this.showMOP = true;
    setTimeout(() => {
      const element = document.getElementById('openMop');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }
  //------Add Discount
  showAndScrollAddDiscount() {
    this.showHideaddDiscount = true;
    setTimeout(() => {
      const element = document.getElementById('addDiscount');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  //------Sales Person
  showAndScrollSalesPerson() {
    this.showHideSalesPerson = true;
    setTimeout(() => {
      const element = document.getElementById('salesPerson');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  MOPDetails() {
    const dialogRef = this.dialog.open(FormDialogComponent,
      {
        data:
        {
          advanceTable: this.advanceTableMOP,
          reservationID: this.ReservationID,
          action: 'edit',
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.MOPLoadData();
      window.location.reload();
    })
  }

  public MOPLoadData() {
    this.mopDetailsService.getModeOfPaymentDetails(this.ReservationID).subscribe
      (
        //  data=>   
        //  {
        //    this.advanceTableMOP = data;
        //  }, 
        (data: MOPModel) => {
          // #region agent log
          fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run1',hypothesisId:'H1',location:'clossingOne.component.ts:MOPLoadData-before-toggle',message:'mode of payment response received',data:{isNull:data===null,showMOPOtherBefore:this.showMOPOther},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
          if (data !== null) {
            this.showMOPOther = true;
          }
          this.advanceTableMOP = data;
          // #region agent log
          fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run1',hypothesisId:'H1',location:'clossingOne.component.ts:MOPLoadData-after-toggle',message:'mode of payment state updated',data:{showMOPOtherAfter:this.showMOPOther,hasMop:!!this.advanceTableMOP},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
        },
        (error: HttpErrorResponse) => { this.advanceTableMOP = null; }
      );
  }

  onDutyStatusChanged(event: { verifyDuty: boolean, goodForBilling: boolean, message: string }) {
    // #region agent log
    fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run2',hypothesisId:'H6',location:'clossingOne.component.ts:onDutyStatusChanged-before',message:'parent received duty status change',data:{verifyDuty:this.verifyDuty,goodForBilling:this.goodForBilling,message:this.Message,incoming:event},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    this.verifyDuty = event.verifyDuty;
    this.goodForBilling = event.goodForBilling;
    this.Message = event.message;
     this.GSTDataOnClosing();
    // #region agent log
    fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run2',hypothesisId:'H6',location:'clossingOne.component.ts:onDutyStatusChanged-after',message:'parent updated duty status and triggered GST refresh',data:{verifyDuty:this.verifyDuty,goodForBilling:this.goodForBilling,message:this.Message},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }

  openSearchModal() {
    this.searchModal.openModal();
  }

  openDutySlipImage() {
    this._dutySlipImageService.getAllotmentIDForDutySlipImage(this.allotmentID).subscribe(
      data => {
        this.dutySlipImageAllotmentID = data;
        if (this.dutySlipImageAllotmentID.dutySlipImage === null) {
          this.dialogRequestObject = {
            action: 'add',
            dutySlipID: this.dutySlipID,
            reservationID: this.ReservationID,
            allotmentID: this.allotmentID,
            verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
          };
        }
        if (this.dutySlipImageAllotmentID.dutySlipImage !== null) {
          this.dialogRequestObject = {
            action: 'edit',
            dutySlipID: this.dutySlipID,
            reservationID: this.ReservationID,
            allotmentID: this.allotmentID,
            verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
          };
        }
        let dialogRef = this.dialog.open(DutySlipImageDialog, {
          data: this.dialogRequestObject
        });
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result !== undefined || result !== null) {
            this.dutySlipImage = result.dutySlipImage;
            this.loadDataForImage();
            window.location.reload();
          }

        });
      });

  }
  public loadDataForImage() {
    this.odoMeterAndManualDutySlipImageService.getAllotmentIDForDutySlipImage(this.AllotmentID).subscribe
      (
        (data: OdoMeterAndManualDutySlipImage) => {
          if (data.tripEndODOMeterImage !== null || data.tripStartODOMeterImage !== null || data.dutySlipImage !== null) {
            this.showHideODOMeterCard = true;
          }
          this.oDOMAndMDSAdvanceTable = data;
        },
        (error: HttpErrorResponse) => { this.oDOMAndMDSAdvanceTable = null; }
      );
  }
  PrintDS() {
    let baseUrl = this._generalService.FormURL;
    if (this.allotmentStatus === 'Alloted') {
      const dutySlipType = (this?.dutySlipType || '').toString().trim();
      let url = '';
      if (dutySlipType === 'GeneralDutySlipWithMap') {
        url = this.router.serializeUrl(this.router.createUrlTree(['/printdutyslip'],
          { queryParams: { dutySlipID: this.dutySlipID, reservationID: this.ReservationID } }));
      }
      else if (dutySlipType === 'GeneralDutySlipWithoutMap') {
        url = this.router.serializeUrl(this.router.createUrlTree(['/PrintDutySlipWithoutMap'],
          { queryParams: { dutySlipID: this.dutySlipID, reservationID: this.ReservationID } }));
      }
      else {
        // Fallback: backend sometimes sends null dutySlipType; default to without-map format.
        url = this.router.serializeUrl(this.router.createUrlTree(['/PrintDutySlipWithoutMap'],
          { queryParams: { dutySlipID: this.dutySlipID, reservationID: this.ReservationID } }));
      }
      window.open(baseUrl + url, '_blank');
    }
    else {
      Swal.fire({
        title: '',
        icon: 'warning',
        html: `<b>Allotment Required.</b>`
      });
      return;
    }
  }

  //---------- Settled Rate ----------
   
   settledRates()
   {
    this.settleRateService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      (dataSRD :SettledRateDetails)=>   
      {
        if(dataSRD !== null)
        {
          this.advanceTableSRD = dataSRD;
          const dialogRef = this.dialog.open(FormDialogSRDComponent, 
          {
            data: 
            {
              reservationID:this.ReservationID,
              advanceTable:this.advanceTableSRD[0],
              action: 'edit',
              status: this.verifyDutyStatusAndCacellationStatus
            }
          });
          dialogRef.afterClosed().subscribe((res: any) => {
            this.settledRateLoadData();
            //this.ngOnInit();
            window.location.reload();
          })
        }
        else
        {
          const dialogRef = this.dialog.open(FormDialogSRDComponent, 
          {
            data: 
            {
              reservationID:this.ReservationID,
              action: 'add',
              status: this.verifyDutyStatusAndCacellationStatus
            }
          });
          dialogRef.afterClosed().subscribe((res: any) => {
            this.settledRateLoadData();
            //this.ngOnInit();
            window.location.reload();
          })
        }
      }
    );  
  }
  
  settledRateLoadData() 
  {
    this.settleRateService.getTableData(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      (data :SettledRateDetails)=>   
      {
        if(data !== null)
        {
          this.showHidesettledRates = true;
        }
        this.advanceTableSRD = data;
      },
     (error: HttpErrorResponse) => { this.advanceTableSRD = null;}
    );
  }
  //------settledRates
showAndScrollOpenSettledRates() {
  this.showHidesettledRates = true;
  setTimeout(() => {
    const element = document.getElementById('settledRates');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 0);
}

 changeDutyTypeClosingDetails() {
    const dialogRef = this.dialog.open(CDTClosingDialogComponent,
      {
        data:
        {
          pickupDate: this.PickupDate,
          reservationID: this.ReservationID,
          customerID: this.CustomerID,
          pickupCityID: this.PickupCityID,
          vehicleID: this.VehicleID,
          vehicleCategoryID: this.VehicleCategoryID,
          verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      window.location.reload();
    })
  }

  GetTotalTollParInStDispute() 
  {
    this.clossingOneService.GetTotalTollParInStDispute(this.DutySlipID).subscribe(
      data => {
        this.TotalTollParInStDispute = data;
        this.totalTollParking = this.TotalTollParInStDispute?.totalTollParking || 0;
        this.totalInterStateTax = this.TotalTollParInStDispute?.totalInterStateTax || 0;
        this.totalDEChargeableAmount = this.TotalTollParInStDispute?.totalDutyExpenseModel?.totalDEChargeableAmount;
        this.totalDENonChargeableAmount = this.TotalTollParInStDispute?.totalDutyExpenseModel?.totalDENonChargeableAmount;
        // #region agent log
        fetch('http://127.0.0.1:7830/ingest/e71207c4-423e-4a42-a900-5bc43349cfbe',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2871b3'},body:JSON.stringify({sessionId:'2871b3',runId:'run1',hypothesisId:'H2',location:'clossingOne.component.ts:GetTotalTollParInStDispute',message:'totals updated from API',data:{totalTollParking:this.totalTollParking,totalInterStateTax:this.totalInterStateTax},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
      }
    );
  }
  public loadDataForBillNo() 
  {
     this.clossingOneService.printDutySlipInfo(this.invoiceID).subscribe
   (
     data =>   
     {
       this.dataSourceForBillNo = data;
       console.log(this.dataSourceForBillNo);
     },
     (error: HttpErrorResponse) => { this.dataSourceForBillNo = null;}
   );
 }

 //---------- Change City ----------
  ChangeCity() 
  {
    const dialogRef = this.dialog.open(FormDialogComponentForCity,
    {
      data:
      {
        action:'edit',
        reservationID: this.ReservationID,
        pickupDate: this.PickupDate,          
        packageTypeID:this.PackageTypeID,
        customerID: this.CustomerID,
        verifyDutyStatusAndCacellationStatus: this.verifyDutyStatusAndCacellationStatus
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      window.location.reload();
    })
  }

}




