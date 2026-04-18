// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerPersonDocumentVerificationService } from './customerPersonDocumentVerification.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerPersonDocumentVerification } from './customerPersonDocumentVerification.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogVerificationComponentHolder } from './dialogs/form-dialog/form-dialog.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { CityDropDown } from '../city/cityDropDown.model';

//import { DocumentVerificationComponentHolder } from '../customerPersonDocumentVerificationVerification/dialogs/form-dialog/documentVerification.component';
@Component({
  standalone: false,
  selector: 'app-customerPersonDocumentVerification',
  templateUrl: './customerPersonDocumentVerification.component.html',
  styleUrls: ['./customerPersonDocumentVerification.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerPersonDocumentVerificationComponent implements OnInit {
  displayedColumns = [
    'customerPersonName',
    'customer',
    'documentNumber',
    'verficationStatus',
    'activationStatus',
    'actions'
  ];
  dataSource: CustomerPersonDocumentVerification[] | null;
  customerPersonDocumentVerificationID: number;
  advanceTable: CustomerPersonDocumentVerification | null;
  SearchCustomerPersonDocumentVerification: string = ''; 
  SearchGstNumber: string='';
  SearchPercentage:string='';
  SearchDocumentNumber:string='';
  documentNumber : FormControl = new FormControl();
  billingName : FormControl = new FormControl();
  percentage: FormControl = new FormControl();
  searchEntity: FormControl = new FormControl();
  SearchEntityType:string='';
  SearchActivationStatus : string='true';
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  ActiveStatus: any;
  employee_ID:any;
  EmployeeID:number=0;
  customerPerson_ID: any;
  customerPerson_Name: any;
  public CityList?: CityDropDown[] = [];
  customer_ID: any;
  customer_Name: any;
  constructor(
   
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public customerPersonDocumentVerificationService: CustomerPersonDocumentVerificationService,
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
      // this.customerPerson_ID   = paramsData.CustomerPersonID;
      //  this.customerPerson_Name=paramsData.CustomerPersonName;
      const encryptedCustomerPersonID = paramsData.CustomerPersonID;
  const encryptedCustomerPersonName = paramsData.CustomerPersonName;

  if (encryptedCustomerPersonID && encryptedCustomerPersonName) {
    // Decrypt the values and assign them to the class properties
    this.customerPerson_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerPersonID));
    this.customerPerson_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerPersonName));
  }

  // Log the decrypted values to the console
  console.log(this.customerPerson_ID, this.customerPerson_Name);

    });
      this.loadData();
      this.SubscribeUpdateService();
  }
  refresh() {
    debugger;
  
    this.SearchCustomerPersonDocumentVerification = '';
    this.SearchDocumentNumber='';
    this.SearchActivationStatus = 'true';
    this.PageNumber=0;
    this.loadData();
  }
  addNew()
  {
    
    const dialogRef = this.dialog.open(FormDialogVerificationComponentHolder, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          CustomerPersonID:this.customerPerson_ID,
          CustomerPersonName:this.customerPerson_Name
       
        }
    });
  }
  
  editCall(row) {
      //  alert(row.id);
    this.customerPersonDocumentVerificationID = row.id;
    const dialogRef = this.dialog.open(FormDialogVerificationComponentHolder, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerPersonID:this.customerPerson_ID,
        CustomerPersonName:this.customerPerson_Name
      }
    });
  }

  public SearchData()
  {
    this.loadData();
    //this.SearchCustomerPersonDocumentVerification='';
  }
  
  public Filter()
  {
    this.PageNumber = 0;
    this.loadData();
  }
  public loadData() 
   {

      this.customerPersonDocumentVerificationService.getTableData(this.customerPerson_ID,this.SearchCustomerPersonDocumentVerification,this.SearchDocumentNumber,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
        //console.log(this.dataSource);
        this.dataSource.forEach((element)=>{
          if(element.activationStatus===true){
            this.ActiveStatus="Active"
          }
          else{
            this.ActiveStatus="Deleted"
          }
         // console.log(element);
        })
      
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
  onContextMenu(event: MouseEvent, item: CustomerPersonDocumentVerification) {
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
        console.log(this.MessageArray);
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="CustomerPersonDocumentVerificationCreate")
          {
            if(this.MessageArray[1]=="CustomerPersonDocumentVerificationView")
            {
              if(this.MessageArray[2]=="Success")
              {
                debugger;
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Person Document Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonDocumentVerificationUpdate")
          {
            if(this.MessageArray[1]=="CustomerPersonDocumentVerificationView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Document Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonDocumentVerificationDelete")
          {
            if(this.MessageArray[1]=="CustomerPersonDocumentVerificationView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Document Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonDocumentVerificationAll")
          {
            if(this.MessageArray[1]=="CustomerPersonDocumentVerificationView")
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
    debugger;
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.customerPersonDocumentVerificationService.getTableDataSort(this.customerPerson_ID,this.SearchCustomerPersonDocumentVerification,this.SearchDocumentNumber,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



