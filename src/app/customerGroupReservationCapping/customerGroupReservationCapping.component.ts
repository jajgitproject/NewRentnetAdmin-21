// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomerGroupReservationCappingService } from './customerGroupReservationCapping.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerGroupReservationCappingModel } from './customerGroupReservationCapping.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../customerGroupReservationCapping/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-customerGroupReservationCapping',
  templateUrl: './customerGroupReservationCapping.component.html',
  styleUrls: ['./customerGroupReservationCapping.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerGroupReservationCappingComponent implements OnInit {
  displayedColumns = [
    'GeoPoint.GeoPointName',
    'PackageType.PackageType',
    'VehicleCategory.VehicleCategory',
    'CustomerGroupReservationCapping.MondayCap',
    'CustomerGroupReservationCapping.TuesdayCap',
    'CustomerGroupReservationCapping.WednesdayCap',
    'CustomerGroupReservationCapping.ThursdayCap',
    'CustomerGroupReservationCapping.FridayCap',
    'CustomerGroupReservationCapping.SaturdayCap',
    'CustomerGroupReservationCapping.SundayCap',
    'status',
    'actions'
  ];
  dataSource: CustomerGroupReservationCappingModel[] | null;
  advanceTable: CustomerGroupReservationCappingModel | null;

  SearchCity: string = '';
  SearchPackageType: string = '';
  SearchVehicleCategory: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  sacID: number;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;
  customerGroup_ID: any;
  customerGroup_Name: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public customerGroupReservationCappingService: CustomerGroupReservationCappingService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
    public route:ActivatedRoute
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  
  @ViewChild('searchDialog') searchDialog: TemplateRef<any>;
@ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedCustomerGroupID = paramsData.CustomerGroupID;
      const encryptedCustomerGroupName = paramsData.CustomerGroupName;
      this.customerGroup_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupID));
      this.customerGroup_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupName));
    });
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() 
  {
    this.SearchCity = '';
    this.SearchPackageType = '';
    this.SearchVehicleCategory = '';
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
          CustomerGroupID:this.customerGroup_ID,
          CustomerGroupName:this.customerGroup_Name
        }
    });
  }

  editCall(row) {
  this.sacID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit',
      CustomerGroupID:this.customerGroup_ID,
      CustomerGroupName:this.customerGroup_Name
    }
  });

}

deleteItem(row)
{
  this.sacID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}

shouldShowDeleteButton(item: any): boolean {
  return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
}
onBackPress(event) {
  if (event.keyCode === 8) 
  {
    this.loadData();
  }
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
      case 'city':
        this.SearchCity = this.searchTerm;
        break;
      case 'packageType':
        this.SearchPackageType = this.searchTerm;
        break;
      case 'vehicleCategory':
        this.SearchVehicleCategory = this.searchTerm;
        break;  
      default:
        this.searchTerm = '';
        break;
    }  
    this.customerGroupReservationCappingService.getTableData(this.customerGroup_ID,this.SearchCity,this.SearchPackageType,this.SearchVehicleCategory,this.SearchActivationStatus, this.PageNumber).subscribe
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

  onContextMenu(event: MouseEvent, item: CustomerGroupReservationCappingModel) {
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
    //this.SearchCustomerGroupReservationCapping='';
    
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
          if(this.MessageArray[0]=="CustomerGroupReservationCappingCreate")
          {
            if(this.MessageArray[1]=="CustomerGroupReservationCappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Group Reservation Capping Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupReservationCappingUpdate")
          {
            if(this.MessageArray[1]=="CustomerGroupReservationCappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Group Reservation Capping Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupReservationCappingDelete")
          {
            if(this.MessageArray[1]=="CustomerGroupReservationCappingView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Group Reservation Capping Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupReservationCappingAll")
          {
            if(this.MessageArray[1]=="CustomerGroupReservationCappingView")
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
    this.customerGroupReservationCappingService.getTableDataSort(this.customerGroup_ID,this.SearchCity,this.SearchPackageType,this.SearchVehicleCategory,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
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



