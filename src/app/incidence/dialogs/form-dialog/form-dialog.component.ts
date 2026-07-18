// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { IncidenceService } from '../../incidence.service';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Incidence } from '../../incidence.model';
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
import { DepartmentDropDown } from 'src/app/general/departmentDropDown.model';
@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class incidenceFormDialogComponent {
  saveDisabled:boolean=true;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: Incidence;
  filteredDutySlipListOptions: Observable<DutySlipDropDown[]>;
  public DutySlipList?: DutySlipDropDown[] = [];
  public EmployeeList?: EmployeeDropDown[] = [];
  filteredIncidenceTypeListOptions: Observable<IncidenceTypeDropDown[]>;
  public IncidenceTypeList?: IncidenceTypeDropDown[] = [];
  filteredinstructedByOptionss: Observable<EmployeeDropDown[]>
  public IssueCategoryList?: IssueCategoryDropDown[] = [];
  filteredIssueCategoryByOptionss: Observable<IssueCategoryDropDown[]>

  filteredDepartmentByOptions: Observable<DepartmentDropDown[]>
  public DepartmentList?: DepartmentDropDown[] = [];

  public passengerList?: EmployeesDropDown[] = [];
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
   dataSource: Incidence[] | null;
  incidenceID: any;
  customerType: any;
  departmentID: any;
  supplier:any;
  isVIP: any;
  today:Date =new Date();
  verifyDutyStatusAndCacellationStatus: string;
  isSaveAllowed: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<incidenceFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: IncidenceService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService) 
    {
      console.log(data);
    this.reservationID = this.data?.item?.reservationID || this.data?.reservationID;
    this.dutySlipID = this.data?.dutySlipID || this.data?.item?.dutySlipID;
    this.incidenceID = this.data?.incidenceID || this.data?.item?.incidenceID;
    this.incidenceTypeID = this.data?.item?.incidenceTypeID;
    this.issueCategoryID = this.data?.item?.issueCategoryID;
    this.customerID = this.data?.item?.customerID;
    this.customerName = this.data?.item?.customerName;
    this.customerType = this.data?.item?.customerType;
    this.driverID = this.data?.item?.driverID;
    this.driverName = this.data?.item?.driverName;
    this.customerID = this.data?.item?.customerID;
    this.registrationNumber = this.data?.item?.registrationNumber;
    this.inventoryID = this.data?.item?.inventoryID;
    this.customerPersonID = this.data?.item?.customerPersonID;
    this.organizationalEntityName = this.data?.item?.transferedLocation;
    this.transferedLocationID = this.data?.item?.transferedLocationID;
    this.supplier= this.data?.item?.carVendor;
    this.isVIP = this.data?.item?.customerPerson?.importance;
    this.customerPersonName =
      this.data?.item?.primaryPassengerName ;
    this.passengerID =
      this.data?.item?.customerPersonID;
    this.CustomerPersonID = data.CustomerPersonID;
    // Set the defaults
    this.action = data.action;
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
    if (this.action === 'edit') {
      this.dialogTitle = 'Incidence';
      this.advanceTable = data.advanceTable;
      // this.loadData();
      // this.ImagePath=this.advanceTable?.reportEvidenceDoc;
      // let startDate = moment(this.advanceTable?.incidenceDate).format('DD/MM/yyyy');
      // this.onBlurStartDateEdit(startDate);
      // let reportingDate = moment(this.advanceTable?.reportingTime).format('DD/MM/yyyy');
      // this.onBlurreportingDateEdit(reportingDate);

    } else {
      this.dialogTitle = 'Incidence';
      this.advanceTable = new Incidence({});
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

//this.isSaveAllowed = status === 'changes allow';
    }

  public ngOnInit(): void {
   // this.loadData();
    this.InitDuty();
    this.initPassenger();
    // this.InitincidenceType();
    // this.initIssueCategory();
   // this.InitEmployee();
    this.InitDepartment();
    this.getOpenByEmployee();
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = new Date(now).toISOString();

    this.advanceTableForm.patchValue({
      reservationID: this.reservationID,
      customerName: this.customerName,
      customerType: this.customerType,
      registrationNumber: this.registrationNumber,
      driverName: this.driverName,
      dispatchLocation: this.organizationalEntityName,
      incidenceDate: currentDate,
      incidenceTime: currentTime,
      openDate: now,
      openTime: now,
      reportingDate: currentDate,
      reportingTime: currentTime,
      supplier:this.supplier,
      isVIP:this.isVIP,
      dutySlipNumber:this.dutySlipID,
     customerPersonName: this.customerPersonName,
     passengerID:this.passengerID
    });
    this.advanceTableForm.controls['openDate'].disable();
    this.advanceTableForm.controls['openTime'].disable();
    this.advanceTableForm.controls['reservationID'].disable();
    this.advanceTableForm.controls['dutySlipNumber'].disable();
    this.advanceTableForm.controls['customerName'].disable();
    this.advanceTableForm.controls['driverName'].disable();
    this.advanceTableForm.controls['registrationNumber'].disable();
    this.advanceTableForm.controls['dispatchLocation'].disable();
    this.advanceTableForm.controls['customerType'].disable();
    this.advanceTableForm.controls['supplier'].disable();
    this.advanceTableForm.controls['isVIP'].disable();
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      dutySlipID: [this.advanceTable?.dutySlipID],
      userID: [this.advanceTable?.userID || ''],
      reservationID: [this.advanceTable?.reservationID ],
      incidenceID: [this.data?.item?.incidenceID || -1],
      passengerID: [this.advanceTable?.passengerID],
      inventoryID: [this.advanceTable?.inventoryID || 0],
      dutySlipNumber: [this.advanceTable?.dutySlipNumber || ''],
      driverID: [this.advanceTable?.driverID || 0],
      driverName: [this.advanceTable?.driverName || ''],
      locationOutAddressString: [this.advanceTable?.locationOutAddressString || ''],
      registrationNumber: [this.advanceTable?.registrationNumber || ''],
      incidenceDate: [null, Validators.required],
      incidenceTime: [null, Validators.required],
      incidencePlace: [this.advanceTable?.incidencePlace || ''],
      dispatchLocationID: [this.advanceTable?.dispatchLocationID || 0],
      incidenceTypeID: [this.advanceTable?.incidenceTypeID],
      incidenceType: [this.advanceTable?.incidenceType || ''],
      issueCategoryID: [this.advanceTable?.issueCategoryID],
      issueCategory: [this.advanceTable?.issueCategory || ''],
      incidenceDetails: [this.advanceTable?.incidenceDetails || ''],
      reportingDate: [this.advanceTable?.reportingDate || null],
      reportingTime: [this.advanceTable?.reportingTime || null],
      reportedBy: [this.advanceTable?.reportedBy || ''],
      reporterName: [this.advanceTable?.reporterName || ''],
      reportSource: [this.advanceTable?.reportSource || ''],
      reportEvidenceDoc: [this.advanceTable?.reportEvidenceDoc],
      assignedToEmployeeID: [this.advanceTable?.assignedToEmployeeID],
      assignedToEmployeeName: [this.advanceTable?.assignedToEmployeeName],
      assignedToEmployeeDepartment: [this.advanceTable?.assignedToEmployeeDepartment || ''],
      openedByEmployeeID: [this.advanceTable?.openedByEmployeeID || ''],
      openedByEmployeeDepartment: [this.advanceTable?.openedByEmployeeDepartment || ''],
      openDate: [''],
      openTime: [''],
      customerName: [this.advanceTable?.customerName || ''],
      customerType:[this.advanceTable?.customerType || ''],
      openedByEmployeeName: [this.advanceTable?.openedByEmployeeName || ''],
      dispatchLocation: [this.data?.item?.transferedLocation || ''],
      customerPersonName: [this.advanceTable?.customerPersonName || ''],
      rootCauseAnalysis: [this.advanceTable?.rootCauseAnalysis || ''],
      actionTaken: [this.advanceTable?.actionTaken || ''],
      closedByEmployee: [this.advanceTable?.closedByEmployee || ''],
      closureComment: [this.advanceTable?.closureComment || ''],
      closureDate: [this.advanceTable?.closureDate || null],
      closureTime: [this.advanceTable?.closureTime || null],
      incidenceCategory: [this.advanceTable?.incidenceCategory || ''],
      responsible1: [this.advanceTable?.responsible1 || ''],
      responsible2Name: [''],
      Responsible1Name: [this.advanceTable?.Responsible1Name || ''],
      responsible1EmployeeName: [this.advanceTable?.responsible1EmployeeName || ''],
      responsible2: [this.advanceTable?.responsible2 || ''],
      responsible3: [this.advanceTable?.responsible3 || ''],
      responsible4: [this.advanceTable?.responsible4 || ''],
      supplier:[this.advanceTable?.supplier || ''],
      isVIP:[this.advanceTable?.isVIP || ''],
      department:[this.advanceTable?.department || ''],
      type:[this.advanceTable?.type || '']
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
  public Post(): void {
    this.advanceTableForm.patchValue({ reservationID: this.reservationID });
    this.advanceTableForm.patchValue({ dutySlipID: this.dutySlipID });
    this.advanceTableForm.patchValue({ customerID: this.customerID });
    this.advanceTableForm.patchValue({ driverID: this.driverID });
    this.advanceTableForm.patchValue({ inventoryID: this.inventoryID });
    this.advanceTableForm.patchValue({ dispatchLocationID: this.transferedLocationID });
    this.advanceTableForm.patchValue({ passengerID: this.passengerID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          
          this.showNotification(
            'snackbar-success',
            'Incidence Create...!!!',
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
  public Put(): void {
    this.advanceTableForm.patchValue({ reservationID: this.reservationID || this.advanceTable.reservationID  });
    this.advanceTableForm.patchValue({ dutySlipID: this.dutySlipID || this.advanceTable?.dutySlipID });
    this.advanceTableForm.patchValue({ customerID: this.customerID || this.advanceTable?.customerID });
    this.advanceTableForm.patchValue({ driverID: this.driverID || this.advanceTable?.driverID});
    this.advanceTableForm.patchValue({ inventoryID: this.inventoryID || this.advanceTable?.inventoryID });
    this.advanceTableForm.patchValue({ dispatchLocationID: this.transferedLocationID || this.advanceTable?.dispatchLocationID });
   
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          
          this.showNotification(
            'snackbar-success',
            'Incidence Update...!!!',
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
    else {
      this.Post();
    }
  }

  InitDuty() {
    this._generalService.GetDutySlip(this.reservationID).pipe(
      catchError(error => {
        console.error('Error fetching duty slip list:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.DutySlipList = Array.isArray(data) ? data : [];
      this.syncDutySlipForSave();
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

  private syncDutySlipForSave(): void {
    if (!this.DutySlipList?.length) {
      return;
    }

    const targetId = Number(
      this.dutySlipID ||
      this.data?.dutySlipID ||
      this.data?.item?.dutySlipID ||
      this.advanceTableForm.get('dutySlipNumber')?.value ||
      0
    );

    const matched =
      this.DutySlipList.find((d) => Number(d.dutySlipID) === targetId) ||
      this.DutySlipList[0];

    if (!matched) {
      return;
    }

    this.dutySlipID = matched.dutySlipID;
    this.advanceTableForm.patchValue({
      dutySlipNumber: matched.dutySlipID,
      dutySlipID: matched.dutySlipID,
    });
  }

  // Validator function
  supplierTypeValidator(dutySlipList: any[]): any {
    return (control: any) => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return { invalidDutySlip: true };
      }
      const isValid = dutySlipList.some(
        (item) => Number(item.dutySlipID) === Number(control.value)
      );
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

  //   const filterValue = value.toLowerCase();
  //   return this.DutySlipList.filter(option =>
  //     option.dutySlipNumber?.toString()?.toLowerCase().includes(filterValue)
  //   );
  // }

  // OnSupplierSelect(selectedSupplier: string) {
  //   const dutySlip = this.DutySlipList.find(
  //     data => data.dutySlipID === Number(selectedSupplier)
  //   );
  //   if (dutySlip) {
  //     this.getdutySlipID(dutySlip.dutySlipID);
  //   }
  // }

  // getdutySlipID(dutySlipID: any) {
  //   this.dutySlipID = dutySlipID;
  // }

  // supplierTypeValidator(DutySlipList: any[]): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value?.toString().toLowerCase();
  //     const match = DutySlipList.some(
  //       group => group.dutySlipNumber?.toString().toLowerCase() === value
  //     );
  //     return match ? null : { supplierNameInvalid: true };
  //   };
  // }

  //--------------- Employee Validator -----------
 
   employeeNameValidator(EmployeeList: any[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          if (!control.value) {
            return null; // No value to validate, return null (no error)
          }
          const value = control.value?.toLowerCase();
          const match = EmployeeList.some(employee => (employee.firstName + ' ' + employee.lastName).toLowerCase() === value);
          return match ? null : { employeeNameInvalid: true };
        };
      }

  InitEmployee(_event?: any) {
    var Prefix = this.advanceTableForm.get("assignedToEmployeeName").value;
      if(Prefix.length < 3)
      { 
        this.EmployeeList = [];
        return;
      }
    this._generalService.GetEmployeesForVehicleCategoryPrefix(Prefix).subscribe
      (

        data => {

          this.EmployeeList = data;
          this.advanceTableForm.controls['assignedToEmployeeName']?.setValidators([this.employeeNameValidator(this.EmployeeList)
          ]);
          this.advanceTableForm.controls['assignedToEmployeeName']?.updateValueAndValidity();
          this.filteredinstructedByOptionss = this.advanceTableForm.controls['assignedToEmployeeName']?.valueChanges.pipe(
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
    this.assignedToEmployeeID = employeeID;
    this.advanceTableForm.patchValue({ assignedToEmployeeID: this.assignedToEmployeeID });
  }
  InitDepartment() {
    this._generalService.GetDepartments().subscribe
      (

        data => {

          this.DepartmentList = data;
          this.advanceTableForm.controls['department'].setValidators([Validators.required,
            this.departmentNameValidator(this.DepartmentList )
            ]);
          this.advanceTableForm.controls['department']?.updateValueAndValidity();
          this.filteredDepartmentByOptions = this.advanceTableForm.controls['department']?.valueChanges.pipe(
            startWith(""),
            map(value => this?._filterDepartment(value || ''))
          );
        });
  }
  private _filterDepartment(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DepartmentList.filter(
      data => {
        const fullName = `${data.department} `.toLowerCase();
        return fullName.includes(filterValue);
      });
  }
  OnDepartmentSelect(selectedDepartment: string) {
    const DepartmentName = this.DepartmentList.find(
      data => `${data.department}` === selectedDepartment
    );
    if (selectedDepartment) {
      this.getDepartmentIDTitles(DepartmentName.departmentID);
    }
  }
  getDepartmentIDTitles(departmentID: any) {
    this.departmentID = departmentID;
    this.advanceTableForm.patchValue({ departmentID: this.departmentID });
    this.InitincidenceType();
  }

departmentNameValidator(DepartmentList: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase();
    const match = DepartmentList.some(group => group.department.toLowerCase() === value);
    return match ? null : { departmentNameInvalid: true };
  };
}

  initPassenger() {
    {

      this._generalService.getPassenger(this.reservationID).subscribe

        (
          data => {
            this.passengerList = Array.isArray(data) ? data : [];
            // Passenger picker UI is currently hidden, but validators remain —
            // resolve a valid passenger so Save is not stuck disabled.
            this.syncPassengerForSave();
            this.filteredPassengerOptions = this.advanceTableForm.controls['customerPersonName'].valueChanges.pipe(
              startWith(""),
              map(value => this._filterCategory(value || ''))
            );
          }
        );
    }
  }

  private syncPassengerForSave(): void {
    if (!this.passengerList?.length) {
      // No passengers available — do not block Save on a hidden field.
      this.advanceTableForm.controls['customerPersonName'].clearValidators();
      this.advanceTableForm.controls['customerPersonName'].updateValueAndValidity();
      return;
    }

    const targetId = Number(
      this.passengerID ||
      this.CustomerPersonID ||
      this.customerPersonID ||
      this.data?.item?.primaryPassengerID ||
      this.data?.item?.passengerDetails?.[0]?.customerPersonID ||
      0
    );
    const targetName = (
      this.customerPersonName ||
      this.data?.item?.primaryPassenger ||
      this.data?.item?.passengerDetails?.[0]?.customerPersonName ||
      this.advanceTableForm.get('customerPersonName')?.value ||
      ''
    )
      .toString()
      .trim()
      .toLowerCase();

    const matched =
      this.passengerList.find(
        (p) =>
          Number(p.primaryPassengerID || p.customerPersonID || p.passengerID) ===
          targetId
      ) ||
      this.passengerList.find(
        (p) => p.customerPersonName?.toString().trim().toLowerCase() === targetName
      ) ||
      this.passengerList[0];

    if (matched) {
      this.passengerID =
        matched.primaryPassengerID ||
        matched.customerPersonID ||
        matched.passengerID;
      this.customerPersonName = matched.customerPersonName;
      this.advanceTableForm.patchValue({
        customerPersonName: matched.customerPersonName,
        passengerID: this.passengerID,
      });
    }

    this.advanceTableForm.controls['customerPersonName'].setValidators([
      Validators.required,
      this.passengerValidator(this.passengerList),
    ]);
    this.advanceTableForm.controls['customerPersonName'].updateValueAndValidity();
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

  getpassengerTitles(passengerID) {
    this.passengerID = passengerID
    this.advanceTableForm.patchValue({ passengerID: this.passengerID  || this.advanceTable?.passengerID});
  }

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

  this.advanceTableService
    .getIncidenceType(this.departmentID)
    .subscribe(data => {

      this.IncidenceTypeList = data;

      const control = this.advanceTableForm.get('incidenceType');

      control?.setValidators([
        Validators.required,
        this.incidenceTypeValidator(this.IncidenceTypeList)
      ]);

      control?.updateValueAndValidity();

      this.filteredIncidenceTypeListOptions =
        control?.valueChanges.pipe(
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
    this.advanceTableForm.patchValue({ incidenceTypeID: this.incidenceTypeID  || this.advanceTable?.incidenceTypeID});
    this.initIssueCategory()
  }

incidenceTypeValidator(list: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) return null; // required handle karega

    const value = control.value
      ?.toString()
      .trim()
      .toLowerCase();

    const match = list?.some(item =>
      item.incidenceType
        ?.toString()
        .trim()
        .toLowerCase() === value
    );

    return match ? null : { incidenceTypeInvalid: true };
  };
}


  initIssueCategory() {

  this.advanceTableService
    .getIssueCategory(this.incidenceTypeID)
    .subscribe(data => {

      this.IssueCategoryList = data;

      const control = this.advanceTableForm.get('issueCategory');

      control?.setValidators([
        Validators.required,
        this.IssueCategoryValidator(this.IssueCategoryList)
      ]);

      control?.updateValueAndValidity();
      this.syncIssueCategoryDisplayValue();

      this.filteredIssueCategoryByOptionss =
        control?.valueChanges.pipe(
          startWith(control?.value || ''),
          map(value => this._filterIssueCategory(value || ''))
        );

    });
}

  getIssueCategoryDisplayLabel(item: IssueCategoryDropDown): string {
    if (!item?.issueCategory) {
      return '';
    }
    return item.severity ? `${item.issueCategory} - ${item.severity}` : item.issueCategory;
  }

  private syncIssueCategoryDisplayValue(): void {
    const issueCategoryID = this.issueCategoryID || this.advanceTableForm.get('issueCategoryID')?.value;
    const selected = this.IssueCategoryList?.find(item => item.issueCategoryID === issueCategoryID);
    if (selected) {
      this.advanceTableForm.patchValue({
        issueCategory: this.getIssueCategoryDisplayLabel(selected)
      });
    }
  }


  private _filterIssueCategory(value: string): any {
    const filterValue = value.toLowerCase();
    return this.IssueCategoryList.filter(
      customer => {
        return this.getIssueCategoryDisplayLabel(customer).toLowerCase().includes(filterValue);
      });
  }
  onIssueCategorySelected(selectedIssueCategory: string) {
    const selectedCategory = this.IssueCategoryList.find(
      data => this.getIssueCategoryDisplayLabel(data) === selectedIssueCategory
    )
    if (selectedCategory) {
      this.issueCategoryID = selectedCategory.issueCategoryID;
      
      this.advanceTableForm.patchValue({ issueCategoryID: this.issueCategoryID });
    }
}

  getIssueCategoryID(issueCategoryID) {
    this.issueCategoryID = issueCategoryID;
    this.advanceTableForm.patchValue({ issueCategoryID: this.issueCategoryID  || this.advanceTable?.issueCategoryID});
    const selected = this.IssueCategoryList?.find(item => item.issueCategoryID === issueCategoryID);
    if (selected) {
      this.advanceTableForm.patchValue({
        issueCategory: this.getIssueCategoryDisplayLabel(selected)
      });
    }
  }

  IssueCategoryValidator(list: any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) return null; // required handle karega

    const value = control.value
      ?.toString()
      .trim()
      .toLowerCase();

    const match = list?.some(item =>
      this.getIssueCategoryDisplayLabel(item)
        ?.toString()
        .trim()
        .toLowerCase() === value
    );

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

  //start date
  onBlurSEZStartDate(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('incidenceDate')?.setValue(formattedDate);
    }
    else {
      this.advanceTableForm.get('incidenceDate')?.setErrors({ invalidDate: true });
    }
  }

  onBlurStartDateEdit(value: string): void {
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      const incidenceDateControl = this.advanceTableForm?.get('incidenceDate');
      if (this.action === 'edit' && incidenceDateControl) {
        this.advanceTable.incidenceDate = formattedDate;
      }
      else if(incidenceDateControl) {
        this.advanceTableForm.get('incidenceDate')?.setValue(formattedDate);
      }
    }
    else {
      this.advanceTableForm.get('incidenceDate')?.setErrors({ invalidDate: true });
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
      else if(reportingDateControl) {
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
      this.advanceTableForm.get('incidenceTime').setValue(parsedTime);
    }
  }

  getOpenByEmployee() {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data => {
        this.employeeDataSource = data;
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
      // Create flow should not load/patch an existing incidence row.
      if (this.action === 'add') {
        return;
      }

      const targetIncidenceID =
        this.data?.incidenceID ||
        this.data?.item?.incidenceID ||
        this.incidenceID ||
        this.advanceTable?.incidenceID;

      this.advanceTableService.getTableData(this.reservationID, true ,0).subscribe
        (
          data => {
            this.dataSource = data;
            if (!this.dataSource || this.dataSource.length === 0) {
              return;
            }

            const selected =
              this.dataSource.find(
                (row) => Number(row.incidenceID) === Number(targetIncidenceID)
              ) || null;

            if (!selected) {
              this.showNotification(
                'snackbar-danger',
                'Selected incidence was not found for this reservation.',
                'bottom',
                'center'
              );
              return;
            }

            this.incidenceID = selected.incidenceID;
            this.advanceTableForm.patchValue({ reservationID: selected.reservationID });
            this.advanceTableForm.patchValue({ incidenceID: selected.incidenceID });
            this.advanceTableForm.patchValue({
              incidenceDate: selected.incidenceDate
            });
            this.advanceTableForm.patchValue({ dutySlipNumber: selected.dutySlipID });
            this.advanceTableForm.patchValue({ customerPersonName: selected.customerpersonName || selected.customerPersonName });
            this.advanceTableForm.patchValue({ incidenceTime: selected.incidenceTime });
            this.advanceTableForm.patchValue({ openedByEmployeeDepartment: selected.openedByEmployeeDepartment});
            this.advanceTableForm.patchValue({ reportSource: selected.reportSource });
            this.advanceTableForm.patchValue({ reportedBy: selected.reportedBy });
            this.advanceTableForm.patchValue({ incidencePlace: selected.incidencePlace });
            this.advanceTableForm.patchValue({ openDate: selected?.openDate });
            this.advanceTableForm.patchValue({ openTime: selected?.openTime });
            this.advanceTableForm.patchValue({ reportingDate: selected.reportingDate });
            this.advanceTableForm.patchValue({ reportingTime: selected.reportingTime });
            this.advanceTableForm.patchValue({ assignedToEmployeeName: selected.assignedToEmployeeName});
            this.advanceTableForm.patchValue({ assignedToEmployeeID: selected.assignedToEmployeeID});
            this.advanceTableForm.patchValue({ assignedToEmployeeDepartment: selected.assignedToEmployeeDepartment });
            this.advanceTableForm.patchValue({ reporterName: selected.reporterName });
            this.advanceTableForm.patchValue({ incidenceDetails: selected.incidenceDetails });
            this.advanceTableForm.patchValue({ incidenceType: selected.incidenceType });
            this.advanceTableForm.patchValue({ incidenceTypeID: selected.incidenceTypeID });
            this.advanceTableForm.patchValue({ issueCategoryID: selected.issueCategoryID });
            this.incidenceTypeID = selected.incidenceTypeID;
            this.issueCategoryID = selected.issueCategoryID;
            if (this.incidenceTypeID) {
              this.initIssueCategory();
            } else {
              this.advanceTableForm.patchValue({ issueCategory: selected.issueCategory });
            }
            this.advanceTableForm.patchValue({ passengerID: selected.passengerID });
            this.advanceTableForm.patchValue({ reportEvidenceDoc: selected.reportEvidenceDoc });
            this.advanceTableForm.patchValue({ type: selected.type });  
            this.advanceTableForm.patchValue({ department: selected.department });              
            this.ImagePath = selected.reportEvidenceDoc;
          },
          (error: HttpErrorResponse) => { this.dataSource = null; }
        );
      //  this.tripBackAttachmentloadData();
    }
  }



