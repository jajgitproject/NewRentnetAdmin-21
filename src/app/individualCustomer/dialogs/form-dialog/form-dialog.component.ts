// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { IndividualCustomerService } from '../../individualCustomer.service';
import { IndividualCustomerModel } from '../../individualCustomer.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SalutationDropDown } from 'src/app/salutation/salutationDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { CustomerContractDropDown } from 'src/app/customerContract/customerContractDropDown.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-individual-customer-form-dialog',
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
  advanceTable: IndividualCustomerModel;
  saveDisabled:boolean=true;

  filteredCustomerContractOptions: Observable<CustomerContractDropDown[]>;
  public CustomerContractList?: CustomerContractDropDown[] = [];
  customerContractID: any;

  filteredSalutationOptions: Observable<SalutationDropDown[]>;
  public SalutationList?: SalutationDropDown[] = [];
  salutationID: any;

  filteredLocationOptions: Observable<OrganizationalEntityDropDown[]>;
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  locationID: any;

  filteredStateOptions: Observable<StateDropDown[]>;
  public StatesList?: StateDropDown[] = [];
  billingStateID:any;

  filteredCityOptions: Observable<CityDropDown[]>;
  public CityList?: CityDropDown[] = [];
  billingCityID:any;

  filteredEmployeeOptions: Observable<EmployeeDropDown[]>;
  public EmployeeList?: EmployeeDropDown[] = [];
  employeeID:any

  filteredSalesManagerOptions: Observable<EmployeeDropDown[]>;
  public SalesManagerList?: EmployeeDropDown[] = [];
  salesManagerID:any

  filteredKAMCityOptions: Observable<CityDropDown[]>;
  public KAMCityList?: CityDropDown[] = [];
  customerKAMCityID:any;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public individualCustomerService: IndividualCustomerService,
  private fb: FormBuilder,
  private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
    this.action = data.action;
    this.dialogTitle = 'Individual Customer';
    this.advanceTable = new IndividualCustomerModel({});
    this.advanceTable.activationStatus = true;
    this.advanceTable.isPostPickUpCallAllowed = false;
    this.advanceTable.roundOffInvoiceValue = false;
    this.advanceTableForm = this.createContactForm();
  }

  ngOnInit()
  {
    this.InitCustomerContract();
    this.InitSalutation();
    this.InitLocation();
    this.InitState();
    this.InitKAMEmployee();
    this.InitSalesManager();
  }

  createContactForm(): FormGroup
  {
    return this.fb.group(
    {
      customerPersonName: [this.advanceTable.customerPersonName, [Validators.required, this.noWhitespaceValidator]],
      customerContractID: [this.advanceTable.customerContractID],
      customerContractName: [this.advanceTable.customerContractName],
      salutationID: [this.advanceTable.salutationID],
      salutation: [this.advanceTable.salutation],
      gender: [this.advanceTable.gender],
      importance: [this.advanceTable.importance],
      primaryMobile: [this.advanceTable.primaryMobile],
      primaryEmail: [this.advanceTable.primaryEmail],
      billingEmail: [this.advanceTable.billingEmail],
      locationID: [this.advanceTable.locationID],
      location: [this.advanceTable.location],
      gstNumber: [this.advanceTable.gstNumber || null],
      gstRate: [this.advanceTable.gstRate],
      billingName: [this.advanceTable.billingName],
      billingAddress: [this.advanceTable.billingAddress],
      billingCityID: [this.advanceTable.billingCityID],
      billingCityName: [this.advanceTable.billingCityName],
      billingStateID: [this.advanceTable.billingStateID],
      billingStateName: [this.advanceTable.billingStateName],
      billingPin: [this.advanceTable.billingPin],
      eInvoiceAddress: [this.advanceTable.eInvoiceAddress],
      employeeID: [this.advanceTable.employeeID],
      employeeName: [this.advanceTable.employeeName],
      customerKAMCityID: [this.advanceTable.customerKAMCityID],
      customerKAMCity: [this.advanceTable.customerKAMCity],
      roundOffInvoiceValue: [this.advanceTable.roundOffInvoiceValue],
      salesManagerID: [this.advanceTable.salesManagerID],
      salesManagerName: [this.advanceTable.salesManagerName],
      activationStatus: [this.advanceTable.activationStatus],
      countryForISDCodeID: [this.advanceTable.countryForISDCodeID],
      customerDepartmentID: [this.advanceTable.customerDepartmentID],
      customerDesignationID: [this.advanceTable.customerDesignationID],
      maskMobileNumber:[this.advanceTable.maskMobileNumber],
      isPostPickUpCallAllowed: [this.advanceTable.isPostPickUpCallAllowed ?? false]
    });
  }

  public noWhitespaceValidator(control: FormControl)
  {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {}

  onNoClick(): void
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
      this.advanceTableForm.patchValue({
        activationStatus: true,
        isPostPickUpCallAllowed: false,
        roundOffInvoiceValue: false
      });
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Post(): void
  {
    this.individualCustomerService.add(this.advanceTableForm.getRawValue())
    .subscribe(
      response =>
      {
        if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.includes("Duplicate"))
        {
          this.showNotification(
              'snackbar-danger',
              'Duplicate Value Found.....!!!',
              'bottom',
              'center'
              );
          this.saveDisabled = true;
        }
        else if (response && response.activationStatus && typeof response.activationStatus === 'string' && response.activationStatus.startsWith('+'))
        {
          this.showNotification(
              'snackbar-danger',
              'Operation Failed...!!!',
              'bottom',
              'center'
              );
          this.saveDisabled = true;
        }
        else
        {
          this.showNotification(
            'snackbar-success',
            'Individual Customer Created...!!!',
            'bottom',
            'center'
          );
          this.dialogRef.close(true);
        }
      },
      error =>
      {
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
      }
    )
  }

  public confirmAdd(): void
  {
    this.saveDisabled = false;
    this.Post();
  }

  //------------ Customer Contract -----------------
    customerContractValidator(CustomerContractList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        if (!value) {
          return { customerContractNameInvalid: true };
        }
        const match = (CustomerContractList || []).some(
          contract => (contract.customerContractName || '').toLowerCase() === value
        );
        return match ? null : { customerContractNameInvalid: true };
      };
    }
    InitCustomerContract()
    {
      this._generalService.GetCustomerContract().subscribe(
      data =>
      {
        this.CustomerContractList = data || [];
        this.advanceTableForm.controls['customerContractName'].setValidators([
          Validators.required,
          this.customerContractValidator(this.CustomerContractList)
        ]);
        this.advanceTableForm.controls['customerContractName'].updateValueAndValidity();
        this.filteredCustomerContractOptions = this.advanceTableForm.controls['customerContractName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomerContract(value || ''))
        );
      });
    }
    private _filterCustomerContract(value: string): CustomerContractDropDown[] {
      const filterValue = (value || '').toString().toLowerCase();
      return (this.CustomerContractList || []).filter(data =>
        (data.customerContractName || '').toLowerCase().includes(filterValue)
      );
    }
    OnCustomerContractNameSelect(selectedCustomerContract: string)
    {
      const CustomerContract = this.CustomerContractList.find(
        data => data.customerContractName === selectedCustomerContract);
      if (selectedCustomerContract && CustomerContract)
      {
        this.getCustomerContractID(CustomerContract.customerContractID);
      }
    }
    getCustomerContractID(customerContractID: any)
    {
      this.customerContractID = customerContractID;
      this.advanceTableForm.patchValue({ customerContractID: this.customerContractID });
    }

  //------------ Salutation -----------------
    salutationValidator(SalutationList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = SalutationList.some(group => group.salutation.toLowerCase() === value);
        return match ? null : { salutationInvalid: true };
      };
    }
    InitSalutation()
    {
      this._generalService.GetSalutations().subscribe(
      data=>{
          this.SalutationList=data;
          this.advanceTableForm.controls['salutation'].setValidators([Validators.required,this.salutationValidator(this.SalutationList)]);
          this.advanceTableForm.controls['salutation'].updateValueAndValidity();
          this.filteredSalutationOptions = this.advanceTableForm.controls['salutation'].valueChanges.pipe(
            startWith(""),
            map(value => this._filterSalutation(value || ''))
          );
        }
      );
    }
    private _filterSalutation(value: string): any {
      const filterValue = value.toLowerCase();
      return this.SalutationList.filter(
        data =>
        {
          return data.salutation.toLowerCase().includes(filterValue);
        });
    }
    OnSalutationSelect(selectedSalutation: string)
    {
      const SalutationName = this.SalutationList.find(
        data => data.salutation === selectedSalutation);
      if (selectedSalutation)
      {
        this.getSalutationID(SalutationName.salutationID);
      }
    }
    getSalutationID(salutationID: any)
    {
      this.salutationID=salutationID;
      this.advanceTableForm.patchValue({salutationID:this.salutationID});
    }

  //------------ Location -----------------
    serviceLocationValidator(OrganizationalEntitiesList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = OrganizationalEntitiesList.some(group => group.organizationalEntityName.toLowerCase() === value);
        return match ? null : { locationInvalid: true };
      };
    }
    InitLocation()
    {
      this._generalService.GetLocation().subscribe(
      data=>{
        this.OrganizationalEntitiesList = data;
        this.advanceTableForm.controls['location'].setValidators([Validators.required,this.serviceLocationValidator(this.OrganizationalEntitiesList)]);
        this.advanceTableForm.controls['location'].updateValueAndValidity();
        this.filteredLocationOptions = this.advanceTableForm.controls['location'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterLocation(value || ''))
        );
      })
    }
    private _filterLocation(value: string): any {
      const filterValue = value.toLowerCase();
      return this.OrganizationalEntitiesList.filter(
        data =>
        {
          return data.organizationalEntityName.toLowerCase().includes(filterValue);
        }
      );
    };
    onServiceLocationSelected(selectedServiceName: string) {
      const selectedValue = this.OrganizationalEntitiesList.find(
      data => data.organizationalEntityName === selectedServiceName);
      if (selectedValue)
      {
        this.getLocationID(selectedValue.organizationalEntityID);
      }
    }
    getLocationID(organizationalEntityID: any)
    {
      this.locationID=organizationalEntityID;
      this.advanceTableForm.patchValue({locationID:this.locationID})
    }

  //------------ State -----------------
    billingStateNameValidator(StatesList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = StatesList.some(group => group.geoPointName.toLowerCase() === value);
        return match ? null : { billingStateNameInvalid: true };
      };
    }
    InitState()
    {
      this._generalService.GetStatesAl().subscribe(
      data =>
      {
        this.StatesList = data;
        this.advanceTableForm.controls['billingStateName'].setValidators([Validators.required,this.billingStateNameValidator(this.StatesList)]);
        this.advanceTableForm.controls['billingStateName'].updateValueAndValidity();
        this.filteredStateOptions = this.advanceTableForm.controls['billingStateName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterState(value || ''))
        );
      });
    }
    private _filterState(value: string): any {
      const filterValue = value.toLowerCase();
      return this.StatesList.filter(
      data =>
      {
        return data.geoPointName.toLowerCase().includes(filterValue);
      });
    }
    OnStateSelect(selectedState: string)
    {
      const StateName = this.StatesList.find(
        data => data.geoPointName === selectedState);
      if (selectedState)
      {
        this.getStateID(StateName.geoPointID);
      }
    }
    getStateID(geoPointID: any)
    {
      this.billingStateID = geoPointID;
      this.advanceTableForm.patchValue({billingStateID:this.billingStateID});
      this.OnStateChangeGetCity();
      this.advanceTableForm.controls['billingCityName'].setValue('');
    }

  //------------ City -----------------
    billingCityNameValidator(CityList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = CityList.some(group => group.geoPointName.toLowerCase() === value);
        return match ? null : { billingCityNameInvalid: true };
      };
    }
    OnStateChangeGetCity()
    {
      this._generalService.GetCities(this.billingStateID).subscribe(
      data =>
      {
        this.CityList = data;
        this.advanceTableForm.controls['billingCityName'].setValidators([Validators.required,this.billingCityNameValidator(this.CityList)]);
        this.advanceTableForm.controls['billingCityName'].updateValueAndValidity();
        this.filteredCityOptions = this.advanceTableForm.controls['billingCityName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCity(value || ''))
        );
      });
    }
    private _filterCity(value: string): any {
      const filterValue = value.toLowerCase();
      return this.CityList.filter(
      data =>
      {
        return data.geoPointName.toLowerCase().includes(filterValue);
      });
    }
    OnCitySelect(selectedCity: string)
    {
      const CityName = this.CityList.find(
        data => data.geoPointName === selectedCity);
      if (selectedCity)
      {
        this.getCityID(CityName.geoPointID);
      }
    }
    getCityID(geoPointID: any)
    {
    this.billingCityID=geoPointID;
    this.advanceTableForm.patchValue({billingCityID:this.billingCityID});
    }

    onStateInputChange(event: any)
    {
      if(event.target.value.length === 0)
      {
        this.advanceTableForm.controls['billingCityName'].setValue('');
        this.OnStateChangeGetCity();
      }
    }

  //--------------- Employee -----------
    employeeNameValidator(EmployeeList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = EmployeeList.some(employee => (employee.firstName + ' ' + employee.lastName).toLowerCase() === value);
        return match ? null : { employeeNameInvalid: true };
      };
    }
    InitKAMEmployee()
    {
      this._generalService.GetEmployee().subscribe(
      data =>
      {
        this.EmployeeList = data;
        this.advanceTableForm.controls['employeeName'].setValidators([Validators.required,this.employeeNameValidator(this.EmployeeList)]);
        this.advanceTableForm.controls['employeeName'].updateValueAndValidity();
        this.filteredEmployeeOptions = this.advanceTableForm.controls['employeeName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterEmployee(value || ''))
        );
      });
    }
    private _filterEmployee(value: string): any {
      const filterValue = value.toLowerCase();
      return this.EmployeeList.filter(
      data =>
       {
        const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.includes(filterValue);
      });
    }
    OnEmployeeSelect(selectedEmployee: string)
    {
      const EmployeeName = this.EmployeeList.find(
      data => `${data.firstName} ${data.lastName}` === selectedEmployee);
      if (selectedEmployee)
      {
        this.getEmployeeID(EmployeeName.employeeID);
      }
    }
    getEmployeeID(employeeID: any)
    {
      this.employeeID=employeeID;
      this.advanceTableForm.patchValue({employeeID:this.employeeID});
      this.InitKAMCity();
    }


    //------------ KAM City -----------------
    kamCityNameValidator(KAMCityList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = KAMCityList.some(group => group.geoPointName.toLowerCase() === value);
        return match ? null : { kamCityNameInvalid: true };
      };
    }
    InitKAMCity()
    {
      this._generalService.GetCitys().subscribe(
      data =>
      {
        this.KAMCityList = data;
        this.advanceTableForm.controls['customerKAMCity'].setValidators([Validators.required,this.kamCityNameValidator(this.KAMCityList)]);
        this.advanceTableForm.controls['customerKAMCity'].updateValueAndValidity();
        this.filteredKAMCityOptions = this.advanceTableForm.controls['customerKAMCity'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterKAMCity(value || ''))
        );
      });
    }
    private _filterKAMCity(value: string): any {
      const filterValue = value.toLowerCase();
      return this.KAMCityList.filter(
      data =>
      {
        return data.geoPointName.toLowerCase().includes(filterValue);
      });
    }
    OnKAMCitySelect(selectedCity: string)
    {
      const CityName = this.KAMCityList.find(
        data => data.geoPointName === selectedCity);
      if (selectedCity)
      {
        this.getKAMCityID(CityName.geoPointID);
      }
    }
    getKAMCityID(geoPointID: any)
    {
    this.customerKAMCityID=geoPointID;
    this.advanceTableForm.patchValue({customerKAMCityID:this.customerKAMCityID});
    }


    //--------------- Sales Manager -----------
    salesManagerValidator(SalesManagerList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = SalesManagerList.some(employee => (employee.firstName + ' ' + employee.lastName).toLowerCase() === value);
        return match ? null : { salesManagerNameInvalid: true };
      };
    }
    InitSalesManager()
    {
      this._generalService.GetEmployee().subscribe(
      data =>
      {
        this.SalesManagerList = data;
        this.advanceTableForm.controls['salesManagerName'].setValidators([Validators.required,this.salesManagerValidator(this.SalesManagerList)]);
        this.advanceTableForm.controls['salesManagerName'].updateValueAndValidity();
        this.filteredSalesManagerOptions = this.advanceTableForm.controls['salesManagerName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterSalesManager(value || ''))
        );
      });
    }
    private _filterSalesManager(value: string): any {
      const filterValue = value.toLowerCase();
      return this.SalesManagerList.filter(
      data =>
       {
        const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.includes(filterValue);
      });
    }
    OnSalesManagerSelect(selectedEmployee: string)
    {
      const EmployeeName = this.SalesManagerList.find(
      data => `${data.firstName} ${data.lastName}` === selectedEmployee);
      if (selectedEmployee)
      {
        this.getSalesManagerID(EmployeeName.employeeID);
      }
    }
    getSalesManagerID(employeeID: any)
    {
      this.salesManagerID=employeeID;
      this.advanceTableForm.patchValue({salesManagerID:this.salesManagerID});
    }

}
