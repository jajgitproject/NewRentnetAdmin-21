// @ts-nocheck
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GeoPointTypeService } from './geoPointType.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { GeoPointType } from './geoPointType.model';
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
import { GeoPointTypeDropDown } from './geoPointTypeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-geoPointType',
  templateUrl: './geoPointType.component.html',
  styleUrls: ['./geoPointType.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class GeoPointTypeComponent implements OnInit {
  displayedColumns = [
    'geoPointType',
    'parent',
    'status',
    'actions'
  ];
  dataSource: GeoPointType[] | null;
  geoPointTypeID: number;
  advanceTable: GeoPointType | null;
  SearchName: string = '';
  SearchParent: string='' ;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  parent : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData:any;
  myControl: FormControl = new FormControl();

  public GeoPointTypeList?: GeoPointTypeDropDown[] = [];
  filteredOptions: Observable<GeoPointTypeDropDown[]>;
  geoPointTypeHierarchyID: any;
  geoPointType: any;

  searchTerm: any = '';
  selectedFilter: string = 'search';
  
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public geoPointTypeService: GeoPointTypeService,
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
    this.loadData();
    this.SubscribeUpdateService();
    this.InitGeoPointTypes();
  }
  refresh() {
    this.SearchName = '';
    this.parent.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

  InitGeoPointTypes(){
    this._generalService.GetGeoPointTypes().subscribe(
      data=>
      {
        this.GeoPointTypeList=data;
        this.filteredOptions = this.parent.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.GeoPointTypeList.filter(
      customer => 
      {
        return customer.geoPointType.toLowerCase().indexOf(filterValue)===0;
      }
    );

  }


  public SearchData()
  {
    this.loadData();
    //this.SearchName='';
    
  }

  openSearchDialog()
  {
    this.dialog.open(this.searchDialog, { width: '560px' });
  }

  SearchFromDialog(dialogRef: any)
  {
    this.SearchData();
    dialogRef.close();
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add'
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.geoPointTypeID = row.geoPointTypeID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: 
      {
        advanceTable: row,
        action: 'edit'        
      }
    });
    

  }
  deleteItem(row)
  {

    this.geoPointTypeID = row.id;
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
      case 'geoPointType':
        this.SearchName = this.searchTerm;
        break;
      case 'parent':
        this.parent.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.geoPointTypeService.getTableData(this.SearchName,this.parent.value,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      //  this.dataSource.forEach((ele)=>{
      //   if(ele.activationStatus===true){
          
      //     this.activeData="Active";
      //   }
      //   else{
      //     this.activeData="Deleted";
      //   }
      //  })
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
  onContextMenu(event: MouseEvent, item: GeoPointType) {
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
          if(this.MessageArray[0]=="GeoPointTypeCreate")
          {
            if(this.MessageArray[1]=="GeoPointTypeView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Geo Point Type Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GeoPointTypeUpdate")
          {
            if(this.MessageArray[1]=="GeoPointTypeView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Geo Point Type Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GeoPointTypeDelete")
          {
            if(this.MessageArray[1]=="GeoPointTypeView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Geo Point Type Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="GeoPointTypeAll")
          {
            if(this.MessageArray[1]=="GeoPointTypeView")
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
     ;
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.geoPointTypeService.getTableDataSort(this.SearchName,this.SearchParent,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}




