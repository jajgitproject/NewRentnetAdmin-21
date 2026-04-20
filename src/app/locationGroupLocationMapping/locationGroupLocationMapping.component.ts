// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
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
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceTemplateDropDown } from '../invoiceTemplate/invoiceTemplateDropDown.model';
import { LocationGroupLocationMapping } from './locationGroupLocationMapping.model';
import { LocationGroupLocationMappingService } from './locationGroupLocationMapping.service';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';

@Component({
  standalone: false,
  selector: 'app-locationGroupLocationMapping',
  templateUrl: './locationGroupLocationMapping.component.html',
  styleUrls: ['./locationGroupLocationMapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class LocationGroupLocationMappingComponent implements OnInit {
  displayedColumns = [
    'OrganizationalEntityName',
    'status',
    'actions'
  ];
  dataSource: LocationGroupLocationMapping[] | null;
  invoiceTemplateID: number;
  advanceTable: LocationGroupLocationMapping | null;
  SearchInvoiceTemplateName: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  customer_Name: any;
  customer_ID: any;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;
  customerInvoiceTemplateID: any;
  filteredInvoiceTemplateOptions:Observable<InvoiceTemplateDropDown[]>;
  public InvoiceTemplateList?:InvoiceTemplateDropDown[]=[];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  filteredLocationOptions: Observable<OrganizationalEntityDropDown[]>;
  location = new FormControl();
  locationGroupID: any;
  locationGroupName: any;
  locationGroupLocationMappingID: any;
 

  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public locationGroupLocationMappingService: LocationGroupLocationMappingService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
@ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    this.route.queryParams.subscribe(paramsData =>{
     this.locationGroupID = paramsData.locationGroupID;
   this.locationGroupName = paramsData.locationGroup;
    
     
    });
    this.initServiceLocation();
    this.loadData();
    this.SubscribeUpdateService();
  }

  initServiceLocation(){
    this._generalService.GetLocation().subscribe(
      data=>{
        this.OrganizationalEntitiesList=data;
        this.filteredLocationOptions = this.location.valueChanges.pipe(
          startWith(""),
          map(value => this._filterLocation(value || ''))
        );
      }
    )
  }
  
  private _filterLocation(value: string): any {
    const filterValue = value.toLowerCase();
    return this.OrganizationalEntitiesList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };
  
refresh() {
  this.location.setValue('');
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
          locationGroupID:this.locationGroupID,
          
        }
    });
  }

  editCall(row) {
    //  alert(row.id);
  this.locationGroupLocationMappingID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit',
      locationGroupID:this.locationGroupID,
      
    }
  });

}
deleteItem(row)
{
  this.locationGroupLocationMappingID = row.id;
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
     
      case 'location':
        this.location.setValue(this.searchTerm);
        break;
       
      default:
        this.searchTerm = '';
        break;
    }
      this.locationGroupLocationMappingService.getTableData(this.locationGroupID,this.location.value,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: LocationGroupLocationMapping) {
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
    //this.SearchInvoiceTemplate='';
    
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
          if(this.MessageArray[0]=="LocationGroupLocationMappingCreate")
          {
            if(this.MessageArray[1]=="LocationGroupLocationMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Location Group Location Mapping Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="LocationGroupLocationMappingUpdate")
          {
            if(this.MessageArray[1]=="LocationGroupLocationMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Location Group Location Mapping Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="LocationGroupLocationMappingDelete")
          {
            if(this.MessageArray[1]=="LocationGroupLocationMappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Location Group Location Mapping Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="LocationGroupLocationMappingAll")
          {
            if(this.MessageArray[1]=="LocationGroupLocationMappingView")
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
    this.locationGroupLocationMappingService.getTableDataSort(this.locationGroupID,this.location.value,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }


  openSearchDialog() {
    this.dialog.open(this.searchDialog, { width: '500px' });
  }

  SearchFromDialog(dialogRef: any) {
    SearchData();
    dialogRef.close();
  }

}



