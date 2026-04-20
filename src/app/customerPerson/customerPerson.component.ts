// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CustomerPersonService } from './customerPerson.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerPerson } from './customerPerson.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormDialogComponentCustomerPerson } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerDropDown } from '../customer/customerDropDown.model';
interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}
@Component({
  standalone: false,
  selector: 'app-customerPerson',
  templateUrl: './customerPerson.component.html',
  styleUrls: ['./customerPerson.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerPersonComponent implements OnInit {
  displayedColumns = [
    'customerPersonName',
    'customerName',
    'gender',
    'importance',
    'isContactPerson',
    'isAdmin',
    'isBooker',
    'isPassenger',
    'oldRentNetID',
    'status',
    'actions'
  ];
  dataSource: CustomerPerson[] | null;
  customerPersonID: number;
  advanceTable: CustomerPerson | null;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  customerGroup_ID: any;
  customerGroup_Name: any;

  SearchIsAdmin : boolean | null = null;
  SearchIsBooker : boolean | null = null;
  SearchIsPassenger : boolean | null = null;

  isBooker : FormControl = new FormControl();

   isPassenger : FormControl = new FormControl();
  isAdmin : FormControl = new FormControl();

  SearchName: string = '';
  search : FormControl = new FormControl();

  SearchPrimary: string = '';
  primaryEmail : FormControl = new FormControl();

  SearchBilling: string = '';
  billingEmail : FormControl = new FormControl();

  SearchCustomer: string = '';
  CustomerName : FormControl = new FormControl();

  SearchMobile: string = '';
  primaryMobile : FormControl = new FormControl();

  public CustomerList?: CustomerDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  menuItems: any[] = [
    { label: 'Instruction',  },
    { label: 'Address',},
    { label: 'Driving License',  tooltip:'Customer Person Driving License'  },
    { label: 'Driver Restriction', tooltip:'Customer Person Driver Restriction'},
    { label: 'Inventory Restriction',  tooltip:'Customer Person Inventory Restriction'  },
    { label: 'Prefered Driver', },
    { label: 'Temp VIP',  },
    { label: 'Person Alert Messages', },
    { label: 'Document', },
    { label: 'Approval', },
    
  ];

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public route:ActivatedRoute,
    public customerPersonService: CustomerPersonService,
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
    this.route.queryParams.subscribe(paramsData =>{
    //   this.customerGroup_ID   = paramsData.CustomerGroupID;
    //    this.customerGroup_Name=paramsData.CustomerGroupName;
    // });
    const encryptedCustomerGroupID = paramsData.CustomerGroupID;
    const encryptedCustomerGroupName = paramsData.CustomerGroupName;
  
    // Decrypt CustomerGroupID and CustomerGroupName
    if (encryptedCustomerGroupID && encryptedCustomerGroupName) {
      this.customerGroup_ID = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupID));
      this.customerGroup_Name = this._generalService.decrypt(decodeURIComponent(encryptedCustomerGroupName));
    }
  
    // Log decrypted values
    console.log("Decrypted CustomerGroupID: ", this.customerGroup_ID);
    console.log("Decrypted CustomerGroupName: ", this.customerGroup_Name);
  });
    
    this.loadData();
    this.InitCustomer();
    this.menuItems.sort((a, b) => a.label.localeCompare(b.label));
    console.log(this.menuItems);
    this.SubscribeUpdateService();
  }

  InitCustomer(){
    this._generalService.GetCustomersForCP(this.customerGroup_ID).subscribe
    (
      data=>{
        this.CustomerList=data;
       
        this.filteredCustomerOptions = this.CustomerName.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        ); 
      }
    );
  }
  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3)
     {
        return [];   
      }
    return this.CustomerList?.filter(
      customer => 
      {
        return customer.customerName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }

  refresh() {
    this.CustomerName.setValue('');
    this.SearchName='';
    this.SearchPrimary='';
    this.SearchBilling='';
    this.SearchCustomer='';
    this.SearchMobile='';
    this.SearchIsAdmin=null;
    this.SearchIsBooker=null;
    this.SearchIsPassenger=null;
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }
  onBackPress(event) {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }

  public SearchData()
  {
    this.loadData();    
  }
  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          CustomerGroupID:this.customerGroup_ID,
          CustomerGroupName:this.customerGroup_Name
        }
    });
  }

 editCall(row) {
  console.log('Row:', row);
 console.log(this.advanceTable)
  this.customerPersonID = row.customerPersonID;

  // // ✅ Extract mobile number only (ignore country code like "91-")
  // let mobileNumber = '';
  // if (row.primaryMobile && row.primaryMobile.includes('-')) {
  //   mobileNumber = row.primaryMobile.split('-')[1]; // after '-'
  // } else {
  //   mobileNumber = row.primaryMobile || ''; // fallback if no dash
  // }

  //console.log("Mobile Number:", mobileNumber);

  
  const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, {
    data: {
      advanceTable: row,
      action: 'edit',
      CustomerGroupID: this.customerGroup_ID,
      CustomerGroupName: this.customerGroup_Name,
      PrimaryMobile: this.primaryMobile   // pass it if needed
    }
  });
}

  deleteItem(row)
  {

    this.customerPersonID = row.id;
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
    switch (this.selectedFilter)
    {
      
      case 'customerName':
        this.CustomerName.setValue(this.searchTerm);
        break;
        case 'customerPersonName':
        this.SearchName = this.searchTerm;
        break;
        case 'primaryEmail':
          this.SearchPrimary = this.searchTerm;
          break;
          case 'billingEmail':
            this.SearchBilling = this.searchTerm;
            break;
       
      default:
        this.searchTerm = '';
        break;
    }
      this.customerPersonService.getTableData( this.CustomerName.value,this.SearchName,this.SearchPrimary,this.SearchBilling,
        this.SearchMobile,
        this.customerGroup_ID,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
        console.log(this.dataSource);
        
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
  onContextMenu(event: MouseEvent, item: CustomerPerson) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  
  NextCall()
  {
    //console.log(this.dataSource.length>0)
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

//   openInNewTab(menuItem: any, rowItem: any) {

//     console.log(menuItem);
//     console.log(rowItem);
//     let baseUrl = this._generalService.FormURL;
//     if(menuItem.label.toLowerCase() === 'address') {
//       const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonAddress'], { queryParams: {
//         CustomerPersonID: rowItem.customerPersonID,
//         CustomerPersonName: rowItem.customerPersonName, 

//       } }));
//       console.log(baseUrl + url);
//       window.open(baseUrl + url, '_blank'); 
//       // this.router.navigate(['/customerAddress'], {
//       //   queryParams: {
//       //     CustomerID: rowItem.customerID,
//       //     CustomerName: rowItem.customerName
//       //   }
//       // });
//     } else if(menuItem.label.toLowerCase() === 'document') {
//       const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonDocument'], { queryParams: {
//         CustomerPersonID: rowItem.customerPersonID,
//         CustomerPersonName: rowItem.customerPersonName, 

//       } }));
//       window.open(baseUrl + url, '_blank'); 
//     }
  
//   else if(menuItem.label.toLowerCase() === 'driver restriction') {
//     const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonDriverRestriction',  
//   ], { queryParams: {
//       CustomerPersonID: rowItem.customerPersonID,
//       CustomerPersonName: rowItem.customerPersonName, 

//     } }));
//     window.open(baseUrl + url, '_blank'); 
//   }

// else if(menuItem.label.toLowerCase() === 'instruction') {
//   const url = this.router.serializeUrl(this.router.createUrlTree([ '/customerPersonInstruction'], { queryParams: {
//     CustomerPersonID: rowItem.customerPersonID,
//     CustomerPersonName: rowItem.customerPersonName, 

//   } }));
//   window.open(baseUrl + url, '_blank'); 
// }

// else if(menuItem.label.toLowerCase() === 'driving license') {
//   const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonDrivingLicense'], { queryParams: {
//     CustomerPersonID: rowItem.customerPersonID,
//     CustomerPersonName: rowItem.customerPersonName, 

//   } }));
//   window.open(baseUrl + url, '_blank'); 
// }

// else if(menuItem.label.toLowerCase() === 'temp vip') {
//   const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonTempVIP'], { queryParams: {
//     CustomerPersonID: rowItem.customerPersonID,
//     CustomerPersonName: rowItem.customerPersonName, 

//   } }));
//   window.open(baseUrl + url, '_blank'); 
// }
// else if(menuItem.label.toLowerCase() === 'prefered driver') {
//   const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonPreferedDriver'], { queryParams: {
//     CustomerPersonID: rowItem.customerPersonID,
//     CustomerPersonName: rowItem.customerPersonName, 

//   } }));
//   window.open(baseUrl + url, '_blank'); 
// }

// else if(menuItem.label.toLowerCase() === 'person alert messages') {
//   const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonAlertMessages'], { queryParams: {
//     CustomerPersonID: rowItem.customerPersonID,
//     CustomerPersonName: rowItem.customerPersonName, 

//   } }));
//   window.open(baseUrl + url, '_blank'); 
// }

//   }

  // CustomerPersonDriverRestriction(row) {
  //   this.router.navigate([
  //     '/customerPersonDriverRestriction',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerPersonID: row.customerPersonID,
  //       CustomerPersonName: row.customerPersonName,       
  //     }
  //   }); 
  // }

  // CustomerPersonDrivingLicense(row) {
  //   this.router.navigate([
  //     '/customerPersonDrivingLicense',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerPersonID: row.customerPersonID,
  //       CustomerPersonName: row.customerPersonName,       
  //     }
  //   }); 
  // }

  // CustomerPersonAddress(row) {
  //   this.router.navigate([
  //     '/customerPersonAddress',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerPersonID: row.customerPersonID,
  //       CustomerPersonName: row.customerPersonName,       
  //     }
  //   });
  // }

  // CustomerPersonInstruction(row) {
  //   this.router.navigate([
  //     '/customerPersonInstruction',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerPersonID: row.customerPersonID,
  //       CustomerPersonName: row.customerPersonName,       
  //     }
  //   }); 
  // }

  // customerPersonPreferedDriver(row) {
  //   this.router.navigate([
  //     '/customerPersonPreferedDriver',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerPersonID: row.customerPersonID,
  //       CustomerPersonName: row.customerPersonName,       
  //     }
  //   }); 
  // }

  // customerPersonTempVIP(row) {
  //   this.router.navigate([
  //     '/customerPersonTempVIP',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerPersonID: row.customerPersonID,
  //       CustomerPersonName: row.customerPersonName,   
            
  //     }
  //   }); 
  // }

  // CustomerPersonDrivingLicense(row) {
  //   this.router.navigate([
  //     '/customerPersonDrivingLicense',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerPersonID: row.customerPersonID,
  //       CustomerPersonName: row.customerPersonName,       
  //     }
  //   }); 
  // }

  // customerPersonAlertMessages(row) {
  //   this.router.navigate([
  //     '/customerPersonAlertMessages',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerPersonID: row.customerPersonID,
  //       CustomerPersonName: row.customerPersonName,   
            
  //     }
  //   }); 
  // }

  // CustomerPersonDocument(row) {
  //   this.router.navigate([
  //     '/customerPersonDocument',  
  //   ],
  //   {
  //     queryParams: {
  //       CustomerPersonID: row.customerPersonID,
  //       CustomerPersonName: row.customerPersonName,       
  //     }
  //   }); 
	
  // }
/////////////////for Image Upload////////////////////////////

openInNewTab(menuItem: any, rowItem: any) {
  console.log(menuItem);
  console.log(rowItem);
  let baseUrl = this._generalService.FormURL;

  // Encrypt the parameters
  const encryptedCustomerPersonID = encodeURIComponent(this._generalService.encrypt(rowItem.customerPersonID.toString()));
  const encryptedCustomerPersonName = encodeURIComponent(this._generalService.encrypt(rowItem.customerPersonName));
  //const encryptedCustomerGroupID = encodeURIComponent(this._generalService.encrypt(rowItem.customerGroupID?.toString() || '0'));


  if (menuItem.label.toLowerCase() === 'address') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonAddress'], { queryParams: {
      CustomerPersonID: encryptedCustomerPersonID,
      CustomerPersonName: encryptedCustomerPersonName, 
    } }));
    console.log(baseUrl + url);
    window.open(baseUrl + url, '_blank');
  } else if (menuItem.label.toLowerCase() === 'document') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonDocument'], { queryParams: {
      CustomerPersonID: encryptedCustomerPersonID,
      CustomerPersonName: encryptedCustomerPersonName, 
    } }));
    window.open(baseUrl + url, '_blank'); 
  } else if (menuItem.label.toLowerCase() === 'driver restriction') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonDriverRestriction'], { queryParams: {
      CustomerPersonID: encryptedCustomerPersonID,
      CustomerPersonName: encryptedCustomerPersonName, 
    } }));
    window.open(baseUrl + url, '_blank'); 
    
  } 
    else if (menuItem.label.toLowerCase() === 'inventory restriction') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonInventoryRestriction'], { queryParams: {
      CustomerPersonID: encryptedCustomerPersonID,
      CustomerPersonName: encryptedCustomerPersonName, 
    } }));
    window.open(baseUrl + url, '_blank'); 
  }
  else if (menuItem.label.toLowerCase() === 'instruction') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonInstruction'], { queryParams: {
      CustomerPersonID: encryptedCustomerPersonID,
      CustomerPersonName: encryptedCustomerPersonName, 
    } }));
    window.open(baseUrl + url, '_blank'); 
  } else if (menuItem.label.toLowerCase() === 'driving license') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonDrivingLicense'], { queryParams: {
      CustomerPersonID: encryptedCustomerPersonID,
      CustomerPersonName: encryptedCustomerPersonName, 
    } }));
    window.open(baseUrl + url, '_blank'); 
  } else if (menuItem.label.toLowerCase() === 'temp vip') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonTempVIP'], { queryParams: {
      CustomerPersonID: encryptedCustomerPersonID,
      CustomerPersonName: encryptedCustomerPersonName, 
    } }));
    window.open(baseUrl + url, '_blank'); 
  } else if (menuItem.label.toLowerCase() === 'prefered driver') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonPreferedDriver'], { queryParams: {
      CustomerPersonID: encryptedCustomerPersonID,
      CustomerPersonName: encryptedCustomerPersonName, 
    } }));
    window.open(baseUrl + url, '_blank'); 
  } else if (menuItem.label.toLowerCase() === 'person alert messages') {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonAlertMessages'], { queryParams: {
      CustomerPersonID: encryptedCustomerPersonID,
      CustomerPersonName: encryptedCustomerPersonName, 
    } }));
    window.open(baseUrl + url, '_blank'); 
  }
  // else if (menuItem.label.toLowerCase() === 'approval') {
  //   const url = this.router.serializeUrl(this.router.createUrlTree(['/customerPersonApprover'], { queryParams: {
  //     CustomerPersonID: encryptedCustomerPersonID,
  //     CustomerPersonName: encryptedCustomerPersonName, 
  //         CustomerGroupID: encryptedCustomerGroupID 
  //   } }));
  //   window.open(baseUrl + url, '_blank'); 
  // }
else if (menuItem.label.toLowerCase() === 'approval') {
    const url = this.router.serializeUrl(
        this.router.createUrlTree(['/customerPersonApprover'], { 
            queryParams: {
                CustomerPersonID: encryptedCustomerPersonID,
                CustomerPersonName: encryptedCustomerPersonName, 
                CustomerGroupID: encodeURIComponent(
                    this._generalService.encrypt((rowItem.customerGroupID ?? 0).toString())
                )
            } 
        })
    );

    window.open(baseUrl + url, '_blank'); 
}
}

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
          if(this.MessageArray[0]=="CustomerPersonCreate")
          {
            if(this.MessageArray[1]=="CustomerPersonView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Person Created...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonUpdate")
          {
            if(this.MessageArray[1]=="CustomerPersonView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Updated ..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonDelete")
          {
            if(this.MessageArray[1]=="CustomerPersonView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Person Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerPersonAll")
          {
            if(this.MessageArray[1]=="CustomerPersonView")
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
    this.customerPersonService.getTableDataSort(
      this.SearchCustomer,this.SearchName,
      this.SearchPrimary,
      this.SearchBilling,
      this.SearchMobile,
      this.customerGroup_ID,
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



