// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { SupplierContractCustomerPackageTypePercentageService } from '../../supplierContractCustomerPackageTypePercentagePercentage.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { SupplierContractCustomerPackageTypePercentage } from '../../supplierContractCustomerPackageTypePercentage.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { OrganizationalEntityDropDown } from 'src/app/general/organizationalEntityDropDown.model';
import { DepartmentDropDown } from 'src/app/general/departmentDropDown.model';
import { DesignationDropDown } from 'src/app/general/designationDropDown.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { PackageTypeDropDown } from 'src/app/general/packageTypeDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerDropDown } from 'src/app/supplierCustomerFixedForAllPercentage/customerDropDown.model';
import moment from 'moment';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponentHolder {
  employeeID: number;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  public OrganizationalEntityList?: OrganizationalEntityDropDown[] = [];
  public PackageTypeList?: PackageTypeDropDown[] = [];
  public DesginationList?: DesignationDropDown[] = [];
  public CustomerList?: CustomerDropDown[] = [];
  searchCustomer: FormControl = new FormControl();
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  searchPackageType: FormControl = new FormControl();
  filteredPackageTypeOptions: Observable<PackageTypeDropDown[]>;
  isLoading: boolean = false;

  image: any;
  advanceTable: SupplierContractCustomerPackageTypePercentage;
  applicableFrom: any;
  applicableTo: any;
  supplierName: any;
  customerID: any;
  packageTypeID: any;
  // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponentHolder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public advanceTableService: SupplierContractCustomerPackageTypePercentageService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {

      this.dialogTitle = 'Customer Wise Package Type Percentage For';
      this.advanceTable = data.advanceTable;
      this.searchCustomer.setValue(this.advanceTable.customerName);
      this.searchPackageType.setValue(this.advanceTable.packageType);
      let fromDate = moment(this.advanceTable.fromDate).format('DD/MM/yyyy');
      let toDate = moment(this.advanceTable.toDate).format('DD/MM/yyyy');
      this.onBlurUpdateDateFromEdit(fromDate);
      this.onBlurUpdateDateToEdit(toDate);
    } else {
      this.dialogTitle = 'Customer Wise Package Type Percentage For';
      this.advanceTable = new SupplierContractCustomerPackageTypePercentage({});
      this.advanceTable.activationStatus = true;

    }
    this.advanceTableForm = this.createContactForm();
    this.applicableFrom = data.ApplicableFrom;
    this.applicableTo = data.ApplicableTo;
    this.supplierName = data.SupplierName;
    this.searchCustomer.setValue(this.advanceTable.customerName);
    this.searchPackageType.setValue(this.advanceTable.packageType);
  }
  public ngOnInit(): void {
    this.InitCustomer();
    this.InitPackage();
    // this._generalService.GetPackageType().subscribe
    // (
    //   data =>   
    //   {
    //     this.PackageTypeList = data;

    //   }
    // );

  }

  //----------- Package Validation --------------
  packageValidator(PackageTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = PackageTypeList.some(employee => employee.packageType.toLowerCase() === value);
      return match ? null : { packageInvalid: true };
    };
  }


  InitPackage() {
    this._generalService.GetPackageType().subscribe(
      data => {
        ;
        this.PackageTypeList = data;
        this.advanceTableForm.controls['packageType'].setValidators([Validators.required,
        this.packageValidator(this.PackageTypeList)]);
        this.advanceTableForm.controls['packageType'].updateValueAndValidity();
        this.filteredPackageTypeOptions = this.advanceTableForm.controls['packageType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterPackage(value || ''))
        );
      },
      error => {

      }
    );
  }
  private _filterPackage(value: string): any {
    const filterValue = value.toLowerCase();
    return this.PackageTypeList.filter(
      customer => {
        return customer.packageType.toLowerCase().includes(filterValue);
      }
    );
  }

  onPackageSelected(selectedPackage: string) {
    const selectedValue = this.PackageTypeList.find(
      data => data.packageType === selectedPackage
    );

    if (selectedValue) {
      this.getTitlespackageTypeID(selectedValue.packageTypeID);
    }
  }
  getTitlespackageTypeID(packageTypeID: any) {
    this.packageTypeID = packageTypeID;
  }

  //----------- Customer Validation --------------
  customerValidator(CustomerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerList.some(employee => employee.customerName.toLowerCase() === value);
      return match ? null : { customerNameInvalid: true };
    };
  }


  InitCustomer() {
    this._generalService.GetCustomers().subscribe(
      data => {
        ;
        this.CustomerList = data;
        this.advanceTableForm.controls['customerName'].setValidators([Validators.required,
        this.customerValidator(this.CustomerList)]);
        this.advanceTableForm.controls['customerName'].updateValueAndValidity();
        this.filteredCustomerOptions = this.advanceTableForm.controls["customerName"].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        );
      },
      error => {

      }
    );
  }
  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    return this.CustomerList.filter(
      customer => {
        return customer.customerName.toLowerCase().includes(filterValue);
      }
    );
  }
  onCustomerSelected(selectedCustomer: string) {
    const selectedValue = this.CustomerList.find(
      data => data.customerName === selectedCustomer
    );

    if (selectedValue) {
      this.getTitles(selectedValue.customerID);
    }
  }
  getTitles(customerID: any) {
    this.customerID = customerID;
  }
  formControl = new FormControl('',
    [
      Validators.required
      // Validators.email,
    ]);
  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        supplierContractCustomerPackageTypePercentageID: [this.advanceTable.supplierContractCustomerPackageTypePercentageID],
        supplierContractID: [this.advanceTable.supplierContractID],
        packageTypeID: [this.advanceTable.packageTypeID],
        packageType: [this.advanceTable.packageType],
        fromDate: [this.advanceTable.fromDate, [Validators.required, this._generalService.dateValidator()]],
        toDate: [this.advanceTable.toDate, [Validators.required, this._generalService.dateValidator()]],
        customerID: [this.advanceTable.customerID],
        customerName: [this.advanceTable.customerName],
        supplierPercentage: [this.advanceTable.supplierPercentage,],
        activationStatus: [this.advanceTable.activationStatus],
      });
  }


  //start date
  onBlurUpdateDateFrom(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);

    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('fromDate')?.setValue(formattedDate);
    } else {
      this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
    }
  }


  onBlurUpdateDateFromEdit(value: string): void {
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if (this.action === 'edit') {
        this.advanceTable.fromDate = formattedDate
      }
      else {
        this.advanceTableForm.get('fromDate')?.setValue(formattedDate);
      }

    } else {
      this.advanceTableForm.get('fromDate')?.setErrors({ invalidDate: true });
    }
  }


  //end date
  onBlurUpdateDateTo(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);

    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('toDate')?.setValue(formattedDate);
    } else {
      this.advanceTableForm.get('toDate')?.setErrors({ invalidDate: true });
    }
  }

  onBlurUpdateDateToEdit(value: string): void {
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if (this.action === 'edit') {
        this.advanceTable.toDate = formattedDate
      }
      else {
        this.advanceTableForm.get('toDate')?.setValue(formattedDate);
      }

    } else {
      this.advanceTableForm.get('toDate')?.setErrors({ invalidDate: true });
    }
  }


  // InitCustomer(){
  //   this._generalService.GetCustomers().subscribe(
  //     data=>{
  //       this.CustomerList=data;
  //     }
  //   )
  // }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
    // emppty stuff
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
    this.isLoading = true;
    this.advanceTableForm.patchValue({ supplierContractID: this.data.SupplierContractID });
    this.advanceTableForm.patchValue({ customerID: this.customerID });
    this.advanceTableForm.patchValue({ packageTypeID: this.packageTypeID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          //debugger;
          this.isLoading = false;
          this.dialogRef.close();

          this._generalService.sendUpdate('SupplierContractCustomerPackageTypePercentageCreate:SupplierContractCustomerPackageTypePercentageView:Success');//To Send Updates  


        },
        error => {

          this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractCustomerPackageTypePercentageAll:SupplierContractCustomerPackageTypePercentageView:Failure');//To Send Updates  
        }
      )
  }
  public Put(): void {
    this.isLoading = true;
    this.advanceTableForm.patchValue({ supplierContractID: this.advanceTable.supplierContractID });
    this.advanceTableForm.patchValue({ packageTypeID: this.packageTypeID || this.advanceTable.packageTypeID });
    this.advanceTableForm.patchValue({ customerID: this.customerID || this.advanceTable.customerID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;
          this.dialogRef.close();
          this._generalService.sendUpdate('SupplierContractCustomerPackageTypePercentageUpdate:SupplierContractCustomerPackageTypePercentageView:Success');//To Send Updates 

        },
        error => {
          this.isLoading = false;
          this._generalService.sendUpdate('SupplierContractCustomerPackageTypePercentageAll:SupplierContractCustomerPackageTypePercentageView:Failure');//To Send Updates  
        }
      )
  }
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  SubscribeUpdateService() {
    this.subscriptionName = this._generalService.getUpdate().subscribe
      (
        message => {
          //message contains the data sent from service
          this.messageReceived = message.text;
          this.MessageArray = this.messageReceived.split(":");

          if (this.MessageArray.length == 3) {
            if (this.MessageArray[0] == "SupplierContractCustomerPackageTypePercentageCreate") {
              if (this.MessageArray[1] == "SupplierContractCustomerPackageTypePercentageView") {
                if (this.MessageArray[2] == "Success") {
                  //debugger;

                  this.showNotification(
                    'snackbar-success',
                    'Organizational Entity Stake Holders Created...!!!',
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
  public confirmAdd(): void {
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }
}



