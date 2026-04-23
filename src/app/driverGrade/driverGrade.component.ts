// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DriverGradeService } from './driverGrade.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DriverGrade } from './driverGrade.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../driverGrade/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DriverGradeDropDown } from './driverGradeDropDown.model';
@Component({
  standalone: false,
  selector: 'app-driverGrade',
  templateUrl: './driverGrade.component.html',
  styleUrls: ['./driverGrade.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverGradeComponent implements OnInit {
  displayedColumns = [
    'driverGradeName',
    'nextGrade',
  'previousGrade',
    'activationStatus',
    'actions'
  ];
  dataSource: DriverGrade[] | null;
  driverGradeID: number;
  advanceTable: DriverGrade | null;
  searchdriverGradeName: string = '';
  searchnextGrade: string = '';
  searchpreviousGrade: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  driverGradeName : FormControl = new FormControl();
  nextGrade : FormControl = new FormControl();
  previousGrade : FormControl = new FormControl();

  cancel : FormControl = new FormControl();
  public DriverGradeList?: DriverGradeDropDown[] = [];
  filteredOptions: Observable<DriverGradeDropDown[]>;
  filteredPerviousOptions: Observable<DriverGradeDropDown[]>;

  searchTerm: any = '';
  selectedFilter: string = 'search';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public driverGradeService: DriverGradeService,
    private snackBar: MatSnackBar,
    public router:Router,
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
    this.initDriverGrade();
    this.initPerviousGrade();
    this.SubscribeUpdateService();
  }
  refresh() {
    this.searchdriverGradeName = '';
    this.nextGrade.setValue('');
    this.previousGrade.setValue('');
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
          action: 'add'
        }
    });
  }

  editCall(row) {
    //  alert(row.id);
  this.driverGradeID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });
}
deleteItem(row)
{
  this.driverGradeID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}
shouldShowDeleteButton(item: any): boolean {
  return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
}

// initDriverGrade() {
    
//   this._generalService.getDriverGrade().subscribe(
//     data =>
//     {
//       this.DriverGradeList = data;
//      // console.log(this.VehicleCategoryList);
//     },
//     error =>
//     {
     
//     }
//   );
// }

initDriverGrade() {
    
  this._generalService.getDriverGrade().subscribe(
    data =>
    {
      this.DriverGradeList = data;
      this.filteredOptions = this.nextGrade.valueChanges.pipe(
        startWith(""),
        map(value => this._filter(value || ''))
      );
    },
    error =>
    {
     
    }
  );
}
private _filter(value: string): any {
  const filterValue = value.toLowerCase();
  return this.DriverGradeList.filter(
    customer => 
    {
      return customer.driverGradeName.toLowerCase().indexOf(filterValue)===0;
    }
  );
  
};
initPerviousGrade() {
    
  this._generalService.getDriverGrade().subscribe(
    data =>
    {
      this.DriverGradeList = data;
      this.filteredPerviousOptions = this.previousGrade.valueChanges.pipe(
        startWith(""),
        map(value => this._filterPervious(value || ''))
      );
    },
    error =>
    {
     
    }
  );
}
private _filterPervious(value: string): any {
  const filterValue = value.toLowerCase();
  return this.DriverGradeList.filter(
    customer => 
    {
      return customer.driverGradeName.toLowerCase().indexOf(filterValue)===0;
    }
  );
  
};

// driverGradeSBTDomain(row) {
//   this.router.navigate([
//     '/driverGradeSBTDomain',  
//   ],
//   {
//     queryParams: {
//       DriverGradeID: row.driverGradeID,
//       DriverGrade: row.driverGrade,
//     }
//   }); 
// }

// customerDepartment(row) {
//   this.router.navigate([
//     '/customerDepartment',  
//   ],
//   {
//     queryParams: {
//       DriverGradeID: row.driverGradeID,
//       DriverGrade: row.driverGrade,
//     }
//   }); 
// }

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
      case 'gradeName':
        this.searchdriverGradeName = this.searchTerm;
        break;
      case 'nextGrade':
        this.nextGrade.setValue(this.searchTerm);
        break;
      case 'previousGrade':
        this.previousGrade.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.driverGradeService.getTableData(this.searchdriverGradeName,this.nextGrade.value,this.previousGrade.value,this.SearchActivationStatus, this.PageNumber).subscribe
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
  showNotification(driverGradeName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: driverGradeName
    });
  }
  onContextMenu(event: MouseEvent, item: DriverGrade) {
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
    //this.SearchDriverGrade='';
    
  }

  // CustomerPerson(row) {
  //   this.router.navigate([
  //     '/customerPerson',  
  //   ],
  //   {
  //     queryParams: {
  //       DriverGradeID: row.driverGradeID,
  //       DriverGradeName: row.driverGrade,       
  //     }
  //   }); 
  // }

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
          if(this.MessageArray[0]=="DriverGradeCreate")
          {
            if(this.MessageArray[1]=="DriverGradeView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Driver Grade Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverGradeUpdate")
          {
            if(this.MessageArray[1]=="DriverGradeView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Driver Grade Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverGradeDelete")
          {
            if(this.MessageArray[1]=="DriverGradeView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Driver Grade Deleted ..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverGradeAll")
          {
            if(this.MessageArray[1]=="DriverGradeView")
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
    this.driverGradeService.getTableDataSort(this.searchdriverGradeName,this.searchnextGrade,this.searchpreviousGrade,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



