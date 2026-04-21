// @ts-nocheck
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DisputeResolutionService } from './disputeResolution.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DisputeResolution } from './disputeResolution.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { Form, FormControl } from '@angular/forms';
import moment from 'moment';
import { CustomerDropDown } from './customerDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DisputeService } from '../dispute/dispute.service';
import Swal from 'sweetalert2';
@Component({
  standalone: false,
  selector: 'app-disputeResolution',
  templateUrl: './disputeResolution.component.html',
  styleUrls: ['./disputeResolution.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DisputeResolutionComponent implements OnInit {
  displayedColumns = [
    'actionTaken',
    'actionTakenDate',
    'actionTakenTime',
    // 'supplierPercentage',
    'activationStatus',
    'actions'
  ];
  dataSource: DisputeResolution[] | null;
  disputeDetails: any;
  supplierCustomerFixedPercentageForAllID: number;
  advanceTable: DisputeResolution | null;
  SearchSupplierCustomerPercentageForAllID: number = 0;
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;

  SearchFromDate: string = '';
  SearchToDate: string = '';
  SearchCustomer: string = '';
  searchTerm: any = '';
  selectedFilter: string = 'search';

  fromDate: FormControl = new FormControl();
  toDate: FormControl = new FormControl();
  customer: FormControl = new FormControl();

  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  public CustomerList?: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  disputeID: number;
  disputeResolutionID: any;
  SearchactionTaken: string = '';
  reservationID: number;
  dutySlipID: number;
  verifyDutyStatusAndCacellationStatus: string;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public disputeResolutionService: DisputeResolutionService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public router: Router,
    public disputeService: DisputeService,
  
    public _generalService: GeneralService
  ) { }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {

    this.route.queryParams.subscribe(paramsData => {
      // this.vehicleCategoryID = paramsData.VehicleCategoryID;
      // this.vehicleCategory = paramsData.VehicleCategory;
      const encrypteddisputeID = this.route.snapshot.queryParamMap.get('disputeID');
      const encryptedreservationID = this.route.snapshot.queryParamMap.get('reservationID');
       const encrypteddutySlipID = this.route.snapshot.queryParamMap.get('dutySlipID');
       this.verifyDutyStatusAndCacellationStatus = this.route.snapshot.queryParamMap.get('verifyDutyStatusAndCacellationStatus');
      // Check if the parameters exist
      if (encrypteddisputeID) {
        // Decrypt and decode the parameters
        this.disputeID = Number(this._generalService.decrypt(decodeURIComponent(encrypteddisputeID)));
        this.reservationID = Number(this._generalService.decrypt(decodeURIComponent(encryptedreservationID)));
        this.dutySlipID = Number(this._generalService.decrypt(decodeURIComponent(encrypteddutySlipID)));

        // Log the decrypted values
      }

    })
    this.loadData();
    this.InitCustomer();
    this.SubscribeUpdateService();
    this.disputeloadData();
  }
  refresh() {
    this.SearchactionTaken = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.loadData();
  }

  public SearchData() {

    this.loadData();
  }

  onBackPress(event) {
    if (event.keyCode === 8) {
      this.loadData();
    }
  }

  InitCustomer() {
    this._generalService.GetCustomers().subscribe(
      data => {
        this.CustomerList = data;
        this.filteredCustomerOptions = this.customer.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerList.filter(
      customer => {
        return customer.customerName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent,
      {
        data:
        {
          advanceTable: this.advanceTable,
          disputeID: this.disputeID,
          reservationID: this.reservationID,
          action: 'add',
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      });
  }
  editCall(row) {
    //  alert(row.id);
    this.disputeResolutionID = row.disputeResolutionID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        disputeID: this.disputeID,
        reservationID: this.reservationID,
        action: 'edit',
        verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
      }
    });

  }
  deleteItem(row) {

    this.disputeResolutionID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent,
      {
        data: row
      });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
  }
  public Filter() {
    this.PageNumber = 0;
    this.loadData();
  }
  //  public loadData() 
  //  {

  //     this.disputeResolutionService.getTableData(
  //       this.SearchSupplierCustomerPercentageForAllID,
  //       this.customer.value,
  //       this.SearchFromDate,
  //       this.SearchToDate,
  //       this.SearchActivationStatus, 
  //       this.PageNumber).subscribe
  //   (
  //     data =>   
  //     {

  //       this.dataSource = data;
  //       // this.dataSource?.forEach((ele)=>{
  //       //   if(ele.activationStatus===true){
  //       //     this.activeData="Active";
  //       //   }
  //       // })

  //     },
  //     (error: HttpErrorResponse) => { this.dataSource = null;}
  //   );
  // }

  public loadData() {
    switch (this.selectedFilter) {
      case 'actionTaken':
        this.SearchactionTaken = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;

    }
    this.disputeResolutionService.getTableData(this.disputeID, this.SearchactionTaken, this.SearchActivationStatus, this.PageNumber, 'Ascending').subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  public disputeloadData() {

    this.disputeResolutionService.getDisputeDetails(this.disputeID).subscribe
      (
        data => {
          this.disputeDetails = data;
        },
        (error: HttpErrorResponse) => { this.disputeDetails = null; }
      );
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: DisputeResolution) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  NextCall() {
    if (this.dataSource?.length > 0) {

      this.PageNumber++;
      //alert(this.PageNumber + 'mohit')
      this.loadData();
    }
    //alert([this.PageNumber])
  }
  PreviousCall() {

    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
  }

  /////////////////for Image Upload ends////////////////////////////

  /////////////////To Recieve Updates Start////////////////////////////
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe
      (
        message => {
          //message contains the data sent from service
          this.messageReceived = message.text;
          this.MessageArray = this.messageReceived.split(":");
          if (this.MessageArray.length == 3) {
            if (this.MessageArray[0] == "DisputeResolutionCreate") {
              if (this.MessageArray[1] == "DisputeResolutionView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Dispute Resolution Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DisputeResolutionUpdate") {
              if (this.MessageArray[1] == "DisputeResolutionView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Dispute Resolution  Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DisputeResolutionDelete") {
              if (this.MessageArray[1] == "DisputeResolutionView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Dispute Resolution  Deleted...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DisputeResolutionAll") {
              if (this.MessageArray[1] == "DisputeResolutionView") {
                if (this.MessageArray[2] == "Failure") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-danger',
                    'Operation Failed.....!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "DataNotFound") {
              if (this.MessageArray[1] == "DuplicacyError") {
                if (this.MessageArray[2] == "Failure") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-danger',
                    'Duplicate Value Found.....!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
          }
        }
      );
  }

  SortingData(coloumName: any) {
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.disputeResolutionService.getTableDataSort(this.disputeID, this.SearchactionTaken, this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
      (
        data => {
          this.dataSource = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
  approveStatus() 
  {
    const status = this.verifyDutyStatusAndCacellationStatus;
    const isAllowed = status === 'Changes allow';
    Swal.fire({
      title: isAllowed ? 'Are you sure?' : '',
      html: isAllowed
      ? '<p>You want to approve this dispute status?</p>'
      : `<p style="color: red; font-weight: 500;">${status}</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, approve it!',
      cancelButtonText: 'Cancel',
      customClass: {
        cancelButton: 'btn btn-danger',
        confirmButton: 'btn btn-primary custom-confirm'
      },
      buttonsStyling: false, // Let Bootstrap classes apply fully
      didOpen: () => {
      const confirmBtn = Swal.getConfirmButton();
      if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow')
      {
        confirmBtn.setAttribute('disabled', 'true');
        confirmBtn.classList.remove('btn-primary');
        confirmBtn.classList.add('btn-secondary', 'swal2-disabled'); // optional gray-out styling
      }
    }
    }).then((result) => {
      if (result.isConfirmed && this.verifyDutyStatusAndCacellationStatus === 'Changes allow') {
        // Call the API only if confirmed
        this.disputeService.approveDisputeStatus(this.disputeID,this.dutySlipID)
          .subscribe(
            response => {
              this.showNotification(
                'snackbar-success',
                'Dispute Status Approved...!!!',
                'bottom',
                'center'
              );
            },
            error => {
              this.showNotification(
                'snackbar-danger',
                'Operation Failed...!!!',
                'bottom',
                'center'
              );
            }
          );
      } else {
        // Optional: You can handle cancellation here if needed
      }
    });
  }

}




