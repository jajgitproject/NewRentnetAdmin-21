// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { ResolutionService } from '../../resolution.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Resolution } from '../../resolution.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable, of, Subject } from 'rxjs';
import { DutySlipDropDown } from '../../dutySlipDropDown.model';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { EmployeesDropDown } from 'src/app/feedBack/employeeDropDown.model';
import { ActivatedRoute } from '@angular/router';
import { IncidenceTypeDropDown } from 'src/app/incidenceType/incidenceTypeDropDown.model';
import { IssueCategoryDropDown } from 'src/app/issueCategory/issueCategoryDropDown.model';
import { AuthService } from 'src/app/core/service/auth.service';
import moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ControlPanelDesignService } from '../../../controlPanelDesign/controlPanelDesign.service';
import { DebitService } from '../../../debit/debit.service';

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
  filteredDutySlipListOptions: Observable<DutySlipDropDown[]> = of([]);
  public DutySlipList?: DutySlipDropDown[] = [];
  // public EmployeeList?: EmployeeDropDown[] = [];
  filteredIncidenceTypeListOptions: Observable<IncidenceTypeDropDown[]> = of([]);
  public IncidenceTypeList?: IncidenceTypeDropDown[] = [];
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]> = of([]);
  public IssueCategoryList?: IssueCategoryDropDown[] = [];
  filteredIssueCategoryByOptionss: Observable<IssueCategoryDropDown[]> = of([]);

  // public passengerList?: EmployeesDropDown[] = [];
  filteredPassengerOptions: Observable<EmployeesDropDown[]> = of([]);
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

  // autoCompleteLabel: string = '';
  autoCompleteLabel1: string = 'Responsible1 Name';
  autoCompleteLabel2: string = 'Responsible2 Name';
  autoCompleteLabel3: string = 'Responsible3 Name';
  autoCompleteLabel4: string = 'Responsible4 Name';
  filteredOptions: any[] = [];
  filteredOptions1: any[] = [];
  filteredOptions2: any[] = [];
  filteredOptions3: any[] = [];
  filteredOptions4: any[] = [];
  employeeOptions: any[] = [];
  driverOptions: any[] = [];
  supplierOptions: any[] = [];
  passengerOptions: any[] = [];
  /** autocomplete | select | none — controls the value UI for Responsible 1-4 */
  responsibleValueMode1: 'autocomplete' | 'select' | 'none' = 'none';
  responsibleValueMode2: 'autocomplete' | 'select' | 'none' = 'none';
  responsibleValueMode3: 'autocomplete' | 'select' | 'none' = 'none';
  responsibleValueMode4: 'autocomplete' | 'select' | 'none' = 'none';
  displayResponsibleFn = (option: any): string => {
    if (option == null || option === '') {
      return '';
    }
    return typeof option === 'string' ? option : (option.name || '');
  };

  responsibleOptions: { value: string, label: string }[] = [
    { value: 'driver', label: 'Driver' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'employee', label: 'Employee' },
    { value: 'guest', label: 'Guest' },
    { value: 'none', label: 'None' }
  ];
  filteredResponsible1Options: Observable<any[]> = new Observable();
  supplierID: any;
  carVendor: any;
  incidenceDebitID = 0;
  hasActiveIncidenceDebit = false;
  debitRemoveInProgress = false;
  debitTypeOptions: any[] = [];
  verifyDutyStatusAndCacellationStatus: string;
  isSaveAllowed: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<resolutionFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ResolutionService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private controlPanelService: ControlPanelDesignService,
    // private authService: AuthService ,// Inject the AuthService

    private debitService: DebitService,
    public _generalService: GeneralService) {
    this.reservationID = data?.reservationID || data?.item?.reservationID;
this.dutySlipID = data?.dutySlipID || data?.item?.dutySlipID;
this.incidenceTypeID = data?.item?.incidenceTypeID;
this.issueCategoryID = data?.item?.issueCategoryID;

this.customerID = data?.customerID || data?.item?.customerID;
this.customerName = data?.customerName || data?.item?.customerName;

const advanceRow = data?.advanceTable || {};
this.driverID =
  data?.driverID ||
  advanceRow.driverID ||
  data?.item?.driverID;
this.driverName =
  data?.driverName ||
  advanceRow.driverName ||
  data?.item?.driverName ||
  data?.item?.DriverName;

this.supplierID =
  data?.supplierID ||
  advanceRow.supplierID ||
  advanceRow.inventorySupplierID ||
  data?.item?.supplierID ||
  data?.item?.inventorySupplierID;
this.carVendor =
  data?.item?.carVendor ||
  data?.item?.supplierName ||
  data?.item?.SupplierName;

this.registrationNumber =
  data?.registrationNumber ||
  advanceRow.registrationNumber ||
  data?.item?.registrationNumber;
this.inventoryID =
  data?.inventoryID ||
  advanceRow.inventoryID ||
  data?.item?.inventoryID;
this.dispatchLocationID =
  advanceRow.dispatchLocationID || data?.item?.dispatchLocationID;

this.organizationalEntityName =
    data?.organizationalEntityName ||
    data?.item?.transferedLocation ||
    data?.item?.organizationalEntityName;

this.transferedLocationID =
  data?.transferedLocationID ||
  data?.item?.transferedLocationID ||
  advanceRow.transferedLocationID ||
  advanceRow.dispatchLocationID ||
  data?.item?.serviceLocationID;

this.incidenceID =
    data?.incidenceID ||
    advanceRow.incidenceID ||
    data?.item?.incidenceID;

this.CustomerPersonID =
    data?.customerPersonID ||
    data?.item?.primaryPassengerID ||
    data?.item?.passengerID ||
    data?.item?.customerPersonID ||
    data?.item?.passengerDetails?.[0]?.customerPersonID;

this.customerPersonName =
    data?.customerPersonName ||
    data?.item?.primaryPassenger ||
    data?.item?.customerPersonName ||
    data?.item?.passengerDetails?.[0]?.customerPersonName;

this.verifyDutyStatusAndCacellationStatus =
    data?.verifyDutyStatusAndCacellationStatus;

this.action = data?.action;
   if (this.action === 'edit') {

  this.dialogTitle = 'Incidence Resolution';

  // Prefer incidence row; `item` is often reservation context from /incidence.
  this.advanceTable = data.advanceTable || data.item || {};

}
else {

  this.dialogTitle = 'Resolution';

  this.advanceTable = new Resolution({});

  this.advanceTable.activationStatus = true;
}
    this.advanceTableForm = this.createContactForm();

    // Run after form exists — calling this before createContactForm crashes.
    if (this.action === 'edit' && this.advanceTable?.closureDate) {
      const closureDate = moment(this.advanceTable.closureDate).format('DD/MM/YYYY');
      this.onBlurStartDateEdit(closureDate);
    }
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

//this.isSaveAllowed = status === 'changes allow';
    }

  public ngOnInit(): void {
    this.advanceTableForm.patchValue({incidenceID: this.incidenceID});
    this.loadReservationContextIfMissing();
    // Driver/Vendor/Employee lists are prefix-searched on demand (3+ chars).
    // Guests are loaded for the reservation dropdown.
    this.InitPassenger();
    this.InitDuty();
    this.InitincidenceType();
    this.initIssueCategory();
    this.getOpenByEmployee();
    this.getClosedByEmployee();
    this.initCloseEmployee();
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = new Date(now).toISOString();
    this.advanceTableForm.patchValue({
      reservationID: this.reservationID,
      incidenceIDt:this.incidenceID,
      dutySlipID: this.dutySlipID,
      customerName: this.customerName,
      registrationNumber: this.registrationNumber,
      customerPersonName: this.customerPersonName,
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
    const summaryFallback = this.getIncidenceSummaryFallback();
    if (summaryFallback) {
      this.dataSource = [summaryFallback];
    }
    this.loadData();
    this.initIncidenceDebitTypes();
  }

  ngOnChanges(): void {
    this.InitPassenger();
  }
  createContactForm(): FormGroup {
    return this.fb.group({
      userID: [this.advanceTable?.userID || ''],
      incidenceID: [this.advanceTable?.incidenceID || -1],
      dutySlipNumber: [this.advanceTable?.dutySlipNumber || 0],
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
      responsible1ID: [0 || ''],
      responsible2Option: [''],
      responsible2Value: [''],
      responsible2ID: [0 || ''],
      responsible3Option: [''],
      responsible3Value: [''],
      responsible3ID: [0 || ''],
      responsible4Option: [''],
      responsible4Value: [''],
      responsible4ID: [0 || ''],
      followUpAction : [''],
      reminderDateForFollowUp : [''],
      debitTypeID: [''],
      debitAmount: [''],
      debitNarration: ['', Validators.maxLength(500)],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
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
    this.advanceTableForm.patchValue({incidenceID: this.incidenceID});
    const rawBeforeSave = this.advanceTableForm.getRawValue();
    if (this.shouldSaveIncidenceDebit()) {
      const debitValidation = this.validateDebitSectionForSave(rawBeforeSave);
      if (debitValidation) {
        this.showNotification('snackbar-danger', debitValidation, 'bottom', 'center');
        this.saveDisabled = true;
        return;
      }
    }

    let requestObject = rawBeforeSave;
    ['responsible1', 'responsible2', 'responsible3', 'responsible4'].forEach((responsible, index) => {
      const option = this.advanceTableForm.get(`${responsible}Option`).value;
      const id = this.advanceTableForm.get(`${responsible}ID`).value;
      if (option) {
        requestObject[`Responsible${index + 1}`] = option;
        if (option === 'guest' || option === 'passenger') {
          requestObject[`Responsible${index + 1}GuestID`] = id;
          requestObject[`responsible${index + 1}CustomerPersonID`] = id;
        } else {
          requestObject[`Responsible${index + 1}${option.charAt(0).toUpperCase() + option.slice(1)}ID`] = id;
        }
      }
    });
    this.advanceTableService.update(requestObject)
      .subscribe(
        response => {
          if (!this.shouldSaveIncidenceDebit()) {
            this.showNotification(
              'snackbar-success',
              'Resolution Update...!!!',
              'bottom',
              'center'
            );
            this.saveDisabled = true;
            this.dialogRef.close(response);
            return;
          }

          this.saveIncidenceDebit(
            () => {
              this.showNotification(
                'snackbar-success',
                'Resolution and driver debit saved.',
                'bottom',
                'center'
              );
              this.saveDisabled = true;
              this.dialogRef.close(response);
            },
            (debitMessage) => {
              const msg =
                typeof debitMessage === 'string' && debitMessage.trim()
                  ? debitMessage
                  : 'Resolution saved but driver debit failed.';
              this.showNotification('snackbar-danger', msg, 'bottom', 'center');
              this.saveDisabled = true;
            }
          );
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
    const filterValue = value;
    return this.DutySlipList.filter(option =>
      option.dutySlipID.toString().toLowerCase().includes(filterValue)
    );
  }

  // Handle selection from autocomplete
  OnSupplierSelect(selectedValue: any): void {
  }

  // Additional method for handling click
  getdutySlipID(dutySlipID: number): void {
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
    this.closedByEmployeeID = employeeID;
    this.advanceTableForm.patchValue({ closedByEmployeeID: this.closedByEmployeeID });
  }

  initsPassenger() {
    {

      this._generalService.getPassenger(this.reservationID).subscribe

        (
          data => {
            this.passengerList = data;
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
  }

  // getpassengerTitles(passengerID) {
  //   // this.passengerID = passengerID
  //   // this.advanceTableForm.patchValue({ passengerID: this.passengerID })
  // }

  passengerValidator(passengerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Log control value and passenger list for debugging

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
        this.employeeDataSource = Array.isArray(data) ? data : [];
        if (!this.employeeDataSource.length) {
          return;
        }
        const emp = this.employeeDataSource[0];
        this.advanceTableForm.patchValue({
          openedByEmployeeName: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
          openedByEmployeeID: emp.employeeID,
        });
        this.advanceTableForm.controls['openedByEmployeeName']?.disable();
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

  /** Row for the read-only summary card when API data is not ready yet. */
  private getIncidenceSummaryFallback(): any | null {
    const fromAdvance =
      this.data?.advanceTable?.incidenceID != null
        ? this.data.advanceTable
        : null;
    const fromItem =
      this.data?.item?.incidenceID != null ? this.data.item : null;
    const base =
      fromAdvance ||
      fromItem ||
      (this.incidenceID ? { incidenceID: this.incidenceID } : null);

    if (!base) {
      return null;
    }

    return {
      ...base,
      incidenceID: base.incidenceID ?? this.incidenceID,
      reservationID: base.reservationID || this.reservationID,
      dutySlipID: base.dutySlipID || this.dutySlipID,
      driverID: base.driverID || this.driverID,
      supplierID: base.supplierID || this.supplierID,
      inventoryID: base.inventoryID || this.inventoryID,
      dispatchLocationID:
        base.dispatchLocationID ||
        this.dispatchLocationID ||
        this.transferedLocationID,
      transferedLocationID:
        base.transferedLocationID ||
        this.transferedLocationID ||
        base.dispatchLocationID,
      customerName: base.customerName || this.customerName,
      customerPersonName: base.customerPersonName || this.customerPersonName,
      registrationNumber: base.registrationNumber || this.registrationNumber,
      driverName: base.driverName || this.driverName,
    };
  }

  public loadData() {
    const targetIncidenceID =
      this.incidenceID ||
      this.data?.incidenceID ||
      this.advanceTable?.incidenceID;

    if (!targetIncidenceID) {
      this.showNotification(
        'snackbar-danger',
        'Incidence ID is required to open resolution.',
        'bottom',
        'center'
      );
      return;
    }

    this.reservationID = this.pickPositiveInt(
      this.reservationID,
      this.data?.reservationID,
      this.data?.advanceTable?.reservationID,
      this.data?.advanceTable?.ReservationID,
      this.data?.item?.reservationID,
      this.data?.item?.ReservationID
    );

    if (!this.reservationID) {
      const fallback = this.getIncidenceSummaryFallback();
      if (fallback) {
        this.dataSource = [fallback];
        this.patchResolutionFromRow(fallback);
      }
      this.loadIncidenceDebitForIncidence();
      return;
    }

    this.advanceTableService.getTableData(this.reservationID, true, 0).subscribe
      (
        data => {
          const rows = Array.isArray(data) ? data : [];
          if (!rows.length) {
            const fallback = this.getIncidenceSummaryFallback();
            if (fallback) {
              this.dataSource = [fallback];
              this.patchResolutionFromRow(fallback);
            } else {
              this.dataSource = [];
            }
            return;
          }

          const selected =
            rows.find(
              (row) => Number(row.incidenceID) === Number(targetIncidenceID)
            ) || null;

          if (!selected) {
            this.showNotification(
              'snackbar-danger',
              'Selected incidence was not found for this reservation.',
              'bottom',
              'center'
            );
            const fallback = this.getIncidenceSummaryFallback();
            if (fallback) {
              this.dataSource = [fallback];
              this.patchResolutionFromRow(fallback);
            } else {
              this.dataSource = rows;
            }
            return;
          }

          // Template still binds dataSource[0] — put selected first.
          this.dataSource = [selected, ...rows.filter(
            (row) => Number(row.incidenceID) !== Number(selected.incidenceID)
          )];
          this.patchResolutionFromRow(selected);
        },

        (error: HttpErrorResponse) => {
          console.error('Error fetching data:', error);
          const fallback = this.getIncidenceSummaryFallback();
          if (fallback) {
            this.dataSource = [fallback];
            this.patchResolutionFromRow(fallback);
          } else {
            this.dataSource = [];
          }
        }
      );
    //  this.tripBackAttachmentloadData();
  }

  private patchResolutionFromRow(selected: any): void {
    if (!selected) {
      return;
    }

    this.incidenceID = selected.incidenceID;
    this.advanceTableForm.patchValue({ incidenceID: selected.incidenceID });
    this.advanceTableForm.patchValue({ reservationID: selected?.reservationID || this.reservationID });
    this.advanceTableForm.patchValue({
      incidenceDate: selected?.incidenceDate
    });
    this.advanceTableForm.patchValue({ dutySlipNumber: selected?.dutySlipID });
    this.advanceTableForm.patchValue({ customerPersonName: selected?.customerPersonName || this.customerPersonName });
    this.advanceTableForm.patchValue({ incidenceTime: selected?.incidenceTime });
    this.advanceTableForm.patchValue({ openedByEmployeeDepartment: selected?.openedByEmployeeDepartment });
    this.advanceTableForm.patchValue({ reportSource: selected?.reportSource });
    this.advanceTableForm.patchValue({ reportedBy: selected?.reportedBy });
    this.advanceTableForm.patchValue({ incidencePlace: selected?.incidencePlace });
    this.advanceTableForm.patchValue({ openDate: selected?.openDate });
    this.advanceTableForm.patchValue({ openTime: selected?.openTime });
    this.advanceTableForm.patchValue({ reportingDate: selected?.reportingDate });
    this.advanceTableForm.patchValue({ reportingTime: selected?.reportingTime });
    this.advanceTableForm.patchValue({ assignedToEmployeeName: selected?.assignedToEmployeeName });
    this.advanceTableForm.patchValue({ assignedToEmployeeDepartment: selected?.assignedToEmployeeDepartment });
    this.advanceTableForm.patchValue({ reporterName: selected?.reporterName });
    this.advanceTableForm.patchValue({ incidenceDetails: selected?.incidenceDetails });
    this.advanceTableForm.patchValue({ incidenceType: selected?.incidenceType });
    this.advanceTableForm.patchValue({ issueCategory: selected?.issueCategory });
    this.advanceTableForm.patchValue({ reportEvidenceDoc: selected?.reportEvidenceDoc });
    this.advanceTableForm.patchValue({ rootCauseAnalysis: selected?.rootCauseAnalysis });
    this.advanceTableForm.patchValue({ actionTaken: selected?.actionTaken });
    this.advanceTableForm.patchValue({ closedByEmployeeID: selected?.closedByEmployeeID });
    this.advanceTableForm.patchValue({ closureComment: selected?.closureComment });
    if (selected?.closureDate) {
      this.advanceTableForm.patchValue({ closureDate: selected?.closureDate });
    }
    if (selected?.closureTime) {
      this.advanceTableForm.patchValue({ closureTime: selected?.closureTime });
    }
    this.advanceTableForm.patchValue({ feedbackEmailAcknowledged: selected?.feedbackEmailAcknowledged });
    this.advanceTableForm.patchValue({ incidenceEmailAcknowledged: selected?.incidenceEmailAcknowledged });
    this.advanceTableForm.patchValue({ incidenceCategory: selected?.incidenceCategory });
    this.advanceTableForm.patchValue({ closeByEmployeeName: selected?.closeByEmployeeName });
    this.advanceTableForm.patchValue({ followUpAction: selected?.followUpAction });
    this.advanceTableForm.patchValue({ reminderDateForFollowUp: selected?.reminderDateForFollowUp });

    this.dispatchLocationID =
      selected.dispatchLocationID ||
      selected.DispatchLocationID ||
      this.dispatchLocationID;
    this.transferedLocationID =
      selected.transferedLocationID ||
      selected.dispatchLocationID ||
      selected.DispatchLocationID ||
      this.transferedLocationID;
    this.dutySlipID = selected.dutySlipID || selected.DutySlipID || this.dutySlipID;
    this.reservationID =
      selected.reservationID || selected.ReservationID || this.reservationID;
    this.inventoryID =
      selected.inventoryID || selected.InventoryID || this.inventoryID;
    this.driverID = selected.driverID || selected.DriverID || this.driverID;
    this.driverName = selected.driverName || this.driverName;
    this.supplierID = selected.supplierID || this.supplierID;
    this.carVendor =
      selected.supplierName || selected.carVendor || this.carVendor;
    this.CustomerPersonID =
      selected.passengerID ||
      selected.customerPersonID ||
      this.CustomerPersonID;
    this.customerPersonName =
      selected.customerPersonName || this.customerPersonName;
    this.syncReservationResponsibleContext();

    this.bindResponsibleData();
    this.ImagePath = selected.reportEvidenceDoc;
    this.loadIncidenceDebitForIncidence();
  }

  private initIncidenceDebitTypes(): void {
    this.debitService.getDebitTypesForIncidenceScreen().subscribe(
      (list) => {
        this.debitTypeOptions = Array.isArray(list) ? list : [];
        const debitTypeControl = this.advanceTableForm.get('debitTypeID');
        if (debitTypeControl && !debitTypeControl['_incidenceDebitTypeHook']) {
          debitTypeControl['_incidenceDebitTypeHook'] = true;
          debitTypeControl.valueChanges.subscribe((debitTypeId) => {
            const match = this.debitTypeOptions.find(
              (x) => Number(x.debitTypeID) === Number(debitTypeId)
            );
            if (match != null && match.debitTypeAmount != null) {
              this.advanceTableForm.patchValue(
                { debitAmount: match.debitTypeAmount },
                { emitEvent: false }
              );
            }
          });
        }
      },
      () => {
        this.debitTypeOptions = [];
      }
    );
  }

  private loadIncidenceDebitForIncidence(): void {
    const incidenceId = Number(this.incidenceID);
    if (!incidenceId) {
      return;
    }

    this.debitService
      .getByIncidenceId(incidenceId)
      .pipe(catchError(() => of(null)))
      .subscribe((row) => {
        if (!row) {
          return;
        }

        const active =
          row.activationStatus !== false && row.ActivationStatus !== false;
        if (!active) {
          this.incidenceDebitID = 0;
          this.hasActiveIncidenceDebit = false;
          return;
        }

        this.incidenceDebitID = Number(row.debitID ?? row.DebitID) || 0;
        this.hasActiveIncidenceDebit = this.incidenceDebitID > 0;
        this.advanceTableForm.patchValue({
          debitTypeID: row.debitTypeID ?? row.DebitTypeID ?? '',
          debitAmount: row.amount ?? row.Amount ?? '',
          debitNarration: row.narration ?? row.Narration ?? '',
        });
      });
  }

  clearIncidenceDebitForm(): void {
    this.incidenceDebitID = 0;
    this.hasActiveIncidenceDebit = false;
    this.advanceTableForm.patchValue({
      debitTypeID: '',
      debitAmount: '',
      debitNarration: '',
    });
  }

  removeIncidenceDebit(): void {
    if (!this.hasActiveIncidenceDebit || !this.incidenceDebitID) {
      return;
    }

    const incidenceId = Number(this.incidenceID);
    if (!incidenceId) {
      return;
    }

    const confirmed = window.confirm(
      'Remove the driver debit linked to this incidence? The debit will be soft-deleted and logged; resolution will stay saved.'
    );
    if (!confirmed) {
      return;
    }

    this.debitRemoveInProgress = true;
    this.debitService
      .deleteFromIncidenceResolution(this.incidenceDebitID, incidenceId)
      .subscribe(
        () => {
          this.clearIncidenceDebitForm();
          this.showNotification(
            'snackbar-success',
            'Driver debit removed.',
            'bottom',
            'center'
          );
          this.debitRemoveInProgress = false;
        },
        (err: HttpErrorResponse) => {
          const apiMsg =
            typeof err?.error === 'string'
              ? err.error
              : err?.error?.message || err?.message;
          this.showNotification(
            'snackbar-danger',
            apiMsg || 'Could not remove driver debit.',
            'bottom',
            'center'
          );
          this.debitRemoveInProgress = false;
        }
      );
  }

  private rowId(row: any, camelKey: string, pascalKey?: string): number {
    if (!row) {
      return 0;
    }
    const pascal = pascalKey || camelKey.charAt(0).toUpperCase() + camelKey.slice(1);
    return this.pickPositiveInt(row[camelKey], row[pascal]);
  }

  private pickPositiveInt(...values: any[]): number {
    for (const value of values) {
      const n = Number(value);
      if (!isNaN(n) && n > 0) {
        return n;
      }
    }
    return 0;
  }

  private resolveDebitTripContext(): {
    incidenceID: number;
    dutySlipID: number;
    reservationID: number;
    driverID: number;
    supplierID: number;
    inventoryID: number;
    locationID: number;
  } {
    const raw = this.advanceTableForm?.getRawValue?.() || {};
    const row =
      this.getSelectedIncidenceRow() ||
      this.dataSource?.[0] ||
      this.getIncidenceSummaryFallback() ||
      {};
    const advance = this.data?.advanceTable || {};
    const item = this.data?.item || {};

    return {
      incidenceID: this.pickPositiveInt(
        this.incidenceID,
        raw.incidenceID,
        this.rowId(row, 'incidenceID'),
        this.rowId(advance, 'incidenceID'),
        this.data?.incidenceID
      ),
      dutySlipID: this.pickPositiveInt(
        this.dutySlipID,
        this.rowId(row, 'dutySlipID'),
        raw.dutySlipNumber,
        this.rowId(advance, 'dutySlipID')
      ),
      reservationID: this.pickPositiveInt(
        this.reservationID,
        this.rowId(row, 'reservationID'),
        raw.reservationID,
        this.rowId(advance, 'reservationID'),
        item.reservationID
      ),
      driverID: this.pickPositiveInt(
        this.driverID,
        this.rowId(row, 'driverID'),
        this.rowId(advance, 'driverID'),
        item.driverID,
        this.data?.driverID
      ),
      supplierID: this.pickPositiveInt(
        this.supplierID,
        this.rowId(row, 'supplierID'),
        this.rowId(row, 'inventorySupplierID'),
        this.rowId(advance, 'supplierID'),
        this.rowId(advance, 'inventorySupplierID'),
        item.supplierID,
        item.inventorySupplierID,
        this.data?.supplierID
      ),
      inventoryID: this.pickPositiveInt(
        this.inventoryID,
        this.rowId(row, 'inventoryID'),
        this.rowId(advance, 'inventoryID'),
        item.inventoryID,
        this.data?.inventoryID
      ),
      locationID: this.pickPositiveInt(
        this.transferedLocationID,
        this.rowId(row, 'transferedLocationID'),
        this.rowId(row, 'dispatchLocationID'),
        this.rowId(advance, 'transferedLocationID'),
        this.rowId(advance, 'dispatchLocationID'),
        this.dispatchLocationID,
        item.transferedLocationID,
        item.serviceLocationID
      ),
    };
  }

  private hasMinimumDebitTripContext(ctx: ReturnType<typeof this.resolveDebitTripContext>): boolean {
    return !!ctx.incidenceID;
  }

  private enrichDebitContextFromReservation(
    ctx: ReturnType<typeof this.resolveDebitTripContext>
  ) {
    const reservationId = ctx.reservationID || Number(this.reservationID);
    if (!reservationId) {
      return of(ctx);
    }

    return this.controlPanelService.getReservationDetails(reservationId).pipe(
      map((rows) => {
        const r = Array.isArray(rows) ? rows[0] : rows;
        if (!r) {
          return ctx;
        }
        return {
          ...ctx,
          reservationID:
            ctx.reservationID ||
            this.pickPositiveInt(r.reservationID, r.ReservationID),
          driverID:
            ctx.driverID || this.pickPositiveInt(r.driverID, r.DriverID),
          supplierID:
            ctx.supplierID ||
            this.pickPositiveInt(
              r.supplierID,
              r.inventorySupplierID,
              r.SupplierID,
              r.InventorySupplierID
            ),
          inventoryID:
            ctx.inventoryID ||
            this.pickPositiveInt(r.inventoryID, r.InventoryID),
          locationID:
            ctx.locationID ||
            this.pickPositiveInt(
              r.transferedLocationID,
              r.serviceLocationID,
              r.ServiceLocationID,
              r.TransferedLocationID
            ),
        };
      }),
      catchError(() => of(ctx))
    );
  }

  private closureDateForDebitApi(closureDate: any): string {
    if (!closureDate) {
      return 'null';
    }
    try {
      const d =
        closureDate instanceof Date ? closureDate : new Date(closureDate);
      if (!isNaN(d.getTime())) {
        return formatDate(d, 'yyyy-MM-dd', 'en-GB');
      }
    } catch (e) {
      /* ignore */
    }
    return 'null';
  }

  private isDebitSectionEmpty(): boolean {
    const raw = this.advanceTableForm.getRawValue();
    const hasType = Number(raw.debitTypeID) > 0;
    const hasAmount = Number(raw.debitAmount) > 0;
    const hasNarration = (raw.debitNarration || '').trim().length > 0;
    return !hasType && !hasAmount && !hasNarration;
  }

  private shouldSaveIncidenceDebit(): boolean {
    return this.action === 'edit' && !this.isDebitSectionEmpty();
  }

  private validateDebitSectionForSave(raw: any): string | null {
    const hasType = Number(raw.debitTypeID) > 0;
    const hasAmount = Number(raw.debitAmount) > 0;
    const narration = (raw.debitNarration || '').trim();
    const hasNarration = narration.length > 0;

    if (!hasType) {
      return 'Debit type is required when saving a driver debit.';
    }
    if (!hasAmount || Number(raw.debitAmount) < 0.01) {
      return 'Amount is required when saving a driver debit.';
    }
    if (!hasNarration) {
      return 'Narration is required when saving a driver debit.';
    }
    if (narration.length > 500) {
      return 'Narration cannot exceed 500 characters.';
    }

    const narrationControl = this.advanceTableForm.get('debitNarration');
    if (narrationControl?.invalid) {
      return 'Driver debit fields are invalid.';
    }
    return null;
  }

  private saveIncidenceDebit(onSuccess: () => void, onError: (message: string) => void): void {
    if (this.action !== 'edit') {
      onSuccess();
      return;
    }

    const raw = this.advanceTableForm.getRawValue();
    const debitValidation = this.validateDebitSectionForSave(raw);
    if (debitValidation) {
      onError(debitValidation);
      return;
    }

    const buildPayload = (ctx: ReturnType<typeof this.resolveDebitTripContext>) => ({
      debitID: this.incidenceDebitID > 0 ? this.incidenceDebitID : -1,
      incidenceID: ctx.incidenceID,
      dutySlipID: ctx.dutySlipID > 0 ? ctx.dutySlipID : null,
      reservationID: ctx.reservationID > 0 ? ctx.reservationID : null,
      driverID: ctx.driverID > 0 ? ctx.driverID : null,
      supplierID: ctx.supplierID > 0 ? ctx.supplierID : null,
      inventoryID: ctx.inventoryID > 0 ? ctx.inventoryID : null,
      locationID: ctx.locationID,
      debitTypeID: Number(raw.debitTypeID),
      amount: Number(raw.debitAmount),
      narration: (raw.debitNarration || '').trim(),
      date: raw.closureDate,
    });

    const postDebit = (ctx: ReturnType<typeof this.resolveDebitTripContext>) => {
      if (!this.hasMinimumDebitTripContext(ctx)) {
        onError('Driver debit could not be saved: incidence is required.');
        return;
      }

      this.debitService.saveFromIncidenceResolution(buildPayload(ctx)).subscribe(
        (res) => {
          const savedId = Number(res?.debitID ?? res?.DebitID);
          if (savedId > 0) {
            this.incidenceDebitID = savedId;
            this.hasActiveIncidenceDebit = true;
          }
          onSuccess();
        },
        (err: HttpErrorResponse) => {
          const apiMsg =
            typeof err?.error === 'string'
              ? err.error
              : err?.error?.message || err?.message;
          onError(apiMsg || 'Driver debit save failed.');
        }
      );
    };

    let ctx = this.resolveDebitTripContext();
    const dateString = this.closureDateForDebitApi(raw.closureDate);

    of(ctx)
      .pipe(
        switchMap((baseCtx) => {
          const needsDriverAssoc =
            (!baseCtx.supplierID || !baseCtx.inventoryID) && baseCtx.driverID > 0;
          if (!needsDriverAssoc) {
            return of(baseCtx);
          }
          return this.debitService.getDriverInventory(baseCtx.driverID, dateString).pipe(
            catchError(() => of(null)),
            map((assoc) => {
              if (!assoc) {
                return baseCtx;
              }
              return {
                ...baseCtx,
                supplierID: baseCtx.supplierID || Number(assoc.supplierID) || 0,
                inventoryID: baseCtx.inventoryID || Number(assoc.inventoryID) || 0,
              };
            })
          );
        }),
        switchMap((enrichedCtx) => this.enrichDebitContextFromReservation(enrichedCtx))
      )
      .subscribe((finalCtx) => postDebit(finalCtx));
  }
  private getSelectedIncidenceRow(): any {
    const targetIncidenceID =
      this.incidenceID ||
      this.data?.incidenceID ||
      this.data?.item?.incidenceID;

    if (!this.dataSource?.length) {
      return null;
    }

    return (
      this.dataSource.find(
        (row) => Number(row.incidenceID) === Number(targetIncidenceID)
      ) || null
    );
  }

  bindResponsibleData() {
    // Prefix search no longer preloads full driver/vendor/employee lists.
    // Bind saved responsible values as soon as incidence row is available.
    const selectedRow = this.getSelectedIncidenceRow();
    if (!selectedRow) {
      return;
    }

    for (let i = 1; i <= 4; i++) {
      const selectedValue = selectedRow?.[`responsible${i}`];
      if (selectedValue) {
        this.onResponsibleChange(i, selectedValue);
      }
    }
  }

  private loadReservationContextIfMissing(): void {
    this.reservationID = this.pickPositiveInt(
      this.reservationID,
      this.data?.reservationID,
      this.data?.advanceTable?.reservationID,
      this.data?.item?.reservationID
    );

    const needsCustomer = !this.customerName;
    const needsDriver = !this.driverName || !this.driverID;
    const needsReg = !this.registrationNumber;
    const needsSupplier = !this.supplierID;
    const needsInventory = !this.inventoryID;
    const needsGuest = !this.customerPersonName || !this.CustomerPersonID;
    const needsLocation =
      !this.transferedLocationID && !this.dispatchLocationID;

    if (
      !this.reservationID ||
      (!needsCustomer &&
        !needsDriver &&
        !needsReg &&
        !needsSupplier &&
        !needsInventory &&
        !needsGuest &&
        !needsLocation)
    ) {
      return;
    }

    this.controlPanelService.getReservationDetails(this.reservationID).subscribe(
      (rows) => {
        const reservation = Array.isArray(rows) ? rows[0] : rows;
        if (!reservation) {
          return;
        }

        this.customerID = this.customerID || reservation.customerID;
        this.customerName = this.customerName || reservation.customerName;
        this.driverID = this.driverID || reservation.driverID;
        this.driverName = this.driverName || reservation.driverName;
        this.registrationNumber =
          this.registrationNumber || reservation.registrationNumber;
        this.inventoryID = this.inventoryID || reservation.inventoryID;
        this.supplierID =
          this.supplierID ||
          reservation.supplierID ||
          reservation.inventorySupplierID;
        this.carVendor =
          this.carVendor ||
          reservation.carVendor ||
          reservation.supplierName;
        this.CustomerPersonID =
          this.CustomerPersonID ||
          reservation.primaryPassengerID ||
          reservation.passengerDetails?.[0]?.customerPersonID;
        this.customerPersonName =
          this.customerPersonName ||
          reservation.primaryPassenger ||
          reservation.passengerDetails?.[0]?.customerPersonName;
        this.organizationalEntityName =
          this.organizationalEntityName ||
          reservation.organizationalEntityName ||
          reservation.transferedLocation;
        this.transferedLocationID =
          this.transferedLocationID ||
          reservation.transferedLocationID ||
          reservation.serviceLocationID;

        if (this.data?.item) {
          this.data.item = {
            ...this.data.item,
            customerName: this.customerName,
            driverName: this.driverName,
            driverID: this.driverID,
            registrationNumber: this.registrationNumber,
            carVendor: this.carVendor,
            supplierName: this.carVendor,
            supplierID: this.supplierID,
            transferedLocationID: this.transferedLocationID,
          };
        }

        this.advanceTableForm?.patchValue({
          customerName: this.customerName,
          driverName: this.driverName,
          registrationNumber: this.registrationNumber,
          customerPersonName: this.customerPersonName,
          dispatchLocation: this.organizationalEntityName,
        });
        this.syncReservationResponsibleContext();
      },
      (_error: HttpErrorResponse) => {
        // Keep dialog usable even if reservation lookup fails.
      }
    );
  }

  // Fetch drivers for location + prefix (3+ chars)
  InitDriver() {
    // Kept for compatibility; search is on-demand via onResponsibleSearch.
  }

  // Fetch vendors for location + prefix (3+ chars)
  InitVendor() {
    // Kept for compatibility; search is on-demand via onResponsibleSearch.
  }

  // Fetch employees for prefix (3+ chars)
  InitEmployee() {
    // Kept for compatibility; search is on-demand via onResponsibleSearch.
  }

  // Fetch the list of passengers/guests for this reservation
  InitPassenger() {
    if (!this.reservationID) {
      this.passengerOptions = [];
      return;
    }
    this._generalService.GetCPForReservationResolution(this.reservationID).subscribe(data => {
      if (data) {
        this.passengerOptions = (Array.isArray(data) ? data : []).map(passenger => ({
          name: passenger.customerPersonName,
          id: passenger.customerPersonID
        }));
      } else {
        this.passengerOptions = [];
      }
      this.syncReservationResponsibleContext();
      this.refreshOpenResponsibleSelections('guest');
    });
  }

  private refreshOpenResponsibleSelections(type: string): void {
    for (let i = 1; i <= 4; i++) {
      const selected = this.advanceTableForm?.get(`responsible${i}Option`)?.value;
      if (!selected) {
        continue;
      }
      if (
        selected === type ||
        (type === 'guest' && selected === 'passenger')
      ) {
        // Re-apply defaults now that dropdown data is available.
        this.onResponsibleChange(i, selected);
      }
    }
  }

  private getResponsibleSearchText(responsibleNumber: number): string {
    const raw = this.advanceTableForm.get(`responsible${responsibleNumber}Value`)?.value;
    if (raw == null) {
      return '';
    }
    if (typeof raw === 'string') {
      return raw.trim();
    }
    return (raw.name || '').toString().trim();
  }

  private getTransferedLocationIdForSearch(): number {
    const row = this.getSelectedIncidenceRow() || {};
    return this.pickPositiveInt(
      this.transferedLocationID,
      row.transferedLocationID,
      row.dispatchLocationID,
      this.data?.advanceTable?.dispatchLocationID,
      this.dispatchLocationID,
      this.data?.item?.transferedLocationID,
      this.data?.item?.serviceLocationID
    );
  }

  onResponsibleSearch(responsibleNumber: number, _event?: any): void {
    const type = this.advanceTableForm.get(`responsible${responsibleNumber}Option`)?.value;
    const prefix = this.getResponsibleSearchText(responsibleNumber);

    // Typing invalidates previous ID until a new option is selected.
    this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue('');

    if (!prefix || prefix.length < this._generalService.lengthToCheck) {
      this[`filteredOptions${responsibleNumber}`] = [];
      return;
    }

    if (type === 'driver') {
      this.searchDrivers(responsibleNumber, prefix);
    } else if (type === 'vendor') {
      this.searchVendors(responsibleNumber, prefix);
    } else if (type === 'employee') {
      this.searchEmployees(responsibleNumber, prefix);
    }
  }

  private searchDrivers(responsibleNumber: number, prefix: string): void {
    const locationID = this.getTransferedLocationIdForSearch();
    if (!locationID) {
      this[`filteredOptions${responsibleNumber}`] = [];
      this.showNotification(
        'snackbar-danger',
        'Transfered location not found for this reservation.',
        'bottom',
        'center'
      );
      return;
    }

    this._generalService.GetDriversByLocationPrefix(locationID, prefix).subscribe(
      (data) => {
        this.driverOptions = (Array.isArray(data) ? data : []).map((driver) => ({
          name: driver.driverName,
          id: driver.driverID
        }));
        this[`filteredOptions${responsibleNumber}`] = this.driverOptions;
      },
      () => {
        this[`filteredOptions${responsibleNumber}`] = [];
      }
    );
  }

  /** Build DOIN ## Mobile ## OwnedSupplier ## SupplierName and put it in the textbox. */
  private setDriverConcatDisplayInTextbox(responsibleNumber: number, driverId: number): void {
    if (!driverId) {
      return;
    }
    this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(driverId);
    this._generalService.GetDriverByID(driverId).subscribe(
      (driver: any) => {
        if (!driver) {
          return;
        }
        const display = [
          driver.driverOfficialIdentityNumber || '',
          driver.mobile1 || '',
          driver.ownedSupplier || '',
          driver.supplier || driver.supplierName || ''
        ].join(' ## ');
        this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(display);
        this[`filteredOptions${responsibleNumber}`] = [{ id: driverId, name: display }];
      },
      () => { /* keep ID; leave name blank if lookup fails */ }
    );
  }

  private searchVendors(responsibleNumber: number, prefix: string): void {
    const locationID = this.getTransferedLocationIdForSearch();
    if (!locationID) {
      this[`filteredOptions${responsibleNumber}`] = [];
      this.showNotification(
        'snackbar-danger',
        'Transfered location not found for this reservation.',
        'bottom',
        'center'
      );
      return;
    }

    this._generalService.GetSuppliersByLocationPrefix(locationID, prefix).subscribe(
      (data) => {
        this.supplierOptions = (Array.isArray(data) ? data : []).map((vendor) => {
          const display = this.formatVendorDisplay(vendor);
          return {
            name: display,
            id: vendor.supplierID
          };
        });
        this[`filteredOptions${responsibleNumber}`] = this.supplierOptions;
      },
      () => {
        this[`filteredOptions${responsibleNumber}`] = [];
      }
    );
  }

  /** SupplierOfficialIdentityNumber ## Phone — same format for list and textbox. */
  private formatVendorDisplay(vendor: any): string {
    if (!vendor) {
      return '';
    }
    const alreadyConcat =
      vendor.supplierName && String(vendor.supplierName).includes('##')
        ? String(vendor.supplierName).trim()
        : '';
    if (alreadyConcat) {
      return alreadyConcat;
    }
    const code =
      vendor.supplierOfficialIdentityNumber ||
      vendor.SupplierOfficialIdentityNumber ||
      '';
    const phone =
      vendor.phone ||
      vendor.supplierPhone ||
      vendor.Phone ||
      '';
    return `${code} ## ${phone}`.trim();
  }

  /** Build SupplierOfficialIdentityNumber ## Phone and put it in the textbox. */
  private setVendorConcatDisplayInTextbox(responsibleNumber: number, supplierId: number): void {
    if (!supplierId) {
      return;
    }
    this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(supplierId);
    this._generalService.GetSupplierByID(supplierId).subscribe(
      (vendor: any) => {
        if (!vendor) {
          return;
        }
        const display = this.formatVendorDisplay(vendor);
        this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(display);
        this[`filteredOptions${responsibleNumber}`] = [{ id: supplierId, name: display }];
      },
      () => { /* keep ID; leave name blank if lookup fails */ }
    );
  }

  private searchEmployees(responsibleNumber: number, prefix: string): void {
    this._generalService.GetEmployeesForVehicleCategoryPrefix(prefix).subscribe(
      (data) => {
        this.employeeOptions = (Array.isArray(data) ? data : []).map((employee) => {
          const display = this.formatEmployeeDisplay(employee);
          return {
            name: display,
            id: employee.employeeID
          };
        });
        this[`filteredOptions${responsibleNumber}`] = this.employeeOptions;
      },
      () => {
        this[`filteredOptions${responsibleNumber}`] = [];
      }
    );
  }

  /** FirstName LastName ## Mobile — same format for list and textbox. */
  private formatEmployeeDisplay(employee: any): string {
    if (!employee) {
      return '';
    }
    const firstName = employee.firstName || employee.FirstName || '';
    const lastName = employee.lastName || employee.LastName || '';
    const mobile = employee.mobile || employee.Mobile || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return `${fullName} ## ${mobile}`.trim();
  }

  private setEmployeeConcatDisplayInTextbox(responsibleNumber: number, employeeId: number): void {
    if (!employeeId) {
      return;
    }
    this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(employeeId);
    this._generalService.getEmployeeID(employeeId).subscribe(
      (data: any) => {
        const employee = Array.isArray(data) ? data[0] : data;
        if (!employee) {
          return;
        }
        const display = this.formatEmployeeDisplay(employee);
        this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(display);
        this[`filteredOptions${responsibleNumber}`] = [{ id: employeeId, name: display }];
      },
      () => { /* keep ID; leave name blank if lookup fails */ }
    );
  }

  onGuestSelect(responsibleNumber: number, selectedId: any): void {
    const id = Number(selectedId || 0);
    const option = (this.passengerOptions || []).find((o) => Number(o.id) === id);
    this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(id || '');
    this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(option?.name || '');
  }

onResponsibleChange(responsibleNumber: number, selectedValue: string): void {
  // ALWAYS enable first (important when switching from "none")
  this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].enable();
  this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].enable();

  // Set option value
  this.advanceTableForm.controls[`responsible${responsibleNumber}Option`].setValue(selectedValue);

  //  Reset fields
  this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue('');
  this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue('');

  // Default UI reset
  this[`showAutoComplete${responsibleNumber}`] = false;
  this[`filteredOptions${responsibleNumber}`] = [];
  this[`responsibleValueMode${responsibleNumber}`] = 'none';

  this.syncReservationResponsibleContext();
  const recordData: any = this.getSelectedIncidenceRow() || this.data?.item || {};

  const dataSourceDriverKey = `responsible${responsibleNumber}DriverID`;
  const dataSourceVendorKey = `responsible${responsibleNumber}VendorID`;
  const dataSourceEmployeeKey = `responsible${responsibleNumber}EmployeeID`;
  const dataSourceCustomerPersonKey = `responsible${responsibleNumber}CustomerPersonID`;
  const savedDriverId = Number(recordData?.[dataSourceDriverKey] || 0);
  const savedVendorId = Number(recordData?.[dataSourceVendorKey] || 0);
  const savedEmployeeId = Number(recordData?.[dataSourceEmployeeKey] || 0);
  const savedGuestId = Number(recordData?.[dataSourceCustomerPersonKey] || 0);

  switch (selectedValue) {

    // ================= NONE =================
    case 'none':
      this[`showAutoComplete${responsibleNumber}`] = false;
      this[`responsibleValueMode${responsibleNumber}`] = 'none';
      this[`filteredOptions${responsibleNumber}`] = [];

      this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue('');
      this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue('');

      this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].disable();
      this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].disable();
      break;

    // ================= DRIVER =================
    case 'driver':
      this[`showAutoComplete${responsibleNumber}`] = true;
      this[`responsibleValueMode${responsibleNumber}`] = 'autocomplete';
      this[`autoCompleteLabel${responsibleNumber}`] = `Search Driver ${responsibleNumber} (min 3 chars)`;
      this[`filteredOptions${responsibleNumber}`] = [];
      {
        const driverId =
          savedDriverId || Number(this.driverID || recordData?.driverID || 0);
        if (driverId) {
          this.setDriverConcatDisplayInTextbox(responsibleNumber, driverId);
        }
      }
      break;

    // ================= VENDOR =================
    case 'vendor':
      this[`showAutoComplete${responsibleNumber}`] = true;
      this[`responsibleValueMode${responsibleNumber}`] = 'autocomplete';
      this[`autoCompleteLabel${responsibleNumber}`] = `Search Vendor ${responsibleNumber} (min 3 chars)`;
      this[`filteredOptions${responsibleNumber}`] = [];
      {
        const vendorId =
          savedVendorId || Number(this.supplierID || recordData?.supplierID || 0);
        if (vendorId) {
          this.setVendorConcatDisplayInTextbox(responsibleNumber, vendorId);
        }
      }
      break;

    // ================= EMPLOYEE =================
    case 'employee':
      this[`showAutoComplete${responsibleNumber}`] = true;
      this[`responsibleValueMode${responsibleNumber}`] = 'autocomplete';
      this[`autoCompleteLabel${responsibleNumber}`] = `Search Employee ${responsibleNumber} (min 3 chars)`;
      this[`filteredOptions${responsibleNumber}`] = [];
      if (savedEmployeeId) {
        this.setEmployeeConcatDisplayInTextbox(responsibleNumber, savedEmployeeId);
      }
      break;

    // ================= GUEST =================
    case 'guest':
    case 'passenger':
      this[`showAutoComplete${responsibleNumber}`] = false;
      this[`responsibleValueMode${responsibleNumber}`] = 'select';
      this[`autoCompleteLabel${responsibleNumber}`] = `Select Guest ${responsibleNumber}`;
      this[`filteredOptions${responsibleNumber}`] = this.ensureOptionInList(
        this.passengerOptions,
        this.CustomerPersonID || recordData?.passengerID || recordData?.customerPersonID,
        this.customerPersonName || recordData?.customerPersonName
      );
      this.setResponsibleValueFromReservation(
        responsibleNumber,
        savedGuestId ||
          Number(
            this.CustomerPersonID ||
              recordData?.passengerID ||
              recordData?.customerPersonID ||
              0
          ),
        savedGuestId
          ? recordData?.[`responsible${responsibleNumber}CustomerPersonName`]
          : (this.customerPersonName || recordData?.customerPersonName),
        this.passengerOptions
      );
      break;
  }
  this.updateResponsibleLock();
}

private ensureOptionInList(options: any[], id: any, name: any): any[] {
  const list = Array.isArray(options) ? [...options] : [];
  const numericId = Number(id || 0);
  if (!numericId && !name) {
    return list;
  }
  const exists = list.some(
    (o) =>
      (numericId && Number(o.id) === numericId) ||
      (name &&
        o.name?.toString().trim().toLowerCase() ===
          name.toString().trim().toLowerCase())
  );
  if (!exists && (numericId || name)) {
    list.unshift({ id: numericId || 0, name: name || '' });
  }
  return list;
}

private setResponsibleValueFromReservation(
  responsibleNumber: number,
  id: any,
  name: any,
  options: any[]
): void {
  const numericId = Number(id || 0);
  const fromOptions =
    (numericId &&
      (options || []).find((o) => Number(o.id) === numericId)) ||
    (name &&
      (options || []).find(
        (o) =>
          o.name?.toString().trim().toLowerCase() ===
          name.toString().trim().toLowerCase()
      ));

  const finalName = fromOptions?.name || name || '';
  const finalId = fromOptions?.id || numericId || 0;

  if (finalName || finalId) {
    this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(
      finalName
    );
    this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(
      finalId
    );
  }
}

private syncReservationResponsibleContext(): void {
  const row = this.getSelectedIncidenceRow() || this.data?.item || {};
  this.driverID = this.driverID || row.driverID || this.data?.item?.driverID;
  this.driverName =
    this.driverName ||
    row.driverName ||
    this.data?.item?.driverName ||
    this.data?.driverName;
  this.supplierID =
    this.supplierID ||
    row.supplierID ||
    row.inventorySupplierID ||
    this.data?.advanceTable?.supplierID ||
    this.data?.item?.supplierID ||
    this.data?.item?.inventorySupplierID;
  if (!this.transferedLocationID) {
    this.transferedLocationID =
      row.transferedLocationID ||
      row.dispatchLocationID ||
      this.data?.advanceTable?.dispatchLocationID;
  }
  this.carVendor =
    this.carVendor ||
    row.supplierName ||
    row.carVendor ||
    this.data?.item?.carVendor ||
    this.data?.item?.supplierName;
  this.CustomerPersonID =
    this.CustomerPersonID ||
    row.passengerID ||
    row.customerPersonID ||
    this.data?.customerPersonID ||
    this.data?.item?.passengerID;
  this.customerPersonName =
    this.customerPersonName ||
    row.customerPersonName ||
    this.data?.customerPersonName ||
    this.data?.item?.customerPersonName;

  // Resolve names from loaded dropdowns when we only have IDs.
  if (this.driverID && !this.driverName && this.driverOptions?.length) {
    this.driverName = this.driverOptions.find(
      (d) => Number(d.id) === Number(this.driverID)
    )?.name;
  }
  if (this.supplierID && !this.carVendor && this.supplierOptions?.length) {
    this.carVendor = this.supplierOptions.find(
      (v) => Number(v.id) === Number(this.supplierID)
    )?.name;
  }
  if (this.CustomerPersonID && !this.customerPersonName && this.passengerOptions?.length) {
    this.customerPersonName = this.passengerOptions.find(
      (p) => Number(p.id) === Number(this.CustomerPersonID)
    )?.name;
  }
}
updateResponsibleLock(): void {
  // None only clears/hides that slot's value control.
  // Do not disable other Responsible dropdowns.
  for (let i = 1; i <= 4; i++) {
    const optionCtrl = this.advanceTableForm.get(`responsible${i}Option`);
    const valueCtrl = this.advanceTableForm.get(`responsible${i}Value`);
    const idCtrl = this.advanceTableForm.get(`responsible${i}ID`);
    const selectedValue = optionCtrl?.value;

    optionCtrl?.enable({ emitEvent: false });

    if (selectedValue === 'none' || !selectedValue) {
      valueCtrl?.setValue('', { emitEvent: false });
      idCtrl?.setValue('', { emitEvent: false });
      valueCtrl?.disable({ emitEvent: false });
      idCtrl?.disable({ emitEvent: false });
    } else {
      valueCtrl?.enable({ emitEvent: false });
      idCtrl?.enable({ emitEvent: false });
    }
  }
}
  onAutoCompleteSelect(responsibleNumber: number, event: any): void {
    const optionObject = event.option.value;
    // Prefer plain string so the textbox shows the concatenated driver/vendor/employee label.
    const displayName =
      typeof optionObject === 'string'
        ? optionObject
        : (optionObject?.name || '');
    const selectedId =
      typeof optionObject === 'string'
        ? (this[`filteredOptions${responsibleNumber}`] || []).find(
            (o) => o.name === optionObject
          )?.id
        : optionObject?.id;

    this.advanceTableForm.controls[`responsible${responsibleNumber}Value`].setValue(
      displayName
    );
    this.advanceTableForm.controls[`responsible${responsibleNumber}ID`].setValue(
      selectedId || ''
    );
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



  getClosedByEmployee() {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data => {
        this.employeeDataSource = Array.isArray(data) ? data : [];
        if (!this.employeeDataSource.length) {
          return;
        }
        const emp = this.employeeDataSource[0];
        this.advanceTableForm.patchValue({
          closeByEmployeeName: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(),
          closeByEmployeeID: emp.employeeID,
        });
        // Keep closure fields editable for create/update resolution.
        this.advanceTableForm.controls['closeByEmployeeName']?.enable();
        this.advanceTableForm.controls['closureDate']?.enable();
        this.advanceTableForm.controls['closureTime']?.enable();
      });
  }
}



