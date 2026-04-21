// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerGroupService } from './customerGroup.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerGroup } from './customerGroup.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormDialogComponent } from '../customerGroup/dialogs/form-dialog/form-dialog.component';
import { DeleteDialogCityComponent } from '../dashboard/city-master/dialogscity/delete-city/delete-city.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-customerGroup',
  templateUrl: './customerGroup.component.html',
  styleUrls: ['./customerGroup.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerGroupComponent implements OnInit {
  displayedColumns = [
    'CustomerGroup',
    'createBookingBeforeMinutes',
  'editBookingBeforeMinutes',
  'cancelBookingBeforeMinutes',
    'activationStatus',
    'actions'
  ];
  dataSource: CustomerGroup[] | null;
  customerGroupID: number;
  advanceTable: CustomerGroup | null;
  SearchCustomerGroup: string = '';
  searchCreateBookingBeforeMinutes: string = '';
  searchEditBookingBeforeMinutes: string = '';
  searchCancelBookingBeforeMinutes: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  activation: string;
  sortingData: number;
  sortType: string;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;
  search : FormControl = new FormControl();
  create : FormControl = new FormControl();
  edit : FormControl = new FormControl();

  cancel : FormControl = new FormControl();

  menuItems: any[] = [
    { label: 'SBT Domain',  },
    { label: 'Department',  },
    { label: 'Designation',  },
    { label: 'Person', },
    { label: 'Reservation Capping', },
     { label: 'Allow Car', },
      { label: 'Allow Package Type', },
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public customerGroupService: CustomerGroupService,
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
    this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
    this.SubscribeUpdateService();
  }
  refresh() {
    this.SearchCustomerGroup = '';
    this.searchCreateBookingBeforeMinutes='';
    this.searchEditBookingBeforeMinutes='';
    this.searchCancelBookingBeforeMinutes='';
    this.SearchActivationStatus = true;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.PageNumber=0;
    this.loadData();
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
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
  this.customerGroupID = row.id;
  const dialogRef = this.dialog.open(FormDialogComponent, {
    data: {
      advanceTable: row,
      action: 'edit'
    }
  });

}
deleteItem(row)
{
  this.customerGroupID = row.id;
  const dialogRef = this.dialog.open(DeleteDialogComponent, 
  {
    data: row
  });
}

shouldShowDeleteButton(item: any): boolean {
  return item.activationStatus !== false; // Only show delete button if activationStatus is not false (not deleted)
}

// openInNewTab(menuItem: any, rowItem: any) {
//   let baseUrl = this._generalService.FormURL;
//   if(menuItem.label.toLowerCase() === 'sbt domain') {
//     const url = this.router.serializeUrl(this.router.createUrlTree(['/customerGroupSBTDomain'], { queryParams: {
//       CustomerGroupID: rowItem.customerGroupID,
//       CustomerGroup: rowItem.customerGroup
//     } }));
//     // console.log(baseUrl + url);
//     window.open(baseUrl + url, '_blank'); 
//     // this.router.navigate(['/customerAddress'], {
//     //   queryParams: {
//     //     CustomerID: rowItem.customerID,
//     //     CustomerName: rowItem.customerName
//     //   }
//     // });
//   } else if(menuItem.label.toLowerCase() === 'department') {
//     const url = this.router.serializeUrl(this.router.createUrlTree(['/customerDepartment'], { queryParams: {
//       CustomerGroupID: rowItem.customerGroupID,
//       CustomerGroup: rowItem.customerGroup
//     } }));
//     window.open(baseUrl + url, '_blank'); 
//   }
//     else if(menuItem.label.toLowerCase() === 'designation') {
//       const url = this.router.serializeUrl(this.router.createUrlTree(['/customerDesignation'], { queryParams: {
//         CustomerGroupID: rowItem.customerGroupID,
//         CustomerGroupName: rowItem.customerGroup, 
//       } }));
//       window.open(baseUrl + url, '_blank'); 
    
//   }

//   else if(menuItem.label.toLowerCase() === 'person') {
//     const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPerson'], { queryParams: {
//       CustomerGroupID: rowItem.customerGroupID,
//       CustomerGroupName: rowItem.customerGroup,
//     } }));
//     window.open(baseUrl + url, '_blank'); 
  
// }
// }

// customerGroupSBTDomain(row) {
//   this.router.navigate([
//     '/customerGroupSBTDomain',  
//   ],
//   {
//     queryParams: {
//       CustomerGroupID: row.customerGroupID,
//       CustomerGroup: row.customerGroup,
//     }
//   }); 
// }

// customerDepartment(row) {

//   this.router.navigate([
//     '/customerDepartment',  
//   ],
//   {
//     queryParams: {
//       CustomerGroupID: row.customerGroupID,
//       CustomerGroup: row.customerGroup,
//     }
//   }); 
// }

openInNewTab(menuItem: any, rowItem: any) {
  
  let baseUrl = this._generalService.FormURL;
  
  // Encrypt parameters before passing them in the URL
  const encryptedCustomerGroupID = encodeURIComponent(this._generalService.encrypt(rowItem.customerGroupID.toString()));
  const encryptedCustomerGroup = encodeURIComponent(this._generalService.encrypt(rowItem.customerGroup));

  if (menuItem.label.toLowerCase() === 'sbt domain') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerGroupSBTDomain'], {
      queryParams: {
        CustomerGroupID: encryptedCustomerGroupID,
        CustomerGroup: encryptedCustomerGroup
      }
    }));
    window.open(baseUrl + url, '_blank');
  } 
  else if (menuItem.label.toLowerCase() === 'department') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerDepartment'], {
      queryParams: {
        CustomerGroupID: encryptedCustomerGroupID,
        CustomerGroup: encryptedCustomerGroup
      }
    }));
    window.open(baseUrl + url, '_blank');
  }
  else if (menuItem.label.toLowerCase() === 'designation') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerDesignation'], {
      queryParams: {
        CustomerGroupID: encryptedCustomerGroupID,
        CustomerGroupName: encryptedCustomerGroup
      }
    }));
    window.open(baseUrl + url, '_blank');
  }
  else if (menuItem.label.toLowerCase() === 'person') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPerson'], {
      queryParams: {
        CustomerGroupID: encryptedCustomerGroupID,
        CustomerGroupName: encryptedCustomerGroup
      }
    }));
    window.open(baseUrl + url, '_blank');
  }
  else if (menuItem.label.toLowerCase() === 'reservation capping') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerGroupReservationCapping'], {
      queryParams: {
        CustomerGroupID: encryptedCustomerGroupID,
        CustomerGroupName: encryptedCustomerGroup
      }
    }));
    window.open(baseUrl + url, '_blank');
  }
 else if (menuItem.label.toLowerCase() === 'allow car') {
  const url = this.router.serializeUrl(
    this.router.createUrlTree(['/customerAllowedCarsInCDP'], {
      queryParams: {
        CustomerGroupID: encryptedCustomerGroupID,
        CustomerGroup: encryptedCustomerGroup // ✅ key should match component
      }
    })
  );
  window.open(baseUrl + url, '_blank');
}

else if (menuItem.label.toLowerCase() === 'allow package type') {
  const url = this.router.serializeUrl(
    this.router.createUrlTree(['/customerAllowedPackageTypesInCDP'], {
      queryParams: {
        CustomerGroupID: encryptedCustomerGroupID,
        CustomerGroup: encryptedCustomerGroup // ✅ key should match component
      }
    })
  );
  window.open(baseUrl + url, '_blank');
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
      case 'customerGroup':
        this.SearchCustomerGroup = this.searchTerm;
        break;
      case 'createBookingBeforeMinutes':
        this.searchCreateBookingBeforeMinutes = this.searchTerm;
        break;
        case 'editBookingBeforeMinutes':
        this.searchEditBookingBeforeMinutes = this.searchTerm;
        break;
        case 'cancelBookingBeforeMinutes':
          this.searchCancelBookingBeforeMinutes = this.searchTerm;
          break;
      default:
        this.searchTerm = '';
        break;
    }
      this.customerGroupService.getTableData(this.SearchCustomerGroup,this.searchCreateBookingBeforeMinutes,this.searchEditBookingBeforeMinutes,this.searchCancelBookingBeforeMinutes,this.SearchActivationStatus, this.PageNumber).subscribe
      (
        data =>   
        {
          this.dataSource = data;
         
        },
        (error: HttpErrorResponse) => { this.dataSource = null;}
      );
  }
  showNotification(customerGroupName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: customerGroupName
    });
  }
  onContextMenu(event: MouseEvent, item: CustomerGroup) {
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
    //this.SearchCustomerGroup='';
    
  }

  // CustomerPerson(row) {
  //   this.router.navigate([
  //     '/customerPerson',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerGroupID: row.customerGroupID,
  //       CustomerGroupName: row.customerGroup,       
  //     }
  //   }); 
  // }

  // customerDesignation(row) {
  //   this.router.navigate([
  //     '/customerDesignation',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerGroupID: row.customerGroupID,
  //       CustomerGroupName: row.customerGroup, 
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
          if(this.MessageArray[0]=="CustomerGroupCreate")
          {
            if(this.MessageArray[1]=="CustomerGroupView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'CustomerGroup Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupUpdate")
          {
            if(this.MessageArray[1]=="CustomerGroupView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CustomerGroup Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupDelete")
          {
            if(this.MessageArray[1]=="CustomerGroupView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CustomerGroup Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerGroupAll")
          {
            if(this.MessageArray[1]=="CustomerGroupView")
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
    this.customerGroupService.getTableDataSort(this.SearchCustomerGroup,this.searchCreateBookingBeforeMinutes,this.searchEditBookingBeforeMinutes,this.searchCancelBookingBeforeMinutes,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
}



