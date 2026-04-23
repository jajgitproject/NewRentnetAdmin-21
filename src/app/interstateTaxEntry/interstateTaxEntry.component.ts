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
import { FormDialogComponent } from '../interstateTaxEntry/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { InterstateTaxEntryService } from './interstateTaxEntry.service';
import { InterstateTaxEntry } from './interstateTaxEntry.model';
import { ActivatedRoute } from '@angular/router';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';
import { RegistrationDropDown } from './registrationDropDown.model';
import moment from 'moment';
@Component({
  standalone: false,
  selector: 'app-interstateTaxEntry',
  templateUrl: './interstateTaxEntry.component.html',
  styleUrls: ['./interstateTaxEntry.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class InterstateTaxEntryComponent implements OnInit {
  // displayedColumns = [
  //   'registrationNumber',
  //   'geoPointID',
  //   'interStateTaxStartDate',
  //   'interStateTaxEndDate',
  //   'status',
  //   'actions'
  // ];
  displayedColumns: string[] = [];
  dataSource: InterstateTaxEntry[] | null;
  interstateTaxEntryID: number;
  advanceTable: InterstateTaxEntry | null;
  RegistrationNumber: string = '';
  State: string = '';
  StartDate: string = '';
  EndDate: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  registrationNumber: FormControl = new FormControl();
  filteredRegistrationNumberOptions:Observable<RegistrationDropDown[]>;
  public RegistrationNumberList?: RegistrationDropDown[] = [];
  
  state: FormControl = new FormControl();
  public StatesList?: StatesDropDown[] = [];
  filteredStateOptions: Observable<StatesDropDown[]>;
  
  inventoryID: any;
  redirectingFrom: any;
  StateID: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  status: string = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public interstateTaxEntryService: InterstateTaxEntryService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    public _generalService: GeneralService
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  ngOnInit() {
    // this.route.queryParams.subscribe(paramsData =>{

    //   if(paramsData.InventoryID===undefined && paramsData.StateName===undefined)
    //     {
    //       this.inventoryID=0;
    //       this.RegistrationNumber=null;  
    //     }
    //     else{
    //       this.inventoryID=paramsData.InventoryID;
    //       this.RegistrationNumber=paramsData.RegNo;     
    //     }
    //     if(paramsData.StateID===undefined && paramsData.StateName===undefined)
    //     {
    //       this.StateID=0;
    //       this.State=null;  
    //     }
    //     else{
    //       this.StateID=paramsData.StateID;
    //       this.State=paramsData.State;     
    //     }
        
    //   this.redirectingFrom=paramsData.redirectingFrom;
    //   if (this.redirectingFrom === 'Inventory') {
    //     this.displayedColumns = ['geoPointID', 'interStateTaxStartDate', 'interStateTaxEndDate', 'status', 'actions'];
    //   } else if (this.redirectingFrom === 'State') {
    //     this.displayedColumns = ['registrationNumber', 'interStateTaxStartDate', 'interStateTaxEndDate', 'image' , 'name' , 'status', 'actions'];
    //   }
            
    // });
  this.route.queryParams.subscribe(paramsData => {
  
      // Decrypt InventoryID and RegistrationNumber
      if (paramsData.InventoryID === undefined && paramsData.RegNo === undefined) {
        this.inventoryID = 0;
        this.RegistrationNumber = null;  
      } else {
        this.inventoryID = Number(this._generalService.decrypt(decodeURIComponent(paramsData.InventoryID)));
        this.RegistrationNumber = this._generalService.decrypt(decodeURIComponent(paramsData.RegNo));
      }
    
      // Decrypt StateID and State Name
      if (paramsData.StateID === undefined && paramsData.StateName === undefined) {
        this.StateID = 0;
        this.State = null;  
      } else {
        this.StateID = Number(this._generalService.decrypt(decodeURIComponent(paramsData.StateID)));
        this.State = this._generalService.decrypt(decodeURIComponent(paramsData.StateName));
      }
    
      // Decrypt redirectingFrom
      this.redirectingFrom = this._generalService.decrypt(decodeURIComponent(paramsData.redirectingFrom));

      // Decrypt status if provided
      if (paramsData.status) {
        try {
          this.status = this._generalService.decrypt(decodeURIComponent(paramsData.status));
        } catch {
          this.status = '';
        }
      }
    
      if (this.redirectingFrom === 'Inventory') {
        this.displayedColumns = ['geoPointID', 'interStateTaxStartDate', 'interStateTaxEndDate', 'status', 'actions'];
      } else if (this.redirectingFrom === 'State') {
        this.displayedColumns = ['registrationNumber', 'interStateTaxStartDate', 'interStateTaxEndDate', 'image', 'name', 'status', 'actions'];
      }
    
      // Debugging - Check decrypted values
    });
    
    this.loadData();
    this.SubscribeUpdateService();
    this.GetStates();
    this.InitRegistrationNumber();
  }

  GetStates(){
    this._generalService.GetStatesAl().subscribe(
      data =>
      {
        this.StatesList = data;  
        this.filteredStateOptions = this.state.valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        );              
      },
      error=>
      {
    
      }
    );
    }
    private _filterState(value: string): any {
  const filterValue = value.toLowerCase();

  // Only start filtering after typing 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.StatesList.filter(customer =>
    customer.geoPointName.toLowerCase().indexOf(filterValue) === 0
  );
}


    // private _filterState(value: string): any {
    // const filterValue = value.toLowerCase();
    // return this.StatesList.filter(
    //   customer =>
    //   {
    //     return customer.geoPointName.toLowerCase().indexOf(filterValue)===0;
    //   }
    // );
    // }

    InitRegistrationNumber(){
      this._generalService.GetRegistrationForDropDown().subscribe(
        data=>
        {
          this.RegistrationNumberList=data;
          this.filteredRegistrationNumberOptions = this.registrationNumber.valueChanges.pipe(
            startWith(""),
            map(value => this._filterRN(value || ''))
          ); 
        });
    }
    
    private _filterRN(value: string): any {
      const filterValue = value.toLowerCase();
      return this.RegistrationNumberList.filter(
        customer => 
        {
          return customer.registrationNumber.toLowerCase().indexOf(filterValue)===0;
        }
      );
    }

  refresh() {
    if(this.redirectingFrom==='Inventory')
    {
      this.State='';
      this.StartDate='';
      this.EndDate='';
    }
    if(this.redirectingFrom==='State')
    {
      this.RegistrationNumber='';
      this.StartDate='';
      this.EndDate='';
    }
   
    this.State='';
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
          inventoryID:this.inventoryID,
          registrationNumber:this.RegistrationNumber,
          redirectedFrom:this.redirectingFrom,
          StateID:this.StateID,
          State:this.State,
          status: this.status
        }
    });
  }

  editCall(row) {
    //  alert(row.id);
  this.interstateTaxEntryID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit',
      inventoryID:this.inventoryID,
      registrationNumber:this.RegistrationNumber,
      redirectedFrom:this.redirectingFrom,
      StateID:this.StateID,
      State:this.State,
      status: this.status
    }
  });

}
deleteItem(row)
{
  this.interstateTaxEntryID = row.id;
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
    debugger;
    if(this.StartDate!==""){
      this.StartDate=moment(this.StartDate).format('MMM DD yyyy');
    }
    if(this.EndDate!==""){
      this.EndDate=moment(this.EndDate).format('MMM DD yyyy');
    }
    switch (this.selectedFilter)
    {
      case 'state':
        this.state.setValue(this.searchTerm);
        break;
      case 'startDate':
        this.StartDate = this.searchTerm;
        break;
       case 'endDate':
        this.EndDate = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.interstateTaxEntryService.getTableData(this.registrationNumber.value || this.RegistrationNumber,this.state.value || this.State,this.StartDate,this.EndDate,this.SearchActivationStatus, this.PageNumber).subscribe
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
  onContextMenu(event: MouseEvent, item: InterstateTaxEntry) {
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
        debugger;
        //message contains the data sent from service
        this.messageReceived = message.text;
        this.MessageArray=this.messageReceived.split(":");
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="InterstateTaxEntryCreate")
          {
            if(this.MessageArray[1]=="InterstateTaxEntryView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Interstate Tax  Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InterstateTaxEntryUpdate")
          {
            if(this.MessageArray[1]=="InterstateTaxEntryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Interstate Tax Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InterstateTaxEntryDelete")
          {
            if(this.MessageArray[1]=="InterstateTaxEntryView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Interstate Tax  Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="InterstateTaxEntryAll")
          {
            if(this.MessageArray[1]=="InterstateTaxEntryView")
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
    this.interstateTaxEntryService.getTableDataSort(this.RegistrationNumber,this.State,this.StartDate,this.EndDate,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;     
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




