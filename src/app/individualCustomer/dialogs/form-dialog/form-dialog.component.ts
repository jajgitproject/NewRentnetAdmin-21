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

  private readonly defaultCustomerContractName = 'Default';
  private readonly defaultLocationName = 'Head Office';

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
    if (this.action === 'edit' && data.advanceTable) {
      this.advanceTable = data.advanceTable;
    } else {
      this.advanceTable = new IndividualCustomerModel({});
      this.advanceTable.activationStatus = true;
      this.advanceTable.importance = 'General';
      this.advanceTable.isPostPickUpCallAllowed = true;
      this.advanceTable.isBillToShipToCustomer = false;
      this.advanceTable.roundOffInvoiceValue = false;
    }
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
    this.setupFieldAutoPopulation();
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
      gender: [this.advanceTable.gender, Validators.required],
      importance: [this.advanceTable.importance || 'General', Validators.required],
      primaryMobile: [this.advanceTable.primaryMobile, Validators.required],
      primaryEmail: [this.advanceTable.primaryEmail, [Validators.required, Validators.email]],
      billingEmail: [this.advanceTable.billingEmail, [Validators.required, Validators.email]],
      locationID: [this.advanceTable.locationID],
      location: [this.advanceTable.location],
      gstNumber: [this.advanceTable.gstNumber || null],
      gstRate: [this.advanceTable.gstRate, [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      billingName: [this.advanceTable.billingName, [Validators.required, this.noWhitespaceValidator]],
      billingAddress: [this.advanceTable.billingAddress, [Validators.required, this.noWhitespaceValidator]],
      billingCityID: [this.advanceTable.billingCityID],
      billingCityName: [this.advanceTable.billingCityName],
      billingStateID: [this.advanceTable.billingStateID],
      billingStateName: [this.advanceTable.billingStateName],
      billingPin: [this.advanceTable.billingPin, Validators.required],
      eInvoiceAddress: [this.advanceTable.eInvoiceAddress, [Validators.required, this.noWhitespaceValidator]],
      employeeID: [this.advanceTable.employeeID],
      employeeName: [this.advanceTable.employeeName],
      roundOffInvoiceValue: [this.advanceTable.roundOffInvoiceValue],
      salesManagerID: [this.advanceTable.salesManagerID],
      salesManagerName: [this.advanceTable.salesManagerName],
      activationStatus: [this.advanceTable.activationStatus],
      countryForISDCodeID: [this.advanceTable.countryForISDCodeID],
      customerDepartmentID: [this.advanceTable.customerDepartmentID],
      customerDesignationID: [this.advanceTable.customerDesignationID],
      maskMobileNumber:[this.advanceTable.maskMobileNumber],
      isPostPickUpCallAllowed: [this.advanceTable.isPostPickUpCallAllowed ?? true],
      isBillToShipToCustomer: [this.advanceTable.isBillToShipToCustomer ?? false],
    });
  }

  private setupFieldAutoPopulation(): void {
    this.advanceTableForm.get('primaryEmail')?.valueChanges.subscribe((value) => {
      this.advanceTableForm.patchValue({ billingEmail: value ?? '' }, { emitEvent: false });
    });

    this.advanceTableForm.get('customerPersonName')?.valueChanges.subscribe((value) => {
      this.advanceTableForm.patchValue({ billingName: value ?? '' }, { emitEvent: false });
    });

    this.advanceTableForm.get('billingAddress')?.valueChanges.subscribe((value) => {
      const address = (value ?? '').toString();
      const eInvoiceAddress = address.length > 100 ? address.substring(0, 100) : address;
      this.advanceTableForm.patchValue({ eInvoiceAddress }, { emitEvent: false });
    });
  }

  private applyDefaultCustomerContract(): void {
    if (this.action !== 'add') {
      return;
    }
    const current = this.advanceTableForm.get('customerContractName')?.value;
    if (current) {
      return;
    }
    const contract = this.findListItemByPreferredLabel(
      this.CustomerContractList || [],
      c => c.customerContractName,
      this.defaultCustomerContractName
    );
    if (contract) {
      this.advanceTableForm.patchValue({
        customerContractName: contract.customerContractName,
        customerContractID: contract.customerContractID
      });
      this.advanceTableForm.controls['customerContractName'].updateValueAndValidity({ emitEvent: false });
    }
  }

  private applyDefaultLocation(): void {
    if (this.action !== 'add') {
      return;
    }
    const current = this.advanceTableForm.get('location')?.value;
    if (current) {
      return;
    }
    const location = this.findListItemByPreferredLabel(
      this.OrganizationalEntitiesList || [],
      l => l.organizationalEntityName,
      this.defaultLocationName
    );
    if (location) {
      this.advanceTableForm.patchValue({
        location: location.organizationalEntityName,
        locationID: location.organizationalEntityID
      });
      this.advanceTableForm.controls['location'].updateValueAndValidity({ emitEvent: false });
    }
  }

  private applyAddModeFormDefaults(): void {
    if (this.action !== 'add') {
      return;
    }
    this.advanceTableForm.patchValue({
      importance: 'General',
      isPostPickUpCallAllowed: true,
      isBillToShipToCustomer: false,
      activationStatus: true,
      roundOffInvoiceValue: false
    });
    this.applyDefaultCustomerContract();
    this.applyDefaultLocation();
  }

  public noWhitespaceValidator(control: FormControl)
  {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  private normalizeLabel(value: string): string {
    return (value || '').toString().replace(/\s+/g, ' ').trim().toLowerCase();
  }

  private findListItemByPreferredLabel<T>(
    list: T[],
    labelSelector: (item: T) => string,
    preferredLabel: string
  ): T | undefined {
    if (!list?.length) {
      return undefined;
    }
    const preferred = this.normalizeLabel(preferredLabel);
    let item = list.find(i => this.normalizeLabel(labelSelector(i)) === preferred);
    if (item) {
      return item;
    }
    item = list.find(i => this.normalizeLabel(labelSelector(i)).includes(preferred));
    if (item) {
      return item;
    }
    return list.find(i => preferred.includes(this.normalizeLabel(labelSelector(i))));
  }

  private employeeDisplayName(employee: EmployeeDropDown): string {
    return `${employee.firstName || ''} ${employee.lastName || ''}`.replace(/\s+/g, ' ').trim();
  }

  /** Resolve hidden *ID fields from display text when the user picked a list value without firing option handlers. */
  private syncAutocompleteIds(): void {
    const raw = this.advanceTableForm.getRawValue();

    const contract = (this.CustomerContractList || []).find(
      c => this.normalizeLabel(c.customerContractName) === this.normalizeLabel(raw.customerContractName)
    );
    if (contract) {
      this.advanceTableForm.patchValue({ customerContractID: contract.customerContractID });
    }

    const salutation = (this.SalutationList || []).find(
      s => this.normalizeLabel(s.salutation) === this.normalizeLabel(raw.salutation)
    );
    if (salutation) {
      this.advanceTableForm.patchValue({ salutationID: salutation.salutationID });
    }

    const location = (this.OrganizationalEntitiesList || []).find(
      l => this.normalizeLabel(l.organizationalEntityName) === this.normalizeLabel(raw.location)
    );
    if (location) {
      this.advanceTableForm.patchValue({ locationID: location.organizationalEntityID });
    }

    const state = (this.StatesList || []).find(
      s => this.normalizeLabel(s.geoPointName) === this.normalizeLabel(raw.billingStateName)
    );
    if (state) {
      this.advanceTableForm.patchValue({ billingStateID: state.geoPointID });
    }

    const city = (this.CityList || []).find(
      c => this.normalizeLabel(c.geoPointName) === this.normalizeLabel(raw.billingCityName)
    );
    if (city) {
      this.advanceTableForm.patchValue({ billingCityID: city.geoPointID });
    }

    const employee = (this.EmployeeList || []).find(
      e => this.normalizeLabel(this.employeeDisplayName(e)) === this.normalizeLabel(raw.employeeName)
    );
    if (employee) {
      this.advanceTableForm.patchValue({ employeeID: employee.employeeID });
    }

    const salesManager = (this.SalesManagerList || []).find(
      e => this.normalizeLabel(this.employeeDisplayName(e)) === this.normalizeLabel(raw.salesManagerName)
    );
    if (salesManager) {
      this.advanceTableForm.patchValue({ salesManagerID: salesManager.employeeID });
    }
  }

  private validateReferenceIds(): string | null {
    const v = this.advanceTableForm.getRawValue();
    if (!v.customerContractID) {
      return 'Please select Customer Contract from the list';
    }
    if (!v.salutationID) {
      return 'Please select Salutation from the list';
    }
    if (!v.locationID) {
      return 'Please select Location from the list';
    }
    if (!v.billingStateID) {
      return 'Please select Billing State from the list';
    }
    if (!v.billingCityID) {
      return 'Please select Billing City from the list';
    }
    if (!v.employeeID) {
      return 'Please select KAM from the list';
    }
    if (!v.salesManagerID) {
      return 'Please select Sales Manager from the list';
    }
    if (!this._generalService.getUserID()) {
      return 'Your session has no user ID. Please log in again and retry.';
    }
    return null;
  }

  submit() {}

  onNoClick(): void
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
      this.applyAddModeFormDefaults();
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

  private parseActivationStatus(response: any): string | null {
    if (!response) return null;
    if (typeof response === 'string') {
      try {
        const parsed = JSON.parse(response);
        return parsed?.activationStatus ?? response;
      } catch {
        return response;
      }
    }
    if (typeof response.activationStatus === 'string') {
      return response.activationStatus;
    }
    return null;
  }

  private extractHttpErrorMessage(error: any): string {
    const body = error?.error;
    if (!body) {
      return error?.message || 'Operation Failed...!!!';
    }
    if (typeof body === 'string') {
      try {
        const parsed = JSON.parse(body);
        if (parsed?.activationStatus) {
          return String(parsed.activationStatus).replace(/^\+/, '');
        }
        return body;
      } catch {
        return body;
      }
    }
    if (body.activationStatus) {
      return String(body.activationStatus).replace(/^\+/, '');
    }
    if (body.title) {
      return body.title;
    }
    if (body.errors) {
      const firstKey = Object.keys(body.errors)[0];
      if (firstKey && body.errors[firstKey]?.length) {
        return `${firstKey}: ${body.errors[firstKey][0]}`;
      }
    }
    return 'Operation Failed...!!!';
  }

  public Post(): void
  {
    this.individualCustomerService.add(this.advanceTableForm.getRawValue())
    .subscribe(
      response =>
      {
        const activationStatus = this.parseActivationStatus(response);
        if (activationStatus && activationStatus.includes("Duplicate"))
        {
          this.showNotification(
              'snackbar-danger',
              'Duplicate Value Found.....!!!',
              'bottom',
              'center'
              );
          this.saveDisabled = true;
        }
        else if (activationStatus && activationStatus.startsWith('+'))
        {
          this.showNotification(
              'snackbar-danger',
              activationStatus.replace(/^\+/, '') || 'Operation Failed...!!!',
              'bottom',
              'center'
              );
          this.saveDisabled = true;
        }
        else
        {
          this._generalService.sendUpdate('CustomerCreate:CustomerView:Success');
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
          this.extractHttpErrorMessage(error),
          'bottom',
          'center'
        );
        this.saveDisabled = true;
      }
    )
  }

  private syncEInvoiceAddressFromBilling(): void {
    const address = (this.advanceTableForm.get('billingAddress')?.value ?? '').toString();
    const eInvoiceAddress = address.length > 100 ? address.substring(0, 100) : address;
    this.advanceTableForm.patchValue({ eInvoiceAddress }, { emitEvent: false });
  }

  public confirmAdd(): void
  {
    this.syncEInvoiceAddressFromBilling();
    this.syncAutocompleteIds();
    this.advanceTableForm.updateValueAndValidity();

    if (this.advanceTableForm.invalid) {
      this.advanceTableForm.markAllAsTouched();
      this.showNotification(
        'snackbar-danger',
        'Please complete all required fields correctly.',
        'bottom',
        'center'
      );
      return;
    }

    const idError = this.validateReferenceIds();
    if (idError) {
      this.showNotification(
        'snackbar-danger',
        idError,
        'bottom',
        'center'
      );
      return;
    }

    this.saveDisabled = false;
    this.Post();
  }

  //------------ Customer Contract -----------------
    customerContractValidator(CustomerContractList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = this.normalizeLabel(control.value);
        if (!value) {
          return { customerContractNameInvalid: true };
        }
        const match = (CustomerContractList || []).some(
          contract => this.normalizeLabel(contract.customerContractName) === value
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
        this.applyDefaultCustomerContract();
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
        data => this.normalizeLabel(data.customerContractName) === this.normalizeLabel(selectedCustomerContract));
      if (CustomerContract)
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
        const value = this.normalizeLabel(control.value);
        if (!value) {
          return { salutationInvalid: true };
        }
        const match = (SalutationList || []).some(
          group => this.normalizeLabel(group.salutation) === value
        );
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
        data => this.normalizeLabel(data.salutation) === this.normalizeLabel(selectedSalutation));
      if (SalutationName)
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
        const value = this.normalizeLabel(control.value);
        if (!value) {
          return { locationInvalid: true };
        }
        const match = (OrganizationalEntitiesList || []).some(
          group => this.normalizeLabel(group.organizationalEntityName) === value
        );
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
        this.applyDefaultLocation();
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
        data => this.normalizeLabel(data.organizationalEntityName) === this.normalizeLabel(selectedServiceName));
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
        const value = this.normalizeLabel(control.value);
        if (!value) {
          return { employeeNameInvalid: true };
        }
        const match = (EmployeeList || []).some(
          employee => this.normalizeLabel(this.employeeDisplayName(employee)) === value
        );
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
        data => this.normalizeLabel(this.employeeDisplayName(data)) === this.normalizeLabel(selectedEmployee));
      if (EmployeeName)
      {
        this.getEmployeeID(EmployeeName.employeeID);
      }
    }
    getEmployeeID(employeeID: any)
    {
      this.employeeID=employeeID;
      this.advanceTableForm.patchValue({employeeID:this.employeeID});
    }

    //--------------- Sales Manager -----------
    salesManagerValidator(SalesManagerList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = this.normalizeLabel(control.value);
        if (!value) {
          return { salesManagerNameInvalid: true };
        }
        const match = (SalesManagerList || []).some(
          employee => this.normalizeLabel(this.employeeDisplayName(employee)) === value
        );
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
        data => this.normalizeLabel(this.employeeDisplayName(data)) === this.normalizeLabel(selectedEmployee));
      if (EmployeeName)
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
