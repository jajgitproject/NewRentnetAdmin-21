// @ts-nocheck
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router'
import { QualificationDropDown } from '../general/qualificationDropDown.model';
import { DriverGradeDropDown } from '../driverGrade/driverGradeDropDown.model';
import { DriverMISService } from './driverMIS.service';
import { DriverMIS } from './driverMIS.model';
import { SupplierTypeDropDownModel } from '../supplierType/supplierType.model';
import { DriverDropDown } from '../customerPersonDriverRestriction/driverDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import moment from 'moment';

interface MenuItem {
  label: string;
  action: (item: any) => void;
  tooltip?: string;
  row?: any;
}

@Component({
  standalone: false,
  selector: 'app-drivermis',
  templateUrl: './drivermis.component.html',
  styleUrls: ['./drivermis.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DriverMISComponent implements OnInit {
  displayedColumns = [
    'driverName',
    'driverFatherName',
    'driverGrade',
    'driverEmail',
    'driverOfficialIdentityNumber',
    'dob',
    'driverGradeName',
    'rtoState',
    'idMark',
    'localAddressCity',
    'highestQualification',
    'bloodGroup',
    'driverStatus',
    'dateOfJoining',
    'dateOfLeaving',
    'localAddressAddressString',
    'localAddressLatLong',
    'localAddress',
    'localPincode',
    'permanentAddressCity',
    'permanentAddress',
    'permanentAddressPincode',
    'mobile1',
    'mobile2',
    'hub',
    'location',
    'supplierType',
    'supplier',
    'englishSpeakingSkills',
    'referenceOf',
    'policeVerification',
    'driverImage',
    'medicalInsurance',
    'drivingSinceDate',
    'countryCodes',
    'companyName',
    'driverFeedbackAverage',
    'driverFeedbackReceived',
    'driverFeedbackTotal',
    'driverFeedbackCount',
    'appLoginStatus',
    'offDuty',
    'appVersion',
    'deviceModel',
    'deviceIMEI',
    'deviceType',
    'driverCameraProblem',
    // 'actions'
  ];
  columnTitleMap: { [key: string]: string } = {
    driverName: "Driver Name",
    driverFatherName: "Father Name",
    driverGrade: "Driver Grade",
    driverEmail: "Driver Email",
    driverOfficialIdentityNumber: "Official Identity Number",
    dob: "Dob",
    driverGradeName: "Grade Name",
    rtoState: "State",
    idMark: "Mark",
    localAddressCity: "Local Address City",
    highestQualification: "Highest Qualification",
    bloodGroup: "Blood Group",
    driverStatus: "Driver Status",
    dateOfJoining: "Date Of Joining",
    dateOfLeaving: "Date Of Leaving",
    localAddressAddressString: "Local Address String",
    localAddressLatLong: "Local Address Lat Long",
    localAddress: "Local Address",
    localPincode: "Local Pincode",
    permanentAddressCity: "Permanent Address City",
    permanentAddress: "Permanent Address",
    permanentAddressPincode: "Permanent Address Pincode",
    mobile1: "Mobile 1",
    mobile2: "Mobile 2",
    hub: "Hub",
    location: "Location",
    supplierType: "Supplier Type",
    supplier: "Supplier",
    englishSpeakingSkills: "English Speaking Skills",
    referenceOf: "Reference Of",
    policeVerification: "Police Verification",
    driverImage: "Driver Image",
    medicalInsurance: "Medical Insurance",
    drivingSinceDate: "Driving Since Date",
    countryCodes: "Country Codes",
    companyName: "Company Name",
    driverFeedbackAverage: "Feedback Average",
    driverFeedbackReceived: "Feedback Received",
    driverFeedbackTotal: "Feedback Total",
    driverFeedbackCount: "Feedback Count",
    appLoginStatus: "App Login Status",
    offDuty: "Off Duty",
    appVersion: "App Version",
    deviceModel: "Device Model",
    deviceIMEI: "Device Imei",
    deviceType: "Device Type",
    driverCameraProblem: "Camera Problem",
     actions: "Actions"
  }
  
  dataSource: DriverMIS[] | null;
  driverID: number;
  advanceTable: DriverMIS | null;
  SearchdriverName: string = '';
  searchdriverFatherName: string = '';
  searchdriverGradeName: string = '';
  searchDriverMISOfficialIdentityNumber: string = '';
  searchhighestQualification: string = '';
  SearchActivationStatus : boolean=true;
  PageNumber: number = 0;
  search : FormControl = new FormControl();
  driverFatherName : FormControl = new FormControl();
  driverGrade : FormControl = new FormControl();
  idMark : FormControl = new FormControl();
  highestQualification : FormControl = new FormControl();
  isChecked: boolean = false;
  sortingData: number;
  sortType: string;
  activeData: string;
  public DriverMISGradeList?: DriverGradeDropDown[] = [];
  filteredGradeOptions: Observable<DriverGradeDropDown[]>;
  public QualificationList?: QualificationDropDown[] = [];

 public SupplierTypeList?: SupplierTypeDropDownModel[] = [];
  filteredSupplierTypeOptions: Observable<SupplierTypeDropDownModel[]>;
filteredDriverOptions:Observable<DriverDropDown[]>;
  public DriverList?:DriverDropDown[]=[];
  searchDriverName:string='';
  searchSupplierType: string = '';
  driver : FormControl=new FormControl();
  supplierType : FormControl = new FormControl();

   filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
   public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
   public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
     locationHub: FormControl = new FormControl();
    searchdateofjoiningfrom:string = ''; 
    searchdateofjoiningto:string = ''; 
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public router:Router,
    public drivermisService: DriverMISService,
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
    this.initSupplierType();
     this.initDriver();
     this.InitLocationHub();
    this.SubscribeUpdateService();
  }
  refresh() {
    // this.driver.setvalue ('');
    this.driver.setValue('');
    this.locationHub.setValue('');
    this.searchdateofjoiningfrom ='';
    this.searchdateofjoiningto='';
    this.supplierType.setValue('');
    this.SearchActivationStatus = true;
    this.PageNumber=0;
    this.loadData();
  }

  public SearchData()
  {
    this.loadData();    
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

      if(this.searchdateofjoiningfrom!==""){
              this.searchdateofjoiningfrom=moment(this.searchdateofjoiningfrom).format('MMM DD yyyy');
            }
            if(this.searchdateofjoiningto!==""){
              this.searchdateofjoiningto=moment(this.searchdateofjoiningto).format('MMM DD yyyy');
            }
      
      this.drivermisService.getTableData(this.driver.value,this.locationHub.value,this.searchdateofjoiningfrom, this.searchdateofjoiningto,this.supplierType.value,this.SearchActivationStatus, this.PageNumber).subscribe
    (
      data =>   
      {

        this.dataSource = data;
       
        // this.dataSource.forEach((ele)=>{
        //   if(ele.activationStatus===true){
        //     this.activeData="Active";
        //   }
        //   else{
        //     this.activeData="Deleted"
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
  onContextMenu(event: MouseEvent, item: DriverMIS) {
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

//-------Driver-------
initDriver(){
  this._generalService.getDriverMIS().subscribe(
    data=>
    {
      this.DriverList=data;
      this.filteredDriverOptions = this.driver.valueChanges.pipe(
        startWith(""),
        map(value => this._filterDriver(value || ''))
      ); 
    });
}
private _filterDriver(value: string): any {
  const filterValue = value.toLowerCase();
  // if (!value || value.length < 3)
  //    {
  //       return [];   
  //     }
  return this.DriverList.filter(
    customer => 
    {
      return customer.driverName.toLowerCase().indexOf(filterValue)===0;
    }
  );
}

InitLocationHub(){
  this._generalService.GetLocation().subscribe(
    data=>
    {
      this.OrganizationalEntitiesList=data;
    
      this.filteredOrganizationalEntityOptions = this.locationHub.valueChanges.pipe(
        startWith(""),
        map(value => this._filterOrganizationalsEntity(value || ''))
      ); 
    });
}
private _filterOrganizationalsEntity(value: string): any {
  const filterValue = value.toLowerCase();
  // if (!value || value.length < 3)
  //    {
  //       return [];   
  //     }
  return this.OrganizationalEntitiesList.filter(
    customer => 
    {
      return customer.organizationalEntityName.toLowerCase().indexOf(filterValue)===0;
    }
  );
}

  initSupplierType() {
    
    this._generalService.GetSupplierType().subscribe(
      data =>
      {
        this.SupplierTypeList = data;
       this.filteredSupplierTypeOptions = this.supplierType.valueChanges.pipe(
          startWith(""),
          map(value => this._filterSupplierType(value || ''))
        );
      },
      error =>
      {
       
      }
    );
  }
  private _filterSupplierType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.SupplierTypeList?.filter(
      customer => 
      {
        return customer.supplierType.toLowerCase().indexOf(filterValue)===0;
      }
    );
    
  };

  PreviousCall()
  {

    if(this.PageNumber>0)
    {
      this.PageNumber--;
      this.loadData();    } 
  }

  // drivermisDocument(row) {
  
  //   this.router.navigate([
  //     '/drivermisDocument',  
  //   ],
  //   {
  //     queryParams: {
  //       DriverMISID: row.drivermisID,
  //       DriverMISName: row.drivermisName,   
            
  //     }
  //   }); 
  // }

  // drivermisInventoryAssociation(row) {
  
  //   this.router.navigate([
  //     '/drivermisInventoryAssociation',  
  //   ],
  //   {
  //     queryParams: {
  //       DriverMISID: row.drivermisID,
  //       DriverMISName: row.drivermisName,   
            
  //     }
  //   }); 
  // }

  // DriverMISDrivingLicense(row) {
  //   this.router.navigate([
  //     '/drivermisDrivingLicense',  
  //   ],
  //   {
  //     queryParams: {
  //       DriverMISID: row.drivermisID,
  //       DriverMISName: row.drivermisName,       
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
          if(this.MessageArray[0]=="DriverMISCreate")
          {
            if(this.MessageArray[1]=="DriverMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
                this.refresh();
                this.showNotification(
                'snackbar-success',
                'DriverMIS Created ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverMISUpdate")
          {
            if(this.MessageArray[1]=="DriverMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'DriverMIS Updated ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverMISDelete")
          {
            if(this.MessageArray[1]=="DriverMISView")
            {
              if(this.MessageArray[2]=="Success")
              {
               this.refresh();
               this.showNotification(
                'snackbar-success',
                'DriverMIS Deleted ...!!!',
                'bottom',
                'center'
              );
              }
            }
          }
          else if(this.MessageArray[0]=="DriverMISAll")
          {
            if(this.MessageArray[1]=="DriverMISView")
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
    if(coloumName.active==='hub')
    {
      coloumName.active="hub"
    }
    if(coloumName.active==='location')
    {
      coloumName.active="location"
    }
    this.drivermisService.getTableDataSort(this.driver.value,this.locationHub.value,this.searchdateofjoiningfrom,this.searchdateofjoiningto, this.supplierType.value,this.SearchActivationStatus, this.PageNumber,coloumName.active,this.sortType).subscribe
    (
      data =>   
      {
        this.dataSource = data;
      },
      (error: HttpErrorResponse) => { this.dataSource = null;}
    );
  }
 
}




