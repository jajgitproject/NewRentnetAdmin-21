// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SupplierRequiredDocumentService } from './supplierRequiredDocument.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupplierRequiredDocument } from './supplierRequiredDocument.model';
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
import moment from 'moment';
import { DocumentDropDown } from './documentDropDown.model';
@Component({
  standalone: false,
  selector: 'app-supplierRequiredDocument',
  templateUrl: './supplierRequiredDocument.component.html',
  styleUrls: ['./supplierRequiredDocument.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierRequiredDocumentComponent implements OnInit {
  displayedColumns = [
    'documentName',
    'RequiredForSoftAttachment', 
    'RequiredForFullAttachment',
    'validFrom',
    'validTo',
    'activationStatus',
    'actions'
  ];
  dataSource: SupplierRequiredDocument[] | null;
  supplierRequiredDocumentID: number;
  advanceTable: SupplierRequiredDocument | null;
  SearchDocumentName: string = '';
  search : FormControl = new FormControl();
 searchDate: FormControl = new FormControl();
 SearchValidTo: string = '';

  SearchValidFrom: string = '';
  // SearchEntityType:string='';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  sortType: string;
  sortingData: number;
  ActiveStatus: any;
  employee_ID:any;
  EmployeeID:number=0;
  public DocumentList?: DocumentDropDown[] = [];
  filteredDocumentOptions: Observable<DocumentDropDown[]>;

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public route:ActivatedRoute,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public supplierRequiredDocumentService: SupplierRequiredDocumentService,
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
    this.route.queryParams.subscribe(paramsData =>{
      this.employee_ID   = paramsData.employeeID;
      //console.log(this.employee_ID);
      this.initDocument(); 
    });
    //onsole.log(this)
  }
  refresh() {
    this.search.setValue('');
    this.SearchValidTo = '';
    this.SearchValidFrom = '';
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
          //employeeID:this.employee_ID 
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.supplierRequiredDocumentID = row.id;
    const dialogRef = this.dialog.open(FormDialogComponentHolder, {
      data: {
        advanceTable: row,
        action: 'edit'
      }
    });
    //console.log(row);

  }
  public SearchData()
  {
    this.loadData();
    //this.SearchSupplierRequiredDocument='';
  }
  
  deleteItem(row)
  {

    this.supplierRequiredDocumentID = row.id;
  //console.log(row)
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
    if(this.SearchValidTo!==""){
      this.SearchValidTo=moment(this.SearchValidTo).format('MMM DD yyyy');
    }
    if(this.SearchValidFrom!==""){
      this.SearchValidFrom=moment(this.SearchValidFrom).format('MMM DD yyyy');
    } 
    switch (this.selectedFilter)
    {
      case 'document':
        this.search.setValue(this.searchTerm);
        break;
      case 'validFrom':
        this.SearchValidFrom = this.searchTerm;
        break;
      case 'validTo':
        this.SearchValidTo = this.searchTerm;
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.supplierRequiredDocumentService.getTableData(this.search.value,this.SearchValidFrom,this.SearchValidTo,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;
        //console.log(this.dataSource);
      //   this.dataSource.forEach((element)=>{
      //     if(element.activationStatus===true){
      //       this.ActiveStatus="Active"
      //     }
      //     else{
      //       this.ActiveStatus="Deleted"
      //     }
      //    // console.log(element);
      //   })
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
  onContextMenu(event: MouseEvent, item: SupplierRequiredDocument) {
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
        //console.log(this.MessageArray);
        if(this.MessageArray.length==3)
        {
          if(this.MessageArray[0]=="SupplierRequiredDocumentCreate")
          {
            if(this.MessageArray[1]=="SupplierRequiredDocumentView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Required Document Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierRequiredDocumentUpdate")
          {
            if(this.MessageArray[1]=="SupplierRequiredDocumentView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Required Document Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierRequiredDocumentDelete")
          {
            if(this.MessageArray[1]=="SupplierRequiredDocumentView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Required Document Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierRequiredDocumentAll")
          {
            if(this.MessageArray[1]=="SupplierRequiredDocumentView")
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

  initDocument(){
    this._generalService.getDocument().subscribe(
      data=>
      {
        this.DocumentList=data;
        this.filteredDocumentOptions = this.search.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (filterValue.length < 3) {
      return [];
    }
    return this.DocumentList.filter(
      customer => 
      {
        return customer.documentName.toLowerCase().indexOf(filterValue)===0;
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
    this.supplierRequiredDocumentService.getTableDataSort(this.SearchDocumentName,this.SearchValidTo,this.SearchValidFrom,this.SearchActivationStatus, this.PageNumber, coloumName.active,this.sortType).subscribe
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




