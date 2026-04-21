// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrganizationalEntityStakeHoldersService } from './organizationalEntityStakeHolders.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OrganizationalEntityStakeHolders } from './organizationalEntityStakeHolders.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponentHolder } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
@Component({
  standalone: false,
  selector: 'app-organizationalEntityStakeHolders',
  templateUrl: './organizationalEntityStakeHolders.component.html',
  styleUrls: ['./organizationalEntityStakeHolders.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class OrganizationalEntityStakeHoldersComponent implements OnInit {
  displayedColumns = [
    'organizationalEntityType',
    'organizationalEntityName',
    'startDate',
   'endDate',
   'positionType', 
    'activationStatus',
    'actions'
  ];
  dataSource: OrganizationalEntityStakeHolders[] | null;
  organizationalEntityStakeHoldersID: number;
  advanceTable: OrganizationalEntityStakeHolders | null;
  SearchOrganizationalEntityStakeHolders: string = ''; 
  search : FormControl = new FormControl();
  searchEntity: FormControl = new FormControl();
  SearchEntityType:string='';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  ActiveStatus: any;
  employee_ID:any;
  EmployeeID:number=0;
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  OrganizationalEntityID: any;
  OrganizationalEntityName: any;
  
  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public organizationalEntityStakeHoldersService: OrganizationalEntityStakeHoldersService,
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
      this.employee_ID   = paramsData.employeeID;
      // this.OrganizationalEntityID = paramsData.OrganizationalEntityID;     
      // this.OrganizationalEntityName = paramsData.OrganizationalEntity; 
      const encryptedOrganizationalEntityID = this.route.snapshot.queryParamMap.get('OrganizationalEntityID');
  const encryptedOrganizationalEntityName = this.route.snapshot.queryParamMap.get('OrganizationalEntity');
  
  if (encryptedOrganizationalEntityID && encryptedOrganizationalEntityName) {
    // Decrypt the values
    this.OrganizationalEntityID = this._generalService.decrypt(decodeURIComponent(encryptedOrganizationalEntityID));
    this.OrganizationalEntityName = this._generalService.decrypt(decodeURIComponent(encryptedOrganizationalEntityName));
    
    // Decode the URL-encoded string after decryption
    this.OrganizationalEntityName = decodeURIComponent(this.OrganizationalEntityName);
    
  }
});
    this.loadData();
    this.SubscribeUpdateService();
    
    this.InitOrganizationalEntity();
  }

  InitOrganizationalEntity() {
    this._generalService.GetOrganizationalEntity().subscribe(
      data => {
        this.OrganizationalEntityList = data;
        this.filteredOrganizationalEntityOptions = this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filterOrganizational(value || ''))
        );
      });
  }

  private _filterOrganizational(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.OrganizationalEntityList.filter(
      customer => {
        return customer.organizationalEntityName.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  refresh() {
    this.SearchEntityType='';
    this.search.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }
  addNew()
  {
    
    const dialogRef = this.dialog.open(FormDialogComponentHolder, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          employeeID:this.employee_ID,
          organizationalEntityID:this.OrganizationalEntityID,
          organizationalEntityName:this.OrganizationalEntityName 
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.organizationalEntityStakeHoldersID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponentHolder, {
      data: {
        advanceTable: row,
        action: 'edit',
        organizationalEntityID:this.OrganizationalEntityID,
        organizationalEntityName:this.OrganizationalEntityName
      }
    });
  }
  public SearchData()
  {
    this.loadData();
    //this.SearchOrganizationalEntityStakeHolders='';
  }
  
  deleteItem(row)
  {
    this.organizationalEntityStakeHoldersID = row.id;
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
      case 'entity':
        this.search.setValue(this.searchTerm);
        break;
      case 'entityType':
        this.SearchEntityType = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.organizationalEntityStakeHoldersService.getTableData(this.OrganizationalEntityID,this.SearchEntityType,this.search.value,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
        // this.dataSource.forEach((element)=>{
        //   if(element.activationStatus===true){
        //     this.ActiveStatus="Active"
        //   }
        //   else{
        //     this.ActiveStatus="Deleted"
        //   }
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
  onContextMenu(event: MouseEvent, item: OrganizationalEntityStakeHolders) {
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
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="OrganizationalEntityStakeHoldersCreate")
          {
            if(this.MessageArray[1]=="OrganizationalEntityStakeHoldersView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Organizational Entity Stake Holders Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="OrganizationalEntityStakeHoldersUpdate")
          {
            if(this.MessageArray[1]=="OrganizationalEntityStakeHoldersView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Organizational Entity Stake Holders Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="OrganizationalEntityStakeHoldersDelete")
          {
            if(this.MessageArray[1]=="OrganizationalEntityStakeHoldersView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Organizational Entity Stake Holders Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="OrganizationalEntityStakeHoldersAll")
          {
            if(this.MessageArray[1]=="OrganizationalEntityStakeHoldersView")
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
    this.organizationalEntityStakeHoldersService.getTableDataSort(this.OrganizationalEntityID,this.SearchEntityType,this.SearchOrganizationalEntityStakeHolders,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



