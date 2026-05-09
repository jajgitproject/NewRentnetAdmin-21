// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, NgZone, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../general/general.service';
import { ControlPanelData, ControlPanelHeaderData, ControlPanelHeaderDetails, Filters, PassengerModel } from '../controlPanelDesign/controlPanelDesign.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DutySlipQualityCheckService } from '../dutySlipQualityCheck/dutySlipQualityCheck.service';
import { DutySlipImageService } from '../dutySlipImage/dutySlipImage.service';
import { ControlPanelDesignService } from '../controlPanelDesign/controlPanelDesign.service';
import { DutySlipQualityCheckedByExecutiveService } from '../dutySlipQualityCheckedByExecutive/dutySlipQualityCheckedByExecutive.service';
import { DispatchByExecutiveService } from '../dispatchByExecutive/dispatchByExecutive.service';
import { DriverRemarkService } from '../driverRemark/driverRemark.service';
import { NextDayInstructionService } from '../nextDayInstruction/nextDayInstruction.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResolutionService } from '../resolution/resolution.service';
import { ReservationDetailsService } from '../reservationDetails/reservationDetails.service';
import { FeedBackAttachmentService } from '../feedBackAttachment/feedBackAttachment.service';
import { LifeCycleStatusService } from '../lifeCycleStatus/lifeCycleStatus.service';
import { ReservationLocationTransferLogService } from '../reservationLocationTransferLog/reservationLocationTransferLog.service';
import { IncidenceService } from '../incidence/incidence.service';
import { InterstateTaxEntryService } from '../interstateTaxEntry/interstateTaxEntry.service';
import { DutyPostPickUPCallService } from '../dutyPostPickUPCall/dutyPostPickUPCall.service';
import { PassToSupplierService } from '../passToSupplier/passToSupplier.service';
import { AppDataMissingStatusService } from '../appDataMissingStatus/appDataMissingStatus.service';
import { PassengerDetailsService } from '../passengerDetails/passengerDetails.service';
import { ClossingOneService } from '../clossingOne/clossingOne.service';
import { SpecialInstructionInfoComponent } from '../SpecialInstructionInfo/SpecialInstructionInfo.component';
import moment from 'moment';
import { DutyPostPickUPCallModel } from '../dutyPostPickUPCall/dutyPostPickUPCall.model';
import { Observable, Subject } from 'rxjs';
import { ReservationDetails } from '../reservationDetails/reservationDetails.model';
import { PassengerDetails } from '../passengerDetails/passengerDetails.model';
import { ReservationLocationTransferLogModel } from '../reservationLocationTransferLog/reservationLocationTransferLog.model';
import { PassToSupplierModel } from '../passToSupplier/passToSupplier.model';
import { InterstateTaxEntry } from '../interstateTaxEntry/interstateTaxEntry.model';
import { AppDataMissingStatusModel } from '../appDataMissingStatus/appDataMissingStatus.model';
import { DriverOfficialIdentityNumberDD } from '../general/driverOfficialIdentityNumberDD.model';
import { DisputeTypeDropDown } from '../dispute/disputeTypeDropDown.model';
import { DriverInventoryAssociationDropDown } from '../driverInventoryAssociation/driverInventoryAssociationDropDown';
import { SupplierDropDown } from '../organizationalEntity/supplierDropDown.model';
import { FormDialogComponent as PickupTimeFormDialogComponent } from '../reservation/dialogs/form-dialog/form-dialog.component';
import { SoftToHardDialogComponent } from '../cancelAllotment/dialogs/softToHard-Dialog/softToHard-Dialog.component';
import { VehicleInfoComponent } from '../VehicleInfo/VehicleInfo.component';
import { VehicleCategoryInfoComponent } from '../VehicleCategoryInfo/VehicleCategoryInfo.component';
import { BookerInfoComponent } from '../BookerInfo/BookerInfo.component';
import { FormDialogSendEmsComponent } from '../sendEmsAndEmail/dialogs/form-dialog/form-dialog.component';
import { PackageInfoComponent } from '../PackageInfo/PackageInfo.component';
import { FormDialogComponent as PassToSupplierFormDialogComponent } from '../passToSupplier/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as MessagingDialog } from '../reservationMessaging/dialogs/form-dialog/form-dialog.component';
import { MTSFormDialogComponent } from '../mailSupplier/dialogs/form-dialog/form-dialog.component';
import { PassengerInfoComponent } from '../PassengerInfo/PassengerInfo.component';
import { TimeAndAddressInfoComponent } from '../TimeAndAddressInfo/TimeAndAddressInfo.component';
import { StopOnMapInfoComponent } from '../StopOnMapInfo/StopOnMapInfo.component';
import { StopDetailsInfoComponent } from '../StopDetailsInfo/StopDetailsInfo.component';
import { LocationDetailsComponent } from '../locationDetails/locationDetails.component';
import { AllotmentStatusDetailsComponent } from '../AllotmentStatusDetails/AllotmentStatusDetails.component';
import { FormDialogComponent as InterstateTaxFormDialogComponent } from '../interstateTaxEntry/dialogs/form-dialog/form-dialog.component';
import { ReservationLocationTransferLogComponent } from '../reservationLocationTransferLog/reservationLocationTransferLog.component';
import { FormDialogComponent as FormDialogComponentTransferLocation } from '../reservationLocationTransferLog/dialogs/form-dialog/form-dialog.component';
import { VendorDetailsComponent } from '../vendorDetails/vendorDetails.component';
import { DutySlipQualityCheckDetailsComponent } from '../DutySlipQualityCheckDetails/DutySlipQualityCheckDetails.component';
import Swal from 'sweetalert2';
import { FormDialogComponent as SendSMSFormDialogComponent } from '../sendSMS/dialogs/form-dialog/form-dialog.component';
import { PrintDutySlipComponent } from '../PrintDutySlip/PrintDutySlip.component';
import { LifeCycleStatusComponent } from '../lifeCycleStatus/lifeCycleStatus.component';
import { NoDataDialogComponent } from '../no-data-dialog/no-data-dialog.component';
import { FormDialogComponent as DutySlipQualityCheckFormDialogComponent } from '../dutySlipQualityCheck/dialogs/form-dialog/form-dialog.component';
import { DutySlipQualityCheckedByExecutiveDetailsComponent } from '../DutySlipQualityCheckedByExecutiveDetails/DutySlipQualityCheckedByExecutiveDetails.component';
import { FormDialogGIComponent } from '../garageIn/dialogs/form-dialog/form-dialog.component';
import { FormDialogDBEComponent } from '../dispatchByExecutive/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponent as FormDialogComponentDutyTracking } from '../dutyTracking/dialogs/form-dialog/form-dialog.component';
import { GarageOutDetailsComponent } from '../GarageOutDetails/GarageOutDetails.component';
import { DutyTrackingComponent } from '../dutyTracking/dutyTracking.component';
import { ReachedByExecutiveDetailsComponent } from '../ReachedByExecutiveDetails/ReachedByExecutiveDetails.component';
import { FormDialogComponent as ReachedByExecutiveFormDialogComponent } from '../reachedByExecutive/dialogs/form-dialog/form-dialog.component';
import { PickUpDetailShowComponent } from '../pickUpDetailShow/pickUpDetailShow.component';
import { FormDialogComponentPUBE } from '../pickUpByExecutive/dialogs/form-dialog/form-dialog.component';
import { FormDialogDropOffByExecutiveComponent } from '../dropOffByExecutive/dialogs/form-dialog/form-dialog.component';
import { LocationInDetailShowComponent } from '../locationInDetailShow/locationInDetailShow.component';
import { DropOffDetailShowComponent } from '../dropOffDetailShow/dropOffDetailShow.component';
import { DriverRemarkDetailsComponent } from '../DriverRemarkDetails/DriverRemarkDetails.component';
import { FormDialogdriverRemarkComponent } from '../driverRemark/dialogs/form-dialog/form-dialog.component';
import { CarMovingStatusByAppComponent } from '../carMovingStatusByApp/carMovingStatusByApp.component';
import { AppDataMissingStatusComponent } from '../appDataMissingStatus/appDataMissingStatus.component';
import { FormDialogComponent } from '../feedBack/dialogs/form-dialog/form-dialog.component';
import { NextDayInstructionFormDialogComponent } from '../nextDayInstruction/dialogs/form-dialog/form-dialog.component';
import { DutyPostFormDialogComponent } from '../dutyPostPickUPCall/dialogs/form-dialog/form-dialog.component';
import { DutyPostPickUPCallComponent } from '../dutyPostPickUPCall/dutyPostPickUPCall.component';
import { NextDayInstructionDetailsComponent } from '../NextDayInstructionDetails/NextDayInstructionDetails.component';
import { FormDialogComponent as DutySlipImageDialog } from '../dutySlipImage/dialogs/form-dialog/form-dialog.component';
import { incidenceFormDialogComponent } from '../incidence/dialogs/form-dialog/form-dialog.component';
import { DutySlipImageDetailsShowComponent } from '../dutySlipImageDetailsShow/dutySlipImageDetailsShow.component';
import { resolutionFormDialogComponent } from '../resolution/dialogs/form-dialog/form-dialog.component';
import { FormDialogSendSmsWhatsappMailComponent } from '../sendSmsWhatsappMail/dialogs/form-dialog/form-dialog.component';
import { EmailInfoComponent } from '../EmailInfo/EmailInfo.component';
import { FormDialogComponent as DutySlipQualityCheckedByExecutive } from '../dutySlipQualityCheckedByExecutive/dialogs/form-dialog/form-dialog.component';
import { FormDialogCAComponent } from '../cancelAllotment/dialogs/form-dialog/form-dialog.component';
import { FormDialogCRAComponent } from '../cancelReservationAndAllotment/dialogs/form-dialog/form-dialog.component';
import { ControlPanelDialogeService } from './controlPanelDialoge.service';
import { PrintBlankDutySlipComponent } from '../PrintBlankDutySlip/PrintBlankDutySlip.component';
import { DutySlipAccentureComponent } from '../dutySlipAccenture/dutySlipAccenture.component';
import { CancelReservationAndAllotmentComponent } from '../cancelReservationAndAllotment/cancelReservationAndAllotment.component';
import { FormDialogComponentIL } from '../integrationLog/dialogs/form-dialog/form-dialog.component';
import { LocationOutTimeEditComponent } from '../reservation/dialogs/locationOutTimeEdit/locationOutTimeEdit.component';
import { AllotmentLogDetailsComponent } from '../allotmentLogDetails/AllotmentLogDetails.component';

@Component({
  standalone: false,
  selector: 'app-controlPanelDialoge',
  templateUrl: './controlPanelDialoge.component.html',
  styleUrls: ['./controlPanelDialoge.component.sass', './controlPanelDialoge.popup.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ControlPanelDialogeComponent {
  dialogTitle: string;
  dutySlipID: number;
  public reservationInfo: any[] = [];
  public reservationHeaderInfo: ControlPanelHeaderDetails[];
  reservationID: any;
  index: number;
  totalData = 0;
  recordsPerPage = 50;
  isLoading = true;
  currentPage = 1;
  isExpanded = [];
  rowIndex?: number;
  dialogRequestObject: any;
  public _filters: Filters;
  filterForm: FormGroup;
  advanceTable: any;
  dutyqualityCheckAllotmentID: any;
  dutySlipImageAllotmentID: any;
  dataSource: DutySlipQualityCheckedByExecutive[] | null;
  lifeCycleStatusdataSource: any[] = [];
  dutyPostPickUPCalldataSource: DutyPostPickUPCallModel[] = [];
  role: string;
 checkInvoiceNumber:any;
  eventsSubject: Subject<boolean> = new Subject<boolean>();
  advanceTableRD: ReservationDetails | null;
  advanceTablePD: PassengerDetails | null;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  ReservationID: any;
  customerGroupID: any;
  customerID: any;
  passengerID: any;
  bookerID: any;
  vehicleCategoryID: any;
  packageTypeID: any;
  packageID: any;
  supplierID: any;
  showEmptyTableHeader: boolean = false;
  //sortBy:string='Reservation.ReservationID';
  sortBy: string = 'Reservation.PickupDate';
  orderBy: string = 'Desc';
  bookingCategory: string = 'complete';

  public advanceTableRLT: ReservationLocationTransferLogModel | null;
  ShowAllLocation: any;

  dataSourceForAppDataMissingStatus: AppDataMissingStatusModel[] | null;
  status: string;
  currentLocationLatitude: string;
  currentLocationLongitude: string;
  currentAddress: any;
  locationBeforeTwoMinutesLatitude: string;
  locationBeforeTwoMinutesLongitude: string;
  locationBeforeTwoMinutesAddress: any;

  incidenceID: number
  @Output() newDataAddedEvent = new EventEmitter<boolean>();
  @Input() newDataAddedEvents = new EventEmitter<boolean>();

  searchTerm: any = '';
  selectedFilter: string = 'search';
  SearchBookingNo: string = '';

  sortDirection: 'asc' | 'desc' = 'desc';
  sortColumn: string = 'reservationID';

  dataSourceForInterstateTax: InterstateTaxEntry[] | null;
  dataSourceForPassToSupplier: PassToSupplierModel | null;
  public DutyPostPickUPCall: DutyPostPickUPCallModel | null;
  verifyDutyStatusAndCacellationStatus: any;

  ReservationStatus:any;

  constructor(
    public dialogRef: MatDialogRef<ControlPanelDialogeComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialog: MatDialog,
    public route: Router,
    public httpClient: HttpClient,
    public _dutySlipQualityCheckService: DutySlipQualityCheckService,
    public _dutySlipImageService: DutySlipImageService,
    public _controlPanelDesignService: ControlPanelDesignService,
    public dutySlipQualityCheckedByExecutiveService: DutySlipQualityCheckedByExecutiveService,
    public dispatchByExecutiveService: DispatchByExecutiveService,
    public driverRemarkService: DriverRemarkService,
    public feedBackAttachmentService: FeedBackAttachmentService,
    public nextDayInstructionService: NextDayInstructionService,
    public lifeCycleStatusService: LifeCycleStatusService,
    public _generalService: GeneralService,
    public router: ActivatedRoute,
    private fb: FormBuilder,
    public reservationDetailsService: ReservationDetailsService,
    private resolutionService: ResolutionService,
    public incidenceService: IncidenceService,
    public passengerDetailsService: PassengerDetailsService,
    public reservationLocationTransferLogService: ReservationLocationTransferLogService,
    public appDataMissingStatusService: AppDataMissingStatusService,
    public interstateTaxEntryService: InterstateTaxEntryService,
    public passToSupplierService: PassToSupplierService,
    public dutyPostPickUPCallService: DutyPostPickUPCallService,
    public clossingOneService: ClossingOneService,
    public controlPanelDialogeService:ControlPanelDialogeService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    // Set the defaults
    this.dialogTitle = 'Reservation Details';
    this.reservationID = data.reservationID;
    this.index = data.index;
    this.loadData(this.reservationID, this.index)
  }

  ngOnInit() 
  {
    this.controlPanelDialogeService.getVerifyDutyStatus(this.reservationID).subscribe(
    data =>
    {
      this.verifyDutyStatusAndCacellationStatus = data.status;
    });

  }

  public loadData(reservationID: any, index: number) {
    this._controlPanelDesignService.getReservationDetails(reservationID).subscribe(
      (data: ControlPanelData) => {
        const details = data?.reservationDetails;
        const list = Array.isArray(details) ? details : details != null ? [details] : [];
        this.reservationInfo = list.length > 0 ? list : null;
        console.log('Fetched reservation details:', this.reservationInfo);
        this.ReservationStatus = list[0]?.reservationStatus ?? null;
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      },
      (error: HttpErrorResponse) => {
        this.reservationInfo = null;
        this.ReservationStatus = null;
        this.cdr.detectChanges();
      }
    );
  }

  private onDutyLifecycleDialogClosed(dialogRef: MatDialogRef<any>, apply: (res: any) => void): void {
    dialogRef.afterClosed().subscribe((res) => {
      this.ngZone.run(() => {
        apply(res);
        this.cdr.detectChanges();
      });
    });
  }

  SpecialInstructionInfo(item) {
    this.dialog.open(SpecialInstructionInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }
  TimeAndAddressInfo(item) {
    // Always fetch latest status before opening
    this.fetchStatusAndOpen(() => {
      this.dialog.open(TimeAndAddressInfoComponent, {
        width: '920px',
        maxWidth: '96vw',
        data: {
          advanceTable: item.stopsDetails[0],
          status: this.status,
          parentRow: item
        }
      });
    }, item.reservationID);
  }
  TimeAndAddressDrop(item) {
    this.fetchStatusAndOpen(() => {
      this.dialog.open(TimeAndAddressInfoComponent, {
        width: '920px',
        maxWidth: '96vw',
        data: {
          advanceTable: item.stopsDetails[1],
          status: this.status,
          parentRow: item,
          locationKind: 'drop'
        }
      });
    }, item.reservationID);
  }

  StopDetailsInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === reservationID
    // )[0].stopsDetails;
    this.dialog.open(StopDetailsInfoComponent, {
      width: 'min(1200px, 98vw)',
      maxWidth: '98vw',
      panelClass: 'stop-details-wide-dialog',
      data: {
        advanceTable: item
      }
    });
  }

  StopsOnMapInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === item.reservationID
    // )[0].stopsDetails;
    this.dialog.open(StopOnMapInfoComponent, {
      width: 'min(1200px, 98vw)',
      maxWidth: '98vw',
      panelClass: 'stops-on-map-wide-dialog',
      data: {
        advanceTable: item
      }
    });
  }
  allotmentStatus(item: any) {

    this.dialog.open(AllotmentStatusDetailsComponent, {
      width: '500px',
      data: {
        row: item
      }
    });
  }

  openIntegrationLog(reservationID: any) {
  if (reservationID) {
    this.dialog.open(FormDialogComponentIL, {
      width: '80%',
      height: '80%', // ✅ scroll control
      data: {
        reservationID: reservationID
      }
    });
  }
}

 DriverAllotment(reservationID: number, reservationGroupID: number, pickupDate: any, pickupAddress: any) {
  // 

  if (!reservationGroupID) {
    console.warn('⚠️ reservationGroupID is missing!');
  }

  const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(reservationGroupID.toString()));
  const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(reservationID.toString()));
  const encryptedPickupDate = encodeURIComponent(this._generalService.encrypt(pickupDate));
  const encryptedPickupAddress = encodeURIComponent(this._generalService.encrypt(pickupAddress));


  const url = this.route.serializeUrl(this.route.createUrlTree(
    ['/CarAndDriverAllotment'],
    {
      queryParams: {
        reservationGroupID: encryptedReservationGroupID,
        reservationID: encryptedReservationID,
        pickupDate: encryptedPickupDate,
        pickupAddress: encryptedPickupAddress,
        status:this.verifyDutyStatusAndCacellationStatus
      }
    }
  ));


  window.open(this._generalService.FormURL + url, '_blank');
}

  locationDetailsInfo(item: any) {

    this.dialog.open(LocationDetailsComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }
  //--------- Transfer Location Popup ----------
  TransferLocation(reservationID: number, i: any) {
     this.fetchStatusAndOpen(() => {
    const dialogRef = this.dialog.open(FormDialogComponentTransferLocation,
      {
        data:
        {
          reservationID: reservationID,
          action: 'edit',
          status: this.status

        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadData(reservationID, i);
    })
  }
, reservationID);
  }

  //---------- Transfer Location History ----------
  TransferLocationHistory(reservationID: number) {
    this.dialog.open(ReservationLocationTransferLogComponent,
      {
        width: '500px',
        data:
        {
          reservationID: reservationID,
        }
      });
  }

  //---------- Transfer Location Data ----------
  public TransferLocationData(reservationID: number) {
    this.reservationLocationTransferLogService.getTableData(reservationID).subscribe
      (
        data => {
          this.advanceTableRLT = data;
        },
      );
  }

  CovertSoftToHard(item: any, i: any) {
    
    if (item.allotmentStatus === 'Alloted') {
      const dialogRef = this.dialog.open(SoftToHardDialogComponent,
        {
          width: '400px',
          data:
          {
            advanceTable: item,
            allotmentID: item.allotmentID
          }

        });
      dialogRef.afterClosed().subscribe(res => {
        this.loadData(item.reservationID, i);
      })

    }
  }

  //---------- Allotment & Pickup Time Comparison ----------
  AllotmentOnTime(item: any) {
    if (!item) {
      return 'notDone';
    }
    // ------------Pickup DateTime--------------
    var pickupTime = item.pickupTime;
    var pickupTimeConversion = moment(pickupTime).format('HH:mm:ss');
    var pickupDate = item.pickupDate;
    var pickupDateConversion = moment(pickupDate).format('yyyy-MM-DD');
    var pickupDateTime = pickupDateConversion + ' ' + pickupTimeConversion;

    // ------------Allotment DateTime--------------
    var timeofAllotment = item.timeofAllotment;
    var timeofAllotmentConversion = moment(timeofAllotment).format('HH:mm:ss');
    var dateOfAllotment = item.dateOfAllotment;
    var dateOfAllotmentConversion = moment(dateOfAllotment).format('yyyy-MM-DD');
    var allotmentDateTime = dateOfAllotmentConversion + ' ' + timeofAllotmentConversion;

    var diffBtwAllotPickup = new Date(pickupDateTime).getTime() - new Date(allotmentDateTime).getTime();

    const currentDateTime = new Date();
    var systemTime = moment(currentDateTime).format('HH:mm:ss');
    var systemDate = moment(currentDateTime).format('yyyy-MM-DD');
    var systemDateTime = systemDate + ' ' + systemTime;

    var diffBtwSystemPickup = new Date(pickupDateTime).getTime() - new Date(systemDateTime).getTime();

    if (diffBtwAllotPickup > 4 * 60 * 60 * 1000) {
      return 'onTime'; // Allotment is done on time
    }
    else if (diffBtwAllotPickup < 4 * 60 * 60 * 1000) {
      return 'late'; // Allotment is done but less than 4 hours
    }
    else if (diffBtwSystemPickup < 4 * 60 * 60 * 1000) {
      return 'lateNotDone'; // Allotment not done
    }
    else {
      return 'notDone';
    }
  }
  //--------- PickupTime Popup ----------
  pickupTimeUpdate(item,i) {
    this.fetchStatusAndOpen(() => {
      const dialogRef = this.dialog.open(PickupTimeFormDialogComponent,
        {
          width: '520px',
          maxWidth: '96vw',
          data:
          {
            advanceTable: item,
            customerID: item.customerID,
            status: this.status
          }
        });
      dialogRef.afterClosed().subscribe((res: any) => { 
        this.loadData(item.reservationID, i);
      });
    }, item.reservationID);
  }

  private fetchStatusAndOpen(callback: () => void, reservationID: any) {
    // If already have a non-empty status, reuse it but still attempt refresh
    this.clossingOneService.getVerifyDutydata(reservationID).subscribe(
      statusData => {
        let status = '';
        if (typeof statusData === 'string') {
          status = statusData;
        } else if (statusData?.status && typeof statusData.status === 'string') {
          status = statusData.status;
        } else if (statusData?.status?.status && typeof statusData.status.status === 'string') {
          status = statusData.status.status;
        }
        this.status = status; // persist
        callback();
      },
      error => {
        console.warn('Failed to fetch status (fetchStatusAndOpen), proceeding without it', error);
        callback();
      }
    );
  }
  navigateToBookingForEdit(item) {
    // Fetch status first so edit screen can gate changes consistently
    this.fetchStatusAndOpen(() => {
      const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(item.reservationGroupID.toString()));
      const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
      const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customerName));
      const queryParams: any = {
        reservationGroupID: encryptedReservationGroupID,
        customerID: encryptedCustomerID,
        customerName: encryptedCustomerName,
        type: 'edit'
      };
      if (this.status) {
        const encryptedStatus = encodeURIComponent(this._generalService.encrypt(this.status));
        queryParams.status = encryptedStatus;
      } else {
        console.warn('navigateToBookingForEdit no status available');
      }
      const url = this.route.serializeUrl(this.route.createUrlTree(['/reservationGroupDetails'], { queryParams }));
      window.open(this._generalService.FormURL + url, '_blank');
    }, item.reservationID);
  }
  OpenBookingScreen(item) {
    
    // Fetch status first, then open booking screen
    this.clossingOneService.getVerifyDutydata(item.reservationID).subscribe(
      statusData => {
        let status = '';
        if(typeof statusData === 'string') {
          status = statusData;
        } else if(statusData?.status && typeof statusData.status === 'string') {
          status = statusData.status;
        } else if(statusData?.status?.status && typeof statusData.status.status === 'string') {
          status = statusData.status.status;
        }
        
        this.openBookingScreenWithStatus(item, status);
      },
      error => {
        console.error('Error fetching status:', error);
        this.openBookingScreenWithStatus(item, '');
      }
    );
  }
  
  openBookingScreenWithStatus(item: any, status: string) {
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customerName));
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(item.reservationGroupID.toString()));
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));
    const encryptedCustomerGroupID = encodeURIComponent(this._generalService.encrypt(item.customerGroupID.toString()));
    const encryptedAction = encodeURIComponent(this._generalService.encrypt('edit'));
    
    const queryParams: any = {
      reservationID: encryptedReservationID,
      reservationGroupID: encryptedReservationGroupID,
      customerGroupID: encryptedCustomerGroupID,
      customerID: encryptedCustomerID,
      customerName: encryptedCustomerName,
      action: encryptedAction
    };
    
    // Add status to query params if available
    if(status) {
      const encryptedStatus = encodeURIComponent(this._generalService.encrypt(status));
      queryParams.status = encryptedStatus;
    } else {
      console.warn('No status to add to query params');
    }
    
    const url = this.route.serializeUrl(this.route.createUrlTree(['/bookingScreen'], {
      queryParams: queryParams
    }));
    
    window.open(this._generalService.FormURL + url, '_blank');
  }
  openSendEmsDialog(reservationID, vehicle, pickupDate, pickupTime,
    registrationNumber, customerPersonName, city, customerPersonID, item: any) {
    this.dialog.open(FormDialogSendEmsComponent, {
      width: '70%',
      data: {
        // advanceTable: filtered

        reservationID: reservationID,
        vehicle: vehicle,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        registrationNumber: registrationNumber,
        customerPersonName: customerPersonName,
        city: city,
        item: item,
        customerPersonID: customerPersonID
      }
    });
  }
  OpenBookingScreenIncomplete(item) {
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customerName));
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(item.reservationGroupID.toString()));
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));

    const url = this.route.serializeUrl(this.route.createUrlTree(['/bookingScreen'], {
      queryParams: {

        reservationID: encryptedReservationID,
        reservationGroupID: encryptedReservationGroupID
      }
    }));
    window.open(this._generalService.FormURL + url, '_blank');
  }
 BookerInfo(item) {
    this.dialog.open(BookerInfoComponent, {
      // width: '500px',
      data: {
        advanceTable: item
      }
    });
  }
  emailInfo(item) {
    this.dialog.open(EmailInfoComponent, {
      // width: '500px',
      data: {
        reservationID: item?.reservationID,
        reservationGroupID: item?.reservationGroupID,
        advanceTable: item
      }
    });
  }
  VehicleCategoryInfo(item) {
    this.dialog.open(VehicleCategoryInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }

  VehicleInfo(item) {
    this.dialog.open(VehicleInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }
  PackageInfo(item) {
    this.dialog.open(PackageInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }
  ReservationMessaging(reservationID: number, allotmentID: number) {
    this.dialog.open(MessagingDialog, {
      width: '100%',
      data: {
        reservationID: reservationID,
        allotmentID: allotmentID

      }
    });
  }
  PassToSupplier(reservationID: number) {
    // Fetch status first, then open Pass To Supplier dialog with status included
    this.fetchStatusAndOpen(() => {
      this.passToSupplierService.getData(reservationID).subscribe(
        data => {
          this.dataSourceForPassToSupplier = data;
          if (this.dataSourceForPassToSupplier !== null) {
            this.dialog.open(PassToSupplierFormDialogComponent, {
              width: '700px',
              data: {
                reservationID: reservationID,
                action: 'edit',
                status: this.status
              }
            });
          } else {
            this.dialog.open(PassToSupplierFormDialogComponent, {
              width: '700px',
              data: {
                reservationID: reservationID,
                action: 'add',
                status: this.status
                //data:this.dataSourceForPassToSupplier
              }
            });
          }
        }
      );
    }, reservationID);
  }
  openMailToSupplier(reservationID: any) {
    const dialogRef = this.dialog.open(MTSFormDialogComponent,
      {
        width: '60%',
        height: '85%',
        data:
        {
          reservationID: reservationID
        }
      });
  }
  PassengerInfo(item) {
    // const filtered = this.reservationInfo.filter(
    //   (value) => value.reservationID === reservationID[0] &&
    //      value.customerPersonID === customerPersonID
    //   )[0];
    this.dialog.open(PassengerInfoComponent, {
      width: '500px',
      data: {
        advanceTable: item.passengerDetails
      }
    });
  }

  reachedDetails(item: any) {
    this.reachedDetailsloadData(item)
  }

  public reachedDetailsloadData(item: any) {

    this.dispatchByExecutiveService.getgaroutCheckDataDetails(item.dutySlipID).subscribe
      (
        data => {
          this.dataSource = data;
          this.dialog.open(ReachedByExecutiveDetailsComponent, {
            width: '500px',
            data: {
              row: item,
              dataSource: this.dataSource
            }

          });

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
  reachedByExecutiveManual(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      let dialogRef = this.dialog.open(ReachedByExecutiveFormDialogComponent, {
        data: {
          action: 'edit',
          allotmentID: item.allotmentID,
          driverName: item.driverName,
          regno: item.registrationNumber,
          reservationID: item.reservationID,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'Manual',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          item.reportingToGuestDate = res?.reportingToGuestDate;
          item.reportingToGuestTime = res?.reportingToGuestTime;
        }
      });
    }
  }

  reachedByExecutiveAPP(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      let dialogRef = this.dialog.open(ReachedByExecutiveFormDialogComponent, {
        data: {
          action: 'edit',
          allotmentID: item.allotmentID,
          driverName: item.driverName,
          regno: item.registrationNumber,
          reservationID: item.reservationID,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'APP',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          item.reportingToGuestDate = res?.reportingToGuestDate;
          item.reportingToGuestTime = res?.reportingToGuestTime;
        }
      });
    }
  }
  reachedByExecutiveGPS(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      let dialogRef = this.dialog.open(ReachedByExecutiveFormDialogComponent, {
        data: {
          action: 'edit',
          allotmentID: item.allotmentID,
          driverName: item.driverName,
          regno: item.registrationNumber,
          reservationID: item.reservationID,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'GPS',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          item.reportingToGuestDate = res?.reportingToGuestDate;
          item.reportingToGuestTime = res?.reportingToGuestTime;
        }
      });
    }
  }
  //---------- GarageOut,Reached Pickup,Dropoff,GarageIn Time Comparison ----------
  TripOnTime(item: any) {
    if (!item) {
      return 'NotDispatchedMoreThanTwoHours';
    }
    // ------------GarageOut DateTime--------------
    var locationOutTime = item.locationOutTime;
    var locationOutTimeConversion = moment(locationOutTime).format('HH:mm:ss');
    var locationOutDate = item.locationOutDate;
    var locationOutDateConversion = moment(locationOutDate).format('yyyy-MM-DD');
    var locationOutDateTime = locationOutDateConversion + ' ' + locationOutTimeConversion;

    // ------------Reached DateTime--------------
    var reportingToGuestTime = item.reportingToGuestTime;
    var reportingToGuestTimeConversion = moment(reportingToGuestTime).format('HH:mm:ss');
    var reportingToGuestDate = item.reportingToGuestDate;
    var reportingToGuestDateConversion = moment(reportingToGuestDate).format('yyyy-MM-DD');
    var reportingToGuestDateTime = reportingToGuestDateConversion + ' ' + reportingToGuestTimeConversion;

    // ------------Reservation Pickup DateTime--------------
    var pickupTime = item.pickupTime;
    var pickupTimeConversion = moment(pickupTime).format('HH:mm:ss');
    var pickupDate = item.pickupDate;
    var pickupDateConversion = moment(pickupDate).format('yyyy-MM-DD');
    var pickupDateTime = pickupDateConversion + ' ' + pickupTimeConversion;

    // ------------Duty Pickup DateTime--------------
    var dutyPickUpTime = item.dutyPickUpTime;
    var dutyPickUpTimeConversion = moment(dutyPickUpTime).format('HH:mm:ss');
    var dutyPickUpDate = item.dutyPickUpDate;
    var dutyPickUpDateConversion = moment(dutyPickUpDate).format('yyyy-MM-DD');
    var dutyPickUpDateTime = dutyPickUpDateConversion + ' ' + dutyPickUpTimeConversion;

    // ------------Dropoff DateTime--------------
    var dropOffTime = item.dropOffTime;
    var dropOffTimeConversion = moment(dropOffTime).format('HH:mm:ss');
    var dropOffDate = item.dropOffDate;
    var dropOffDateConversion = moment(dropOffDate).format('yyyy-MM-DD');
    var dropOffDateTime = dropOffDateConversion + ' ' + dropOffTimeConversion;

    // ------------GarageIn DateTime--------------
    var locationInTime = item.locationInTime;
    var locationInTimeConversion = moment(locationInTime).format('HH:mm:ss');
    var locationInDate = item.locationInDate;
    var locationInDateConversion = moment(locationInDate).format('yyyy-MM-DD');
    var locationInDateTime = locationInDateConversion + ' ' + locationInTimeConversion;

    const currentDateTime = new Date();
    var systemTime = moment(currentDateTime).format('HH:mm:ss');
    var systemDate = moment(currentDateTime).format('yyyy-MM-DD');
    var systemDateTime = systemDate + ' ' + systemTime;

    var diffBtwSystemPickup = new Date(pickupDateTime).getTime() - new Date(systemDateTime).getTime();
    var diffBtwPickupLocout = new Date(pickupDateTime).getTime() - new Date(locationOutDateTime).getTime();

    if (diffBtwSystemPickup >= 2 * 60 * 60 * 1000) {
      return "NotDispatchedMoreThanTwoHours";
    }
    else if (diffBtwSystemPickup < 2 * 60 * 60 * 1000 && (item.locationOutDate && item.locationOutTime) === null) {
      return "NotDispatchedLessThanTwoHours";
    }
    else if (locationOutDateTime && diffBtwSystemPickup < 20 * 60 * 1000 && (item.reportingToGuestDate && item.reportingToGuestTime) === null) {
      return 'DispatchedButNotReached';
    }
    else if (((item.locationOutDate && item.locationOutTime) !== null) && (diffBtwPickupLocout > 20 * 60 * 1000)) {
      return 'Dispatched';
    }
    else if ((item.reportingToGuestDate && item.reportingToGuestTime) !== null) {
      return 'Reached';
    }
    else if ((item.dutyPickUpDate && item.dutyPickUpTime) === null) {
      return 'NotPickup';
    }
    else if ((item.dutyPickUpDate && item.dutyPickUpTime) !== null) {
      return 'Pickup';
    }
    else if ((item.dropOffDate && item.dropOffTime) === null) {
      return 'NotDropOff';
    }
    else if ((item.dropOffDate && item.dropOffTime) !== null) {
      return 'DropOff';
    }
    else if ((item.locationInDate && item.locationInTime) === null) {
      return 'NotGarageIn';
    }
    else if ((item.locationInDate && item.locationInTime) !== null) {
      return 'GarageIn';
    }
    // else
    // {
    //   return 'notDone';
    // }
  }
  //--------- Interstate Tax Popup ----------
  InterstateTax(item) {
    if (item.allotmentStatus === 'Alloted') {
      // Always refresh status before opening Interstate Tax dialog for gating
      this.fetchStatusAndOpen(() => {
        const dialogRef = this.dialog.open(InterstateTaxFormDialogComponent, {
          data: {
            inventoryID: item.inventoryID,
            registrationNumber: item.registrationNumber,
            Vehicle: item.vehicle.vehicle,
            VehicleCategory: item.vehicle.vehicleCategory,
            SupplierName: item.carVendor,
            redirectedFrom: 'Inventory',
            action: 'add',
            status: this.status
          }
        });
        dialogRef.afterClosed().subscribe((res: any) => {
          if (res) {
            item.interstateTaxAmount = 'Done';
          }
        });
      }, item.reservationID);
    }
  }

  //--------- Interstate Tax Details ----------
  navigateToInterstateTaxDetails(item) {
    // Fetch latest status first (if reservationID available) then navigate with status param
    const reservationID = item?.reservationID;
    const proceed = () => {
      const encryptedInventoryID = encodeURIComponent(this._generalService.encrypt(item.inventoryID.toString()));
      const encryptedRegNo = encodeURIComponent(this._generalService.encrypt(item.registrationNumber.toString()));
      const encryptedVehicle = encodeURIComponent(this._generalService.encrypt(item.vehicle.vehicle.toString()));
      const encryptedVehicleCategory = encodeURIComponent(this._generalService.encrypt(item.vehicle.vehicleCategory.toString()));
      const encryptedRedirectingFrom = encodeURIComponent(this._generalService.encrypt('Inventory'));
      const encryptedSupplierName = encodeURIComponent(this._generalService.encrypt(item.carVendor.toString()));

      const queryParams: any = {
        InventoryID: encryptedInventoryID,
        RegNo: encryptedRegNo,
        Vehicle: encryptedVehicle,
        VehicleCategory: encryptedVehicleCategory,
        redirectingFrom: encryptedRedirectingFrom,
        SupplierName: encryptedSupplierName
      };
      if (this.status) {
        const encryptedStatus = encodeURIComponent(this._generalService.encrypt(this.status));
        queryParams.status = encryptedStatus;
      } else {
        console.warn('navigateToInterstateTaxDetails no status available');
      }
      const url = this.route.serializeUrl(this.route.createUrlTree(['/interstateTaxEntry'], { queryParams }));
      window.open(this._generalService.FormURL + url, '_blank');
    };

    if (reservationID) {
      this.fetchStatusAndOpen(() => proceed(), reservationID);
    } else {
      proceed();
    }
  }
  vendorStatus(item) {

    this.dialog.open(VendorDetailsComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
  }
  qCImageDetails(item: any) {

    this.QcImageloadData(item)
  }
  public QcImageloadData(item: any) {

    this.dutySlipQualityCheckedByExecutiveService.getdutyQualityCheckDataDetails(item.allotmentID).subscribe
      (
        data => {
          this.dataSource = data;
          this.dialog.open(DutySlipQualityCheckDetailsComponent, {
            width: '500px',
            data: {
              row: item,
              dataSource: this.dataSource
            }

          });

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
  qCImage(item: any, i: any) {
    if (item.allotmentType === 'Hard') {
      // Fetch status first to enforce gating inside quality check dialog
      this.fetchStatusAndOpen(() => {
        this._dutySlipQualityCheckService.getAllotmentIDForDutyQualityCheck(item.allotmentID).subscribe(
          data => {
            this.dutyqualityCheckAllotmentID = data;
            if (!this.dutyqualityCheckAllotmentID) {
              this.dialogRequestObject = {
                action: 'add',
                dutySlipID: item.dutySlipID,
                reservationID: item.reservationID,
                allotmentID: item.allotmentID,
                driverID: item.driverID,
                driverName: item.driverName,
                inventoryID: item.inventoryID,
                registrationNumber: item.registrationNumber,
                status: this.status
              };
            }
            if (this.dutyqualityCheckAllotmentID) {
              this.dialogRequestObject = {
                action: 'edit',
                dutySlipID: item.dutySlipID,
                reservationID: item.reservationID,
                allotmentID: item.allotmentID,
                status: this.status
              };
            }
            let dialogRef = this.dialog.open(DutySlipQualityCheckFormDialogComponent, {
              width: '75%',
              data: this.dialogRequestObject
            });
            dialogRef.afterClosed().subscribe((result: any) => {
              if (result) {
                item.activationStatus = 'Active';
                this.loadData(item.reservationID, i);
              }
            });
          });
      }, item.reservationID);
    }
    else {

      Swal.fire({
                  title: '',
                  icon: 'warning',
                  html: `<b>Hard Allotment Required Before Quality Check..</b>`
                  })
                 return;
    }
  }
  verifyImageDetails(item: any) {
    // this.dialog.open(DutySlipQualityCheckDetailsComponent, {
    //   width: '500px',
    //   data: {
    //     row: item
    //   }

    // });
    this.verifyImageloadData(item)
  }

  public verifyImageloadData(item: any) {

    this.dutySlipQualityCheckedByExecutiveService.getdutyQualityCheckDataDetails(item.allotmentID).subscribe
      (
        data => {
          this.dataSource = data;
          this.dialog.open(DutySlipQualityCheckedByExecutiveDetailsComponent, {
            width: '500px',
            data: {
              row: item,
              dataSource: this.dataSource
            }

          });

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
  viewQcImage(item: any, i: any) {
    if (item.allotmentType === 'Hard') {
      this._generalService.GetDutyQualityCheckID(item.allotmentID).subscribe((data: any) => {
        if (data !== undefined && data !== 0) {
          let dialogRef = this.dialog.open(DutySlipQualityCheckedByExecutive, {
            data: {
              action: 'edit',
              dutySlipID: item.dutySlipID,
              reservationID: item.reservationID,
              allotmentID: item.allotmentID,
              verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
            }
          });
          dialogRef.afterClosed().subscribe(res => {
            if (res) {
              item.qcCheckedByExecutivePassed = "Passed";
              this.loadData(item.reservationID, i);
            }

            //this.loadData(this.currentPage, this.recordsPerPage, this.isLoading);

          })
        }
        else {
          Swal.fire({
                  title: '',
                  icon: 'warning',
                  html: `<b>Please Do Quality Check Before Verification.</b>`
                  })
                 return;
        }
      });
    }
  }

  

  // PrintDS(item: any) 
  // {
  //   if (item.allotmentStatus === 'Alloted') 
  //   {
  //     if(item.dutySlipType === 'GeneralDutySlipWithMap' || item.dutySlipType === 'GeneralDutySlipWithoutMap')
  //     {
  //       this.dialog.open(PrintDutySlipComponent, {
  //       width: '800px',
  //       data: {
  //         controlPanelData: item
  //         }
  //       });
  //     }
  //     else if(item.dutySlipType === 'BlankGeneralDutySlip')
  //     {
  //       this.dialog.open(PrintBlankDutySlipComponent, {
  //       width: '800px',
  //       data: {
  //         controlPanelData: item
  //         }
  //       });
  //     }
  //     else if(item.dutySlipType === 'AccentureDutySlip')
  //     {
  //       this.dialog.open(DutySlipAccentureComponent, {
  //       width: '800px',
  //       data: {
  //         dutySlipID: item.dutySlipID
  //         }
  //       });
  //     }      
  //   }
  //   else {
  //     Swal.fire({
  //                 title: '',
  //                 icon: 'warning',
  //                 html: `<b>Allotment Required.</b>`,
  //                 customClass: {
  //                   container: 'swal2-popup-high-zindex'
  //                 }
  //                 })
  //                return;
  //   }
  // }


  PrintDSBlank(item: any) 
  {
    let baseUrl = this._generalService.FormURL;
    let url = '';
    if (item.allotmentStatus === 'Alloted') 
    {
      url = this.route.serializeUrl(this.route.createUrlTree(['/printBlankdutyslip'], 
        { queryParams: {  dutySlipID: item.dutySlipID,reservationID: item.reservationID } }));   
      window.open(baseUrl + url, '_blank');
    }
    else 
    {
      Swal.fire({
                title: '',
                icon: 'warning',
                html: `<b>Allotment Required.</b>`
                })
              return;
    }
  }

    PrintDS(item: any) 
    {
      let baseUrl = this._generalService.FormURL;
      if (item.allotmentStatus === 'Alloted') 
      {
        const dutySlipType = (item?.dutySlipType || '').toString().trim();
        let url = '';
        if (dutySlipType === 'GeneralDutySlipWithMap') 
        {
          url = this.route.serializeUrl(this.route.createUrlTree(['/printdutyslip'], 
            { queryParams: { dutySlipID: item.dutySlipID,reservationID: item.reservationID } }));
        }
        else if (dutySlipType === 'GeneralDutySlipWithoutMap') 
        {
          url = this.route.serializeUrl(this.route.createUrlTree(['/PrintDutySlipWithoutMap'], 
            { queryParams: {  dutySlipID: item.dutySlipID,reservationID: item.reservationID } }));
        }
        else {
          // Fallback: backend sometimes sends null dutySlipType; default to without-map format.
          url = this.route.serializeUrl(this.route.createUrlTree(['/PrintDutySlipWithoutMap'], 
            { queryParams: {  dutySlipID: item.dutySlipID,reservationID: item.reservationID } }));
        }
        window.open(baseUrl + url, '_blank');
      } 
      else 
      {
        Swal.fire({
          title: '',
          icon: 'warning',
          html: `<b>Allotment Required.</b>`
        });
        return;
      }
    }

  openGarageInManual(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      const dialogRef = this.dialog.open(FormDialogGIComponent, {
        width: '800px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        autoFocus: false,
        restoreFocus: false,
        panelClass: 'dbe-dialog-centered',
        data: {
          reservationID: item.reservationID,
          allotmentID: item.allotmentID,
          registrationNumber: item.registrationNumber,
          driverName: item.driverName,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          transferedLocationID: item.transferedLocationID,
          rowRecord: item,
          tab: 'Manual',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          const garageInPayload = Array.isArray(res?.data) ? res.data[0] : (res?.data ?? res);
          const garageInKM = garageInPayload?.locationInKM ?? garageInPayload?.locationInKm ?? garageInPayload?.garageInKM ?? garageInPayload?.garageInKm ?? res?.locationInKM ?? res?.locationInKm ?? res?.garageInKM ?? res?.garageInKm ?? null;
          const garageInAddress = garageInPayload?.locationInAddressString ?? garageInPayload?.garageInAddressString ?? res?.locationInAddressString ?? res?.garageInAddressString ?? null;
          item.locationInDate = res?.locationInDate;
          item.locationInTime = res?.locationInTime;
          item.locationInKM = garageInKM ?? item.locationInKM ?? item.locationInKm ?? item.garageInKM ?? item.garageInKm ?? null;
          item.locationInKm = garageInKM ?? item.locationInKm ?? item.locationInKM ?? item.garageInKm ?? item.garageInKM ?? null;
          item.garageInKM = garageInKM ?? item.garageInKM ?? item.garageInKm ?? item.locationInKM ?? item.locationInKm ?? null;
          item.garageInKm = garageInKM ?? item.garageInKm ?? item.garageInKM ?? item.locationInKm ?? item.locationInKM ?? null;
          item.locationInAddressString = garageInAddress ?? item.locationInAddressString ?? item.garageInAddressString ?? null;
          item.garageInAddressString = garageInAddress ?? item.garageInAddressString ?? item.locationInAddressString ?? null;
        }
      });
    }
  }

  openGarageInApp(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      const dialogRef = this.dialog.open(FormDialogGIComponent, {
        width: '800px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        autoFocus: false,
        restoreFocus: false,
        panelClass: 'dbe-dialog-centered',
        data: {
          reservationID: item.reservationID,
          allotmentID: item.allotmentID,
          registrationNumber: item.registrationNumber,
          driverName: item.driverName,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'APP',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          const garageInPayload = Array.isArray(res?.data) ? res.data[0] : (res?.data ?? res);
          const garageInKM = garageInPayload?.locationInKM ?? garageInPayload?.locationInKm ?? garageInPayload?.garageInKM ?? garageInPayload?.garageInKm ?? res?.locationInKM ?? res?.locationInKm ?? res?.garageInKM ?? res?.garageInKm ?? null;
          const garageInAddress = garageInPayload?.locationInAddressString ?? garageInPayload?.garageInAddressString ?? res?.locationInAddressString ?? res?.garageInAddressString ?? null;
          item.locationInDate = res?.locationInDate;
          item.locationInTime = res?.locationInTime;
          item.locationInKM = garageInKM ?? item.locationInKM ?? item.locationInKm ?? item.garageInKM ?? item.garageInKm ?? null;
          item.locationInKm = garageInKM ?? item.locationInKm ?? item.locationInKM ?? item.garageInKm ?? item.garageInKM ?? null;
          item.garageInKM = garageInKM ?? item.garageInKM ?? item.garageInKm ?? item.locationInKM ?? item.locationInKm ?? null;
          item.garageInKm = garageInKM ?? item.garageInKm ?? item.garageInKM ?? item.locationInKm ?? item.locationInKM ?? null;
          item.locationInAddressString = garageInAddress ?? item.locationInAddressString ?? item.garageInAddressString ?? null;
          item.garageInAddressString = garageInAddress ?? item.garageInAddressString ?? item.locationInAddressString ?? null;
        }
      });
    }
  }
  openGarageInGPS(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      const dialogRef = this.dialog.open(FormDialogGIComponent, {
        width: '800px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        autoFocus: false,
        restoreFocus: false,
        panelClass: 'dbe-dialog-centered',
        data: {
          reservationID: item.reservationID,
          allotmentID: item.allotmentID,
          registrationNumber: item.registrationNumber,
          driverName: item.driverName,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'GPS',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          const garageInPayload = Array.isArray(res?.data) ? res.data[0] : (res?.data ?? res);
          const garageInKM = garageInPayload?.locationInKM ?? garageInPayload?.locationInKm ?? garageInPayload?.garageInKM ?? garageInPayload?.garageInKm ?? res?.locationInKM ?? res?.locationInKm ?? res?.garageInKM ?? res?.garageInKm ?? null;
          const garageInAddress = garageInPayload?.locationInAddressString ?? garageInPayload?.garageInAddressString ?? res?.locationInAddressString ?? res?.garageInAddressString ?? null;
          item.locationInDate = res?.locationInDate;
          item.locationInTime = res?.locationInTime;
          item.locationInKM = garageInKM ?? item.locationInKM ?? item.locationInKm ?? item.garageInKM ?? item.garageInKm ?? null;
          item.locationInKm = garageInKM ?? item.locationInKm ?? item.locationInKM ?? item.garageInKm ?? item.garageInKM ?? null;
          item.garageInKM = garageInKM ?? item.garageInKM ?? item.garageInKm ?? item.locationInKM ?? item.locationInKm ?? null;
          item.garageInKm = garageInKM ?? item.garageInKm ?? item.garageInKM ?? item.locationInKm ?? item.locationInKM ?? null;
          item.locationInAddressString = garageInAddress ?? item.locationInAddressString ?? item.garageInAddressString ?? null;
          item.garageInAddressString = garageInAddress ?? item.garageInAddressString ?? item.locationInAddressString ?? null;
        }
      });
    }
  }

  lifeCycleStatus(item: any) {

    // Call the method to load life cycle status data
    this.lifeCycleStatusLoadData(item);
  }

  public lifeCycleStatusLoadData(item: any) {
    this.lifeCycleStatusService.getlifeCycleStatus(item.reservationID).subscribe(
      data => {
        if (data && data.length > 0) {
          this.lifeCycleStatusdataSource = data;

          const dialogRef = this.dialog.open(LifeCycleStatusComponent, {
            width: '500px',
            data: {
              row: item,
              reservationID: item.reservationID,
              lifeCycleStatusdataSource: this.lifeCycleStatusdataSource,
            }
          });
        } else {
          // Show a message if no data found
          this.showNoDataMessage();
        }
      },
      (error) => {
        const errorMsg = error?.error?.message || error?.message || 'Unknown error';
        console.error('Failed to fetch life cycle status:', errorMsg);
        this.showNoDataMessage();
      }
    );
  }

  // Show message when no data is found
  public showNoDataMessage() {
    this.dialog.open(NoDataDialogComponent, {
      width: '300px',
      data: { message: 'No data found for the given reservation No.' }
    });
  }
  //--------- Duty Tracking Popup ----------
  DutyTracking(item: any, i: any) {
    const dialogRef = this.dialog.open(FormDialogComponentDutyTracking,
      {
        data:
        {
          dutySlipID: item.dutySlipID,
          action: 'add',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
    dialogRef.afterClosed().subscribe(res => {
      this.loadData(item.reservationID, i);
    })
  }

  //---------- Duty Tracking History ----------
  DutyTrackingHistory(dutySlipID: number) {
    this.dialog.open(DutyTrackingComponent,
      {
        width: '600px',
        data:
        {
          dutySlipID: dutySlipID,
        }
      });
  }
  garageOutDetails(item: any) {
    this.garageOutDetailsloadData(item)
  }

  public garageOutDetailsloadData(item: any) {

    this.dispatchByExecutiveService.getgaroutCheckDataDetails(item.dutySlipID).subscribe
      (
        data => {
          this.dataSource = data;
          this.dialog.open(GarageOutDetailsComponent, {
            width: '500px',
            maxWidth: '95vw',
            panelClass: 'dbe-dialog-centered',
            data: {
              row: item,
              dataSource: this.dataSource
            }

          });

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
  handleDispatchByQC(item: any) {
    this.DispatchByExecutiveManual(item);
  }

  DispatchByExecutiveManual(item: any) {
    if (item.allotmentType === 'Hard') {
      const dialogRef = this.dialog.open(FormDialogDBEComponent, {
        width: '800px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        autoFocus: false,
        restoreFocus: false,
        panelClass: 'dbe-dialog-centered',
        data: {
          reservationID: item.reservationID,
          allotmentID: item.allotmentID,
          registrationNumber: item.registrationNumber,
          driverName: item.driverName,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'Manual',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          item.locationOutDate = res?.locationOutDate;
          item.locationOutTime = res?.locationOutTime;
        }
      });
    }
    else {
      Swal.fire({
                  title: '',
                  icon: 'warning',
                  html: `<b>Only Hard  Alloted Duty Can Be Disptached.</b>`
                  })
                 return;
    }

  }

  DispatchByExecutiveApp(item: any) {
    if (item.allotmentType === 'Hard') {
      const dialogRef = this.dialog.open(FormDialogDBEComponent, {
        width: '800px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        autoFocus: false,
        restoreFocus: false,
        panelClass: 'dbe-dialog-centered',
        data: {
          reservationID: item.reservationID,
          allotmentID: item.allotmentID,
          registrationNumber: item.registrationNumber,
          driverName: item.driverName,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'App',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          item.locationOutDate = res?.locationOutDate;
          item.locationOutTime = res?.locationOutTime;
        }
      });
    }

    else {
      Swal.fire({
                  title: '',
                  icon: 'warning',
                  html: `<b>Only Hard  Alloted Duty Can Be Disptached.</b>`
                  })
                 return;
    }
  }

  DispatchByExecutiveGPS(item: any) {
    if (item.allotmentType === 'Hard') {
      const dialogRef = this.dialog.open(FormDialogDBEComponent, {
        width: '800px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        autoFocus: false,
        restoreFocus: false,
        panelClass: 'dbe-dialog-centered',
        data: {
          reservationID: item.reservationID,
          allotmentID: item.allotmentID,
          registrationNumber: item.registrationNumber,
          driverName: item.driverName,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'GPS',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          item.locationOutDate = res?.locationOutDate;
          item.locationOutTime = res?.locationOutTime;
        }
      });
    }
    else {
      Swal.fire({
                  title: '',
                  icon: 'warning',
                  html: `<b>Only Hard  Alloted Duty Can Be Disptached.</b>`
                  })
                 return;
    }
  }

  SendSMS(reservationId, vehicle, pickupDate, pickupTime,
    registrationNumber, customerPersonName, city, item: any, primaryMobile, primaryEmail) {
    this.dialog.open(SendSMSFormDialogComponent, {
      width: '60%',
      data: {

        reservationID: reservationId,
        vehicle: vehicle,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        registrationNumber: registrationNumber,
        customerPersonName: customerPersonName,
        city: city,
        primaryMobile: primaryMobile,
        primaryEmail: primaryEmail,
        item: item
      }
    });
  }
  PickupDetail(item: any) {
    this.dialog.open(PickUpDetailShowComponent, {
      width: '500px',
      data: {
        dutySlipID: item?.dutySlipID,
        rowRecord: item
      }
    });
  }
  pickupByExecutiveManual(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      let dialogRef = this.dialog.open(FormDialogComponentPUBE, {
        data:
        {
          action: 'edit',
          allotmentID: item.allotmentID,
          driverName: item.driverName,
          regno: item.registrationNumber,
          reservationID: item.reservationID,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'Manual',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });

      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          const pickupPayload = Array.isArray(res?.data) ? res.data[0] : (res?.data ?? res);
          const pickupKM = pickupPayload?.pickUpKM ?? pickupPayload?.pickupKM ?? res?.pickUpKM ?? res?.pickupKM ?? null;
          const pickupAddress = pickupPayload?.pickUpAddressString ?? pickupPayload?.pickupAddressString ?? res?.pickUpAddressString ?? res?.pickupAddressString ?? null;
          item.pickDate = res?.pickUpDate;
          item.pickTime = res?.pickUpTime;
          item.pickUpKM = pickupKM ?? item.pickUpKM ?? item.pickupKM ?? null;
          item.pickupKM = pickupKM ?? item.pickupKM ?? item.pickUpKM ?? null;
          item.pickUpAddressString = pickupAddress ?? item.pickUpAddressString ?? item.pickupAddressString ?? null;
          item.pickupAddressString = pickupAddress ?? item.pickupAddressString ?? item.pickUpAddressString ?? null;
        }
      });
    }

  }

  pickupByExecutiveAPP(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      let dialogRef = this.dialog.open(FormDialogComponentPUBE, {
        data:
        {
          action: 'edit',
          allotmentID: item.allotmentID,
          driverName: item.driverName,
          regno: item.registrationNumber,
          reservationID: item.reservationID,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'APP',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });

      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          const pickupPayload = Array.isArray(res?.data) ? res.data[0] : (res?.data ?? res);
          const pickupKM = pickupPayload?.pickUpKM ?? pickupPayload?.pickupKM ?? res?.pickUpKM ?? res?.pickupKM ?? null;
          const pickupAddress = pickupPayload?.pickUpAddressString ?? pickupPayload?.pickupAddressString ?? res?.pickUpAddressString ?? res?.pickupAddressString ?? null;
          item.pickDate = res?.pickUpDate;
          item.pickTime = res?.pickUpTime;
          item.pickUpKM = pickupKM ?? item.pickUpKM ?? item.pickupKM ?? null;
          item.pickupKM = pickupKM ?? item.pickupKM ?? item.pickUpKM ?? null;
          item.pickUpAddressString = pickupAddress ?? item.pickUpAddressString ?? item.pickupAddressString ?? null;
          item.pickupAddressString = pickupAddress ?? item.pickupAddressString ?? item.pickUpAddressString ?? null;
        }
      });
    }

  }
  pickupByExecutiveGPS(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      let dialogRef = this.dialog.open(FormDialogComponentPUBE, {
        data:
        {
          action: 'edit',
          allotmentID: item.allotmentID,
          driverName: item.driverName,
          regno: item.registrationNumber,
          reservationID: item.reservationID,
          dutySlipID: item.dutySlipID,
          dutySlipByDriverID: item.dutySlipByDriverID,
          rowRecord: item,
          tab: 'GPS',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });

      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          const pickupPayload = Array.isArray(res?.data) ? res.data[0] : (res?.data ?? res);
          const pickupKM = pickupPayload?.pickUpKM ?? pickupPayload?.pickupKM ?? res?.pickUpKM ?? res?.pickupKM ?? null;
          const pickupAddress = pickupPayload?.pickUpAddressString ?? pickupPayload?.pickupAddressString ?? res?.pickUpAddressString ?? res?.pickupAddressString ?? null;
          item.pickDate = res?.pickUpDate;
          item.pickTime = res?.pickUpTime;
          item.pickUpKM = pickupKM ?? item.pickUpKM ?? item.pickupKM ?? null;
          item.pickupKM = pickupKM ?? item.pickupKM ?? item.pickUpKM ?? null;
          item.pickUpAddressString = pickupAddress ?? item.pickUpAddressString ?? item.pickupAddressString ?? null;
          item.pickupAddressString = pickupAddress ?? item.pickupAddressString ?? item.pickUpAddressString ?? null;
        }
      });
    }

  }
  DropOffDetail(item: any) {
    this.dialog.open(DropOffDetailShowComponent, {
      width: '500px',
      data: {
        dutySlipID: item?.dutySlipID,
        rowRecord: item
      }
    });
  }

  LocationInDetail(item: any) {
    this.dialog.open(LocationInDetailShowComponent, {
      width: '500px',
      data: {
        dutySlipID: item?.dutySlipID,
        rowRecord: item
      }
    });
  }
  openDropOffByExectiveManual(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      const dialogRef = this.dialog.open(FormDialogDropOffByExecutiveComponent,
        {
          data:
          {
            allotmentID: item.allotmentID,
            driverName: item.driverName,
            regno: item.registrationNumber,
            reservationID: item.reservationID,
            dutySlipID: item.dutySlipID,
            dutySlipByDriverID: item.dutySlipByDriverID,
            rowRecord: item,
            tab: 'Manual',
            verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
          }
        });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          const dropPayload = Array.isArray(res?.data) ? res.data[0] : (res?.data ?? res);
          const dropOffKM = dropPayload?.dropOffKM ?? dropPayload?.dropoffKM ?? dropPayload?.dropOffKm ?? dropPayload?.dropoffKm ?? res?.dropOffKM ?? res?.dropoffKM ?? res?.dropOffKm ?? res?.dropoffKm ?? null;
          const dropOffAddress = dropPayload?.dropOffAddressString ?? dropPayload?.dropoffAddressString ?? res?.dropOffAddressString ?? res?.dropoffAddressString ?? null;
          item.dropOffDate = res?.dropOffDate ?? item.dropOffDate ?? item.garageOutDate ?? null;
          item.dropOffTime = res?.dropOffTime ?? item.dropOffTime ?? item.garageOutTime ?? null;
          // Keep legacy aliases in sync for older bindings.
          item.garageOutDate = item.dropOffDate;
          item.garageOutTime = item.dropOffTime;
          item.dropOffKM = dropOffKM ?? item.dropOffKM ?? item.dropOffKm ?? item.dropoffKM ?? item.dropoffKm ?? null;
          item.dropOffKm = dropOffKM ?? item.dropOffKm ?? item.dropOffKM ?? item.dropoffKm ?? item.dropoffKM ?? null;
          item.dropoffKM = dropOffKM ?? item.dropoffKM ?? item.dropoffKm ?? item.dropOffKM ?? item.dropOffKm ?? null;
          item.dropoffKm = dropOffKM ?? item.dropoffKm ?? item.dropoffKM ?? item.dropOffKm ?? item.dropOffKM ?? null;
          item.dropOffAddressString = dropOffAddress ?? item.dropOffAddressString ?? item.dropoffAddressString ?? null;
          item.dropoffAddressString = dropOffAddress ?? item.dropoffAddressString ?? item.dropOffAddressString ?? null;
        }
      });
    }
  }

  openDropOffByExectiveAPP(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      const dialogRef = this.dialog.open(FormDialogDropOffByExecutiveComponent,
        {
          data:
          {
            allotmentID: item.allotmentID,
            driverName: item.driverName,
            regno: item.registrationNumber,
            reservationID: item.reservationID,
            dutySlipID: item.dutySlipID,
            dutySlipByDriverID: item.dutySlipByDriverID,
            rowRecord: item,
            tab: 'APP',
            verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
          }
        });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          const dropPayload = Array.isArray(res?.data) ? res.data[0] : (res?.data ?? res);
          const dropOffKM = dropPayload?.dropOffKM ?? dropPayload?.dropoffKM ?? dropPayload?.dropOffKm ?? dropPayload?.dropoffKm ?? res?.dropOffKM ?? res?.dropoffKM ?? res?.dropOffKm ?? res?.dropoffKm ?? null;
          const dropOffAddress = dropPayload?.dropOffAddressString ?? dropPayload?.dropoffAddressString ?? res?.dropOffAddressString ?? res?.dropoffAddressString ?? null;
          item.dropOffDate = res?.dropOffDate ?? item.dropOffDate ?? item.garageOutDate ?? null;
          item.dropOffTime = res?.dropOffTime ?? item.dropOffTime ?? item.garageOutTime ?? null;
          // Keep legacy aliases in sync for older bindings.
          item.garageOutDate = item.dropOffDate;
          item.garageOutTime = item.dropOffTime;
          item.dropOffKM = dropOffKM ?? item.dropOffKM ?? item.dropOffKm ?? item.dropoffKM ?? item.dropoffKm ?? null;
          item.dropOffKm = dropOffKM ?? item.dropOffKm ?? item.dropOffKM ?? item.dropoffKm ?? item.dropoffKM ?? null;
          item.dropoffKM = dropOffKM ?? item.dropoffKM ?? item.dropoffKm ?? item.dropOffKM ?? item.dropOffKm ?? null;
          item.dropoffKm = dropOffKM ?? item.dropoffKm ?? item.dropoffKM ?? item.dropOffKm ?? item.dropOffKM ?? null;
          item.dropOffAddressString = dropOffAddress ?? item.dropOffAddressString ?? item.dropoffAddressString ?? null;
          item.dropoffAddressString = dropOffAddress ?? item.dropoffAddressString ?? item.dropOffAddressString ?? null;
        }
      });
    }
  }

  openDropOffByExectiveGPS(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      const dialogRef = this.dialog.open(FormDialogDropOffByExecutiveComponent,
        {
          data:
          {
            allotmentID: item.allotmentID,
            driverName: item.driverName,
            regno: item.registrationNumber,
            reservationID: item.reservationID,
            dutySlipID: item.dutySlipID,
            dutySlipByDriverID: item.dutySlipByDriverID,
            rowRecord: item,
            tab: 'GPS',
            verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
          }
        });
      this.onDutyLifecycleDialogClosed(dialogRef, (res) => {
        if (res) {
          const dropPayload = Array.isArray(res?.data) ? res.data[0] : (res?.data ?? res);
          const dropOffKM = dropPayload?.dropOffKM ?? dropPayload?.dropoffKM ?? dropPayload?.dropOffKm ?? dropPayload?.dropoffKm ?? res?.dropOffKM ?? res?.dropoffKM ?? res?.dropOffKm ?? res?.dropoffKm ?? null;
          const dropOffAddress = dropPayload?.dropOffAddressString ?? dropPayload?.dropoffAddressString ?? res?.dropOffAddressString ?? res?.dropoffAddressString ?? null;
          item.dropOffDate = res?.dropOffDate ?? item.dropOffDate ?? item.garageOutDate ?? null;
          item.dropOffTime = res?.dropOffTime ?? item.dropOffTime ?? item.garageOutTime ?? null;
          // Keep legacy aliases in sync for older bindings.
          item.garageOutDate = item.dropOffDate;
          item.garageOutTime = item.dropOffTime;
          item.dropOffKM = dropOffKM ?? item.dropOffKM ?? item.dropOffKm ?? item.dropoffKM ?? item.dropoffKm ?? null;
          item.dropOffKm = dropOffKM ?? item.dropOffKm ?? item.dropOffKM ?? item.dropoffKm ?? item.dropoffKM ?? null;
          item.dropoffKM = dropOffKM ?? item.dropoffKM ?? item.dropoffKm ?? item.dropOffKM ?? item.dropOffKm ?? null;
          item.dropoffKm = dropOffKM ?? item.dropoffKm ?? item.dropoffKM ?? item.dropOffKm ?? item.dropOffKM ?? null;
          item.dropOffAddressString = dropOffAddress ?? item.dropOffAddressString ?? item.dropoffAddressString ?? null;
          item.dropoffAddressString = dropOffAddress ?? item.dropoffAddressString ?? item.dropOffAddressString ?? null;
        }
      });
    }
  }
  openClosingScreen(item: any) {
    if (!item.locationOutDate || !item.locationOutTime) {
      Swal.fire({
        title: '',
        icon: 'warning',
        html: `<b>Closing can not be done without dispatch.</b>`
      });
      return;
    }

    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));
    const encryptedAllotmentID = encodeURIComponent(this._generalService.encrypt(item.allotmentID.toString()));
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedDutySlipID = encodeURIComponent(this._generalService.encrypt(item.dutySlipID.toString()));
    const encryptedDutySlipForBillingID = encodeURIComponent(this._generalService.encrypt(item.dutySlipForBillingID.toString()));
    const encryptedPackageID = encodeURIComponent(this._generalService.encrypt(item.package.packageID.toString()));
    const encryptedInventoryID = encodeURIComponent(this._generalService.encrypt(item.inventoryID.toString()));
    const encryptedClosureStatus = encodeURIComponent(this._generalService.encrypt(item.closureStatus));
    const encryptedPackageTypeID = encodeURIComponent(this._generalService.encrypt(item.package.packageTypeID.toString()));
    const encryptedRegistrationNumber = encodeURIComponent(this._generalService.encrypt(item.registrationNumber));
    const encryptedPickupDate = encodeURIComponent(this._generalService.encrypt(item.pickup.pickupDate));
    const encryptedPickupTime = encodeURIComponent(this._generalService.encrypt(item.pickup.pickupTime));
    const encryptedDropOffDate = encodeURIComponent(this._generalService.encrypt(item.drop.dropOffDate));
    const encryptedDropOffTime = encodeURIComponent(this._generalService.encrypt(item.drop.dropOffTime));
    const encryptedLocationOutDate = encodeURIComponent(this._generalService.encrypt(item.locationOutDate));
    const encryptedLocationOutTime = encodeURIComponent(this._generalService.encrypt(item.locationOutTime));
    const encryptedPickupAddress = encodeURIComponent(this._generalService.encrypt(item.pickup.pickupAddress));
    const encryptedDropOffAddress = encodeURIComponent(this._generalService.encrypt(item.drop.dropOffAddress));
    const encryptedLocationOutAddress = encodeURIComponent(this._generalService.encrypt(item.organizationalEntityName));
    const encryptedAllotmentStatus = encodeURIComponent(this._generalService.encrypt(item.allotmentStatus));
    const encryptedDutySlipType = encodeURIComponent(this._generalService.encrypt(item.dutySlipType));

    // Create URL with encrypted query parameters
    const url = this.route.serializeUrl(
      this.route.createUrlTree(['/closingOne'], {
        queryParams: {
          reservationID: encryptedReservationID,
          allotmentID: encryptedAllotmentID,
          customerID: encryptedCustomerID,
          dutySlipID: encryptedDutySlipID,
          dutySlipForBillingID: encryptedDutySlipForBillingID,
          packageID: encryptedPackageID,
          inventoryID: encryptedInventoryID,
          closureStatus: encryptedClosureStatus,
          packageTypeID: encryptedPackageTypeID,
          registrationNumber: encryptedRegistrationNumber,
          pickupDate: encryptedPickupDate,
          pickupTime: encryptedPickupTime,
          dropOffDate: encryptedDropOffDate,
          dropOffTime: encryptedDropOffTime,
          locationOutDate: encryptedLocationOutDate,
          locationOutTime: encryptedLocationOutTime,
          pickupAddress: encryptedPickupAddress,
          dropOffAddress: encryptedDropOffAddress,
          locationOutAddress: encryptedLocationOutAddress,
          allotmentStatus: encryptedAllotmentStatus,
          dutySlipType: encryptedDutySlipType
         
        }
      }));
    const closingWin = window.open(this._generalService.FormURL + url, '_blank');
    closingWin?.focus();
  }
  driverRemarkDetails(item: any) {
    this.driverRemarkDetailsloadData(item)
  }

  public driverRemarkDetailsloadData(item: any) {
    this.driverRemarkService.getDriverRemarkDetails(item.dutySlipID).subscribe(
      data => {
        this.dataSource = data;

        let dialogRef = this.dialog.open(DriverRemarkDetailsComponent, {
          width: '350px',
          data: {
            row: item,
            dataSource: this.dataSource,
          }
        });

        this.onDutyLifecycleDialogClosed(dialogRef, (result) => {
          if (result !== undefined && result !== null) {
            item.activationStatus = "Active";
          }
        });
      },
      (error: HttpErrorResponse) => {
        console.error('Error while fetching driver remark details:', error);
        this.dataSource = null;
      }
    );
  }

  driverRemark(item: any) {
    let dialogRef = this.dialog.open(FormDialogdriverRemarkComponent, {
      data: {
        action: 'edit',
        dutySlipID: item.dutySlipID,
        driverRemark: item.driverRemark,
        rowRecord: item,
        verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
      }
    });

    this.onDutyLifecycleDialogClosed(dialogRef, (result) => {
      if (result !== undefined && result !== null) {
        item.driverRemark = result.driverRemark;
        item.activationStatus = "Active";
      }
    });
  }

  dutySlipImage(dutySlipID: number) {
    this.dialog.open(DutySlipImageDetailsShowComponent, {
      // width: '250px',
      data: {
        dutySlipID: dutySlipID
      }
    });
  }

  openDutySlipImage(item: any) {
    if (item.allotmentStatus === 'Alloted') {
      this._dutySlipImageService.getAllotmentIDForDutySlipImage(item.allotmentID).subscribe(
        data => {
          this.dutySlipImageAllotmentID = data;
          if (this.dutySlipImageAllotmentID.dutySlipImage ===null) {
            this.dialogRequestObject = {
              action: 'add',
              dutySlipID: item.dutySlipID,
              reservationID: item.reservationID,
              allotmentID: item.allotmentID,
              driverID: item.driverID,
              driverName: item.driverName,
              inventoryID: item.inventoryID,
              registrationNumber: item.registrationNumber,
              verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
            };
          }
          if (this.dutySlipImageAllotmentID !== null) {
            this.dialogRequestObject = {
              action: 'edit',
              dutySlipID: item.dutySlipID,
              reservationID: item.reservationID,
              allotmentID: item.allotmentID,
              verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
            };
          }
          let dialogRef = this.dialog.open(DutySlipImageDialog, {
            data: this.dialogRequestObject
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            if (result !== undefined || result !== null) {
              item.dutySlipImage = result.dutySlipImage;
              //item.activationStatus ="Active";
            }

          });
        });
    }
  }
   nextDayInstructionDetails(item: any) {
    this.nextDayInstructionDetailsloadData(item)
  }
  
    public nextDayInstructionDetailsloadData(item: any) {
      this.nextDayInstructionService.getDriverRemarkDetails(item.dutySlipID).subscribe(
        data => {
          this.dataSource = data;
    
          let dialogRef = this.dialog.open(NextDayInstructionDetailsComponent, {
            width: '500px',
            data: {
              row: item,
              dataSource: this.dataSource,
              nextDayInstruction: item.nextDayInstruction,
          nextDayInstructionDate: item.nextDayInstructionDate,
          nextDayInstructionTime: item.nextDayInstructionTime,
            }
          });
    
          dialogRef.afterClosed().subscribe(
            (result: any) => {
              if (result !== undefined && result !== null) {
                item.activationStatus ="Active";
              }
            },
            
          );
        },
        (error: HttpErrorResponse) => {
          console.error('Error while fetching driver remark details:', error);
          this.dataSource = null;
        }
      );
    }
     nextDayInstruction(item: any) {
        let dialogRef = this.dialog.open(NextDayInstructionFormDialogComponent, {
          data: {
            action: 'edit',
            dutySlipID: item.dutySlipID,
            nextDayInstruction: item.nextDayInstruction,
            nextDayInstructionDate: item.nextDayInstructionDate,
            nextDayInstructionTime: item.nextDayInstructionTime,    
            rowRecord: item,
            verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
          }
        });
      
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result !== undefined && result !== null) {
            item.nextDayInstruction = result.nextDayInstruction;
            item.activationStatus = "Active";
         
          }
        });
      }
       //--------- postPickUPCall Popup ----------
        postPickUPCall(item:any)
        {
          if(item && item.dutySlipID === null || item.dutySlipID === undefined || item.dutySlipID === 0 || item.dutySlipID === '')  {
            return;
          }
          const dialogRef = this.dialog.open(DutyPostFormDialogComponent, 
          {
             width: '500px',           
             maxHeight: '90vh',        
            data: 
            {
              
              dutySlipID: item?.dutySlipID,
              dutyPostPickUPCall: item?.dutyPostPickUPCall,
              action:'add',
              verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
              // action: (item.dutyPostPickUPCall?.dutyPostPickUPCallID === null || item.dutyPostPickUPCall?.dutyPostPickUPCallID === undefined || item?.dutyPostPickUPCall.dutyPostPickUPCallID === '' || item?.dutyPostPickUPCall.dutyPostPickUPCallID === 0) ? 'add' : 'edit'
            }
          });
          dialogRef.afterClosed().subscribe((res: any) => {
           if (res) {
            item.dutyPostPickUPCall = {
              ...(item.dutyPostPickUPCall || {}), // fallback to empty object if null
              ...res
            };
            this.postPickUPCallLoadData(item,false);  // Refresh data only if saved
          }
            
          })
        }
       postPickUPCallLoadDataDetails(item: any) {
        this.postPickUPCallLoadData(item,true)
      }
      
      public postPickUPCallLoadData(item: any, popUpOpen = true) {
        
        if (!item?.dutySlipID || !item?.reservationID) {
          console.error('Missing dutySlipID or reservationID in item:', item);
          return;
        }
        this.dutyPostPickUPCallService.getDataDutyPostPickUpCall(item.dutySlipID, item.reservationID).subscribe(
          data => {
            this.dutyPostPickUPCalldataSource = data;
            item.dutyPostPickUPCall = data;
      
            if (popUpOpen) {
              const dialogRef = this.dialog.open(DutyPostPickUPCallComponent, {
                width: '600px',
                data: {
                  row: item,
                  dutySlipID: item.dutySlipID,
                  reservationID: item.reservationID,
                  dutyPostPickUPCalldataSource: this.dutyPostPickUPCalldataSource,
                }
              });
      
              dialogRef.afterClosed().subscribe((result: any) => {
                if (result !== undefined && result !== null) {
                  item.activationStatus = "Active";
                }
              });
            }
          },
          (error: HttpErrorResponse) => {
            console.error('Error while fetching driver remark details:', error);
            this.dutyPostPickUPCalldataSource = null;
          }
        );
      }
      incidence(item: any): void {
          if (this.incidenceID !== undefined && (!item.incidenceID || item.incidenceID === 0)) { 
            item.incidenceID = this.incidenceID;
          } else {
            this.incidenceID = item.incidenceID;
          }
          let dialogRef = this.dialog.open(incidenceFormDialogComponent, {
            width: '60%',
            data: {
              advanceTable: this.advanceTable,
              action: item.incidenceID === 0 ? 'add' : 'edit',
              item: item,
              reservationID: item.reservationID ,
              customerName: item.customerName,
              customerID: item.customerID,
              registrationNumber: item.registrationNumber,
              inventoryID: item.inventoryID,
              customerPersonID: item.customerPersonID,
              driverName: item.driverName,
              organizationalEntityName: item.organizationalEntityName,
              dutySlipID: item.dutySlipID,
              verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
            }
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if(result) {
              this.incidenceID = result.incidenceID;
              this.emitEventToChild();
              // this.ngOnInit();
            }
          });
          
        }
        emitEventToChild() {
    this.eventsSubject.next(true);
  }
      
        resolution(item: any): void {
          if(this.incidenceID === undefined && item.incidenceID != 0) {
            this.incidenceID = item.incidenceID;
          }
          let dialogRef = this.dialog?.open(resolutionFormDialogComponent, {
            width: '80%',
            height: '80%',
            data: {
              advanceTable: this.advanceTable,
              action:'edit',
              item: item,
              reservationID: item.reservationID ,
              customerName: item.customerName,
              customerID: item.customerID,
              registrationNumber: item.registrationNumber,
              inventoryID: item.inventoryID,
              // customerPersonID: item.customerPersonID,
              driverName: item.driverName,
              organizationalEntityName: item.organizationalEntityName,
              dutySlipID: item.dutySlipID,
              incidenceID: this.incidenceID,
              customerPersonID: item.passengerDetails[0]?.customerPersonID,
              customerPersonName: item.passengerDetails[0]?.customerPersonName,
              verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
            }
          });
        
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              // this.incidenceID = result.incidenceID;
            }
          });
        }
 FeedBack(reservationId,cutomerPersonId,allotmentID, primaryPassengerID,dutySlipID,inventoryID,driverID,registrationNumber,driverName,reservationPassengerID,feedbackRemark, item)
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
      {
        
        width:'60%',
        data: 
          {
             advanceTable: this.advanceTable,
             action: 'add',
            reservationID:reservationId,
            customerPersonID:cutomerPersonId,
            allotmentID:allotmentID,
            dutySlipID:dutySlipID,
            primaryPassengerID:primaryPassengerID,
            inventoryID:inventoryID,
            driverID:driverID,
            registrationNumber:registrationNumber,
            driverName:driverName,
            reservationPassengerID:reservationPassengerID,
            feedbackRemark:feedbackRemark,
            customerPersonName:item.customerPerson.customerPersonName,
            item:item ,
            verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
          }
          
      });
      const dialogInstance = dialogRef.componentInstance;
     
      // Subscribe to the messageSubject to receive messages from the dialog
      dialogInstance.messageSubject.subscribe((data: any) => {
        item.feedbackRemark = data.feedbackRemark;
        item.activationStatus = "Active";
        // Handle the received message from the dialog
      });
  }
//----------TrackOnMap------------
TrackOnMapInfo(reservationID: number, item?: any) {
  const rid = Number(
    reservationID != null && reservationID !== ''
      ? reservationID
      : item?.reservationID
  );
  if (!Number.isFinite(rid) || rid <= 0) {
    console.warn('TrackOnMapInfo skipped: invalid reservationID', reservationID, item);
    return;
  }

  const trackUrl = `https://ecopartner.ecoserp.in/?id=${encodeURIComponent(String(Math.trunc(rid)))}`;
  window.open(trackUrl, '_blank', 'noopener,noreferrer');
}
 //---------- Car Moving Status By App Popup----------
  CarMovingStatusByApp(item: any) 
  {
    this.dialog.open(CarMovingStatusByAppComponent, {
      width: '500px',
      data: {
        dutySlipID: item.dutySlipID
      }
    });
  }
  //---------- Car Moving Status By App Popup----------
  AppDataMissingStatus(item: any) 
  {
    this.dialog.open(AppDataMissingStatusComponent, {
      width: '500px',
      data: {
        dutySlipID: item.dutySlipID
      }
    });
  }
  openSendSmsWhatsappMail(reservationID,vehicle,pickupDate,pickupTime,
      registrationNumber,customerPersonName,city,customerPersonID, item: any)
      {
        this.dialog.open(FormDialogSendSmsWhatsappMailComponent, {
          width: '70%',
          data: {
            // advanceTable: filtered
    
            reservationID:reservationID,
            vehicle:vehicle,
            pickupDate:pickupDate,
            pickupTime:pickupTime,    
            registrationNumber:registrationNumber,
            customerPersonName:customerPersonName,
            city:city,
            item: item,
            customerPersonID:customerPersonID
          }
        });
    
      }
      
  onNoClick(): void {
   this.dialogRef.close(this.reservationHeaderInfo);

  }
  emailInfoDetails(reservationID: number) {
      const filtered = this.reservationInfo.filter(
        (value) => value.reservationID === reservationID
      )[0];
      this.dialog.open(EmailInfoComponent, {
        width: '500px',
        data: {
          reservationID: reservationID ?? filtered?.reservationID,
          reservationGroupID: filtered?.reservationGroupID,
          advanceTable: filtered
        }
      });
    }


  CancellReservation(item:any ,i: any)
  {
    if(item.allotmentType === 'Hard')
    {
      Swal.fire({
                  title: '',
                  icon: 'error',
                  html: `<b>Reservation cannot be cancelled as it is already allotted to 
                            ${item.registrationNumber} - ${item.driverName}#${item.driverMobile}.<br><br>
                            Please cancel the Allotment before cancelling the Reservation.
                         </b>
                        `
                })
            return;
    }
    else if(item.reservationStatus === 'Cancelled')
    {
      this.dialog.open(CancelReservationAndAllotmentComponent, {
      width: '500px',
      data: {
        advanceTable: item
      }
    });
    }
    else
    {           
        
        // Fetch status first
        const reservationID = this.reservationInfo[0].reservationID;
        this.clossingOneService.getVerifyDutydata(reservationID).subscribe(
          statusData => {
            let status = '';
            if(typeof statusData === 'string') {
              status = statusData;
            } else if(statusData?.status && typeof statusData.status === 'string') {
              status = statusData.status;
            } else if(statusData?.status?.status && typeof statusData.status.status === 'string') {
              status = statusData.status.status;
            }
                      
            // Open dialog with status
            const dialogRef = this.dialog.open(FormDialogCRAComponent, 
                {
                width:'700px',
                  data: 
                    {
                      popUpTitle: 'Cancel Reservation',
                      advanceTable: this.advanceTable,             
                      allotmentID:this.reservationInfo[0].allotmentID,
                      reservationID: this.reservationInfo[0].reservationID,
                      allotmentStatus: this.reservationInfo[0].allotmentStatus,
                      allotmentType: this.reservationInfo[0].allotmentType,  
                        status: status        
                    }
                    
                });
                dialogRef.afterClosed().subscribe(res => {
                  if(res.isClose===false){
                  this._filters = new Filters({}); // ✅ Initialize it here
                  this.filterForm = this.createFilterForm(); 
                  const today = new Date();
                  this.filterForm?.patchValue({fromDate: today});
                  this.filterForm?.patchValue({toDate: today});  
                  this.filterForm.patchValue({showAllLocation:true});
                    this.filterForm.patchValue({
                      customer: '',
                      customerID: '',
                      customerGroup: '',
                      customerGroupID: '',
                      packageType: '',
                      packageTypeID: ''
                    });
                  
                  this.loadDataForHeader('complete',this.currentPage,50,true);
                    
                  
                  }
                  
                })
          },
          error => {
            console.error('CancellReservation - Error fetching status:', error);
            
            // Open dialog without status if fetch fails
            const dialogRef = this.dialog.open(FormDialogCRAComponent, 
              {
              width:'400px',
                data: 
                  {
                    popUpTitle: 'Cancel Reservation',
                    advanceTable: this.advanceTable,             
                    allotmentID:this.reservationInfo[0].allotmentID,
                    reservationID: this.reservationInfo[0].reservationID,
                    allotmentStatus: this.reservationInfo[0].allotmentStatus,
                    status: '' 
                          
                  }
                  
              });
              dialogRef.afterClosed().subscribe(res => {
                  if(res.isClose===false){
                  this._filters = new Filters({}); // ✅ Initialize it here
                  this.filterForm = this.createFilterForm(); 
                  const today = new Date();
                  this.filterForm?.patchValue({fromDate: today});
                  this.filterForm?.patchValue({toDate: today});  
                  this.filterForm.patchValue({showAllLocation:true});
                    this.filterForm.patchValue({
                      customer: '',
                      customerID: '',
                      customerGroup: '',
                      customerGroupID: '',
                      packageType: '',
                      packageTypeID: ''
                    });
                  
                  this.loadDataForHeader('complete',this.currentPage,50,true);
                    
                  
                  }
                  
                })
          }
        );
    }      
  }

public getInvoiceNumber(item:any ,i: any) 
 {
      this.controlPanelDialogeService.checkInvoiceNumber(item.reservationID).subscribe
      (
        data =>   
        {
          this.checkInvoiceNumber = data.invoiceNumber;
          if(this.checkInvoiceNumber === false)
          {
           this.CancellReservation(item,i)
          }
          else
          {
             Swal.fire({
                  title: '',
                  icon: 'warning',
                  html: `<b>Invoice is generate so reservation is not cancelled...</b>`
                  })
                 return;
          }
        
         
        },
        (error: HttpErrorResponse) => { this.checkInvoiceNumber = null;}
      );
  }

 public loadDataForHeader(status:string,currentPage: number,pageSize: number,isLoading: boolean,rowIndex?: number)
  {
    this._controlPanelDesignService.getReservationHeaderDetails(status,this.filterForm?.getRawValue()?? {},currentPage,pageSize,this.sortBy,this.orderBy).subscribe(
      (data: ControlPanelHeaderData) => {
          if (data != null) 
          {
            this.reservationHeaderInfo = data.reservationHeaderDetails;
            this.totalData = data.totalRecords;

            if (rowIndex !== undefined)
            {
              this.isExpanded[rowIndex] = true;
            }
            if (isLoading) 
            {
              this.isLoading = false;
            }
          } 
          else 
          {
            this.reservationHeaderInfo = null;
            this.totalData = 0;
          }
        },
        (error: HttpErrorResponse) => {
          this.reservationHeaderInfo = null;
        }
      );
  }
  

   createFilterForm(): FormGroup {
      return this.fb.group({
        reservationID: [this._filters.reservationID],
        vendorTripNumber: [this._filters.vendorTripNumber],
        tripStatus: [this._filters.tripStatus],
        qualityStatus: [this._filters.qualityStatus],
        reservationStatus: [this._filters.reservationStatus],
        allotmentStatus: [this._filters.allotmentStatus],
        billingStatus: [this._filters.billingStatus],
        delays: [this._filters.delays],
        security: [this._filters.security],
        disputes: [this._filters.disputes],
        reservationType: [this._filters.reservationType],
        guestType: [this._filters.guestType],
        reservationGroupID:[this._filters.reservationGroupID],
        fromDate: [this._filters.fromDate],
        toDate: [this._filters.toDate],
        fromTime: [this._filters.fromTime],
        toTime: [this._filters.toTime],
        customerGroup: [this._filters.customerGroup],
        customer: [this._filters.customer],
        booker: [this._filters.booker],
        passenger: [this._filters.customer],
        vehicleCategory:[this._filters.vehicleCategory],
        vehicleName: [this._filters.vehicleName],
        city: [this._filters.city],
        packageType: [this._filters.packageType],
        package: [this._filters.package],
        supplier:[this._filters.supplier],
        vehicleInventory:[this._filters.vehicleInventory],
        driver:[this._filters.driver],
        userID:[this._generalService.getUserID()],
        showAllLocation:[this._filters.showAllLocation],
        primarymobile:[this._filters.primarymobile],
        locationName:[this._filters.locationName],
        driverOfficialIdentityNumber:[this._filters.driverOfficialIdentityNumber],
        gender:[this._filters.gender],
        ownership:[this._filters.ownership],
        contactMobile:[this._filters.contactMobile],
        messageType:[this._filters.messageType],
        customerGroupID:[this._filters.customerGroupID],
        customerID:[this._filters.customerID],
        packageTypeID:[this._filters.packageTypeID],
        packageID:[this._filters.packageID]
      });
    }
  //--------- Location Out Time Popup ----------
  locationOutTimeUpdate(item,i) {
    this.fetchStatusAndOpen(() => {
      const dialogRef = this.dialog.open(LocationOutTimeEditComponent,
        {
          width: '520px',
          maxWidth: '96vw',
          data:
          {
            advanceTable: item,
            customerID: item.customerID,
            status: this.status
          }
        });
      dialogRef.afterClosed().subscribe((res: any) => { 
        this.loadData(item.reservationID, i);
      });
    }, item.reservationID);
  }

   allotmentHistory(item: any) {

    this.dialog.open(AllotmentLogDetailsComponent, {
      width: '500px',
      data: {
        row: item
      }
    });
  }

}



