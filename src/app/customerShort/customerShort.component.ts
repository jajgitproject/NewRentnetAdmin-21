// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomerShortService } from './customerShort.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerShort } from './customerShort.model';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
//import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormControl } from '@angular/forms';
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleCategory } from '../vehicleCategory/vehicleCategory.model';
import { FormDialogCustomerShortComponent } from './dialogs/form-dialog/form-dialog.component';
@Component({
  standalone: false,
  selector: 'app-customerShort',
  templateUrl: './customerShort.component.html',
  styleUrls: ['./customerShort.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CustomerShortComponent implements OnInit {
  displayedColumns = [
    'customerShortName',
    'customerShortGroup',
    'customerShortType',
    'customerShortCategory',
    'actions'
  ];
  dataSource: CustomerShort[] | null;
  customerShortID: number;
  advanceTable: CustomerShort | null;
  CustomerShortID: number = 0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  customerGroup_ID: any;
  customerGroup_Name: any;

  searchCustomerShortName:string='';
  searchcustomerShortGroup:string='';
  searchCustomerShortType:string='';
  searchCustomerShortCategory:string='';
  searchCustomerShortCodeForAPIIntegration:string='';
  //vehicleCategory:FormControl=new FormControl();

  customerShortName:FormControl=new FormControl();
  customerShortGroup:FormControl=new FormControl();
  customerShortType:FormControl=new FormControl();
  customerShortCategory:FormControl=new FormControl();
  customerShortCodeForAPIIntegration:FormControl=new FormControl();

  supplier:FormControl=new FormControl();
  
  // regNumber:FormControl=new FormControl();
  ActiveStatus: string;
  customerID: any;
  customerGroupID: any;
  customerGroup: any;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public customerShortService: CustomerShortService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
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
      this.customerGroupID   = paramsData.CustomerGroupID;
      this.customerGroup   = paramsData.CustomerGroup;
  });
    this.loadData();
    this.SubscribeUpdateService();
    //this.InitSupplier();
  }

  // InitSupplier(){
  //   this._generalService.getSuppliersForCustomerShort().subscribe(
  //     data=>{
  //       this.SupplierList=data;
  //     }
  //   )
  // }

  refresh() {
    this.searchCustomerShortName='',
    this.searchCustomerShortType='',
    this.searchCustomerShortCategory='',
    this.searchcustomerShortGroup='',
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }
  // initCustomerShortType(){
  //   this._generalService.getCustomerShortType().subscribe(
  //     data=>{
  //       this.CustomerShortTypeList=data;
  //     }
  //   )
  // }

  // initCustomerShortCategory(){
  //   this._generalService.getCustomerShortCategory().subscribe(
  //     data=>{
  //       this.customerShortCategoryList=data;
  //     }
  //   )
  //   //console.log(this.customerShortCategoryList)
  // }

  // initCustomerShortGroup(){
  //   this._generalService.getCustomerShortGroup().subscribe(
  //     data=>{
  //       this.customerShortGroupList=data;``
  //       console.log(this.customerShortGroupList)
  //     }
  //   )
  // }

  addNew()
  {
    const dialogRef = this.dialog.open(FormDialogCustomerShortComponent, 
    {
      data: 
        {
          advanceTable: this.advanceTable,
          action: 'add',
          customerGroupID: this.customerGroupID,
          customerGroup :this.customerGroup,
        }
    });
  }
  editCall(row) {
      //  alert(row.id);
    this.customerID = row.customerID;
    const dialogRef = this.dialog.open(FormDialogCustomerShortComponent, {
      data: {
        advanceTable: row,
        action: 'edit',
        customerGroupID: this.customerGroupID,
          customerGroup :this.customerGroup,
        
      }
    });
    console.log(row)

  }
  deleteItem(row)
  {

    this.customerID = row.id;
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
      this.customerShortService.getTableData(
        this.customerGroupID,
        this.searchCustomerShortName,
        this.searchCustomerShortType,
        this.searchCustomerShortCategory,
        this.searchcustomerShortGroup,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
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
         // console.log(element);
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
  onContextMenu(event: MouseEvent, item: CustomerShort) {
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

  customerShortStatus(row) {
    console.log(row.vehicle);
    this.router.navigate([
      '/customerShortConfigurationSEZ',  
    ],
    {
      queryParams: {
        CustomerShortID: row.customerShortID,
        CustomerShortName: row.customerShortName,
        //vehicleID:row.vehicleID,
        //vechicleName: row.vehicle,
      }
    }); 
  }

  customerShortCityMapping(row) {
    console.log(row.vehicle);
    this.router.navigate([
      '/customerShortCategoryMapping',  
    ],
    {
      queryParams: {
        CustomerShortID: row.customerShortID,
        CustomerShortName: row.customerShortName,
      }
    }); 
  }

  driverDetailsSMsEMail(row) {
    console.log(row.vehicle);
    this.router.navigate([
      '/customerShortCarAndDriverDetailsSMSEMail',  
    ],
    {
      queryParams: {
        CustomerShortID: row.customerShortID,
        CustomerShortName: row.customerShortName,
      }
    }); 
  }

  customerShortDesignation(row) {
    console.log(row.vehicle);
    this.router.navigate([
      '/customerShortDesignation',  
    ],
    {
      queryParams: {
        CustomerShortID: row.customerShortID,
        CustomerShortName: row.customerShortName,
      }
    }); 
  }

  customerShortReservation(row) {
    console.log(row.vehicle);
    this.router.navigate([
      '/customerShortReservationAlert',  
    ],
    {
      queryParams: {
        CustomerShortID: row.customerShortID,
        CustomerShortName: row.customerShortName,
      }
    }); 
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
          if(this.MessageArray[0]=="CustomerShortCreate")
          {
            if(this.MessageArray[1]=="CustomerShortView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'CustomerShort Created ..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerShortUpdate")
          {
            if(this.MessageArray[1]=="CustomerShortView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CustomerShort Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerShortDelete")
          {
            if(this.MessageArray[1]=="CustomerShortView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'CustomerShort Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerShortAll")
          {
            if(this.MessageArray[1]=="CustomerShortView")
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
    this.customerShortService.getTableDataSort(this.customerGroupID,this.searchCustomerShortName,
      this.searchCustomerShortType,
      this.searchCustomerShortCategory,
      this.searchcustomerShortGroup,
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

//   CustomerShortInsurance(row) {
   
//     this.customerShortID = row.customerShortID;
//    this.router.navigate([
//      '/customerShortInsurance',       
    
//    ],{
//      queryParams: {
//        CustomerShortID: this.customerShortID,
//        RegNo:row.registrationNumber
//      }
//    });
//   }

customerShortAddress(row) {
   
    this.customerShortID = row.customerShortID;
   this.router.navigate([
     '/customerShortAddress',       
    
   ],{
     queryParams: {
       CustomerShortID: this.customerShortID,
       CustomerShortName:row.customerShortName
     }
   });
  }
  
  customerShortConfigurationBilling(row) {
   
  this.customerShortID = row.customerShortID;
 this.router.navigate([
   '/customerShortConfigurationBilling',       
  
 ],{
   queryParams: {
     CustomerShortID: this.customerShortID,
     CustomerShortName:row.customerShortName
   }
 });
}

customerShortConfigurationReservation(row) {
   
  this.customerShortID = row.customerShortID;
 this.router.navigate([
   '/customerShortConfigurationReservation',       
  
 ],{
   queryParams: {
     CustomerShortID: this.customerShortID,
     CustomerShortName:row.customerShortName
   }
 });
}

reservationAlert(row) {
   
  this.customerShortID = row.customerShortID;
 this.router.navigate([
   '/reservationAlert',       
  
 ],{
   queryParams: {
     CustomerShortID: this.customerShortID,
     CustomerShortName:row.customerShortName
   }
 });
}

customerShortConfigurationSupplier(row) {
   
  this.customerShortID = row.customerShortID;
 this.router.navigate([
   '/customerShortConfigurationSupplier',       
  
 ],{
   queryParams: {
     CustomerShortID: this.customerShortID,
     CustomerShortName:row.customerShortName
   }
 });
}

customerShortBlocking(row) {
   
  this.customerShortID = row.customerShortID;
 this.router.navigate([
   '/customerShortBlocking',       
  
 ],{
   queryParams: {
     CustomerShortID: this.customerShortID,
     CustomerShortName:row.customerShortName
   }
 });
}
										  
customerShortConfigurationInvoicing(row) {
  this.router.navigate([
    '/customerShortConfigurationInvoicing',  
  ],
  {
    queryParams: {
      CustomerShortID: row.customerShortID,
      CustomerShortName: row.customerShortName,
     
    }
  }); 
}
customerShortKeyAccountManager(row) {
  this.router.navigate([
    '/customerShortKeyAccountManager',  
  ],
  {
    queryParams: {
      CustomerShortID: row.customerShortID,
      CustomerShortName: row.customerShortName,
     
    }
  }); 
}

stopReservation(row) {
  this.router.navigate([
    '/stopReservation',  
  ],
  {
    queryParams: {
      CustomerShortID: row.customerShortID,
      CustomerShortName: row.customerShortName,
     
    }
  }); 
}
customerShortServiceExecutive(row) {
  this.router.navigate([
    '/customerShortServiceExecutive',  
  ],
  {
    queryParams: {
      CustomerShortID: row.customerShortID,
      CustomerShortName: row.customerShortName,
     
    }
  }); 
}
customerShortBillingExecutive(row) {
  this.router.navigate([
    '/customerShortBillingExecutive',  
  ],
  {
    queryParams: {
      CustomerShortID: row.customerShortID,
      CustomerShortName: row.customerShortName,
     
    }
  }); 
}
customerShortCollectionExecutive(row) {
  this.router.navigate([
    '/customerShortCollectionExecutive',  
  ],
  {
    queryParams: {
      CustomerShortID: row.customerShortID,
      CustomerShortName: row.customerShortName,
     
    }
  }); 
}
customerShortReservationExecutive(row) {
  this.router.navigate([
    '/customerShortReservationExecutive',  
  ],
  {
    queryParams: {
      CustomerShortID: row.customerShortID,
      CustomerShortName: row.customerShortName,
     
    }
  }); 
}
customerShortSalesManager(row) {
  this.router.navigate([
    '/customerShortSalesManager',  
  ],
  {
    queryParams: {
      CustomerShortID: row.customerShortID,
      CustomerShortName: row.customerShortName,
     
    }
  }); 
}
customerShortConfigurationMessaging(row) {
  this.router.navigate([
    '/customerShortConfigurationMessaging',  
  ],
  {
    queryParams: {
      CustomerShortID: row.customerShortID,
      CustomerShortName: row.customerShortName,
     
    }
  }); 
}
customerShortContractMapping(row) {
  this.router.navigate([
    '/customerShortContractMapping',  
  ],
  {
    queryParams: {
      CustomerShortID: row.customerShortID,
      CustomerShortName: row.customerShortName,
     
    }
  }); 
}

//   InterstateTax(row) {
   
//     this.customerShortID = row.customerShortID;
//    this.router.navigate([
//      '/vehicleInterStateTax',       
    
//    ],{
//      queryParams: {
//        CustomerShortID: this.customerShortID,
//        RegNo:row.registrationNumber
//      }
//    });
//   }

//   CustomerShortPUC(row) {
   
//     this.customerShortID = row.customerShortID;
//    this.router.navigate([
//      '/customerShortPUC',       
    
//    ],{
//      queryParams: {
//        CustomerShortID: this.customerShortID,
//        RegNo:row.registrationNumber
//      }
//    });
//   }
//   CustomerShortFitness(row) {
   
//     this.customerShortID = row.customerShortID;
//    this.router.navigate([
//      '/customerShortFitness',       
    
//    ],{
//      queryParams: {
//        CustomerShortID: this.customerShortID,
//        RegNo:row.registrationNumber
//      }
//    });
//   }
//   CustomerShortBlock(row) {
   
//     this.customerShortID = row.customerShortID;
//    this.router.navigate([
//      '/customerShortBlock',       
    
//    ],{
//      queryParams: {
//        CustomerShortID: this.customerShortID,
//        RegNo:row.registrationNumber
//      }
//    });
//   }
// }
}



