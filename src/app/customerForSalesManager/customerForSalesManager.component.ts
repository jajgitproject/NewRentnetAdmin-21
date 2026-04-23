// @ts-nocheck
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from '../general/general.service';
// import { MyUploadComponent } from '../myupload/myupload.component';
import { MyUploadComponent } from '../myupload/myupload.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { VehicleCategoryDropDown } from '../vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleDropDown } from '../vehicle/vehicleDropDown.model';
import { SupplierDropDown } from '../supplier/supplierDropDown.model';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleCategory } from '../vehicleCategory/vehicleCategory.model';
import { CustomerTypeDropDown } from '../customerType/customerTypeDropDown.model';
import { CustomerCategoryDropDown } from '../customerCategory/customerCategoryDropDown.model';
import { CustomerGroupDropDown } from '../customerGroup/customerGroupDropDown.model';
import { RoleDropDown } from '../role/roleDropDown.model';
import { RolePageMappingService } from '../rolePageMapping/rolePageMapping.service';
import { FormDialogComponent as CIPlusComponent } from '../customerCorporateIndividual/dialogs/form-dialog/form-dialog.component';
import { CustomerForSalesManagerModel, CustomerSalesManagerModel } from './customerForSalesManager.model';
import { CustomerForSalesManagerService } from './customerForSalesManager.service';
import Swal from 'sweetalert2';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-customerForSalesManager',
  templateUrl: './customerForSalesManager.component.html',
  styleUrls: ['./customerForSalesManager.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class CustomerForSalesManagerComponent implements OnInit {
  @Input() customerID:any;
  @Input() action:any;
  
  displayedColumns = [
    'check',
    'customerName',
    'customerGroup',
    'customerType',
  ];

  dataSource: CustomerForSalesManagerModel[] | null;
  dataSourceForPage:RoleDropDown[] | any;
  advanceTable: CustomerForSalesManagerModel | null;
  CustomerID: number = 0;
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;

  searchCustomerName:string='';
  searchcustomerGroup:string='';
  searchCustomerType:string='';
  searchCustomerCategory:string='';
  searchCustomerCodeForAPIIntegration:string='';
  //vehicleCategory:FormControl=new FormControl();

  customerName:FormControl=new FormControl();
  customerGroup:FormControl=new FormControl();
  customerType:FormControl=new FormControl();
  customerCategory:FormControl=new FormControl();
  customerCodeForAPIIntegration:FormControl=new FormControl();

  supplier:FormControl=new FormControl();
  
  // regNumber:FormControl=new FormControl();
  public customerGroupList?: CustomerGroupDropDown[] = [];
  public CustomerTypeList?: CustomerTypeDropDown[] = [];
  public customerCategoryList?: CustomerCategoryDropDown[] = [];
  public SupplierList?: SupplierDropDown[] = [];
  filteredOptions: Observable<CustomerGroupDropDown[]>;
  filteredTypeOptions: Observable<CustomerTypeDropDown[]>;
  filteredCategoryOptions: Observable<CustomerCategoryDropDown[]>;
  ActiveStatus: string;
  searchTerm: any = '';
  selectedFilter: string = 'search';
  filterSelected:boolean = true;

  EmployeeID: any;
  EmployeeName: string;
  selectAll:boolean=false;
  selectedCustomer: any[] = [];
  isLoading = false;
  saveDisabled:boolean=true;

  constructor(
    
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public customerForSalesManagerService: CustomerForSalesManagerService,
    private roleMapService: RolePageMappingService,
    private snackBar: MatSnackBar,
    public route:ActivatedRoute,
    public _generalService: GeneralService,
    private fb: FormBuilder,
  ) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  
  ngOnInit() 
  {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedEmployeeID = paramsData.EmployeeID;
      const encryptedEmployeeName = paramsData.EmployeeName;
      this.EmployeeID = this._generalService.decrypt(decodeURIComponent(encryptedEmployeeID));
      this.EmployeeName = this._generalService.decrypt(decodeURIComponent(encryptedEmployeeName));
    });
    this.loadData();
    this.SubscribeUpdateService();
    this.InitCustomerCategory();
    this.InitCustomerType();
    this.InitCustomerGroup();  
  }


  onBackPress(event) 
  {
    if (event.keyCode === 8) 
    {
      this.loadData();
    }
  }
    

  refresh() 
  {
    this.searchCustomerName='',
    this.customerType.setValue(''),
    this.customerCategory.setValue(''),
    this.customerGroup.setValue(''),
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.searchTerm = '';
    this.selectedFilter = 'search';
    this.loadData();
  }

 

  InitCustomerCategory()
  {
    this._generalService.getCustomerCategory().subscribe(
      data=>{
        this.customerCategoryList=data;
        this.filteredCategoryOptions =  this.customerCategory.valueChanges.pipe(
          startWith(""),
          map(value => this._filterCategory(value || ''))
        );
      }
    )
  }
  private _filterCategory(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.customerCategoryList.filter(
      customer => 
      {
        return customer.customerCategory.toLowerCase().indexOf(filterValue)===0;
      }
    );    
  };

  InitCustomerGroup()
  {
    this._generalService.getCustomerGroup().subscribe(
      data=>{
        this.customerGroupList=data;
        this.filteredOptions = this.customerGroup.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        );

      }
    )
  }
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.customerGroupList.filter(
      customer => 
      {
        return customer.customerGroup.toLowerCase().indexOf(filterValue)===0;
      }
    );    
  };

  InitCustomerType()
  {
    this._generalService.getCustomerType().subscribe(
      data=>{
        this.CustomerTypeList=data;
        this.filteredTypeOptions = this.customerType.valueChanges.pipe(
          startWith(""),
          map(value => this._filterType(value || ''))
        );
      }
    )
  }
  private _filterType(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.CustomerTypeList.filter(
      customer => 
      {
        return customer.customerType.toLowerCase().indexOf(filterValue)===0;
      }
    );    
  };

  public SearchData()
  {
    this.loadData();    
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
      case 'name':
        this.searchCustomerName = this.searchTerm;
        break;
      case 'customerType':
        this.customerType.setValue(this.searchTerm);
        break;
        case 'customerGroup':
        this.customerGroup.setValue(this.searchTerm);
        break;
      default:
        this.searchTerm = '';
        break;
    }
      this.customerForSalesManagerService.getTableData(this.EmployeeID,
        this.searchCustomerName,
        this.customerType.value,
        this.customerGroup.value,
        this.SearchActivationStatus, 
        this.PageNumber).subscribe
    (
      data =>   
      {
        this.dataSource = data;      
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }

  SortingData(coloumName:any) 
  {
    if (this.sortingData == 1) 
    {
      this.sortingData = 0;
      this.sortType = "Ascending"
    }
    else 
    {
      this.sortingData = 1;
      this.sortType = "Descending";
    }
    this.customerForSalesManagerService.getTableDataSort(this.EmployeeID,this.searchCustomerName,
      this.searchCustomerType,
      this.searchcustomerGroup,
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  onContextMenu(event: MouseEvent, item: CustomerForSalesManagerModel) 
  {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    //this.contextMenu.menu.focusFirstItem('mouse');
    //this.contextMenu.openMenu();
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
          if(this.MessageArray[0]=="CustomerCreate")
          {
            if(this.MessageArray[1]=="CustomerView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'Customer Created ..!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerUpdate")
          {
            if(this.MessageArray[1]=="CustomerView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerDelete")
          {
            if(this.MessageArray[1]=="CustomerView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'Customer Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="CustomerAll")
          {
            if(this.MessageArray[1]=="CustomerView")
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


    advanceTableForm: FormGroup = this.fb.group({
        customerSalesManagerID: [],
        employeeID: [],
        userID: [],
        listOfCustomerID: [[]]   // array of numbers
      });

    //---------- Check Box ----------
    checkAll(checkBoxValue: boolean) 
    {
      this.dataSource?.forEach((element: any) => {
        if(checkBoxValue) 
        {
          this.selectAll = true;
          element.checked = true;
          this.selectedCustomer.push(element);
        } 
        else 
        {
          this.selectAll = false;
          element.checked = false;
          const index = this.selectedCustomer.findIndex(x => x.customerID === element.customerID);
          this.selectedCustomer.splice(index, 1);
        }
      });
    }

    onCheckBox(checkBoxValue: boolean, data: any) 
    {
      if(checkBoxValue && this.dataSource.includes(data))
      {
        this.selectedCustomer.push(data);
        data.checked = true;
      } 
      else if(!checkBoxValue && this.dataSource.includes(data)) 
      {
        this.selectAll = false;
        data.checked = false;
        const index = this.selectedCustomer.findIndex(x => x.customerID === data.customerID);
        this.selectedCustomer.splice(index, 1);
      }
    }

    isIndeterminate() 
    {
      const checkedCount = this.dataSource.filter(r => r.checked).length;
      return checkedCount > 0 && checkedCount < this.dataSource.length;
    }

    SetAsSalesManager() 
    {
      const duties: number[] = this.selectedCustomer.map(x => x.customerID);
      //Check if customer selected
      if (!this.selectedCustomer || this.selectedCustomer.length === 0)
      {
        Swal.fire({
          title: 'No Customer Selected!',
          text: 'Please select customer.',
          icon: 'warning',
          confirmButtonText: 'Ok'
        });
        return;
      }

      //Confirmation Popup
      Swal.fire({
        title: `Are you sure you want to set ${this.EmployeeName} as Sales Manager?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => 
        {
          if (result.isConfirmed) 
          {
            this.saveDisabled = false;
            this.advanceTableForm.patchValue({employeeID: this.EmployeeID});
            this.advanceTableForm.patchValue({listOfCustomerID: duties});
            this.customerForSalesManagerService.add(this.advanceTableForm.getRawValue())
            .subscribe(
              response => 
              {
                this.showNotification(
                  'snackbar-success',
                  'Sales Manager Updated Successfully...!!!',
                  'bottom',
                  'center'
                );
                this.refresh();
              },
              error => 
              {
                this.showNotification(
                  'snackbar-danger',
                  'Operation Failed...!!!',
                  'bottom',
                  'center'
                );
              }
          );
        }
      });
    }

   



}



