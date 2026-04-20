// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LutService } from './lut.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Lut } from './lut.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
// import { FormDialogLutComponent } from '../lut/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { BankBranchDropDown } from '../bankChargeConfig/bankBranchDropDown.model';
import { BankDropDown } from '../bankChargeConfig/bankDropDown.model';
import { FormDialogLutComponent } from './dialogs/form-dialog/form-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
//import { FormDialogLutComponent } from './dialogs/form-dialog/form-dialog.component';
@Component({
  standalone: false,
  selector: 'app-lut',
  templateUrl: './lut.component.html',
  styleUrls: ['./lut.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class LutComponent implements OnInit {
  displayedColumns = [
    'image',
    // 'companyBranch',
    // 'bankBranch',
    'startDate',
    'endDate',
    'lutNo',
    'status',
    'actions'
  ];

  public BranchList?: BankBranchDropDown[] = [];
  filteredBankBranchOptions: Observable<BankBranchDropDown[]>;
  public BankList?: BankDropDown[] = [];
  filteredBankOptions: Observable<BankDropDown[]>;
  dataSource: Lut[] | null;
  lutID: number;
  advanceTable: Lut | null;
  SearchBankBranch: string = '';
  SearchBank: string = '';
  SearchLutNo: string = '';
  //SearchName: string = '';
  SearchActivationStatus: boolean = true;
  PageNumber: number = 0;
  search: FormControl = new FormControl();
  bank: FormControl = new FormControl();
  lutNo: FormControl = new FormControl();
  sortingData: number;
  sortType: string;
  activation: string;
  searchcompanyBranch: string = '';
  organizationalEntitID: any;
  organizationalEntityID: any;
  organizationalEntityName: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public lutService: LutService,
    private snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public router: Router,
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
      // this.organizationalEntityID = paramsData.organizationalEntityID;
      // this.organizationalEntityName = paramsData.organizationalEntityName;
      const encryptedOrganizationalEntityID = this.route.snapshot.queryParamMap.get('organizationalEntityID');
  const encryptedOrganizationalEntityName = this.route.snapshot.queryParamMap.get('organizationalEntityName');
  
  // Check if the parameters exist
  if (encryptedOrganizationalEntityID && encryptedOrganizationalEntityName) {
    // Decrypt and decode the parameters
    this.organizationalEntityID = this._generalService.decrypt(decodeURIComponent(encryptedOrganizationalEntityID));
    this.organizationalEntityName = this._generalService.decrypt(decodeURIComponent(encryptedOrganizationalEntityName));
    // Decode the URL-encoded string after decryption
    this.organizationalEntityName = decodeURIComponent(this.organizationalEntityName);

    // Log the decrypted values
    console.log("Decrypted Organizational Entity ID: ", this.organizationalEntityID);
    console.log("Decrypted Organizational Entity Name: ", this.organizationalEntityName);
  }
}
  );
   
    if(this.organizationalEntityID === undefined || this.organizationalEntityID === null){
      this.loadData();
    } else {
      this.LutloadData();
      console.log( this.organizationalEntityName)
    }
    this.InitBranch();
    this.InitBank();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.search.setValue('');
    this.bank.setValue('');
    this.SearchLutNo = '';
    //this.SearchName = '';
    this.SearchActivationStatus = true;
    this.PageNumber = 0;
    if(this.organizationalEntityID === undefined || this.organizationalEntityID === null){
      this.loadData();
    } else {
      this.LutloadData();
    }
  }

  addNew() {
    console.log(this.organizationalEntityID)
    const dialogRef = this.dialog.open(FormDialogLutComponent,
      {
        data:
        {
          organizationalEntityID: this.organizationalEntityID,
          organizationalEntityName: this.organizationalEntityName,
          advanceTable: this.advanceTable,
          action: 'add'
        }
      });
  }

  editCall(row) {
    this.lutID = row.id;
    console.log(row);
  
    const dialogRef = this.dialog.open(FormDialogLutComponent, {
      data: {
        organizationalEntityID: this.organizationalEntityID,
        organizationalEntityName: this.organizationalEntityName,
        advanceTable: row,
        action: 'edit'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      {
        if(this.organizationalEntityID === undefined || this.organizationalEntityID === null){
          this.loadData();
        } else {
          this.LutloadData();
        }
      }
    });
  }
  
  deleteItem(row) {
    this.lutID = row.id;
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
  public loadData() {
    this.lutService.getTableData(this.search.value, this.bank.value, this.SearchLutNo, this.searchcompanyBranch, this.SearchActivationStatus, this.PageNumber).subscribe
      (
        
        data => {
          this.dataSource = data;
          console.log(this.dataSource)
          //   this.dataSource.forEach((ele)=>{
          //     if(ele.activationStatus===true){
          //      this.activation="Active"
          //     }
          //     if(ele.activationStatus===false){
          //       this.activation="Deleted"
          //      }
          //   })
        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
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
  onContextMenu(event: MouseEvent, item: Lut) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall() {
    if (this.dataSource.length > 0) {
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

    //this.SearchBankBranch='';

  }

  public LutloadData() {

    this.lutService.GetLutForBranch(this.organizationalEntityID).subscribe
      (
        data => {
          this.advanceTable = data;
          this.dataSource = data;
          console.log(this.advanceTable)
        },
        (error: HttpErrorResponse) => { this.advanceTable = null; }
      );
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
            if (this.MessageArray[0] == "LutCreate") {
              if (this.MessageArray[1] == "LutView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Lut Created...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "LutUpdate") {
              if (this.MessageArray[1] == "LutView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Lut Updated...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "LutDelete") {
              if (this.MessageArray[1] == "LutView") {
                if (this.MessageArray[2] == "Success") {
                  this.refresh();
                  this.showNotification(
                    'snackbar-success',
                    'Lut Deleted...!!!',
                    'bottom',
                    'center'
                  );
                }
              }
            }
            else if (this.MessageArray[0] == "LutAll") {
              if (this.MessageArray[1] == "LutView") {
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
  InitBank() {
    this._generalService.GetBank().subscribe(
      data => {
        this.BankList = data;
        this.filteredBankOptions = this.bank.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.BankList.filter(
      customer => {
        return customer.bank.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  InitBranch() {
    this._generalService.GetBranch().subscribe(
      data => {
        this.BranchList = data;
        this.filteredBankBranchOptions = this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filterBankBranch(value || ''))
        );
      });
  }

  private _filterBankBranch(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.BranchList.filter(
      customer => {
        return customer.bankBranch.toLowerCase().indexOf(filterValue) === 0;
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
    this.lutService.getTableDataSort(this.SearchBankBranch, this.SearchBank, this.SearchLutNo, this.searchcompanyBranch, this.SearchActivationStatus, this.PageNumber, coloumName.active, this.sortType).subscribe
      (
        data => {
          this.dataSource = data;

        },
        (error: HttpErrorResponse) => { this.dataSource = null; }
      );
  }
}



