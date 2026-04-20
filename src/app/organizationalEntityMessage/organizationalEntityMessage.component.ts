// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { OrganizationalEntityMessageService } from './organizationalEntityMessage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OrganizationalEntityMessage } from './organizationalEntityMessage.model';
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
import moment from 'moment';
import { OrganizationalEntityDropDown } from './organizationalEntityDropDown.model';
import { MessageTypeDropDown } from './messageTypeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-organizationalEntityMessage',
  templateUrl: './organizationalEntityMessage.component.html',
  styleUrls: ['./organizationalEntityMessage.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class OrganizationalEntityMessageComponent implements OnInit {
  displayedColumns = [
    'organizationalEntityName',
    'messageType',
    'message',
    'startDate',
    'endDate',
    'includeChildren',
    //'status',
    'actions'
  ];
  dataSource: OrganizationalEntityMessage[] | null;
  organizationalEntityMessageID: number;
  advanceTable: OrganizationalEntityMessage | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  IC: any;
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  public MessageTypeList?: MessageTypeDropDown[] = [];
  filteredMessageTypeOptions: Observable<MessageTypeDropDown[]>;

  SearchName: string = '';
  search : FormControl = new FormControl();

  SearchMessageType: string = '';
  messageType : FormControl = new FormControl();

  SearchMessage: string = '';
  message : FormControl = new FormControl();

  SearchStartDate: string = '';
  startDate : FormControl = new FormControl();

  SearchEndDate: string = '';
  endDate : FormControl = new FormControl();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public organizationalEntityMessageService: OrganizationalEntityMessageService,
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
    this.InitMessageType();
    this.InitOrganizationalEntity();
  }

  InitOrganizationalEntity(){
    this._generalService.GetOrganizationalEntity().subscribe(
      data=>
      {
        this.OrganizationalEntityList=data;
        this.filteredOrganizationalEntityOptions = this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.OrganizationalEntityList.filter(
      customer => 
      {
        return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  InitMessageType(){
    this._generalService.GetMessageType().subscribe(
      data=>
      {
        this.MessageTypeList=data;
        this.filteredMessageTypeOptions = this.messageType.valueChanges.pipe(
          startWith(""),
          map(value => this._filterMessageType(value || ''))
        ); 
      });
  }
  
  private _filterMessageType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.MessageTypeList.filter(
      customer => 
      {
        return customer.messageType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  refresh() {
    this.search.setValue('');
    this.messageType.setValue(''),
    this.SearchMessage= '',
    this.SearchStartDate= '',
    this.SearchEndDate= '',
    this.SearchActivationStatus = true;
    this.PageNumber=0;
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
          action: 'add'
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.organizationalEntityMessageID = row.organizationalEntityMessageID;
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
  }
  deleteItem(row)
  {

    this.organizationalEntityMessageID = row.id;
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
    if(this.SearchStartDate!==""){
      this.SearchStartDate=moment(this.SearchStartDate).format('MMM DD yyyy');
    }
    if(this.SearchEndDate!==""){
      this.SearchEndDate=moment(this.SearchEndDate).format('MMM DD yyyy');
    }   
      this.organizationalEntityMessageService.getTableData(this.search.value,
        this.messageType.value,
        this.SearchMessage,
        this.SearchStartDate,
        this.SearchEndDate,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        // this.dataSource.forEach((ele)=>{
        //   if(ele.includeChildren===true){
        //     this.IC="Yes";
        //   }
        //   if(ele.includeChildren===false){
        //     this.IC="No";
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
  onContextMenu(event: MouseEvent, item: OrganizationalEntityMessage) {
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
          if(this.MessageArray[0]=="OrganizationalEntityMessageCreate")
          {
            if(this.MessageArray[1]=="OrganizationalEntityMessageView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Organizational Entity Message Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="OrganizationalEntityMessageUpdate")
          {
            if(this.MessageArray[1]=="OrganizationalEntityMessageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Organizational Entity Message Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="OrganizationalEntityMessageDelete")
          {
            if(this.MessageArray[1]=="OrganizationalEntityMessageView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Organizational Entity Message Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="OrganizationalEntityMessageAll")
          {
            if(this.MessageArray[1]=="OrganizationalEntityMessageView")
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
    // if(this.SearchStartDate!==""){
    //   this.SearchStartDate=moment(this.SearchStartDate).format('MMM DD yyyy');
    // }
    // if(this.SearchEndDate!==""){
    //   this.SearchEndDate=moment(this.SearchEndDate).format('MMM DD yyyy');
    // } 
    this.organizationalEntityMessageService.getTableDataSort(this.SearchName,
      this.SearchMessageType,
      this.SearchMessage,
      this.SearchStartDate,
      this.SearchEndDate,
      this.SearchActivationStatus, 
      this.PageNumber,
      coloumName.active,
      this.sortType).subscribe
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





