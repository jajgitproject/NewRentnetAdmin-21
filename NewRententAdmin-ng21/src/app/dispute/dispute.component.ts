// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogDisputeComponent } from '../dispute/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { Dispute } from './dispute.model';
import { DisputeService } from './dispute.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  standalone: false,
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DisputeComponent implements OnInit {
  @Input() disputeAdvanceTable;
  @Input() dutySlipID;
  @Input() reservationID;
  @Input() verifyDutyStatusAndCacellationStatus;
  displayedColumns = [
    'disputeDetails',
    'disputeKM',
    'disputeMinutes',
    'disputeDate',
    'disputeTime',
    'status',
    'approvalStatus',
    'actions'
  ];
  dataSource: Dispute[] | null;
  bankID: number;
  advanceTable: Dispute | null;
  SearchBank: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search: FormControl = new FormControl();
  dutySlipForBillingID: number;

  // menuItems: any[] = [
  //   { label: 'DisputeResolution', tooltip: 'DisputeResolution', pageName: 'DisputeResolution' },
  // ];

  menuItems: any[] = [
    { label: 'Dispute Resolution', tooltip: 'Dispute Resolution' }
  ];
  disputeID: string;
  // reservationID: string;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    public disputeService: DisputeService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
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
      const encrypteddisputeID = paramsData.disputeID;
      
      if (encrypteddisputeID) {

        this.disputeID = this._generalService.decrypt(decodeURIComponent(encrypteddisputeID));
      }

    });
    this.loadData();
    //this.DisputeLoadData();
    this.SubscribeUpdateService();
    // console.log(this.reservationID);
    // console.log(this.dutySlipID);
  }
  refresh() {
    this.SearchBank = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(FormDialogDisputeComponent,
      {
        data:
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
      });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadData();
    });
  }

  editCall(row) {
    //  alert(row.id);
    this.dutySlipID = row.id;
    const dialogRef = this.dialog.open(FormDialogDisputeComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      this.loadData();
    });

  }
  deleteItem(row) {
    this.dutySlipID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent,
      {
        data: row
      });
  }

  public Filter() {
    this.PageNumber = 0;
    this.loadData();
  }
  public loadData() {
    this.disputeService.getTableData(this.dutySlipForBillingID, this.PageNumber, 'Ascending').subscribe
      (
        data => {
          this.disputeAdvanceTable = data;
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  public DisputeLoadData() 
    {
      this.disputeService.getDisputeInfo(this.dutySlipID).subscribe
      (
        (data: Dispute[]) =>   
        {
          // if(data!= null)
          // {
          //   this.showHideDispute=true;
          // }
          this.disputeAdvanceTable = data;
          this.disputeService.updateDisputeData(data); 
        },
        

      (error: HttpErrorResponse) => { this.disputeAdvanceTable = null;}
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
  onContextMenu(event: MouseEvent, item: Dispute) {
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
      this.loadData();
    }
  }
  PreviousCall() {
    if (this.PageNumber > 0) {
      this.PageNumber--;
      this.loadData();
    }
  }

  public SearchData() {
    this.loadData();
    //this.SearchBank='';

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
            if (this.MessageArray[0] == "BankCreate") {
              if (this.MessageArray[1] == "BankView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Bank Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "BankUpdate") {
              if (this.MessageArray[1] == "BankView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Bank Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "BankDelete") {
              if (this.MessageArray[1] == "BankView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Bank Deleted...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "BankAll") {
              if (this.MessageArray[1] == "BankView") {
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
    this.disputeService.getTableDataSort(this.dutySlipForBillingID, this.PageNumber, coloumName.active, this.sortType).subscribe
      (
        data => {
          this.dataSource = data;

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }

  openInNewTab(menuItem: any, rowItem: any) {
    console.log(this.verifyDutyStatusAndCacellationStatus)
    let baseUrl = this._generalService.FormURL;
    if (menuItem.label.toLowerCase() === 'dispute resolution') {
      // Encrypt the required values
      const encrypteddisputeID = this._generalService.encrypt(encodeURIComponent(rowItem.disputeID));
      const encryptedreservationID = this._generalService.encrypt(encodeURIComponent(this.reservationID));
       const encrypteddutySlipID = this._generalService.encrypt(encodeURIComponent(this.dutySlipID));

      // Create the URL with the encrypted values
      const url = this.router.serializeUrl(this.router.createUrlTree(['//disputeResolution'], {
        queryParams: {
          disputeID: encrypteddisputeID,
          reservationID: encryptedreservationID,
          dutySlipID: encrypteddutySlipID,
          verifyDutyStatusAndCacellationStatus:this.verifyDutyStatusAndCacellationStatus
        }
      }));

      // Open the new tab with the encrypted URL
      window.open(baseUrl + url, '_blank');
      // window.open(baseUrl + url);
    }
  }
  approveStatus(rowItem: any) 
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
      confirmButton: 'btn btn-primary'
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
      this.disputeService.approveDisputeStatus(rowItem.disputeID,this.dutySlipID)
        .subscribe(
          response => {
            this.showNotification(
              'snackbar-success',
              'Dispute Status Approved...!!!',
              'bottom',
              'center'
            );
                this.DisputeLoadData();
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
      //console.log('User cancelled the approval');
    }
  });
}

}



