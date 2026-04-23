// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SupplierVerificationDocumentsService } from './supplierVerificationDocuments.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SupplierVerificationDocuments } from './supplierVerificationDocuments.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../supplierVerificationDocuments/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DocumentDropDown } from '../general/documentDropDown.model';
@Component({
  standalone: false,
  selector: 'app-supplierVerificationDocuments',
  templateUrl: './supplierVerificationDocuments.component.html',
  styleUrls: ['./supplierVerificationDocuments.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SupplierVerificationDocumentsComponent implements OnInit {
  displayedColumns = [
    'documentName',
    'supplierRequiredDocumentsImage',
    'supplierRequiredDocumentsNumber',
    'supplierRequiredDocumentAdditionDate',
    'supplierRequiredDocumentNonAvailabilityReason',
    'activationStatus',
    'actions',
  ];
  dataSource: SupplierVerificationDocuments[] | null;
  supplierVerificationDocumentsID: number;
  advanceTable: SupplierVerificationDocuments | null;
  SearchSupplierVerificationDocuments: string = '';
  supplierVerificationDocuments:string='';
  SupplierID:number =0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  SearchNumbers: string = '';
  SearchReasonNon:string='';
  searchNumber: FormControl = new FormControl();
  searchReason: FormControl = new FormControl();
  search : FormControl = new FormControl();
  ActiveStatus: any;
  supplier_ID: any;
  Employee_ID: any;
  supplier_Name: any;
  selectedFilter: string = 'search';
  searchTerm: any = '';
  filterSelected:boolean = true;
  public DocumentList?: DocumentDropDown[] = [];
  filteredDocumentOptions: Observable<DocumentDropDown[]>;
  SearchsupplierRequiredDocumentAdditionDate:  string = '';;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public route:ActivatedRoute,
    public supplierVerificationDocumentsService: SupplierVerificationDocumentsService,
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
      // this.supplier_ID   = paramsData.SupplierID;
      // this.supplier_Name   = paramsData.SupplierName;
      // this.Employee_ID =paramsData.EmployeeID;
      if (paramsData.SupplierID && paramsData.SupplierName && paramsData.EmployeeID) {
        const encryptedSupplierID = decodeURIComponent(paramsData.SupplierID);
        const encryptedSupplierName = decodeURIComponent(paramsData.SupplierName);
        const encryptedEmployeeID = decodeURIComponent(paramsData.EmployeeID);
      
        if (encryptedSupplierID && encryptedSupplierName && encryptedEmployeeID) {
          this.supplier_ID = this._generalService.decrypt(encryptedSupplierID);
          this.supplier_Name = decodeURIComponent(this._generalService.decrypt(encryptedSupplierName));  // Decode after decryption
          this.Employee_ID = this._generalService.decrypt(encryptedEmployeeID);
        }
      }
      
      
    });
    this.loadData();
    this.InitDocument();
    this.SubscribeUpdateService();
    
    // this._generalService.GetDocument().subscribe
    // (
    //   data =>   
    //   {
    //     this.DocumentList = data;
     
    //   }
    // );
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
  InitDocument(){
    this._generalService.GetDocumentRequired().subscribe(
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

  // Only start filtering after typing 3 characters
  if (filterValue.length < 3) {
    return [];
  }

  return this.DocumentList.filter(customer =>
    customer.documentName.toLowerCase().indexOf(filterValue) === 0
  );
}

  
  // private _filter(value: string): any {
  //   const filterValue = value.toLowerCase();
  //   return this.DocumentList.filter(
  //     customer => 
  //     {
  //       return customer.documentName.toLowerCase().indexOf(filterValue)===0;
  //     }
  //   );
  // }
  refresh() {
    this.search.setValue('');
    this.SearchNumbers='';
    this.SearchReasonNon='';
    this.searchTerm='';
    this.SearchsupplierRequiredDocumentAdditionDate='';
    this.selectedFilter ='search';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
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
          SUPPLIERNAME:this.supplier_Name,
          EmployeeID:this.Employee_ID
        }
        
    });
  }

  editCall(row) {
    //  alert(row.id);
  this.supplierVerificationDocumentsID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });

}
deleteItem(row)
{
  this.supplierVerificationDocumentsID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
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
        // case 'supplierVerificationDocuments':
        //   this.search.setValue(this.searchTerm) ;
        //   break;
        case 'number':
          this.SearchNumbers = this.searchTerm;
          break;
        case 'nonAvailabilityReason':
          this.SearchReasonNon = this.searchTerm;
          break;
        case 'supplierRequiredDocumentAdditionDate':
          this.SearchsupplierRequiredDocumentAdditionDate = this.searchTerm;
          break;
        default:
          this.searchTerm = '';
          break;
      }
      this.supplierVerificationDocumentsService.getTableData(this.supplier_ID,this.search.value,this.SearchNumbers,this.SearchReasonNon, this.SearchsupplierRequiredDocumentAdditionDate,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          this.dataSource = data;
          this.dataSource.forEach((element)=>{
            if(element.activationStatus===true){
              this.ActiveStatus="Active"
            }
            else{
              this.ActiveStatus="Deleted"
            }
       
          })
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
  onContextMenu(event: MouseEvent, item: SupplierVerificationDocuments) {
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
      this.loadData(); 
    } 
  }

  public SearchData()
  {
    this.loadData();
    //this.SearchSupplierVerificationDocuments='';
    
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
          if(this.MessageArray[0]=="SupplierVerificationDocumentsCreate")
          {
            if(this.MessageArray[1]=="SupplierVerificationDocumentsView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Supplier Verification Documents Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierVerificationDocumentsUpdate")
          {
            if(this.MessageArray[1]=="SupplierVerificationDocumentsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Verification Documents Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierVerificationDocumentsDelete")
          {
            if(this.MessageArray[1]=="SupplierVerificationDocumentsView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Supplier Verification Documents Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="SupplierVerificationDocumentsAll")
          {
            if(this.MessageArray[1]=="SupplierVerificationDocumentsView")
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
    //debugger;
    if (this.sortingData == 1) {

      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.supplierVerificationDocumentsService.getTableDataSort(this.supplier_ID,this.SearchSupplierVerificationDocuments,this.SearchNumbers,this.SearchReasonNon,this.SearchsupplierRequiredDocumentAdditionDate,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
       
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



