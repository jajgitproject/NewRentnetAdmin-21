// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MailSupplierService } from './mailSupplier.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { MTSFormDialogComponent } from '../mailSupplier/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { MailToSupplier } from './mailSupplier.model';
@Component({
  standalone: false,
  selector: 'app-mailSupplier',
  templateUrl: './mailSupplier.component.html',
  styleUrls: ['./mailSupplier.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class MailSupplierComponent implements OnInit {
  displayedColumns = [
    'MailSupplier',
    'status',
    'actions'
  ];
  mailSupplierID: number;
  advanceTable: MailToSupplier | null;
  SearchMailSupplier: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
  selectedFilter: string = 'search';
  searchTerm: any = '';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public mailSupplierService: MailSupplierService,
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
    this.loadData();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.selectedFilter='search';
    this.searchTerm='';
    this.SearchMailSupplier = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  addNew()
  {
    const dialogRef = this.dialog.open(MTSFormDialogComponent, 
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
  this.mailSupplierID = row.id;
  const dialogRef = this.dialog.open(MTSFormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });

}
deleteItem(row)
{
  this.mailSupplierID = row.id;
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

  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  
   public loadData() 
   {
    // if(this.selectedFilter==='MailSupplier')
    // {
    //   this.SearchMailSupplier=this.searchTerm;
    // }
    //   this.mailSupplierService.getTableData(this.SearchMailSupplier,this.SearchActivationStatus, this.PageNumber).subscribe
    //   (
    //     data =>   
    //     {
    //       this.dataSource = data;
         
    //       // this.dataSource.forEach((ele)=>{
    //       //   if(ele.activationStatus===true){
    //       //    this.activation="Active"
    //       //   }
    //       //   if(ele.activationStatus===false){
    //       //     this.activation="Deleted"
    //       //    }
    //       // })
         
    //     },
    //     (error: HttpErrorResponse) => { this.dataSource = null;}
    //   );
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onContextMenu(event: MouseEvent, item: MailToSupplier) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  NextCall()
  {
    // if (this.dataSource?.length>0) 
    // {
    //   this.PageNumber++;
    //   this.loadData();
    // }
  }
  PreviousCall()
  {
    // if(this.PageNumber>0)
    // {
    //   this.PageNumber--;
    //   this.loadData(); 
    // } 
  }

  public SearchData()
  {
    this.loadData();
    //this.SearchMailSupplier='';
    
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
          if(this.MessageArray[0]=="MailSupplierCreate")
          {
            if(this.MessageArray[1]=="MailSupplierView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Mail Sent Successfully...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="MailSupplierUpdate")
          {
            if(this.MessageArray[1]=="MailSupplierView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'MailSupplier Updated...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="MailSupplierDelete")
          {
            if(this.MessageArray[1]=="MailSupplierView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'MailSupplier Deleted...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="MailSupplierAll")
          {
            if(this.MessageArray[1]=="MailSupplierView")
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
   
    // if (this.sortingData == 1) {

    //   this.sortingData = 0;
    //   this.sortType = "Ascending"
    // }
    // else {
    //   this.sortingData = 1;
    //   this.sortType = "Descending";
    // }
    // this.mailSupplierService.getTableDataSort(this.SearchMailSupplier,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    // (
    //   data =>   
    //   {
    //     this.dataSource = data;
      
    //   },
    //   (error: HttpErrorResponse) => { this.dataSource = null;}
    // );
  }
}



