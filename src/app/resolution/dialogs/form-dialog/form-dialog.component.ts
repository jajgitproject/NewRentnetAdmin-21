// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ResolutionService } from '../../resolution.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { DebitTypeModel, Resolution } from '../../resolution.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable, of, Subject } from 'rxjs';
import { DutySlipDropDown } from '../../dutySlipDropDown.model';
import { catchError, map, startWith } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { EmployeesDropDown } from 'src/app/feedBack/employeeDropDown.model';
import { ActivatedRoute } from '@angular/router';
import { IncidenceTypeDropDown } from 'src/app/incidenceType/incidenceTypeDropDown.model';
import { IssueCategoryDropDown } from 'src/app/issueCategory/issueCategoryDropDown.model';
import { AuthService } from 'src/app/core/service/auth.service';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class resolutionFormDialogComponent {
  saveDisabled:boolean=true;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: Resolution;
  filteredDutySlipListOptions: Observable<DutySlipDropDown[]>;
  public DutySlipList?: DutySlipDropDown[] = [];
  // public EmployeeList?: EmployeeDropDown[] = [];
  filteredIncidenceTypeListOptions: Observable<IncidenceTypeDropDown[]>;
  public IncidenceTypeList?: IncidenceTypeDropDown[] = [];
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]>
  public IssueCategoryList?: IssueCategoryDropDown[] = [];
  filteredIssueCategoryByOptionss: Observable<IssueCategoryDropDown[]>

  // public passengerList?: EmployeesDropDown[] = [];
  filteredPassengerOptions: Observable<EmployeesDropDown[]>;
  messageSubject: Subject<string> = new Subject<any>();
  reservationID: number;
  dutySlipID: any;
  assignedToEmployeeID: any;
  passengerID: any;
  CustomerPersonID: any;
  incidenceTypeID: any;
  issueCategoryID: any;
  customerPersonName: any;
  customerPersonID: any;
  customerName: any;
  customerID: any;
  driverID: any;
  driverName: any;
  registrationNumber: any;
  dispatchLocation: any;
  locationOutAddressString: any;
  inventoryID: any;
  organizationalEntityName: any;
  employeeDataSource: EmployeeDropDown[] | [];
  dispatchLocationID: any;
  transferedLocationID: any;
  primaryPassengerID: any;
  employeeID: any;
  dataSource: Resolution[] | null;
  incidenceID: any;
  closedByEmployeeID: any;

  responsibleType: string = '';
  driverList: any[] = [];
  SupplierList: any[] = [];
  EmployeeList: any[] = [];
  passengerList: any[] = [];
  showAutoComplete = false;

  filteredDebitTypeOptions: Observable<DebitTypeModel[]>;
  public DebitTypeList?: DebitTypeModel[] = [];
  // autoCompleteLabel: string = '';
  autoCompleteLabel1: string = 'Responsible1 Name';
  autoCompleteLabel2: string = 'Responsible2 Name';
  autoCompleteLabel3: string = 'Responsible3 Name';
  autoCompleteLabel4: string = 'Responsible4 Name';
  filteredOptions: any[] = [];
  employeeOptions: any[] = [];
  driverOptions: any[] = [];
  supplierOptions: any[] = [];
  passengerOptions: any[] = [];

  responsibleOptions: { value: string, label: string }[] = [
    { value: 'driver', label: 'Driver' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'employee', label: 'Employee' },
    { value: 'passenger', label: 'Passenger' }
  ];
  filteredResponsible1Options: Observable<any[]> = new Observable();
  supplierID: any;
  carVendor: any;
  debitTypeID: any;
  verifyDutyStatusAndCacellationStatus: string;
  isSaveAllowed: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<resolutionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ResolutionService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    // private authService: AuthService ,// Inject the AuthService

    public _generalService: GeneralService) {
    this.reservationID = data?.item.reservationID;
    this.dutySlipID = data?.item.dutySlipID;
    this.incidenceTypeID = data?.item.incidenceTypeID;
    this.issueCategoryID = data?.item.issueCategoryID;
    this.customerID = data?.item?.customerID;
    this.customerName = data?.item?.customerName;
    this.driverID = data?.item?.driverID;
    this.driverName = data?.item?.driverName;
    this.supplierID = data?.item?.supplierID;
    this.carVendor = data?.item?.carVendor;
    this.CustomerPersonID = data?.item?.passengerDetails[0]?.customerPersonID;
    this.customerPersonName = data?.item?.passengerDetails[0]?.customerPersonName;    
    this.customerID = data?.item?.customerID;
    this.registrationNumber = data?.item?.registrationNumber;
    this.inventoryID = data?.item?.inventoryID;
    this.customerPersonID = data?.item?.customerPersonID;
    this.organizationalEntityName = data?.item?.transferedLocation;
    this.transferedLocationID = data?.item?.transferedLocationID;
    this.incidenceID = data?.incidenceID;
    this.CustomerPersonID = data.CustomerPersonID;
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
    // Set the defaults
    this.action = data.action;
    console.log(this.action);
    if (this.action === 'edit') {
      this.dialogTitle = ' Incidence Resolution';
      this.advanceTable = data.advanceTable;
      if (this.dataSource && this.dataSource.length > 0) {
        let startDate = moment(this.dataSource[0]?.closureDate).format('DD/MM/yyyy');
        // let endDate = moment(this.advanceTable.closureDate).format('DD/MM/yyyy');
        this.onBlurStartDateEdit(startDate);
      }
    } else {
      this.dialogTitle = 'Resolution';
      this.advanceTable = new Resolution({});
      this.advanceTable.activationStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
    // if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
    // {
    //   this.isSaveAllowed = true;
    // } 
    // else
    // {
    //   this.isSaveAllowed = false;
    // }
              const status = (this.verifyDutyStatusAndCacellationStatus ?? '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z\s]/g, ''); // 👈 ye line important hai

this.isSaveAllowed = status === 'changes allow';
    }

  public ngOnInit(): void {
    this.advanceTableForm.patchValue({incidenceID: this.incidenceID});
    this.InitDriver();
    this.InitVendor();
    this.InitEmployee();
    this.InitDuty();
    this.InitPassenger()
    this.InitincidenceType();
    this.initIssueCategory();
    this.getOpenByEmployee();
    this.getClosedByEmployee();
    this.initCloseEmployee();
    this.InitDebitType();
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = new Date(now).toISOString();
    this.advanceTableForm.patchValue({
      reservationID: this.reservationID,
      customerName: this.customerName,
      registrationNumber: this.registrationNumber,
      driverName: this.driverName,
      dispatchLocation: this.organizationalEntityName,
      incidenceDate: currentDate,
      incidenceTime: currentTime,
      openDate: now,
      openTime: now,
      reportingDate: currentDate,
      reportingTime: currentTime,
      closureDate: currentDate,
      closureTime: currentTime
    });
    this.advanceTableForm.controls['openDate'].disable();
    this.advanceTableForm.controls['openTime'].disable();
    this.advanceTableForm.controls['reservationID'].disable();
    this.advanceTableForm.controls['customerName'].disable();
    this.advanceTableForm.controls['driverName'].disable();
    this.advanceTableForm.controls['registrationNumber'].disable();
    this.advanceTableForm.controls['dispatchLocation'].disable();
    this.advanceTableForm.controls['dutySlipNumber'].disable();
    this.advanceTableForm.controls['customerPersonName'].disable();
    this.advanceTableForm.controls['incidenceDate'].disable();
    this.advanceTableForm.controls['incidenceTime'].disable();
    this.advanceTableForm.controls['incidencePlace'].disable();
    this.advanceTableForm.controls['incidenceType'].disable();
    this.advanceTableForm.controls['issueCategory'].disable();
    this.advanceTableForm.controls['incidenceDetails'].disable();
    this.advanceTableForm.controls['reportingDate'].disable();
    this.advanceTableForm.controls['reportingTime'].disable();
    this.advanceTableForm.controls['reportedBy'].disable();
    this.advanceTableForm.controls['reporterName'].disable();
    this.advanceTableForm.controls['reportSource'].disable();
    this.advanceTableForm.controls['assignedToEmployeeName'].disable();
    this.advanceTableForm.controls['openedByEmployeeDepartment'].disable();
    this.advanceTableForm.controls['openDate'].disable();
    this.advanceTableForm.controls['openTime'].disable();
    this.loadData();
  }

  ngOnChanges(): void {
    this.InitEmployee();
    this.InitPassenger();
    this.InitDriver();
    this.InitVendor();
  }
  createContactForm(): FormGroup {
    return this.fb.group({
      userID: [this.advanceTable?.userID || ''],
      incidenceID: [this.advanceTable?.incidenceID || -1],
      dutySlipNumber: [this.advanceTable?.dutySlipNumber || ''],
      reservationID: [this.advanceTable?.reservationID],
      driverName: [this.advanceTable?.driverName || ''],
      locationOutAddressString: [this.advanceTable?.locationOutAddressString || ''],
      registrationNumber: [this.advanceTable?.registrationNumber || ''],
      incidenceDate: [null, Validators.required],
      incidenceTime: [null, Validators.required],
      incidencePlace: [this.advanceTable?.incidencePlace || ''],
      incidenceType: [this.advanceTable?.incidenceType || ''],
      issueCategory: [this.advanceTable?.issueCategory || ''],
      incidenceDetails: [this.advanceTable?.incidenceDetails || ''],
      reportingDate: [this.advanceTable?.reportingDate || null],
      reportingTime: [this.advanceTable?.reportingTime || null],
      reportedBy: [this.advanceTable?.reportedBy || ''],
      reporterName: [this.advanceTable?.reporterName || ''],
      reportSource: [this.advanceTable?.reportSource || ''],
      reportEvidenceDoc: [this.advanceTable?.reportEvidenceDoc || ''],
      assignedToEmployeeName: [this.advanceTable?.assignedToEmployeeName],
      assignedToEmployeeDepartment: [this.advanceTable?.assignedToEmployeeDepartment || ''],
      openedByEmployeeDepartment: [this.advanceTable?.openedByEmployeeDepartment || ''],
      openDate: [''],
      openTime: [''],
      customerName: [this.advanceTable?.customerName || ''],
      openedByEmployeeName: [this.advanceTable?.openedByEmployeeName || ''],
      dispatchLocation: [this.data?.item?.transferedLocation || ''],
      customerPersonName: [this.advanceTable?.customerPersonName || ''],
      closedByEmployeeID: [this.advanceTable?.closedByEmployeeID],
      rootCauseAnalysis: [this.advanceTable?.rootCauseAnalysis || ''],
      actionTaken: [this.advanceTable?.actionTaken || ''],
      closeByEmployeeName: [this.advanceTable?.closeByEmployeeName],
      closureComment: [this.advanceTable?.closureComment || ''],
      closureDate: [this.advanceTable?.closureDate],
      closureTime: [this.advanceTable?.closureTime],
      incidenceCategory: [this.advanceTable?.incidenceCategory || ''],
      incidenceEmailAcknowledged: [''],
      feedbackEmailAcknowledged: [''],
      responsible1Option: [''],
      responsible1Value: [''],
      responsible1ID: [''],
      responsible2Option: [''],
      responsible2Value: [''],
      responsible2ID: [''],
      responsible3Option: [''],
      responsible3Value: [''],
      responsible3ID: [''],
      responsible4Option: [''],
      responsible4Value: [''],
      responsible4ID: [''],
      followUpAction : [''],
      reminderDateForFollowUp : [''],
      debitTypeID : [''],
      debitType : [''],
      debitAmount : ['']
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
    //console.log(this.advanceTableForm.value);
  }
  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();

    }
    else if (this.action === 'edit') {
      this.dialogRef.close();
    }
  }
  public Put(): void {
    
    // console.log(this.
    // action, this.advanceTableForm.getRawValue());
    this.advanceTableForm.patchValue({incidenceID: this.incidenceID});
    let requestObject = this.advanceTableForm.getRawValue();
    ['responsible1', 'responsible2', 'responsible3', 'responsible4'].forEach((responsible, index) => {
      const option = this.advanceTableForm.get(`${responsible}Option`).value;
      const id = this.advanceTableForm.get(`${responsible}ID`).value;
      if (option) {
      requestObject[`Responsible${index + 1}`] = option;
      requestObject[`Responsible${index + 1}${option.charAt(0).toUpperCase() + option.slice(1)}ID`] = id;

      }
    });
    this.advanceTableService.update(requestObject)
      .subscribe(
        response => {
          // this.loadData();
          this.showNotification(
            'snackbar-success',
            'Resolution Update...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
          this.dialogRef.close(response);
        },
        error => {
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
  public confirmAdd(): void {
    this.saveDisabled = false;
    if (this.action == "edit") {
      this.Put();
    }
    // else {
    //   this.Post();
    // }
  }

  InitDuty() {
    this._generalService.GetDutySlip(this.reservationID).pipe(
      catchError(error => {
        console.error('Error fetching duty slip list:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.DutySlipList = Array.isArray(data) ? data : [];
      console.log('Duty Slip List:', this.DutySlipList);
      this.advanceTableForm.controls['dutySlipNumber'].setValidators([
        Validators.required,
        this.supplierTypeValidator(this.DutySlipList)
      ]);
      this.advanceTableForm.controls['dutySlipNumber'].updateValueAndValidity();

      // Populate autocomplete options
      this.filteredDutySlipListOptions = this.advanceTableForm.controls['dutySlipNumber'].valueChanges.pipe(
        startWith(''),
        map(value => this?._filtersearchSupplier(value || ''))
      );
    });

    //     this.DutySlipList = data;
    //     console.log('Duty Slip List:', this.DutySlipList);

    //     // Set validators and update form control
    //     this.advanceTableForm.controls['dutySlipNumber'].setValidators([
    //       Validators.required,
    //       this.supplierTypeValidator(this.DutySlipList),
    //     ]);
    //     this.advanceTableForm.controls['dutySlipNumber'].updateValueAndValidity();

    //     // Populate autocomplete options
    //     this.filteredDutySlipListOptions = this.advanceTableForm.controls['dutySlipNumber'].valueChanges.pipe(
    //       startWith(''),
    //       map(value => this._filtersearchSupplier(value || ''))
    //     );
    //   },
    //   error => {
    //     console.error('Error fetching duty slip list:', error);
    //   }
    // );
  }

  // Validator function
  supplierTypeValidator(dutySlipList: any[]): any {
    return (control: any) => {
      const isValid = dutySlipList.some(item => item.dutySlipID === control.value);
      return isValid ? null : { invalidDutySlip: true };
    };
  }

  // Filter function for autocomplete
  private _filtersearchSupplier(value: string): any[] {
    console.log('Filtering:', value);
    const filterValue = value;
    return this.DutySlipList.filter(option =>
      option.dutySlipID.toString().toLowerCase().includes(filterValue)
    );
  }

  // Handle selection from autocomplete
  OnSupplierSelect(selectedValue: any): void {
    console.log('Selected Duty Slip ID:', selectedValue);
  }

  // Additional method for handling click
  getdutySlipID(dutySlipID: number): void {
    console.log('Clicked Duty Slip ID:', dutySlipID);
  }

  //--------------- Employee Validator -----------
  employeeNameValidator(EmployeeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = EmployeeList.some(employee => (employee.firstName + ' ' + employee.lastName).toLowerCase() === value);
      return match ? null : { employeeNameInvalid: true };
    };
  }

  initCloseEmployee() {
    this._generalService.GetEmployeesForVehicleCategory().subscribe
      (

        data => {

          this.EmployeeList = data;
          // console.log( this.EmployeeList)
          this.advanceTableForm.controls['closeByEmployeeName']?.setValidators([Validators.required, this.employeeNameValidator(this.EmployeeList)
          ]);
          this.advanceTableForm.controls['closeByEmployeeName']?.updateValueAndValidity();
          this.filteredinstructedByOptionss = this.advanceTableForm.controls['closeByEmployeeName']?.valueChanges.pipe(
            startWith(""),
            map(value => this?._filtersearchinstructed(value || ''))
          );
        });
  }
  private _filtersearchinstructed(value: string): any {
    const filterValue = value.toLowerCase();
    return this.EmployeeList.filter(
      data => {
        //return data.firstName.toLowerCase().includes(filterValue);
        const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
        return fullName.includes(filterValue);
      });
  }
  OnEmployeeSelect(selectedEmployee: string) {
    const EmployeeName = this.EmployeeList.find(
      data => `${data.firstName} ${data.lastName}` === selectedEmployee
    );
    if (selectedEmployee) {
      this.getemployeeIDTitles(EmployeeName.employeeID);
    }
  }
  getemployeeIDTitles(employeeID: any) {
    // console.log(employeeID)
    this.closedByEmployeeID = employeeID;
    this.advanceTableForm.patchValue({ closedByEmployeeID: this.closedByEmployeeID });
  }

  initsPassenger() {
    {

      this._generalService.getPassenger(this.reservationID).subscribe

        (
          data => {
            this.passengerList = data;
            // console.log(this.passengerList)
            this.advanceTableForm.controls['customerPersonName'].setValidators([Validators.required,
            this.passengerValidator(this.passengerList)
            ]);
            this.advanceTableForm.controls['customerPersonName'].updateValueAndValidity();
            this.filteredPassengerOptions = this.advanceTableForm.controls['customerPersonName'].valueChanges.pipe(
              startWith(""),
              map(value => this._filterCategory(value || ''))
            );
          }
        );
    }
  }

  private _filterCategory(value: any): any {
    // console.log(typeof value, this.passengerList);
    const filterValue = value;
    return this.passengerList.filter(
      data => {
        const fullName = data?.customerPersonName;
        return fullName.includes(filterValue);
      });
  }

  onPassengerSelected(event: any) {
    const selectedPassenger = event.option.value;
    this.passengerID = selectedPassenger.primaryPassengerID;
    this.advanceTableForm.patchValue({ customerPersonName: selectedPassenger.customerPersonName });
    this.advanceTableForm.patchValue({ passengerID: selectedPassenger.primaryPassengerID });
    // console.log(selectedPassenger);
  }

  // getpassengerTitles(passengerID) {
  //   console.log(passengerID)
  //   // this.passengerID = passengerID
  //   // this.advanceTableForm.patchValue({ passengerID: this.passengerID })
  // }

  passengerValidator(passengerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Log control value and passenger list for debugging
      // console.log('Control Value:', control.value);
      // console.log('Passenger List:', passengerList);

      // Check if control.value is an object and handle accordingly
      let value: string | undefined = undefined;
      if (typeof control.value === 'object' && control.value?.customerPersonName) {
        value = control.value.customerPersonName.toLowerCase();
      } else if (typeof control.value === 'string') {
        value = control.value.toLowerCase();
      }

      // If value is undefined or empty, return an invalid state early
      if (!value) {
        return { passengerInvalid: true };
      }

      // Check if the value exists in the passengerList (ignoring case)
      const match = passengerList.some(group =>
        group.customerPersonName?.toLowerCase() === value
      );

      // Return validation result based on the match
      return match ? null : { passengerInvalid: true };
    };
  }

  InitincidenceType() {
    this._generalService.getIncidenceType().subscribe(
      data => {
        this.IncidenceTypeList = data;
        // console.log(this.IncidenceTypeList);
        this.advanceTableForm.controls['incidenceType'].setValidators([Validators.required,
        this.incidenceTypeValidator(this.IncidenceTypeList)
        ]);
        this.advanceTableForm.controls['incidenceType'].updateValueAndValidity();
        this.filteredIncidenceTypeListOptions = this.advanceTableForm.controls['incidenceType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterincidenceType(value || ''))
        );
      });
  }

  private _filterincidenceType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.IncidenceTypeList.filter(
      customer => {
        return customer.incidenceType.toString().toLowerCase().includes(filterValue);
      });
  }
  onincidenceTypeSelected(selectedincidenceType: string) {
    // console.log(selectedincidenceType);
    const selectedincidence = this.IncidenceTypeList.find(
      data => data.incidenceType === selectedincidenceType
    );

    if (selectedincidence) {
      this.getincidencetypeID(selectedincidence.incidenceTypeID);
    }
  }

  getincidencetypeID(incidenceTypeID: any) {
    this.incidenceTypeID = incidenceTypeID;
    this.advanceTableForm.patchValue({ incidenceTypeID: this.incidenceTypeID });
  }

  incidenceTypeValidator(IncidenceTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = IncidenceTypeList.some(group => group.incidenceType.toLowerCase() === value);
      return match ? null : { incidenceTypeInvalid: true };
    };
  }

  initIssueCategory() {
    this._generalService.getIssueCategory().subscribe(
      data => {
        this.IssueCategoryList = data;
        // console.log(this.IssueCategoryList);
        this.advanceTableForm.controls['issueCategory'].setValidators([Validators.required,
        this.IssueCategoryValidator(this.IssueCategoryList)
        ]);
        this.advanceTableForm.controls['issueCategory'].updateValueAndValidity();
        this.filteredIssueCategoryByOptionss = this.advanceTableForm.controls['issueCategory'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterIssueCategory(value || ''))
        );
      });
  }

  private _filterIssueCategory(value: string): any {
    const filterValue = value.toLowerCase();
    return this.IssueCategoryList.filter(
      customer => {
        return customer.issueCategory.toString().toLowerCase().includes(filterValue);
      });
  }
  onIssueCategorySelected(selectedIssueCategory: string) {
    const selectedCategory = this.IssueCategoryList.find(
      data => data.issueCategory === selectedIssueCategory
    );

    if (selectedCategory) {
      this.getIssueCategoryID(selectedCategory.issueCategoryID);
    }
  }
  getIssueCategoryID(issueCategoryID) {
    this.issueCategoryID = issueCategoryID;
    this.advanceTableForm.patchValue({ issueCategoryID: this.issueCategoryID });
  }

  IssueCategoryValidator(IssueCategoryList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = IssueCategoryList.some(group => group.issueCategory.toLowerCase() === value);
      return match ? null : { issueCategoryInvalid: true };
    };
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string;
  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({ reportEvidenceDoc: this.ImagePath })
  }

  // //start date
  // onBlurSEZStartDate(value: string): void {
  //   value = this._generalService.resetDateiflessthan12(value);
  //   const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  //   if (validDate) {
  //     const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  //     this.advanceTableForm.get('closureDate')?.setValue(formattedDate);
  //   }
  //   else {
  //     this.advanceTableForm.get('closureDate')?.setErrors({ invalidDate: true });
  //   }
  // }

  // onBlurStartDateEdit(value: string): void {
  //   const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  //   if (validDate) {
  //     const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  //     const closureDateControl = this.advanceTableForm?.get('closureDate');
  //     if (this.action === 'edit' && closureDateControl) {
  //       this.advanceTable.closureDate = formattedDate;
  //     }
  //     else if (closureDateControl) {
  //       this.advanceTableForm.get('closureDate')?.setValue(formattedDate);
  //     }
  //   }
  //   else {
  //     this.advanceTableForm.get('closureDate')?.setErrors({ invalidDate: true });
  //   }
  // }

  //start date
  onBlurSEZStartDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);    
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('closureDate')?.setValue(formattedDate);    
    }
    else
    {
      this.advanceTableForm.get('closureDate')?.setErrors({ invalidDate: true });
    }
  }
            
  onBlurStartDateEdit(value: string): void {  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) 
    {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if(this.action==='edit')
      {
        this.advanceTable.closureDate=formattedDate
      }
      else
      {
        this.advanceTableForm.get('closureDate')?.setValue(formattedDate);
      }  
    } 
    else 
    {
      this.advanceTableForm.get('closureDate')?.setErrors({ invalidDate: true });
    }
  }

  //Report date
  onBlurreportingDate(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('reportingDate')?.setValue(formattedDate);
    }
    else {
      this.advanceTableForm.get('reportingDate')?.setErrors({ invalidDate: true });
    }
  }

  onBlurreportingDateEdit(value: string): void {
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    const reportingDateControl = this.advanceTableForm?.get('incidenceDate');
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if (this.action === 'edit' && reportingDateControl) {
        this.advanceTable.reportingDate = formattedDate
      }
      else if (reportingDateControl) {
        this.advanceTableForm.get('reportingDate')?.setValue(formattedDate);
      }
    }
    else {
      this.advanceTableForm.get('reportingDate')?.setErrors({ invalidDate: true });
    }
  }
  onreportingTimeInput(event: any): void {
    const inputValue = event.target.value;

    // Attempt to parse the input as a valid time
    const parsedTime = new Date(`1970-01-01T${inputValue}`);

    // Check if the parsedTime is valid
    if (!isNaN(parsedTime.getTime())) {
      this.advanceTableForm.get('reportingTime').setValue(parsedTime);
    }
  }

  onEndTimeInput(event: any): void {
    const inputValue = event.target.value;

    // Attempt to parse the input as a valid time
    const parsedTime = new Date(`1970-01-01T${inputValue}`);

    // Check if the parsedTime is valid
    if (!isNaN(parsedTime.getTime())) {
      this.advanceTableForm.get('closureTime').setValue(parsedTime);
    }
  }

  getOpenByEmployee() {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data => {
        this.employeeDataSource = data;
        this.advanceTableForm.controls["openedByEmployeeName"].disable();
        this.advanceTableForm.patchValue({ openedByEmployeeName: this.employeeDataSource[0].firstName + " " + this.employeeDataSource[0].lastName });
        this.advanceTableForm.patchValue({ openedByEmployeeID: this.employeeDataSource[0].employeeID });
        this.advanceTableForm.controls["openedByEmployeeName"].disable();
        this.advanceTableForm.patchValue({ openedByEmployeeName: this.employeeDataSource[0].firstName + " " + this.employeeDataSource[0].lastName });
        this.advanceTableForm.patchValue({ openedByEmployeeID: this.employeeDataSource[0].employeeID });

      });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public loadData() {
    this.advanceTableService.getTableData(this.reservationID, true, 0).subscribe
      (
        data => {
          this.dataSource = data;
          if(this.dataSource && this.dataSource.length > 0) {
            console.log(this.dataSource[0]);
            this.advanceTableForm.patchValue({ reservationID: this.dataSource[0]?.reservationID });
            this.advanceTableForm.patchValue({
              incidenceDate
                : this.dataSource[0]?.incidenceDate
            });
            this.advanceTableForm.patchValue({ dutySlipNumber: this.dataSource[0]?.dutySlipID });
            this.advanceTableForm.patchValue({ customerPersonName: this.dataSource[0]?.customerPersonName });
            this.advanceTableForm.patchValue({ incidenceTime: this.dataSource[0]?.incidenceTime });
            this.advanceTableForm.patchValue({ openedByEmployeeDepartment: this.dataSource[0]?.openedByEmployeeDepartment });
            this.advanceTableForm.patchValue({ reportSource: this.dataSource[0]?.reportSource });
            this.advanceTableForm.patchValue({ reportedBy: this.dataSource[0]?.reportedBy });
            this.advanceTableForm.patchValue({ incidencePlace: this.dataSource[0]?.incidencePlace });
            this.advanceTableForm.patchValue({ openDate: this.dataSource[0]?.openDate });
            this.advanceTableForm.patchValue({ openTime: this.dataSource[0]?.openTime });
            this.advanceTableForm.patchValue({ reportingDate: this.dataSource[0]?.reportingDate });
            this.advanceTableForm.patchValue({ reportingTime: this.dataSource[0]?.reportingTime });
            this.advanceTableForm.patchValue({ assignedToEmployeeName: this.dataSource[0]?.assignedToEmployeeName });
            this.advanceTableForm.patchValue({ assignedToEmployeeDepartment: this.dataSource[0]?.assignedToEmployeeDepartment });
            this.advanceTableForm.patchValue({ reporterName: this.dataSource[0]?.reporterName });
            this.advanceTableForm.patchValue({ incidenceDetails: this.dataSource[0]?.incidenceDetails });
            this.advanceTableForm.patchValue({ incidenceType: this.dataSource[0]?.incidenceType });
            this.advanceTableForm.patchValue({ issueCategory: this.dataSource[0]?.issueCategory });
            this.advanceTableForm.patchValue({ reportEvidenceDoc: this.dataSource[0]?.reportEvidenceDoc });
            this.advanceTableForm.patchValue({ issueCategory: this.dataSource[0]?.issueCategory });
            this.advanceTableForm.patchValue({ rootCauseAnalysis: this.dataSource[0]?.rootCauseAnalysis });
            this.advanceTableForm.patchValue({ actionTaken: this.dataSource[0]?.actionTaken });
            this.advanceTableForm.patchValue({ closedByEmployeeID: this.dataSource[0]?.closedByEmployeeID });
            this.advanceTableForm.patchValue({ closureComment: this.dataSource[0]?.closureComment });
            this.advanceTableForm.patchValue({ closureDate: this.dataSource[0]?.closureDate });
            this.advanceTableForm.patchValue({ closureTime: this.dataSource[0]?.closureTime });
            this.advanceTableForm.patchValue({ feedbackEmailAcknowledged: this.dataSource[0]?.feedbackEmailAcknowledged });
            this.advanceTableForm.patchValue({ incidenceEmailAcknowledged: this.dataSource[0]?.incidenceEmailAcknowledged });
            this.advanceTableForm.patchValue({ incidenceCategory: this.dataSource[0]?.incidenceCategory });
            this.advanceTableForm.patchValue({ closeByEmployeeName: this.dataSource[0]?.closeByEmployeeName });
            this.advanceTableForm.patchValue({ followUpAction: this.dataSource[0]?.followUpAction });
            this.advanceTableForm.patchValue({ reminderDateForFollowUp: this.dataSource[0]?.reminderDateForFollowUp });
            this.advanceTableForm.patchValue({ debitTypeID: this.dataSource[0]?.debitTypeID });
            this.advanceTableForm.patchValue({ debitType: this.dataSource[0]?.debitType });
            this.advanceTableForm.patchValue({ debitAmount: this.dataSource[0]?.debitAmount });

            this.onResponsibleChange(1, this.dataSource[0]?.responsible1);
            this.onResponsibleChange(2, this.dataSource[0]?.responsible2);
            this.onResponsibleChange(3, this.dataSource[0]?.responsible3);
            this.onResponsibleChange(4, this.dataSource[0]?.responsible4);
            this.ImagePath = this.dataSource[0].reportEvidenceDoc;
          }
        },

        (error: HttpErrorResponse) => {
          console.error('Error fetching data:', error);
          this.dataSource = [];  // Set to empty array to avoid null/undefined errors
        }
      );
    //  this.tripBackAttachmentloadData();
  }

  // Fetch the list of drivers
  InitDriver() {
    this._generalService.GetDriver().subscribe(data => {
      this.driverOptions = data.map(driver => ({
        name: driver.driverName,
        id: driver.driverID
      }));
    });
  }

  // Fetch the list of vendors
  InitVendor() {
    this._generalService.GetAllSuppliers().subscribe(data => {
      this.supplierOptions = data.map(vendor => ({
        name: vendor.supplierName,
        id: vendor.supplierID
      }));
    });
  }

  // Fetch the list of employees
  InitEmployee() {
    this._generalService.GetEmployeesForVehicleCategory().subscribe(data => {
      this.employeeOptions = data.map(employee => ({
        name: `${employee.firstName} ${employee.lastName}`,
        id: employee.employeeID
      }));
    });
  }

  // Fetch the list of passengers
  InitPassenger() {
    this._generalService.GetCPForPassengerInCPSearch().subscribe(data => {

      this.passengerOptions = data.map(passenger => ({
        name: passenger.customerPersonName,
        id: passenger.customerPersonID
      }));
    });
  }

  onResponsibleChange(responsibleNumber: number, selectedValue: string): void {
    // Reset corresponding responsible fields
    this.advanceTableForm.controls[`responsible${responsibleNumber}Option`].setValue(selectedValue);
    this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue('');
    this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue('');
    let recordData = {};
    if(this.dataSource && this.dataSource.length > 0) {
      recordData = this.dataSource[0];
    }
    const dataSourceDriverKey = `responsible${responsibleNumber}DriverID`;
    const dataSourceVendorrKey = `responsible${responsibleNumber}VendorID`;
    const dataSourceEmployeeKey = `responsible${responsibleNumber}EmployeeID`;
    const dataSourceCustomerPersonKey = `responsible${responsibleNumber}CustomerPersonID`;
    const dataSourceGuestKey = `responsible${responsibleNumber}responsible4GuestID`;
    switch (selectedValue) {
      case 'driver':
        this[`showAutoComplete${responsibleNumber}`] = true;
        this[`autoCompleteLabel${responsibleNumber}`] = `Select Driver ${responsibleNumber}`;
        this[`filteredOptions${responsibleNumber}`] = this.driverOptions;
        if(recordData && recordData[dataSourceDriverKey] != 0) {
          const defaultDriver = this.driverOptions.find(driver => driver.id === recordData[dataSourceDriverKey]);
          if(defaultDriver) {
            this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(defaultDriver?.name);
            this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(defaultDriver?.id);
          } 
        } else if(this.driverID && this.driverName){
          const defaultDriver = this.driverOptions.find(driver => driver.id === this.driverID);
          this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(defaultDriver?.name);
          this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(defaultDriver?.id);
        }
        break;
      case 'vendor':
        this[`showAutoComplete${responsibleNumber}`] = true;
        this[`autoCompleteLabel${responsibleNumber}`] = `Select Vendor ${responsibleNumber}`;
        this[`filteredOptions${responsibleNumber}`] = this.supplierOptions;
        console.log(this.supplierOptions)
        if(recordData && recordData[dataSourceVendorrKey] != 0) {
          const defaultVendor = this.supplierOptions.find(supplier => supplier.id === recordData[dataSourceVendorrKey]);
          if(defaultVendor) {
            this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(defaultVendor?.name);
            this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(defaultVendor?.id);
          } 
        }
          else if(this.supplierID && this.carVendor){
            const defaultVendor = this.supplierOptions.find(supplier => supplier.id ===this.supplierID);
            this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(this.carVendor);
            this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(defaultVendor?.id);
          
        }
        break;
      case 'employee':
        this[`showAutoComplete${responsibleNumber}`] = true;
        this[`autoCompleteLabel${responsibleNumber}`] = `Select Employee ${responsibleNumber}`;
        this[`filteredOptions${responsibleNumber}`] = this.employeeOptions;
        console.log(this.employeeOptions)
        if(recordData && recordData[dataSourceEmployeeKey] != 0) {
          const defaultEmployee = this.employeeOptions.find(emp => emp.id === recordData[dataSourceEmployeeKey]);
          if(defaultEmployee) {
            this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(defaultEmployee?.name);
            this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(defaultEmployee?.id);
          }
        }
        break;
      case 'guest':
        console.log(this.CustomerPersonID, this.customerPersonName);
        this[`showAutoComplete${responsibleNumber}`] = true;
        this[`autoCompleteLabel${responsibleNumber}`] = `Select Passenger ${responsibleNumber}`;
        this[`filteredOptions${responsibleNumber}`] = this.passengerOptions;
        if(recordData && recordData[dataSourceCustomerPersonKey] != 0) {
          const defaultPassenger= this.passengerOptions.find(passenger => passenger.id === recordData[dataSourceCustomerPersonKey]);
          if(defaultPassenger) {
            this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(defaultPassenger?.name);
            this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(defaultPassenger?.id);
          }
        } else if(this.CustomerPersonID && this.customerPersonName){
          const defaultPassenger= this.passengerOptions.find(passenger => passenger.id ===this.CustomerPersonID);
          this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(this.customerPersonName);
          this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(defaultPassenger?.id);
        }
        break;
      default:
        this[`showAutoComplete${responsibleNumber}`] = false;
        break;
    }
  }
  
  onAutoCompleteSelect(responsibleNumber: number, event: any): void {
    const optionObject = event.option.value;
    this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(optionObject.name);
    this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(optionObject.id);
  }

   ///----For Image
 openImageInNewTab(imageUrl: string) {
  window.open(imageUrl, '_blank');
}

onBlurUpdateDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm?.get('reminderDateForFollowUp')?.setValue(formattedDate);    
} else {
  this.advanceTableForm?.get('reminderDateForFollowUp')?.setErrors({ invalidDate: true });
}
}



InitDebitType(){
    this._generalService.GetDebitTypes().subscribe(
      data=>
      {
        this.DebitTypeList=data;
        this.advanceTableForm.controls['debitType'].setValidators([Validators.required,
          this.DebitTypeValidator(this.DebitTypeList)]);
        this.advanceTableForm.controls['debitType'].updateValueAndValidity();
        this.filteredDebitTypeOptions = this.advanceTableForm.controls['debitType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value || ''))
        ); 
      });
  }
  
  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DebitTypeList.filter(
      customer => 
      {
        return customer.debitType.toLowerCase().includes(filterValue);
      });
  }
  OnDebitTypeSelect(selectedDebitType: string)
  {
    const DebitTypeName = this.DebitTypeList.find(
      data => data.debitType === selectedDebitType
    );
    if (selectedDebitType) 
    {
      this.getTitles(DebitTypeName.debitTypeID,DebitTypeName.debitTypeAmount);
    }
  }  
  getTitles(debitTypeID: any,amount : any)
 {
    this.debitTypeID=debitTypeID;
    this.advanceTableForm.patchValue({debitTypeID :this.debitTypeID});
    this.advanceTableForm.patchValue({debitAmount :amount});
  }

  //-------------- Vehicle Category Validator -------------
  DebitTypeValidator(DebitTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = DebitTypeList.some(group => group.debitType.toLowerCase() === value);
      return match ? null : { debitTypeInvalid: true };
    };
  }


  getClosedByEmployee() {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data => {
        this.employeeDataSource = data;
        this.advanceTableForm.controls["closeByEmployeeName"].disable();
        this.advanceTableForm.controls["closureDate"].disable();
        this.advanceTableForm.controls["closureTime"].disable();
        this.advanceTableForm.patchValue({ closeByEmployeeName: this.employeeDataSource[0].firstName + " " + this.employeeDataSource[0].lastName });
        this.advanceTableForm.patchValue({ closeByEmployeeID: this.employeeDataSource[0].employeeID });

      });
  }
}



