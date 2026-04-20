// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerPersonInventoryRestrictionService } from './customerPersonInventoryRestriction.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerPersonInventoryRestriction } from './customerPersonInventoryRestriction.model';
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
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { RegistrationDropDown } from '../interstateTaxEntry/registrationDropDown.model';

@Component({
  standalone: false,
  selector: 'app-customerPersonInventoryRestriction',
  templateUrl: './customerPersonInventoryRestriction.component.html',
  styleUrls: ['./customerPersonInventoryRestriction.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerPersonInventoryRestrictionComponent implements OnInit {
  displayedColumns = [
    'registrationNumber',
    'remark',
    'status',
    'actions'
  ];
  dataSource: CustomerPersonInventoryRestriction[] | null;
  customerPersonInventoryRestrictionID: number;
  advanceTable: CustomerPersonInventoryRestriction | null;
  SearchName: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  customerPerson_ID: any;
  customerPerson_Name: any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;
  filteredInventoryOptions:Observable<VehicleDropDown[]>;
  public InventoryList:VehicleDropDown[]=[];
  inventory : FormControl=new FormControl();
  searchInventoryName:string="";
   registrationNumber: FormControl = new FormControl();
    filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
    public RegistrationNumberList?: RegistrationDropDown[] = [];
    RegistrationNumber: string = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public customerPersonInventoryRestrictionService: CustomerPersonInventoryRestrictionService,
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
    //   this.customerPerson_ID   = paramsData.CustomerPersonID;
    //    this.customerPerson_Name=paramsData.CustomerPersonName;
    // });
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
this.InitRegistrationNumber();
    this.loadData();
    this.SubscribeUpdateService();
   
  }

  refresh() {
    this.registrationNumber.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  public SearchData()
  {
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
          CustomerPersonID:this.customerPerson_ID,
          CustomerPersonName:this.customerPerson_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerPersonInventoryRestrictionID = row.customerPersonInventoryRestrictionID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        CustomerPersonID:this.customerPerson_ID,
        CustomerPersonName:this.customerPerson_Name
      }
    });

  }
  deleteItem(row)
  {

    this.customerPersonInventoryRestrictionID = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, 
    {
      data: row
    });
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
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
    switch (this.selectedFilter)
    {
      
      case 'registrationNumber':
        this.registrationNumber.setValue(this.searchTerm);
        break;
       
      default:
        this.searchTerm = '';
        break;
    }
      this.customerPersonInventoryRestrictionService.getTableData(this.registrationNumber.value || this.RegistrationNumber,this.customerPerson_ID,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
       
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
  onContextMenu(event: MouseEvent, item: CustomerPersonInventoryRestriction) {
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
      //alert(this.PageNumber + 'mohit')
      this.loadData();
    }
    //alert([this.PageNumber])
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
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="CustomerPersonInventoryRestrictionCreate")
          {
            if(this.MessageArray[1]=="CustomerPersonInventoryRestrictionView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Person Inventory Restriction Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonInventoryRestrictionUpdate")
          {
            if(this.MessageArray[1]=="CustomerPersonInventoryRestrictionView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Inventory Restriction Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonInventoryRestrictionDelete")
          {
            if(this.MessageArray[1]=="CustomerPersonInventoryRestrictionView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Inventory Restriction Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonInventoryRestrictionAll")
          {
            if(this.MessageArray[1]=="CustomerPersonInventoryRestrictionView")
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
    this.customerPersonInventoryRestrictionService.getTableDataSort(this.RegistrationNumber,this.customerPerson_ID,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
  InitRegistrationNumber(){
    this._generalService.GetRegistrationForDropDown().subscribe(
      data=>
      {
        this.RegistrationNumberList=data;
        console.log(this.RegistrationNumberList);
        this.filteredRegistrationNumberOptions = this.registrationNumber.valueChanges.pipe(
          startWith(""),
          map(value => this._filterRN(value || ''))
        ); 
      });
  }
  
  private _filterRN(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3)
     {
        return [];   
      }
    return this.RegistrationNumberList.filter(
      customer => 
      {
        return customer.registrationNumber.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
}



