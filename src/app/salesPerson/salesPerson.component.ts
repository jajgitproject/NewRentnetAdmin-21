// @ts-nocheck
import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SalesPersonService } from './salesPerson.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { ReservationSalesPersonModel } from './salesPerson.model';
import { RSPFormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-salesPerson',
  templateUrl: './salesPerson.component.html',
  styleUrls: ['./salesPerson.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SalesPersonComponent implements OnInit {
  @Input() updateData!: Subject<void>;
  private updateSub!: Subscription;
  @Input() dutySlipID;
  @Input() ReservationID;
  @Input() advanceTableDE;
  displayedColumns = [
    'salesPerson',
    'status',
    'actions'
  ];
  dataSource: ReservationSalesPersonModel[] | null;
  salesPersonID: number;
  advanceTable: ReservationSalesPersonModel | null;
   advanceTableSP: ReservationSalesPersonModel | null;
  SearchExpense: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  search : FormControl = new FormControl();
   showHideSalesPerson: boolean=false;

  DutySlipID: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public salesPersonService: SalesPersonService,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService,
       public route:ActivatedRoute, 
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  // ngOnInit() {
  //   this.salesPersonLoadData();
  //   this.loadDataClosingSalesPerson();
  //   this.SubscribeUpdateService();
  // }

  public ngOnInit(): void {
    this.route.queryParams.subscribe(paramsData => {
      const encryptedReservationID = paramsData.reservationID;
      const encryptedDutySlipID = paramsData.dutySlipID;
      this.ReservationID = Number(this._generalService.decrypt(decodeURIComponent(encryptedReservationID)));
      this.DutySlipID = this._generalService.decrypt(decodeURIComponent(encryptedDutySlipID));

    });
    //this.loadDataClosingSalesPerson();
    this.salesPersonLoadData();
    //this.GetInterstateTaxImage();
    this.updateSub = this.updateData.subscribe(() => {
      //console.log('Update received in SalesPersonComponent');
      this.salesPersonLoadData();
    });
  }

  ngOnDestroy() {
    this.updateSub?.unsubscribe();
  }

  refresh() {
    this.SearchExpense = '';
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.salesPersonLoadData();
  }

 addSalesPerson()
 {
   const dialogRef = this.dialog.open(RSPFormDialogComponent, 
     {
       data: 
         {
           advanceTable: this.advanceTableSP,
            action: 'add',
           reservationID:this.ReservationID
         }
     });
     dialogRef.afterClosed().subscribe((res: any) => {
       this.salesPersonLoadData();
       this.loadDataClosingSalesPerson();
 })
 }
 
 updateSalesPerson(row)
 {
   const dialogRef = this.dialog.open(RSPFormDialogComponent, 
     {
       data: 
         {
            advanceTable: row,
            action: 'edit',
           reservationID:this.ReservationID
         }
     });
     dialogRef.afterClosed().subscribe((res: any) => {
       this.salesPersonLoadData();
       // this.loadDataClosingSalesPerson();
 })
 }
 deleteSalesPerson(row)
 {
   const dialogRef = this.dialog.open(DeleteDialogComponent, 
   {
     data: row
   });
   dialogRef.afterClosed().subscribe((res: any) => {
     this.salesPersonLoadData();
 })
 }

// deleteSalesPerson(row)
// {
//   this.salesPersonID = row.id;
//   const dialogRef = this.dialog.open(DeleteDialogComponent, 
//   {
//     data: row
//   });
// }
shouldShowDeleteButton(item: any): boolean {
  return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
}

public Filter()
{
  this.PageNumber = 0;
  this.salesPersonLoadData();
}

 public salesPersonLoadData() 
 {
    this.salesPersonService.getSalesPerson(this.ReservationID,this.SearchActivationStatus, this.PageNumber).subscribe
  (
    (data :ReservationSalesPersonModel)=>   
    {
     if(data !== null){
       this.showHideSalesPerson = true;
     }
      this.advanceTableSP = data;
    },
    (error: HttpErrorResponse) => { this.advanceTableSP = null;}
  );
  
 }
   public loadDataClosingSalesPerson() 
  {
    this.salesPersonService.getTableDataforClosing(this.dutySlipID).subscribe
    (
      data =>   
      {
        this.advanceTableDE = data;
      },
      (error: HttpErrorResponse) => { this.advanceTableDE = null;}
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

  onContextMenu(event: MouseEvent, item: ReservationSalesPersonModel) {
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
      this.salesPersonLoadData();
    }
  }

  PreviousCall()
  {
    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.salesPersonLoadData(); 
    } 
  }

  public SearchData()
  {
    this.salesPersonLoadData();
    //this.SearchExpense='';   
  }

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
         if(this.MessageArray[0]=="SalesPersonCreate")
         {
           if(this.MessageArray[1]=="SalesPersonView")
           {
             if(this.MessageArray[2]=="Success")
             {
               this.refresh();
               this.showNotification(
               'snackbar-success',
               'Duty Expense Created...!!!',
               'bottom',
               'center'
             );
             }
           }
         }
         else if(this.MessageArray[0]=="SalesPersonUpdate")
         {
           if(this.MessageArray[1]=="SalesPersonView")
           {
             if(this.MessageArray[2]=="Success")
             {
              this.refresh();
              this.showNotification(
               'snackbar-success',
               'Duty Expense Updated...!!!',
               'bottom',
               'center'
             );
             }
           }
         }
         else if(this.MessageArray[0]=="SalesPersonDelete")
         {
           if(this.MessageArray[1]=="SalesPersonView")
           {
             if(this.MessageArray[2]=="Success")
             {
              this.refresh();
              this.showNotification(
               'snackbar-success',
               'Duty Expense Deleted...!!!',
               'bottom',
               'center'
             );
             }
           }
         }
         else if(this.MessageArray[0]=="SalesPersonAll")
         {
           if(this.MessageArray[1]=="SalesPersonView")
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

}



