// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { ContractPackageTypeMapping } from './contractPackageTypeMapping.model';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { ContractPackageTypeMappingService } from './contractPackageTypeMapping.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageTypeDropDown } from '../packageType/packageTypeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-contractPackagetypeMapping',
  templateUrl: './contractPackageTypeMapping.component.html',
  styleUrls: [],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class ContractPackageTypeMappingComponent implements OnInit {
  displayedColumns = [
    'PackageType',
    'activationStatus',
    'actions'
  ];
  dataSource: ContractPackageTypeMapping[] | null;
  contractPackageTypeMappingID: number;
  advanceTable: ContractPackageTypeMapping | null;
  searchPackageType: string = '';
  package : FormControl = new FormControl();
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  
  Applicable_To: any;
  Applicable_From: any;
  customerContract_ID: any;
  customerContract_Name: any;
  packageType: any;
  public PackageTypeList?:PackageTypeDropDown[]=[];
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public router:Router,
    public contractPackagetypeMappingService: ContractPackageTypeMappingService,
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
      //  this.Applicable_From   = paramsData.StartDate;
      //  this.Applicable_To   = paramsData.EndDate;
      //  this.customerContract_Name=paramsData.CustomerContractName;
      const encryptedCustomerContractID = paramsData.CustomerContractID;
      const encryptedStartDate = paramsData.StartDate;
      const encryptedEndDate = paramsData.EndDate;
      const encryptedCustomerContractName = paramsData.CustomerContractName;
    
      // Decrypt the parameters if they exist
      if (encryptedCustomerContractID && encryptedStartDate && encryptedEndDate && encryptedCustomerContractName) {
        this.customerContract_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractID));
        this.Applicable_From = this._generalService.decrypt(decodeURIComponent(encryptedStartDate));
        this.Applicable_To = this._generalService.decrypt(decodeURIComponent(encryptedEndDate));
        this.customerContract_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerContractName));
    
        // Log the decrypted values to the console for verification
        console.log("Decrypted CustomerContractID:", this.customerContract_ID);
        console.log("Decrypted StartDate:", this.Applicable_From);
        console.log("Decrypted EndDate:", this.Applicable_To);
        console.log("Decrypted CustomerContractName:", this.customerContract_Name);
      }
    });
    this.loadData();
    this.getPackageType();
    this.InitPackageType();
    this.SubscribeUpdateService();
  }

   //------------Package Type -----------------
   InitPackageType(){
    this._generalService.GetPackageType().subscribe(
      data=>
      {
        this.PackageTypeList=data;
          this.filteredPackageTypeOptions = this.package.valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
  }

  private _filterPackageType(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.PackageTypeList?.filter(
      customer => 
      {
        return customer.packageType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  public getPackageType() 
  {
   this._generalService.getPackageTypeByContractID(this.customerContract_ID).subscribe
   (
     data =>   
     {

       this.packageType = data;
       console.log(this.packageType)
     
     },
     (error: HttpErrorResponse) => { this.dataSource = null;}
   );
 }
  refresh() {
    this.package.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
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
          ContractID:this.customerContract_ID
        }
    });
  }

  editCall(row) {
    //  alert(row.id);
  this.contractPackageTypeMappingID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit',
      ContractID:this.customerContract_ID
    }
  });

}
deleteItem(row)
{
  this.contractPackageTypeMappingID = row.id;
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

  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

   public loadData() 
   {
    switch (this.selectedFilter)
    {
      case 'packageType':
        this.package.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.contractPackagetypeMappingService.getTableData(this.customerContract_ID,this.package.value,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: ContractPackageTypeMapping) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall()
  {
    if (this.dataSource?.length>0) 
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
      this.loadData(); 
    } 
  }

  public SearchData()
  {
    this.loadData();
    //this.SearchContractPackageTypeMapping='';
    
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
          if(this.MessageArray[0]=="ContractPackageTypeMappingCreate")
          {
            if(this.MessageArray[1]=="ContractPackageTypeMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'ContractPackageTypeMapping Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ContractPackageTypeMappingUpdate")
          {
            if(this.MessageArray[1]=="ContractPackageTypeMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'ContractPackageTypeMapping Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ContractPackageTypeMappingDelete")
          {
            if(this.MessageArray[1]=="ContractPackageTypeMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'ContractPackageTypeMapping Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="ContractPackageTypeMappingAll")
          {
            if(this.MessageArray[1]=="ContractPackageTypeMappingView")
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
    this.contractPackagetypeMappingService.getTableDataSort(this.customerContract_ID,this.searchPackageType,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



