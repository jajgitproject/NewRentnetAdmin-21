// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CDCLocalFixedDetailsService } from './cdcLocalFixedDetails.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CDCLocalFixedDetails } from './cdcLocalFixedDetails.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-cdcLocalFixedDetails',
  templateUrl: './cdcLocalFixedDetails.component.html',
  styleUrls: ['./cdcLocalFixedDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CDCLocalFixedDetailsComponent implements OnInit {
  displayedColumns = [
    'billFromTo',
    'packageJumpCriteria',
    'nextPackageSelectionCriteria',
    'packageGraceMinutes',
    'packageGraceKms',
    'activationStatus',
    'actions'
  ];
  dataSource: CDCLocalFixedDetails[] | null;
  cdcLocalFixedDetailsDetailsID: number;
  advanceTable: CDCLocalFixedDetails | null;
  SearchCDCLocalFixedDetailsType: string = '';
  SearchCDCLocalFixedDetails: string = '';
  SearchCDCLocalFixedDetailsValue: string = '';
  // SearchCDCLocalFixedDetailsValue: string = '';
  // SearchCDCLocalFixedDetails: number = 0;
  SearchActivationStatus :boolean=true;
  PageNumber: number = 0;
  sortingData: number;
  sortType: string;
  activation:string;
  search : FormControl = new FormControl();
  cdcLocalFixedDetails: FormControl = new FormControl();
  cdcLocalFixedDetailsValue: FormControl = new FormControl();
  customerContract_ID: any;
  cdcLocalFixedDetailsID: any;
  SearchBillFromTo: string='';
  SearchPackageJumpCriteria: string='';
  SearchNextPackageCriteria:string='';
  constructor(
    public httpClient: HttpClient,
    public route:ActivatedRoute,
    public dialog: MatDialog,
    public cdcLocalFixedDetailsService: CDCLocalFixedDetailsService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      // this.customerContract_ID   = paramsData.CustomerContractID;
      const encryptedCustomerContractID = paramsData.CustomerContractID;

  // Decrypt the CustomerContractID if it exists
  if (encryptedCustomerContractID) {
    this.customerContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractID));

    // Log the decrypted value for verification
  }
    });
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    //this.customerContract_ID = '';
    this.SearchBillFromTo = '';
    this.SearchPackageJumpCriteria = '';
    this.SearchNextPackageCriteria='';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          CustomerContractID:this.customerContract_ID,
        }
    });
  }
  editCall(row) {
    this.cdcLocalFixedDetailsID= row.id;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
     
        advanceTable: row,
        action: 'edit',
        CustomerContractID:this.customerContract_ID,
      }
    });

  }
  deleteItem(row)
  {

    this.cdcLocalFixedDetailsID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }

  shouldShowDeleteButton(item: any): boolean {
    return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
  }
  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
   public loadData() 
   {
      this.cdcLocalFixedDetailsService.getTableData(this.customerContract_ID,this.SearchBillFromTo,this.SearchPackageJumpCriteria,this.SearchNextPackageCriteria, this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
        // this.dataSource.forEach((ele)=>{
        //   if(ele.activationStatus===true){
        //    this.activation="Active"
        //   }
          
        //   if(ele.activationStatus===false){
        //     this.activation="Deleted"
        //    }
          
       // })
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
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
  onContextMenu(event: MouseEvent, item: CDCLocalFixedDetails) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall()
  {
    if (this.dataSource.length>0) 
    {
      this.PageNumber++;
      this.loadData();
    }
  }
  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
  }

  public SearchData()
  {
    this.loadData();
    
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
  MessageArray:string[]=[];
  private subscriptionName: Subscription; //important to create a subscription

  SubscribeUpdateService()
  {
    this.subscriptionName=this._generalService.getUpdate().subscribe
    (
      message => 
      { 
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="CDCLocalFixedDetailsCreate")
          {
            if(this.MessageArray[1]=="CDCLocalFixedDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'CDC Local Fixed Details Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CDCLocalFixedDetailsUpdate")
          {
            if(this.MessageArray[1]=="CDCLocalFixedDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CDC Local Fixed Details Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CDCLocalFixedDetailsDelete")
          {
            if(this.MessageArray[1]=="CDCLocalFixedDetailsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CDC Local Fixed Details  Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CDCLocalFixedDetailsAll")
          {
            if(this.MessageArray[1]=="CDCLocalFixedDetailsView")
            {
              if(this.MessageArray[2]=="Failure")
              {
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
          else if(this.MessageArray[0]=="DataNotFound")
          {
            if(this.MessageArray[1]=="DuplicacyError")
            {
              if(this.MessageArray[2]=="Failure")
              {
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

  SortingData(coloumName:any) {
   
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.cdcLocalFixedDetailsService.getTableDataSort(this.customerContract_ID,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



