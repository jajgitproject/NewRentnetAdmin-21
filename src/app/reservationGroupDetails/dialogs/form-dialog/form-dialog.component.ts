// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ReservationGroupDetailsService } from '../../reservationGroupDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ReservationGroup } from '../../reservationGroupDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { CustomerTypeDropDown } from 'src/app/customerType/customerTypeDropDown.model';
import { CustomerCustomerGroupDropDown } from 'src/app/customer/customerCustomerGroupDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { CustomerPersonDropDown } from 'src/app/customerPerson/customerPersonDropDown.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormDialogCustomerShortComponent } from 'src/app/customerShort/dialogs/form-dialog/form-dialog.component';
import { FormDialogComponentCustomerPerson } from 'src/app/customerPerson/dialogs/form-dialog/form-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerAlertMessageDetailsComponent } from 'src/app/customerAlertMessageDetails/customerAlertMessageDetails.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCheckboxChange } from '@angular/material/checkbox';
import moment from 'moment';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { ReservationGroupService } from 'src/app/reservationGroup/reservationGroup.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerGroupDropDown } from 'src/app/customerGroup/customerGroupDropDown.model';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponent implements OnInit {
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ReservationGroup;
  filteredCustomerTypeOptions: Observable<CustomerTypeDropDown[]>;
  searchCustomerType: FormControl = new FormControl();

  filteredCustomerCustomerGroupOptions: Observable<CustomerCustomerGroupDropDown[]>;
  searchCustomerCustomerGroup: FormControl = new FormControl();

  filteredBookerOptions: Observable<CustomerPersonDropDown[]>;
  searchBooker: FormControl = new FormControl();

  filteredEmployeeOptions: Observable<EmployeeDropDown[]>;
  filteredEmployeesOptions: Observable<EmployeeDropDown[]>;
  searchEmployee: FormControl = new FormControl();

  public TransferLocationList?: OrganizationalEntityDropDown | null;
  public CustomerTypeList?: CustomerTypeDropDown[] = [];
  public CustomerCustomerGroupList?: CustomerCustomerGroupDropDown[] = [];
  public BookerList?: CustomerPersonDropDown[] = [];
  public EmployeeList?: EmployeeDropDown[] = [];
  public EmployeesList?: EmployeeDropDown[] = [];

 public CustomerGroupList?: CustomerGroupDropDown[] = [];
 filteredCustomerGroupOptions: Observable<CustomerGroupDropDown[]>;
  searchCustomerGroup: FormControl = new FormControl();

  customerTypeID: any;
  customerID: any;
  customerGroupID: any;
  bookerID: any;
  salesExecutiveID: any;
  reservationGroupID: any;
  customerDetailData: any;
  reservationID: any;
  customerType: any;
  customer: string;
  customerGroup: string;
  salesManagerList?: ReservationGroup[] = [];
  customerKamList?: ReservationGroup[] = [];
  kamID: any;
  requestType = '';

  public LocationNameList?: OrganizationalEntityDropDown[] = [];
  filteredLocationNameOptions: Observable<OrganizationalEntityDropDown[]>;
  locationID: any;

  FromToDate: string;
  ReasonMessageShow: boolean = false;
  Reason: any;
  saveDisabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    private dialog: MatDialog,
    public route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ReservationGroupDetailsService,
    private fb: FormBuilder,
    public router: Router,
      private snackBar: MatSnackBar,
    public reservationGroupService: ReservationGroupService,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Reservation Group';
      this.advanceTable = data.advanceTable;
      // let startDate=moment(this.advanceTable.reservationStartDate).format('DD/MM/yyyy');
      // let endDate=moment(this.advanceTable.reservationEndDate).format('DD/MM/yyyy');
      // this.onBlurUpdateDateEdit(startDate);
      // this.onBlurUpdateEndDateEdit(endDate);
    } else {
      this.dialogTitle = 'Reservation Group';
      this.advanceTable = new ReservationGroup({});
      // this.advanceTable.activationStatus=true;
    }
    this.requestType = data.requestType;
    console.log(data);
    this.advanceTableForm = this.createContactForm();
    this.reservationID = data.reservationID;
    this.customer = data.customer;
    this.customerGroup = data.customerGroup;

  }

  customerShort() {
    const dialogRef = this.dialog.open(FormDialogCustomerShortComponent,
      {
        data:
        {
          advanceTable: this.customerDetailData,
          action: 'add',
          customerID: this.customerID,
          customerGroupID: this.customerGroupID,

        }
      });
    dialogRef.afterClosed().subscribe(res => {
      // received data from dialog-component
      this.InitCustomerCustomerGroup();

    })
  }

  personShort() {
    if (this.action === 'edit') {

      let customer = this.advanceTableForm.value.customerCustomerGroup?.split('-')[0];
      let customerGroup = this.advanceTableForm.value.customerCustomerGroup?.split('-')[1];
      this.customerDetailData = {
        customerGroup: this.customerGroup, customerGroupID: this.advanceTableForm.value.customerGroupID,
        customerID: this.advanceTableForm.value.customerID, customerName: this.customer
      }

      if (this.customerDetailData) {
        const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson,
          {
            data:
            {
              advanceTable: this.customerDetailData,
              action: 'add',
              forCP: 'CP',
              CustomerGroupID: this.customerDetailData.customerGroupID,
              CustomerGroupName: this.customerDetailData.customerGroup
            }
          });
        dialogRef.afterClosed().subscribe(res => {
          // received data from dialog-component
          this.InitBooker();

        })
      }
    }
    else {
      if (this.customerDetailData) {

        const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson,
          {
            data:
            {
              advanceTable: this.customerDetailData,
              action: 'add',
              forCP: 'CP',
              CustomerGroupID: this.customerDetailData.customerGroupID,
              CustomerGroupName: this.customerDetailData.customerGroup
            }
          });
        dialogRef.afterClosed().subscribe(res => {
          // received data from dialog-component
          this.InitBooker();

        })
      }
    }

  }

  openPopup(event: any) {
    this.dialog.open(CustomerAlertMessageDetailsComponent);  // Open the popup when an option is selected
  }

  customerAlert(customerID: any, customerDetailData: any) {
    let data;
    if (this.action === 'add') {
      data = {
        customerID: customerID,
        customerName: customerDetailData?.customerName
      };
    } else if (this.action === 'edit') {
      data = {
        customerID: this.advanceTable.customerID,
        customerName: this.advanceTable.customer,
        // Add any other details needed for the edit action
        otherDetail: this.customerDetailData?.otherDetail
      };
    }
    this._generalService.GetCustomerAlertMessage(customerID).subscribe((res: any) => {
      if (res !== null && res.length > 0) {
        const data = {
          customerID: customerID,
          customerName: customerDetailData
        };

        this.dialog.open(CustomerAlertMessageDetailsComponent, { data });
      }
    },
      (error: HttpErrorResponse) => { });
  }

  ngOnInit() {
    debugger;
    this.advanceTableForm.controls["kam"].disable();
    this.advanceTableForm.controls["salesExecutive"].disable();
    // this.advanceTableForm.controls["locationName"].disable();
    if (this.action === 'edit') {
      //this.advanceTableForm.patchValue({reservationGroupID:this.advanceTable.reservationGroupID});
      this.advanceTableForm.patchValue({ customerGroupID: this.advanceTable.customerGroupID });
      this.advanceTableForm.patchValue({ customerGroup: this.advanceTable.customerGroup });
      this.advanceTableForm.patchValue({ customerType: this.advanceTable.customerType });
      this.advanceTableForm.patchValue({ customerTypeID: this.advanceTable.customerTypeID });
      this.advanceTableForm.controls["customerType"].disable();
      this.advanceTableForm.patchValue({ customerID: this.advanceTable.customerID });
      this.advanceTableForm.patchValue({ customerCustomerGroup: this.advanceTable.customer + '-' + this.advanceTable.customerGroup });
      this.advanceTableForm.controls["customerCustomerGroup"].disable();
      this.advanceTableForm.controls["numberOfBookings"].disable();
      this.advanceTableForm.patchValue({ primaryBookerID: this.advanceTable.primaryBookerID });
      this.advanceTableForm.patchValue({ primaryBooker: this.advanceTable.primaryBooker + '-' + this.advanceTable.gender + '-' + this.advanceTable.importance + '-' + this.advanceTable.phone + '-' + this.advanceTable.customerDepartment + '-' + this.advanceTable.customerDesignation + '-' + this.advanceTable.customerForBooker });
      this.advanceTableForm.patchValue({ bookingType: this.advanceTable.bookingType });
      //this.advanceTableForm.patchValue({salesExecutive:this.advanceTable.firstName+' '+this.advanceTable.lastName+'-'+this.advanceTable.mobile+'-'+this.advanceTable.email});
      this.InitBooker();
      this.advanceTableForm.patchValue({ salesExecutiveID: this.advanceTable.salesExecutiveID });
      this.advanceTableForm.patchValue({ salesExecutive: this.advanceTable.firstName + ' ' + this.advanceTable.lastName + '-' + this.advanceTable.mobile + '-' + this.advanceTable.email });
      this.advanceTableForm.patchValue({ kamID: this.advanceTable.kamID });
      this.advanceTableForm.patchValue({ kam: this.advanceTable.kamFirstName + ' ' + this.advanceTable.kamLastName + '-' + this.advanceTable.kamMobile + '-' + this.advanceTable.kamEmail });
      // this.getCustomerKam(this.advanceTable.customerID);
      // this.getSalesManager(this.advanceTable.customerID);
      //   if(this.advanceTable.customerType!=='Individual')
      //     {
      //       this.getCustomerKam(this.advanceTable.customerID);
      //     }
      //     else
      //     {
      //       if(this.advanceTable.kamID !== 0 )
      //         {
      //           this.advanceTableForm.patchValue({kamID:this.advanceTable.kamID});
      //           this.advanceTableForm.patchValue({kam:this.advanceTable.firstName+' '+this.advanceTable.lastName+'-'+this.advanceTable.mobile+'-'+this.advanceTable.email});

      //       }
      //       else
      //       {
      //         this.advanceTableForm.patchValue({kamID:0});
      //       this.advanceTableForm.patchValue({kam:null});
      //       }

      //     }
      // if(this.advanceTable.customerType!=='Individual')
      // {
      //   this.getSalesManager(this.advanceTable.customerID);
      // }
      // else
      // {
      //   if(this.advanceTable.salesExecutiveID !== 0 )
      //     {
      //       this.advanceTableForm.patchValue({salesExecutiveID:this.advanceTable.salesExecutiveID});
      //   this.advanceTableForm.patchValue({salesExecutive:this.advanceTable.firstName+' '+this.advanceTable.lastName+'-'+this.advanceTable.mobile+'-'+this.advanceTable.email});

      //   }
      //   else
      //   {
      //     this.advanceTableForm.patchValue({salesExecutiveID:0});
      //   this.advanceTableForm.patchValue({salesExecutive:null});
      //   }

      // }

    }
    this.advanceTableForm.get('bookingType')?.setValue('Normal');
    this.advanceTableForm.patchValue({ activationStatus: true });
    this.InitCustomerCustomerG();
    if(!this.advanceTableForm.value.customerGroupID)
    {
      this.InitCustomerRD();
    }

    //this.InitCustomerType();
    this.InitLocation();
    // this.InitSalesExecutive();
    // this.InitCustomerKAM();
    this.customerDetailData = {
      customerGroup: this.customerGroup, customerGroupID: this.customerGroupID,
      customerID: this.customerID, customerName: this.customer
    }
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      reservationID: [-1],
      customerTypeID: [''],
      customerType: [],
      customerID: [''],
      customer: [''],
      customerGroup:[''],
      customerCustomerGroup: [''],
      //customerGroupID: [''],
      primaryBookerID: [''],
      primaryBooker: [''],
      primaryPassengerID: [0],
      passenger: [''],
      vehicleCategoryID: [0],
      vehicleID: [0],
      vehicle: [''],
      packageTypeID: [0],
      packageType: [''],
      packageID: [0],
      package: [''],
      pickupDate: [null],
      pickupTime: [null],
      pickupCityID: [0],
      pickupCity: [''],
      pickupSpotTypeID: [0],
      pickupSpotType: [''],
      pickupSpotID: [0],
      pickupSpot: [''],
      pickupAddress: [null],
      pickupAddressDetails: [null],
      locationOutDate: [null],
      locationOutTime: [null],
      serviceLocationID: [0],
      serviceLocation: [''],
      transferedLocationID: [''],
      dropOffDate: [null],
      dropOffTime: [null],
      dropOffCityID: [0],
      dropOffCity: [''],
      dropOffSpotTypeID: [0],
      dropOffSpotType: [''],
      dropOffSpotID: [0],
      dropOffSpot: [''],
      dropOffAddress: [null],
      dropOffAddressDetails: [null],
      ticketNumber: [null],
      attachment: [null],
      emailLink: [null],
      reservationSourceID: [0],
      reservationSource: [''],
      reservationSourceDetail: [null],
      referenceNumber: [null],
      reservationStatus: [null],
      reservationStatusDetails: [null],
      reservationStatusText: [null],
      modeOfPayment: [''],
      modeOfPaymentID: [0],
      bookingGroupType: [''],
      //reservationGroupID:[''],
      //reservationStartDate:[''],
      //reservationEndDate:[''],
      //numberOfBookings:[''],
      //reservationExecutiveID:[''],
      //salesExecutiveID:[''],
      //salesExecutive:[''],

      // activationStatus:[''],
      reservationGroupID: [this.advanceTable.reservationGroupID],
      customerGroupID: [this.advanceTable.customerGroupID],
      // reservationStartDate:[this.advanceTable.reservationStartDate],
      // reservationEndDate:[this.advanceTable.reservationEndDate],
      numberOfBookings: [this.advanceTable.numberOfBookings],
      reservationExecutiveID: [this.advanceTable.reservationExecutiveID],
      salesExecutiveID: [this.advanceTable?.salesExecutiveID],
      salesExecutive: [this.advanceTable.salesExecutive],
      kam: [this.advanceTable.kam],
      kamID: [this.advanceTable?.kamID],
      bookingType: [this.advanceTable.bookingType],
      locationID: [this.advanceTable.locationID],
      locationName: [this.advanceTable.locationName]
    })
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  InitCustomerType() {
    this._generalService.getCustomerType().subscribe(
      data => {
        this.CustomerTypeList = data;
        this.advanceTableForm.controls['customerType'].setValidators([Validators.required,
        this.customerTypeValidator(this.CustomerTypeList)
        ]);
        this.advanceTableForm.controls['customerType'].updateValueAndValidity();
        this.filteredCustomerTypeOptions = this.advanceTableForm.controls['customerType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCT(value || ''))
        )
      });;
  }

  private _filterCT(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerTypeList?.filter(
      customer => {
        return customer.customerType.toLowerCase().includes(filterValue);
      }
    );
  }

  onCTSelected(selectedCTName: string) {
    const selectedCT = this.CustomerTypeList.find(
      data => data.customerType === selectedCTName
    );

    if (selectedCT) {
      this.getTitles(selectedCT.customerTypeID, selectedCT.customerType);
    }
  }

  getTitles(customerTypeID: any, custopmerType: any) {
    this.customerTypeID = customerTypeID;
    this.advanceTableForm.patchValue({ customerTypeID: this.customerTypeID });
    // this.InitCustomerCustomerGroup();
    // this.advanceTableForm.controls['customerCustomerGroup'].setValue('');
  }

  customerTypeValidator(CustomerTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerTypeList.some(group => group.customerType.toLowerCase() === value);
      return match ? null : { customerTypeInvalid: true };
    };
  }

  InitCustomerCustomerGroup() {
    this._generalService.getCustomerCustomerGroup(this.customerTypeID || this.advanceTableForm.value.customerTypeID).subscribe(
      data => {
        this.CustomerCustomerGroupList = data;
        this.advanceTableForm.controls['customerCustomerGroup'].setValidators([Validators.required,
        this.customerValidator(this.CustomerCustomerGroupList)
        ]);
        this.advanceTableForm.controls['customerCustomerGroup'].updateValueAndValidity();
        this.filteredCustomerCustomerGroupOptions = this.advanceTableForm.controls['customerCustomerGroup'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCCG(value || ''))
        );
      });
  }

  
  InitCustomerCustomerG() {
    this._generalService.GetCustomersGroups().subscribe(
      data => {
        this.CustomerGroupList = data;
         this.advanceTableForm.controls['customerGroup'].setValidators([this.customerGroupValidator(this.CustomerGroupList)
        ]);
        //this.advanceTableForm.controls['customerGroup'].updateValueAndValidity();
        this.filteredCustomerGroupOptions = this.advanceTableForm.controls['customerGroup'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCCGroup(value || ''))
        );
      });
  }

  private _filterCCGroup(value: string): any {
    const filterValue = value.toLowerCase();
     // if(filterValue.length === 0) {
    //   return [];
    // }
    if(filterValue.length < 3) {
      return [];
    }
    return this.CustomerGroupList.filter(
      customer => {
        return customer.customerGroup.toLowerCase().includes(filterValue);
      }
    );
  }

  
  onCustomerGrouoSelected(selectedCustomerName: string) {
    const selectedCustomer = this.CustomerGroupList.find(
      data => data.customerGroup === selectedCustomerName
    );

    if (selectedCustomer) {
      this.getCustomerGroupID(selectedCustomer.customerGroupID, selectedCustomer.customerGroup);
    }
  }

  getCustomerGroupID( customerGroupID: any,  customerGroup: any) {
   
    this.customerGroupID = customerGroupID;
    this.customerGroup = customerGroup;
    this.advanceTableForm.patchValue({ customerGroupID: this.customerGroupID });
    this.InitCustomerCG(this.customerGroupID)
  
  }

  InitCustomerCG(customerGroupID) {
    this._generalService.getCustomerCustomerGroupForRD(customerGroupID).subscribe(
      data => {
        this.CustomerCustomerGroupList = data;
        this.advanceTableForm.controls['customerCustomerGroup'].setValidators([Validators.required,
        this.customerValidator(this.CustomerCustomerGroupList)
        ]);
        this.advanceTableForm.controls['customerCustomerGroup'].updateValueAndValidity();
        this.filteredCustomerCustomerGroupOptions = this.advanceTableForm.controls['customerCustomerGroup'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCCG(value || ''))
        );
      });
  }

private _filterCCG(value: string): any[] {
  const filterValue = (value || '').toString().trim().toLowerCase();

  return this.CustomerCustomerGroupList?.filter(customer => {
    const name  = (customer.customerName || '').toString().toLowerCase();
    const tally = (customer.tallyCustomerID || '').toString().toLowerCase();
    const state = (customer.stateName || '').toString().toLowerCase();

    // Return true if typed value matches name OR tally OR state
    return name.includes(filterValue) || tally.includes(filterValue) || state.includes(filterValue);
  }) || [];
}



  onCustomerSelected(selectedCustomerName: string) {
    const selectedCustomer = this.CustomerCustomerGroupList.find(
     data => data.customerName + '##' + data.tallyCustomerID + '##' + data.stateName === selectedCustomerName
    );

    if (selectedCustomer) {
      this.getCustomerCustomerGroupID(selectedCustomer.customerID, selectedCustomer.customerGroupID, selectedCustomer.customerName, selectedCustomer.customerGroup, selectedCustomer.customerTypeID, selectedCustomer.customerType);
    }
  }

  getCustomerCustomerGroupID(customerID: any, customerGroupID: any, customer: any, customerGroup: any, customerTypeID: any, customerType: any) {
    this.customerID = customerID;
    this.customerGroupID = customerGroupID;
    this.customerDetailData = customer;
    this.customer = customer;
    this.customerTypeID = customerTypeID;
    this.customerType = customerType;
    this.customerGroup = customerGroup;
    this.advanceTableForm.patchValue({ customerID: this.customerID });
    this.advanceTableForm.patchValue({ customerGroupID: this.customerGroupID });
    this.advanceTableForm.patchValue({ customerGroup: this.customerGroup });
    this.advanceTableForm.patchValue({ customerTypeID: this.customerTypeID });
    this.advanceTableForm.patchValue({ customerType: this.customerType });
    this.getTransferLocationBasedOnCustomer(this.customerID);
    this.getSalesManager(this.customerID);
    this.getCustomerKam(this.customerID);
    this.customerAlert(this.customerID, this.customerDetailData)
    this.InitBooker();
    this.getStopReservationReason(this.customerID);
  }

   InitCustomerRD() {
    this._generalService.getCustomersForRD().subscribe(
      data => {
        this.CustomerCustomerGroupList = data;
        this.advanceTableForm.controls['customerCustomerGroup'].setValidators([Validators.required,
        this.customerValidator(this.CustomerCustomerGroupList)
        ]);
        this.advanceTableForm.controls['customerCustomerGroup'].updateValueAndValidity();
        this.filteredCustomerCustomerGroupOptions = this.advanceTableForm.controls['customerCustomerGroup'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterRD(value || ''))
        );
        console.log(this.filteredCustomerCustomerGroupOptions)
      });
  }
  
private _filterRD(value: string): any[] {
  const filterValue = (value || '').toString().trim().toLowerCase();
   if (!value || value.length < 3) {
    return [];   
  }
  return this.CustomerCustomerGroupList?.filter(customer => {
    const name  = (customer.customerName || '').toString().toLowerCase();
    const tally = (customer.tallyCustomerID || '').toString().toLowerCase();
    const state = (customer.stateName || '').toString().toLowerCase();

    // Return true if typed value matches name OR tally OR state
    return name.includes(filterValue) || tally.includes(filterValue) || state.includes(filterValue);
  }) || [];
}



  onCustomerRDSelected(selectedCustomerName: string) {
    const selectedCustomer = this.CustomerCustomerGroupList.find(
     data => data.customerName + '##' + data.tallyCustomerID + '##' + data.stateName === selectedCustomerName
    );

    if (selectedCustomer) {
      this.getCustomerIDForRD(selectedCustomer.customerID, selectedCustomer.customerGroupID, selectedCustomer.customerName, selectedCustomer.customerGroup, selectedCustomer.customerTypeID, selectedCustomer.customerType);
    }
  }

  getCustomerIDForRD(customerID: any, customerGroupID: any, customer: any, customerGroup: any, customerTypeID: any, customerType: any) {
    this.customerID = customerID;
    this.customerGroupID = customerGroupID;
    this.customerDetailData = customer;
    this.customer = customer;
    this.customerTypeID = customerTypeID;
    this.customerType = customerType;
    this.customerGroup = customerGroup;
    console.log(this.customerGroup,customerGroup)
    this.advanceTableForm.patchValue({ customerID: this.customerID });
    this.advanceTableForm.patchValue({ customerGroupID: this.customerGroupID });
    this.advanceTableForm.patchValue({ customerGroup: this.customerGroup });
    this.advanceTableForm.patchValue({ customerTypeID: this.customerTypeID });
    this.advanceTableForm.patchValue({ customerType: this.customerType });
    this.getTransferLocationBasedOnCustomer(this.customerID);
    this.getSalesManager(this.customerID);
    this.getCustomerKam(this.customerID);
    this.customerAlert(this.customerID, this.customerDetailData)
    this.InitBooker();
    this.getStopReservationReason(this.customerID);
  }

  getStopReservationReason(CustomerID) {
    let FromToDate = this.FromToDate || ''; // Ensure FromToDate is not undefined
    if (FromToDate.trim() !== '') {
      FromToDate = moment(FromToDate).format('YYYY-MM-DD');
    }
    else {
      FromToDate = moment().format('YYYY-MM-DD');// If empty, set it to today's date
    }
    this.reservationGroupService.getReason(CustomerID, FromToDate).subscribe(
      (data: string[]) => {
        if (data && data.length > 0) {
          this.ReasonMessageShow = true;
          this.Reason = data.join(', ');
        }
        else {
          this.ReasonMessageShow = false;
        }
      }
    );
  }

  getTransferLocationBasedOnCustomer(CustomerID: any) {
    this.advanceTableService.getTLBasedOnCustomer(CustomerID).subscribe(
      data => {
        this.TransferLocationList = data;
        this.advanceTableForm.patchValue({ locationID: this.TransferLocationList.organizationalEntityID });
        this.advanceTableForm.patchValue({ locationName: this.TransferLocationList.organizationalEntityName });
        this.advanceTableForm.patchValue({ serviceLocationID: this.TransferLocationList.organizationalEntityID });
        this.advanceTableForm.patchValue({ transferedLocationID: this.TransferLocationList.organizationalEntityID });
      }
    );
  }

  getSalesManager(customerID: any) {
    this._generalService.GetSalesManager(customerID).subscribe(
      data => {
        this.salesManagerList = data;
        this.advanceTableForm.patchValue({ salesExecutive: this.salesManagerList[0].firstName + ' ' + this.salesManagerList[0].lastName + '-' + this.salesManagerList[0].mobile + '-' + this.salesManagerList[0].email });
        this.advanceTableForm.patchValue({ salesExecutiveID: this.salesManagerList[0]?.salesExecutiveID });
        this.advanceTableForm.controls['salesExecutive'].setValidators([
          this.salesExecutiveValidator(this.salesManagerList)
        ]);
        this.advanceTableForm.controls['salesExecutive'].updateValueAndValidity();
        this.filteredEmployeeOptions = this.advanceTableForm.controls['salesExecutive'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomerSE(value || ''))
        )

      }
    )
  }

  private _filterCustomerSE(value: string): any {
    const filterValue = value.toLowerCase();
    return this.salesManagerList?.filter(
      customer => {
        return customer.firstName.toLowerCase().includes(filterValue) || customer.mobile.toLowerCase().includes(filterValue)
          || customer.email.toLowerCase().includes(filterValue);
      }
    );
  }

  getCustomerKam(customerID: any) {
    this._generalService.GetCustomerKam(customerID).subscribe(
      data => {
        this.customerKamList = data;
        this.advanceTableForm.patchValue({ kam: this.customerKamList[0].firstName + ' ' + this.customerKamList[0].lastName + '-' + this.customerKamList[0].mobile + '-' + this.customerKamList[0].email });
        this.advanceTableForm.patchValue({ kamID: this.customerKamList[0]?.kamID });
        this.advanceTableForm.controls['kam'].setValidators([
          this.customerKAMValidator(this.customerKamList)
        ]);
        this.advanceTableForm.controls['kam'].updateValueAndValidity();
        this.filteredEmployeesOptions = this.advanceTableForm.controls['kam'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomerKAM(value || ''))
        )

      }
    )
  }

  private _filterCustomerKAM(value: string): any {
    const filterValue = value.toLowerCase();
    return this.customerKamList?.filter(
      customer => {
        return customer.firstName.toLowerCase().includes(filterValue)
          || customer.mobile.toLowerCase().includes(filterValue)
          || customer.email.toLowerCase().includes(filterValue);
      }
    );
  }

  customerValidator(CustomerCustomerGroupList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerCustomerGroupList.some(customer =>
        (customer.customerName?.toLowerCase() + '##' + customer.tallyCustomerID+ '##' + customer.stateName?.toLowerCase()) === value
      );
      return match ? null : { customerInvalid: true };
    };
  }
  
  customerGroupValidator(CustomerGroupList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
       if (!control.value) {
          return null; // No value to validate, return null (no error)
        }
      const value = control.value?.toLowerCase();
      const match = CustomerGroupList.some(customer =>
        (customer.customerGroup.toLowerCase()) === value
      );
      return match ? null : { customerGroupInvalid: true };
    };
  }


  //------------ Booker -----------------
  InitBooker() {
    this._generalService.GetCPForBooker(this.customerGroupID || this.advanceTable.customerGroupID).subscribe(
      data => {
        this.BookerList = data;
        this.advanceTableForm.controls['primaryBooker'].setValidators([Validators.required,
        this.primaryBookerValidator(this.BookerList)
        ]);
        this.advanceTableForm.controls['primaryBooker'].updateValueAndValidity();
        this.filteredBookerOptions = this.advanceTableForm.controls['primaryBooker'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterBooker(value || ''))
        );
      });
  }

  private _filterBooker(value: string): any {
    const filterValue = value.toLowerCase();
    // if (filterValue.length === 0) {
    //   return [];
    // }
    //  if(filterValue.length < 3) {
    //   return [];
    // }
    return this.BookerList?.filter(
      customer => {
        return customer.customerPersonName?.toLowerCase().includes(filterValue) ||
          customer.phone?.toLowerCase().includes(filterValue) ||
          customer.gender?.toLowerCase().includes(filterValue) ||
          customer.importance?.toLowerCase().includes(filterValue) ||
          customer.customerDepartment?.toLowerCase().includes(filterValue) ||
          customer.customerDesignation?.toLowerCase().includes(filterValue) ||
          customer.customerName?.toLowerCase().includes(filterValue);
      }
    );
  }

  onBookerSelected(selectedBookerName: string) {
    const selectedBooker = this.BookerList.find(
      data => data.customerPersonName + '-' +
        data.gender + '-' +
        data.importance + '-' +
        data.phone + '-' +
        data.customerDepartment + '-' +
        data.customerDesignation + '-' +
        data.customerName === selectedBookerName
    );

    if (selectedBooker) {
      this.getBookerID(selectedBooker.customerPersonID);
    }
  }

  getBookerID(bookerID: any) {
    this.bookerID = bookerID;
    this.advanceTableForm.patchValue({ primaryBookerID: this.bookerID });
  }

  primaryBookerValidator(BookerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = BookerList.some(option =>
        (option.customerPersonName + '-' + option.gender + '-' + option.importance + '-' + option.phone + '-' + option.customerDepartment + '-' + option.customerDesignation + '-' + option.customerName)?.toLowerCase() === value
      );
      return match ? null : { primaryBookerInvalid: true };
    };
  }

  //------------------Sales Executive-----------

  InitSalesExecutive() {
    this._generalService.GetSalesManagerForRG().subscribe(
      data => {
        this.EmployeeList = data;
        this.advanceTableForm.controls['salesExecutive'].setValidators([
          this.salesExecutiveValidator(this.EmployeeList)
        ]);
        this.advanceTableForm.controls['salesExecutive'].updateValueAndValidity();
        this.filteredEmployeeOptions = this.advanceTableForm.controls['salesExecutive'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterSE(value || ''))
        )
      });
  }

  private _filterSE(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeeList?.filter(
      customer => {
        return customer.firstName.toLowerCase().indexOf(filterValue) === 0 || customer.mobile.toLowerCase().indexOf(filterValue) === 0 || customer.email.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  onSESelected(selectedSEName: string) {
    const selectedSE = this.EmployeeList.find(
      data => data.firstName + ' ' + data.lastName === selectedSEName
    );

    if (selectedSE) {
      this.getSalesExecutiveID(selectedSE.employeeID);
    }
  }

  getSalesExecutiveID(salesExecutiveID: any) {
    this.salesExecutiveID = salesExecutiveID;
    this.advanceTableForm.patchValue({ salesExecutiveID: this.salesExecutiveID });
  }

  salesExecutiveValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = EmployeeList.some(option => (option.firstName + ' ' + option.lastName + '-' + option.mobile + '-' + option.email).toLowerCase() === value);
      return match ? null : { salesExecutiveInvalid: true };
    };
  }

  //------------------Customer KAM-----------

  InitCustomerKAM() {
    this._generalService.GetCustomerKAMForRG().subscribe(
      data => {
        this.EmployeesList = data;
        this.advanceTableForm.controls['kam'].setValidators([
          this.customerKAMValidator(this.EmployeesList)
        ]);
        this.advanceTableForm.controls['kam'].updateValueAndValidity();
        this.filteredEmployeesOptions = this.advanceTableForm.controls['kam'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterKAM(value || ''))
        )
      });
  }

  private _filterKAM(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeesList?.filter(
      customer => {
        return customer.firstName.toLowerCase().indexOf(filterValue) === 0 || customer.mobile.toLowerCase().indexOf(filterValue) === 0 || customer.email.toLowerCase().indexOf(filterValue) === 0;
      }
    );
  }

  onKAMSelected(selectedSEName: string) {
    const selectedSE = this.EmployeesList.find(
      data => data.firstName + ' ' + data.lastName === selectedSEName
    );

    if (selectedSE) {
      this.getCustomerKAMID(selectedSE.employeeID);
    }
  }

  getCustomerKAMID(kamID: any) {
    debugger
    this.kamID = kamID;
    this.advanceTableForm.patchValue({ kamID: this.kamID });
  }

  customerKAMValidator(EmployeesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No value to validate, return null (no error)
      }
      const value = control.value?.toLowerCase();
      const match = EmployeesList.some(option => (option.firstName + ' ' + option.lastName + '-' + option.mobile + '-' + option.email).toLowerCase() === value);
      return match ? null : { kamInvalid: true };
    };
  }

  submit() { }

  onNoClick() {
    this.dialogRef.close();
  }
  public Post(): void {
    this.saveDisabled = false;
    console.log(this.advanceTableForm.controls['salesExecutive'].value);
    console.log(this.advanceTableForm.controls['kam'].value);
  const salesExecutive = this.advanceTableForm.controls['salesExecutive'].value;
  const kam = this.advanceTableForm.controls['kam'].value;

  if (!salesExecutive && !kam) {
    this.showNotification(
      'snackbar-danger',
      'Sales Executive and KAM Details are Missing.',
      'bottom',
      'center'
    );
    return;
  }

  if (!salesExecutive) {
    this.showNotification(
      'snackbar-danger',
      'Sales Executive Details is Missing.',
      'bottom',
      'center'
    );
    return;
  }

  if (!kam) {
    this.showNotification(
      'snackbar-danger',
      'KAM Details is Missing.',
      'bottom',
      'center'
    );
    return;
  }
    //this.advanceTableForm.patchValue({salesExecutiveID:this.salesExecutiveID});

    this.advanceTableForm.patchValue({ reservationExecutiveID: this._generalService.getUserID() });
    //this.customer = this.advanceTableForm.get('customerCustomerGroup')?.value?.split('-')[0]?.trim();
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.reservationGroupID = response.reservationGroupID;
          console.log(response)
          this.saveDisabled = true;
          this.dialogRef.close(response);
          this._generalService.sendUpdate('ReservationGroupDetailsCreate:ReservationGroupDetailsView:Success');//To Send Updates  
          if (response.numberOfBookings === 1) {
            const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(this.customerID.toString()));
            const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(this.customerDetailData));
            const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(response.reservationGroupID.toString()));
            const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(response.reservationID.toString()));

            const url = this.router.serializeUrl(this.router.createUrlTree(['/bookingScreen'], {
              queryParams: {
                reservationID: encryptedReservationID,
                reservationGroupID: encryptedReservationGroupID,
                customerID: encryptedCustomerID,
                customerName: encryptedCustomerName,
                
              }
            }));
            window.open(this._generalService.FormURL + url, '_blank');
          }

        },
        error => {
          this.saveDisabled = true;
          this._generalService.sendUpdate('ReservationGroupDetailsAll:ReservationGroupDetailsView:Failure');//To Send Updates  
        }
      )
  }
  public Put(): void {
    this.saveDisabled = false;
    this.advanceTableForm.patchValue({ reservationExecutiveID: this._generalService.getUserID() });
    if (this.advanceTableForm.get('salesExecutive').value === "") {
      this.advanceTableForm.patchValue({ salesExecutiveID: 0 });
    }
    else {
      this.advanceTableForm.patchValue({ salesExecutiveID: this.salesExecutiveID || this.advanceTable.salesExecutiveID });
    }
    if (this.advanceTableForm.get('kam').value === "") {
      this.advanceTableForm.patchValue({ kamID: 0 });
    }
    else {
      this.advanceTableForm.patchValue({ kamID: this.kamID || this.advanceTable.kamID });
    }
    this.advanceTableForm.patchValue({ reservationGroupID: this.advanceTable.reservationGroupID });
    this.advanceTableForm.patchValue({ customerGroupID: this.advanceTable.customerGroupID });
    this.advanceTableForm.patchValue({ locationID: this.locationID || this.advanceTable.locationID });
    this.advanceTableForm.patchValue({ transferedLocationID: this.locationID || this.advanceTable.locationID });
    this.advanceTableForm.patchValue({ serviceLocationID: this.locationID || this.advanceTable.locationID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.saveDisabled = true;
          this.reservationGroupID = response.reservationGroupID;
          this.dialogRef.close(this.reservationGroupID);
          this._generalService.sendUpdate('ReservationGroupDetailsUpdate:ReservationGroupDetailsView:Success');//To Send Updates  

        },
        error => {
          this.saveDisabled = true;
          this._generalService.sendUpdate('ReservationGroupDetailsAll:ReservationGroupDetailsView:Failure');//To Send Updates  
        }
      )
  }
  public confirmAdd(): void {
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }

  onSECheckboxChange(event: MatCheckboxChange): void {
    if (event.checked) {
      this.advanceTableForm.controls["salesExecutive"].setValue('');
      this.advanceTableForm.controls["salesExecutiveID"].setValue(0);
      this.InitSalesExecutive();
    } else {
      this.getSalesManager(this.customerID);
    }
  }

  onKAMCheckboxChange(event: MatCheckboxChange): void {
    if (event.checked) {
      this.advanceTableForm.controls["kam"].setValue('');
      this.advanceTableForm.controls["kamID"].setValue(0);
      this.InitCustomerKAM();
    } else {
      this.getCustomerKam(this.customerID);

    }
  }

  //start date
  // onBlurUpdateDate(value: string): void {
  //   value= this._generalService.resetDateiflessthan12(value);

  // const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  // if (validDate) {
  //   const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  //     this.advanceTableForm.get('reservationStartDate')?.setValue(formattedDate);    
  // } else {
  //   this.advanceTableForm.get('reservationStartDate')?.setErrors({ invalidDate: true });
  // }
  // }

  // onBlurUpdateDateEdit(value: string): void {  
  // const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  // if (validDate) {
  //   const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  //   if(this.action==='edit')
  //   {
  //     this.advanceTable.reservationStartDate=formattedDate
  //   }
  //   else{
  //     this.advanceTableForm.get('reservationStartDate')?.setValue(formattedDate);
  //   }

  // } else {
  //   this.advanceTableForm.get('reservationStartDate')?.setErrors({ invalidDate: true });
  // }
  // }

  // onBlurUpdateEndDate(value: string): void {
  //   value= this._generalService.resetDateiflessthan12(value);

  // const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  // if (validDate) {
  //   const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  //     this.advanceTableForm.get('reservationEndDate')?.setValue(formattedDate);    
  // } else {
  //   this.advanceTableForm.get('reservationEndDate')?.setErrors({ invalidDate: true });
  // }
  // }

  // onBlurUpdateEndDateEdit(value: string): void {  
  // const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  // if (validDate) {
  //   const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  //   if(this.action==='edit')
  //   {
  //     this.advanceTable.reservationEndDate=formattedDate
  //   }
  //   else{
  //     this.advanceTableForm.get('reservationEndDate')?.setValue(formattedDate);
  //   }

  // } else {
  //   this.advanceTableForm.get('reservationEndDate')?.setErrors({ invalidDate: true });
  // }
  // }

  //---------- Location ---------
  InitLocation() {
    this._generalService.GetLocationHub().subscribe(
      data => {
        this.LocationNameList = data;
        this.filteredLocationNameOptions = this.advanceTableForm.controls['locationName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterLocation(value || ''))
        );
      });
  }
  private _filterLocation(value: string): any {
    const filterValue = value.toLowerCase();
    return this.LocationNameList.filter(
      data => {
        return data.organizationalEntityName.toLowerCase().includes(filterValue);
      }
    );
  }
  OnLocationSelect(selectedLocation: string) {
    const selectedLocationName = this.LocationNameList.find(
      data => data.organizationalEntityName === selectedLocation);
    if (selectedLocation) {
      this.getLocationID(selectedLocationName.organizationalEntityID);
    }
  }
  getLocationID(locationHubID: any) {
    this.locationID = locationHubID;
    this.advanceTableForm.patchValue({ locationID: this.locationID });
  }

  BookingForEdit(item) {
    const encryptedReservationID = encodeURIComponent(this._generalService.encrypt(item.reservationID.toString()));
    const encryptedReservationGroupID = encodeURIComponent(this._generalService.encrypt(item.reservationGroupID.toString()));
    const encryptedCustomerID = encodeURIComponent(this._generalService.encrypt(item.customerID.toString()));
    const encryptedCustomerName = encodeURIComponent(this._generalService.encrypt(item.customer));
    const url = this.router.serializeUrl(this.router.createUrlTree(['/bookingScreen'], {
      queryParams: {
        reservationID: encryptedReservationID,
        reservationGroupID: encryptedReservationGroupID,
        customerID: encryptedCustomerID,
        customerName: encryptedCustomerName,
      }
    }));
    window.open(this._generalService.FormURL + url, '_blank');
  }
   showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  onCustomerGroupKeyUp(event) {
    if (event.keyCode === 8) {
      this.advanceTableForm.controls['customerID'].setValue('');
      this.advanceTableForm.controls['customerCustomerGroup'].setValue('');
      this.advanceTableForm.controls['customerTypeID'].setValue('');
      this.advanceTableForm.controls['customerType'].setValue('');
      this.advanceTableForm.controls['customerGroup'].setValue('');
      this.advanceTableForm.controls['customerGroupID'].setValue('');
      this.customerGroupID = 0;
      this.InitCustomerRD();
     
    }
  }
   onCustomerKeyUp(event) {
    if (event.keyCode === 8) {
       this.advanceTableForm.controls['customerTypeID'].setValue('');
      this.advanceTableForm.controls['customerType'].setValue('');
      this.advanceTableForm.controls['customerGroup'].setValue('');
      this.advanceTableForm.controls['customerGroupID'].setValue('');
      this.advanceTableForm.controls['customerID'].setValue('');
      this.advanceTableForm.controls['customerCustomerGroup'].setValue('');   
     
    }
  }
}



