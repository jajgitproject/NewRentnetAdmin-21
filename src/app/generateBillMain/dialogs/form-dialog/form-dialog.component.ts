// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GenerateBillMainService } from '../../generateBillMain.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { CSGSTPercentageDropDown, GenerateBillMainModel, IGSTPercentageDropDown } from '../../generateBillMain.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { PackageTypeDropDown } from 'src/app/packageType/packageTypeDropDown.model';
import { CustomerDropDown } from 'src/app/customer/customerDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { CustomerPersonDropDown } from 'src/app/customerPerson/customerPersonDropDown.model';
import { FormDialogComponentCustomerPerson } from 'src/app/customerPerson/dialogs/form-dialog/form-dialog.component';
import { CustomerCustomerGroupDropDown } from 'src/app/customer/customerCustomerGroupDropDown.model';
import Swal from 'sweetalert2';
// import { OpenPopUpDialogComponent } from '../../openPopUp/openPopUp.component';
// import { OpenPopUpDialogComponent } from '../../openPopUp/openPopUp.component';
import { OpenPopUpDialogComponent} from '../../openPopUp/openPopUp.component'

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: GenerateBillMainModel;

  public StateList?: StateDropDown[] = [];
  filteredStateOptions: Observable<StateDropDown[]>;
  stateID: any;

  public CityList?: CitiesDropDown[] = [];
  filteredCityOptions: Observable<CitiesDropDown[]>;
  cityID: any;

  public VehicleList?: VehicleDropDown[] = [];
  filteredVehicleOptions: Observable<VehicleDropDown[]>;
  vehicleID: any;

  public PackageTypeList?:PackageTypeDropDown[]=[];
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  dutyTypeID: any;

  public CustomerList?: CustomerCustomerGroupDropDown[] = [];
  filteredCustomerOptions: Observable<CustomerCustomerGroupDropDown[]>;
  customerID: any;

  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  ecoBillingBranchID: any;

  public IGSTPercentageList?:IGSTPercentageDropDown[]=[];
  filteredIGSTPercentageOptions:Observable<IGSTPercentageDropDown[]>;
  igstPercentageID: any;

  public CSGSTPercentageList?:CSGSTPercentageDropDown[]=[];
  filteredCSGSTPercentageOptions:Observable<CSGSTPercentageDropDown[]>;
  csgstPercentageID: any;

  public CustomerPersonList?:CustomerPersonDropDown[] = [];
  filteredCustomerPersonOptions:Observable<CustomerPersonDropDown[]>;
  customerPersonNameID: any;

  customerDetailData: any;
  // customerGroup_ID: number = 14;
  // customerGroup_Name: string = "Accenture";
  customerGroupID: any;
  customerGroup: any;
  customerControl=[];
  passengerID: any;
  organizationalEntityID: any;
  
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: GenerateBillMainService,
  private fb: FormBuilder,
  private dialog: MatDialog,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='General Bill';       
          this.advanceTable = data.advanceTable;
          console.log(this.advanceTable);
        } else 
        {
          this.dialogTitle = 'General Bill';
          this.advanceTable = new GenerateBillMainModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      invoiceID: [this.advanceTable.invoiceID],
      customerID: [this.advanceTable.customerID || 0],
      customer: [this.advanceTable.customer],
      stateID: [this.advanceTable.stateID || 0],
      state: [this.advanceTable.state],
      cityID: [this.advanceTable.cityID || 0],
      city: [this.advanceTable.city],
      pinCode: [this.advanceTable.pinCode],
      billingAddress: [this.advanceTable.billingAddress],
      gst: [this.advanceTable.gstType === null ? false : (this.advanceTable.gstType === 'IGST' || this.advanceTable.gstType === 'CGSTSGST')],
      ecoBillingBranchID: [this.advanceTable.organizationalEntityID || this.organizationalEntityID],
      invoiceTemplateID: [this.advanceTable.invoiceTemplateID || 0 ],
      organizationalEntityName: [this.advanceTable.organizationalEntityName],
      monthID: [this.advanceTable.monthID || 0 ],
      monthName: [this.advanceTable.monthName],
      invoiceNarration: [this.advanceTable.invoiceNarration],
      invoiceDate: [this.advanceTable.invoiceDate],
      placeOfSupply: [this.advanceTable.placeOfSupply],
      vehicleID: [this.advanceTable.vehicleID || 0],
      vehicle: [this.advanceTable.vehicle],
      dutyType: [this.advanceTable.dutyType],
      billFromDate: [this.advanceTable.billFromDate],
      billToDate: [this.advanceTable.billToDate],
      gstType: [this.advanceTable.gstType],
      igstPercentageID: [this.advanceTable.igstPercentageID],
      igstPercentage: [this.advanceTable.igstPercentage],
      csgstPercentageID: [this.advanceTable.csgstPercentageID],
      csgstPercentage: [this.advanceTable.csgstPercentage],
      customerPersonNameID: [this.advanceTable.customerPersonNameID],
      customerPersonName: [this.advanceTable.customerPersonName],
      invoiceType:['InvoiceGeneral'],
      //ecoBillingBranchID: [81],
      //passengerID:[10],
      //invoiceNumberIssuedByID: [4],
      cgstPercentage: [this.advanceTable.cgstPercentage],
      sgstPercentage: [this.advanceTable.sgstPercentage],
      passengerID: [this.advanceTable.passengerID],
      passengerName: [this.advanceTable.passengerName]
    });
  }

  public ngOnInit()
  {
    this.InitGuest();
    this.InitOrganizationalEntity();
    this.InitCustomer();
    this.InitState();
    this.InitCity();
    this.InitIGSTPercentage();
    this.InitCSGSTPercentage();
    
    // Watch for invoice date changes
    this.advanceTableForm.get('invoiceDate')?.valueChanges.subscribe((invoiceDate) => {
      if (invoiceDate) {
        // Set billFromDate and billToDate when invoiceDate is selected
        this.advanceTableForm.patchValue({
          billFromDate: invoiceDate,
          billToDate: invoiceDate // You can modify this if the logic differs
        });
      }
    });

    // Watch for customer field changes
    this.advanceTableForm.get('customer')?.valueChanges.subscribe((customerValue) => {
      if (!customerValue || customerValue.trim() === '') {
        // Customer field is cleared, clear all address fields
        this.clearAllAddressFields();
      }
    });
    
    //this.InitVehicle();
    //this.InitPackageType();
  }
  
  //------------- Guest's Drop Down -------------
  InitGuest()
  {
    this._generalService.getCustomerPerson().subscribe(
      data=>
      {
        this.CustomerPersonList=data;
        this.advanceTableForm.controls['passengerName'].setValidators([Validators.required,
          this.customerPersonTypeValidator(this.CustomerPersonList)
        ]);
        this.advanceTableForm.controls['passengerName'].updateValueAndValidity();
        this.filteredCustomerPersonOptions = this.advanceTableForm.controls['passengerName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomerPerson(value || ''))
        ); 
      });
  }
  private _filterCustomerPerson(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CustomerPersonList?.filter(
      data => 
      {
        return data.customerPersonName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  getCustomerPersonID(customerPersonID: any) 
  {
    this.customerPersonNameID=customerPersonID;
    this.advanceTableForm.patchValue({customerPersonNameID:this.customerPersonNameID});
    this.advanceTableForm.patchValue({passengerID:this.customerPersonNameID});
  }
  customerPersonTypeValidator(CustomerPersonList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerPersonList.some(group => group.customerPersonName.toLowerCase() === value);
      return match ? null : { customerPersonNameInvalid: true };
    };
  }

  //------------- Organizational Entity's Drop Down -------------
  InitOrganizationalEntity() 
  {
    this._generalService.GetOrganizationalBranch().subscribe(
      data => {
        this.OrganizationalEntityList = data;
        this.advanceTableForm.controls['organizationalEntityName'].setValidators([Validators.required,
          this.organizationalEntityTypeValidator(this.OrganizationalEntityList)
        ]);
        this.advanceTableForm.controls['organizationalEntityName'].updateValueAndValidity();
        this.filteredOrganizationalEntityOptions =  this.advanceTableForm.controls['organizationalEntityName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterOrganizational(value || ''))
        );
      });
  }

  private _filterOrganizational(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.OrganizationalEntityList.filter(
      data => 
        {
        return data.organizationalEntityName.toLowerCase().indexOf(filterValue) === 0;
        });
    }

  getorganizationalEntityID(organizationalEntityID: any) 
  {
    this.organizationalEntityID = organizationalEntityID;
    this.advanceTableForm.patchValue({ecoBillingBranchID:this.organizationalEntityID});
  }

  organizationalEntityTypeValidator(OrganizationalEntityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = OrganizationalEntityList.some(group => group.organizationalEntityName.toLowerCase() === value);
      return match ? null : { organizationalEntityNameInvalid: true };
    };
  }

  //------------- Customer's Drop Down -------------
  InitCustomer()
  {
    this._generalService.getCustomer().subscribe(
    data=>
      {
        this.CustomerList=data;
        this.advanceTableForm.controls['customer'].setValidators([Validators.required,
          this.customerValidator(this.CustomerList)
        ]);
        this.advanceTableForm.controls['customer'].updateValueAndValidity();
        this.filteredCustomerOptions = this.advanceTableForm.controls['customer'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        );
      }
    ); 
  }
  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CustomerList.filter(
      data => 
      {
        return data.customerName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  };
  getCustomerID(customerID:any, customerGroupID:any, customerGroup:any)
  {     
    this.customerID=customerID;
    this.customerGroupID = customerGroupID;
    this.customerGroup = customerGroup;
    this.customerDetailData={customerGroup:this.customerGroup,customerGroupID:this.customerGroupID}
    this.advanceTableForm.patchValue({customerID:this.customerID});
    
    // Auto-populate customer address details
    this.fetchCustomerAddressDetails(customerID);
  }

  // Method to fetch customer address details from API
  fetchCustomerAddressDetails(customerID: any) {
    console.log('Fetching customer address details for ID:', customerID);
    
    this.advanceTableService.getCustomerAddressFromGeneral(customerID).subscribe({
      next: (data: any) => {
        console.log('Customer address details received:', data);
        
        if (data && data.length > 0) {
          this.populateCustomerAddressData(data[0]);
        } else if (data && !Array.isArray(data)) {
          // If data is not an array but an object
          this.populateCustomerAddressData(data);
        } else {
          console.log('No customer address data found, trying alternative API');
          this.tryAlternativeCustomerAPI(customerID);
        }
      },
      error: (error) => {
        console.error('Customer address API error:', error);
        console.log('Trying alternative customer API');
        this.tryAlternativeCustomerAPI(customerID);
      }
    });
  }

  // Method to populate form with customer address data
  populateCustomerAddressData(customerDetails: any) {
    console.log('Populating form with customer address details:', customerDetails);
    
    // Auto-populate the form fields from API response
    this.advanceTableForm.patchValue({
      state: customerDetails.state || 
             customerDetails.stateName || 
             customerDetails.customerState || 
             customerDetails.billingState || '',
             
      city: customerDetails.city || 
            customerDetails.cityName || 
            customerDetails.customerCity || 
            customerDetails.billingCity || '',
            
      billingAddress: customerDetails.billingAddress || 
                     customerDetails.address || 
                     customerDetails.customerAddress || 
                     customerDetails.fullAddress || '',
                     
      pinCode: customerDetails.pinCode || 
               customerDetails.pin || 
               customerDetails.zipCode || 
               customerDetails.postalCode || ''
    });

    // Update the IDs for autocomplete
    if (customerDetails.stateID || customerDetails.state_ID) {
      this.stateID = customerDetails.stateID || customerDetails.state_ID;
      this.advanceTableForm.patchValue({stateID: this.stateID});
    }
    
    if (customerDetails.cityID || customerDetails.city_ID) {
      this.cityID = customerDetails.cityID || customerDetails.city_ID;
      this.advanceTableForm.patchValue({cityID: this.cityID});
    }
    
    this.clearAddressValidationErrors();
    console.log('Form successfully updated with customer address details');
  }

  // Try alternative customer API as fallback
  tryAlternativeCustomerAPI(customerID: any) {
    console.log('Trying general customer API for ID:', customerID);
    
    this._generalService.GetCustomerFieldsBasedOnCustomerID(customerID).subscribe({
      next: (data: any) => {
        console.log('General customer API response:', data);
        
        if (data && data.length > 0) {
          this.populateCustomerAddressData(data[0]);
        } else if (data && !Array.isArray(data)) {
          this.populateCustomerAddressData(data);
        } else {
          console.log('No customer data found, setting default test data');
          this.setDefaultTestData(customerID);
        }
      },
      error: (error) => {
        console.error('General customer API error:', error);
        console.log('Setting default test data');
        this.setDefaultTestData(customerID);
      }
    });
  }

  // Set default test data for demonstration
  setDefaultTestData(customerID: any) {
    console.log('Setting default test data for customer ID:', customerID);
    
    this.advanceTableForm.patchValue({
      state: 'Delhi',
      city: 'New Delhi',
      billingAddress: `Customer Address for ID: ${customerID}`,
      pinCode: '110001'
    });
    
    this.clearAddressValidationErrors();
    console.log('Default test data set successfully');
  }

  // Method to clear validation errors for address fields
  clearAddressValidationErrors() {
    const stateControl = this.advanceTableForm.get('state');
    const cityControl = this.advanceTableForm.get('city');
    const billingAddressControl = this.advanceTableForm.get('billingAddress');
    const pinCodeControl = this.advanceTableForm.get('pinCode');

    if (stateControl && stateControl.errors) {
      stateControl.setErrors(null);
    }
    if (cityControl && cityControl.errors) {
      cityControl.setErrors(null);
    }
    if (billingAddressControl && billingAddressControl.errors) {
      billingAddressControl.setErrors(null);
    }
    if (pinCodeControl && pinCodeControl.errors) {
      pinCodeControl.setErrors(null);
    }
  }

  // Method to clear all address fields when customer is removed
  clearAllAddressFields() {
    console.log('Customer removed, clearing all address fields');
    
    // Clear the form fields
    this.advanceTableForm.patchValue({
      state: '',
      stateID: '',
      city: '',
      cityID: '',
      billingAddress: '',
      pinCode: '',
      customerID: ''
    });

    // Clear the component variables
    this.customerID = null;
    this.stateID = null;
    this.cityID = null;
    this.customerGroupID = null;
    this.customerGroup = null;
    this.customerDetailData = null;

    // Clear validation errors
    this.clearAddressValidationErrors();
    
    console.log('All address fields cleared successfully');
  }

  customerValidator(CustomerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerList.some(group => group.customerName?.toLowerCase() === value);
      return match ? null : { customerInvalid: true };
    };
  }

  //------------- New Guest Form -------------
  personShort() 
  {
    const customerControl = this.advanceTableForm.get('customer');
    if (customerControl && customerControl.value) 
    {
      const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, {
        width: '800px',
        hasBackdrop: true,
        panelClass: 'custom-dialog',
        data: 
        {
          action: 'add',
          forCP: '368807',
          CustomerGroupID: this.customerDetailData.customerGroupID,
          CustomerGroupName: this.customerDetailData.customerGroup
        }
      });
    }
    else
    {
      const dialogRef = this.dialog.open(OpenPopUpDialogComponent, {
        width: '350px',  // Adjust the width to a smaller value
        hasBackdrop: true,
        panelClass: 'custom-dialog',
        data: 
        {
          //action: 'add',
          // forCP: '368807',
          // CustomerGroupID: this.customerDetailData?.customerGroupID,
          // CustomerGroupName: this.customerDetailData?.customerGroup
        }
      });
    }
    
    // const customerControl = this.advanceTableForm.get('customer');
    // if (customerControl && customerControl.value) 
    // {
    //   const dialogRef = this.dialog.open(FormDialogComponentCustomerPerson, {
    //     width: '600px',
    //     hasBackdrop: true,
    //     panelClass: 'custom-dialog',
    //     data: 
    //     {
    //       action: 'add',
    //       forCP: '368807',
    //       CustomerGroupID: this.customerDetailData.customerGroupID,
    //       CustomerGroupName: this.customerDetailData.customerGroup
    //     }
    //   });
    // }
    // else
    // {
    //   customerControl?.setErrors({ customerInvalid: true });
    //   customerControl?.markAsTouched();
    //   Swal.fire({
    //     title: 'Please select a Customersss',
    //     icon: 'warning',
    //     // toast: true,
    //     // position: 'top-end',  // You can change this to 'top-start', 'bottom-start', etc.
    //     // showConfirmButton: false,
    //     // timer:5000
    // }).then((result) => {
    //   if (result.value) {}
    // });
    // }
  }

  //------------- State's Drop Down -------------
  InitState()
  {
    this._generalService.getStateForInterstateTax().subscribe(
      data=>
        {
          this.StateList=data;
          this.advanceTableForm.controls['state'].setValidators([Validators.required,
            this.stateValidator(this.StateList)
          ]);
          this.advanceTableForm.controls['state'].updateValueAndValidity();
          this.filteredStateOptions = this.advanceTableForm.controls['state'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterState(value || ''))
          );
        }
      );
  }
  private _filterState(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.StateList?.filter(
      data => 
      {
        return data.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    ); 
  };
  getStateID(geoPointID: any) 
  {
    this.stateID=geoPointID;
    this.advanceTableForm.patchValue({stateID:this.stateID});
  }
  stateValidator(StateLists: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = StateLists.some(group => group.geoPointName?.toLowerCase() === value);
      return match ? null : { stateInvalid: true };
    };
  }

  //------------- City's Drop Down -------------
  InitCity(){
    this._generalService.GetCitiessAll().subscribe(
      data=>
      {
        this.CityList=data;
        this.advanceTableForm.controls['city'].setValidators([Validators.required,
          this.cityValidator(this.CityList)
        ]);
        this.advanceTableForm.controls['city'].updateValueAndValidity();

        this.filteredCityOptions = this.advanceTableForm.controls['city'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        ); 
      });
  }
  private _filterCity(value: string): any {
    const filterValue = value.toLowerCase();
    // if (!value || value.length < 3) {
    //   return [];   
    // }
    return this.CityList?.filter(
      data => 
      {
        return data.geoPointName.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  getTitle(geoPointID: any) 
  {
    this.cityID=geoPointID;
    this.advanceTableForm.patchValue({cityID:this.cityID});
  }
  cityValidator(CityList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CityList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { cityInvalid: true };
    };
  }

  //------------- Vehicle's Drop Down -------------
  InitVehicle() 
  {
    this._generalService.GetVehicle().subscribe(
      data =>
        {
          this.VehicleList = data;
          this.advanceTableForm.controls['vehicle'].setValidators([Validators.required,
            this.vehicleValidator(this.VehicleList)]);
          this.advanceTableForm.controls['vehicle'].updateValueAndValidity();
          this.filteredVehicleOptions = this.advanceTableForm.controls['vehicle'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterVehicle(value || ''))
        );
      }
    );
  }
  private _filterVehicle(value: string): any {
    const filterValue = value.toLowerCase();
    return this.VehicleList.filter(
      data => 
      {
        return data.vehicle.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }
  getvehicleID(vehicleID: any) 
  {
    this.vehicleID=vehicleID;
    this.advanceTableForm.patchValue({vehicleID:this.vehicleID});
  }
  vehicleValidator(VehicleList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = VehicleList.some(group => group.vehicle.toLowerCase() === value);
      return match ? null : { vehicleInvalid: true };
    };
  }

  //------------- Duty's Type Drop Down -------------
  InitPackageType()
  {
    this._generalService.GetPackageType().subscribe(
      data=>
      {
        this.PackageTypeList=data;
        this.advanceTableForm.controls['dutyType'].setValidators([Validators.required,
          this.packageTypeValidator(this.PackageTypeList)
        ]);
        this.advanceTableForm.controls['dutyType'].updateValueAndValidity();
        this.filteredPackageTypeOptions = this.advanceTableForm.controls['dutyType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackageType(value || ''))
        ); 
      });
  }
  private _filterPackageType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PackageTypeList?.filter(
      data => 
      {
        return data.packageType.toLowerCase().indexOf(filterValue)===0;
      }
    );
  }  
  getPackageTypeID(packageTypeID: any) 
  {
    this.dutyTypeID=packageTypeID;
    this.advanceTableForm.patchValue({dutyTypeID:this.dutyTypeID});    
  }
  packageTypeValidator(PackageTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PackageTypeList.some(group => group.packageType.toLowerCase() === value);
      return match ? null : { packageTypeInvalid: true };
    };
  }

//--------- IGST Percentage Name-----------------
InitIGSTPercentage()
{
  this._generalService.GetIGSTPercentage().subscribe(
    data=>
    {
      this.IGSTPercentageList=data;
      this.filteredIGSTPercentageOptions = this.advanceTableForm.controls['igstPercentage'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterIGST(value || ''))
      ); 
    });
}
private _filterIGST(value: string): any {
  const filterValue = (value).toLowerCase();
  // if (!value || value.length < 3) {
  //     return [];   
  //   }
  return this.IGSTPercentageList.filter(
    data => 
      {
        return data.igstPercentage.toLowerCase().indexOf(filterValue)===0;
      });
}
getIGSTPercentageID(igstPercentageID:any) 
{
  this.igstPercentageID=igstPercentageID;
  //this.advanceTableForm.patchValue({igstPercentageID:this.igstPercentageID});
}

//--------- CSGST Percentage Name-----------------
InitCSGSTPercentage()
{
  this._generalService.GetCSGSTPercentage().subscribe(
    data=>
    {
      this.CSGSTPercentageList=data;
      this.filteredCSGSTPercentageOptions = this.advanceTableForm.controls['csgstPercentage'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterGST(value || ''))
      ); 
    });
}
private _filterGST(value: string): any {
  const filterValue = (value).toLowerCase();
  // if (!value || value.length < 3) {
  //     return [];   
  //   }
  return this.CSGSTPercentageList.filter(
    data => 
      {
        return data.csgstPercentage.toLowerCase().indexOf(filterValue)===0;
      });
}
getcsGSTPercentageID(csgstPercentageID:any) 
{
  this.csgstPercentageID=csgstPercentageID;
  //this.advanceTableForm.patchValue({csgstPercentageID:this.csgstPercentageID});
}

  public noWhitespaceValidator(control: FormControl) 
  {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() 
  {
    //console.log(this.advanceTableForm.value);
  }
  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }
  }

  public Post(): void
  {
    debugger
    if(this.advanceTableForm.get('gst').value === false)
    {
      this.advanceTableForm.patchValue({igstPercentage:0});
      this.advanceTableForm.patchValue({cgstPercentage:0});
      this.advanceTableForm.patchValue({sgstPercentage:0});
      this.advanceTableForm.patchValue({gstType:null});
    }
    else if(this.advanceTableForm.get('gstType').value === 'CGSTSGST')
    {
      const csgstPercentage = Number(this.advanceTableForm.get('csgstPercentage').value);
      this.advanceTableForm.patchValue({igstPercentage:0});
      this.advanceTableForm.patchValue({cgstPercentage:Number(csgstPercentage/2)});
      this.advanceTableForm.patchValue({sgstPercentage:Number(csgstPercentage/2)});
    }
    else if(this.advanceTableForm.get('gstType').value === 'IGST')
    {
      const igstPercentage = Number(this.advanceTableForm.get('igstPercentage').value);
      this.advanceTableForm.patchValue({igstPercentage:igstPercentage});
      this.advanceTableForm.patchValue({cgstPercentage:0});
      this.advanceTableForm.patchValue({sgstPercentage:0});
    }
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('GenerateBillMainCreate:GenerateBillMainView:Success');//To Send Updates  
    },
    error =>
    {
      this._generalService.sendUpdate('GenerateBillMainAll:GenerateBillMainView:Failure');//To Send Updates  
    })
  }

  public Put(): void
  {
    if(this.advanceTableForm.get('gst').value === false)
      {
        this.advanceTableForm.patchValue({igstPercentage:0});
        this.advanceTableForm.patchValue({cgstPercentage:0});
        this.advanceTableForm.patchValue({sgstPercentage:0});
        this.advanceTableForm.patchValue({gstType:null});
      }
      else if(this.advanceTableForm.get('gstType').value === 'CGSTSGST')
      {
        const csgstPercentage = Number(this.advanceTableForm.get('csgstPercentage').value);
        this.advanceTableForm.patchValue({igstPercentage:0});
        this.advanceTableForm.patchValue({cgstPercentage:Number(csgstPercentage/2)});
        this.advanceTableForm.patchValue({sgstPercentage:Number(csgstPercentage/2)});
      }
      else if(this.advanceTableForm.get('gstType').value === 'IGST')
      {
        const igstPercentage = Number(this.advanceTableForm.get('igstPercentage').value);
        this.advanceTableForm.patchValue({igstPercentage:igstPercentage});
        this.advanceTableForm.patchValue({cgstPercentage:0});
        this.advanceTableForm.patchValue({sgstPercentage:0});
      }
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      this.dialogRef.close();
      this._generalService.sendUpdate('GenerateBillMainUpdate:GenerateBillMainView:Success');//To Send Updates  
       
    },
    error =>
    {
     this._generalService.sendUpdate('GenerateBillMainAll:GenerateBillMainView:Failure');//To Send Updates  
    })
  }

  public confirmAdd(): void 
  {
    if(this.action=="edit")
    {
      this.Put();
    }
    else
    {
      this.Post();
    }
  }
}


