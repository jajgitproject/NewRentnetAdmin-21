// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupplierRateCardSupplierMappingService } from './supplierRateCardSupplierMapping.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupplierRateCardSupplierMapping } from './supplierRateCardSupplierMapping.model';
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
import { CitiesDropDown } from '../organizationalEntity/citiesDropDown.model';
import { SupplierContractForDropDownModel, SupplierRateCardDropDown } from '../supplierRateCard/supplierRateCardDropDown.model';
@Component({
  standalone: false,
  selector: 'app-supplierRateCardSupplierMapping',
  templateUrl: './supplierRateCardSupplierMapping.component.html',
  styleUrls: ['./supplierRateCardSupplierMapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierRateCardSupplierMappingComponent implements OnInit {
  displayedColumns = [
    'supplierContractName',
    'supplierName',
    'status',
    'actions'
  ];
  dataSource: SupplierRateCardSupplierMapping[] | null;
  supplierRateCardSupplierMappingID: number;
  advanceTable: SupplierRateCardSupplierMapping | null;
  SearchSupplierRateCardName: string = '';
  SearchSupplierRateCardSupplierMappingID:number=0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  supplier_ID: any;
  supplier_Name: any;
  
 selectedFilter: string = 'search';
 searchTerm: any = '';
 filterSelected:boolean = true;
  public CityList?: CitiesDropDown[] = [];
  public RateList?: SupplierContractForDropDownModel[] = [];
  filteredRateOptions: Observable<SupplierContractForDropDownModel[]>
  SearchSupplierName: string = '';
  SearchSupplierContractMappingID: number;
  supplierContractName: string = '';
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public supplierRateCardSupplierMappingService: SupplierRateCardSupplierMappingService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
  
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
      // this.supplier_ID   = paramsData.SupplierID;
      // this.supplier_Name   = paramsData.SupplierName;
      if (paramsData.SupplierID && paramsData.SupplierName) {
        const encryptedSupplierID = decodeURIComponent(paramsData.SupplierID);
        const encryptedSupplierName = decodeURIComponent(paramsData.SupplierName);
      
        if (encryptedSupplierID && encryptedSupplierName) {
          this.supplier_ID = this._generalService.decrypt(encryptedSupplierID);
          this.supplier_Name = decodeURIComponent(this._generalService.decrypt(encryptedSupplierName));  // Decode again after decryption
        }
      }
      
      console.log("Decrypted Supplier ID:", this.supplier_ID);
      console.log("Decrypted Supplier Name:", this.supplier_Name);
      
      // console.log(this.supplier_ID)
      // console.log(this.supplier_Name)
    });
    this.InitCities()
    this.initRate();
    this.loadData();
    this.SubscribeUpdateService();
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  refresh() {
    this.search.setValue('');
    this.searchTerm='';
    this.selectedFilter ='search';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  InitCities(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
      });
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
          SUPPLIERID:this.supplier_ID,
          SUPPLIERNAME:this.supplier_Name
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.supplierRateCardSupplierMappingID = row.supplierRateCardSupplierMappingID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        SUPPLIERID:this.supplier_ID,
        SUPPLIERNAME:this.supplier_Name
      }
    });

  }
  deleteItem(row)
  {

    this.supplierRateCardSupplierMappingID = row.id;
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
    {
    switch (this.selectedFilter)
    {
      case 'supplierContractName':
      this.search.setValue(this.searchTerm) ;
        break;
      default:
        this.searchTerm = '';
        break;
    
  }
}
      this.supplierRateCardSupplierMappingService.getTableData(this.search.value,this.supplier_ID,this.search.value,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: SupplierRateCardSupplierMapping) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
  NextCall()
  {
    //console.log(this.dataSource.length>0)
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

  initRate() {
    this._generalService.GetSupplierContract().subscribe(
      data => {
        ;
        this.RateList = data;
        this.filteredRateOptions = this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filterRate(value || ''))
        );
        //console.log(this.StateList);
      },
      error => {

      }
    );
  }
  private _filterRate(value: string): any {
  const filterValue = value.toLowerCase();

  // Only show results after 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.RateList.filter(customer =>
    customer.supplierContractName.toLowerCase().indexOf(filterValue) === 0
  );
}

//  private _filterRate(value: string): any {
//     const filterValue = value.toLowerCase();
//     return this.RateList.filter(
//       customer => 
//       {
//         return customer.supplierContractName.toLowerCase().indexOf(filterValue)===0;
//       }
//     );
//   }
  
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
          if(this.MessageArray[0]=="SupplierContractSupplierMappingCreate")
          {
            if(this.MessageArray[1]=="SupplierContractSupplierMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Contract Supplier Mapping Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractSupplierMappingUpdate")
          {
            if(this.MessageArray[1]=="SupplierContractSupplierMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract Supplier Mapping Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractSupplierMappingDelete")
          {
            if(this.MessageArray[1]=="SupplierContractSupplierMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Contract Supplier Mapping Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierContractSupplierMappingAll")
          {
            if(this.MessageArray[1]=="SupplierContractSupplierMappingView")
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
    this.supplierRateCardSupplierMappingService.getTableDataSort(this.supplierContractName,this.supplier_ID,this.SearchSupplierName,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



