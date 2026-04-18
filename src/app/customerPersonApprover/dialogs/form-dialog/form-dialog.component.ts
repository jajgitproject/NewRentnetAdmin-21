// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { CustomerPersonApproverService } from '../../customerPersonApprover.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { CustomerPersonApprover } from '../../customerPersonApprover.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { DriverDropDown } from '../../driverDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerDropDown } from 'src/app/general/customerDropDown.model';
import moment from 'moment';
import { of } from 'rxjs';

import { CustomerPersonModels } from 'src/app/customerCorporateIndividual/customerCorporateIndividual.model';
@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerPersonApprover;
  searchTerm: FormControl = new FormControl();

  public DriverList?: DriverDropDown[] = [];
  filteredOptions: Observable<DriverDropDown[]>;
  public CustomerList?: CustomerDropDown[] = [];
  searchCustomer: FormControl = new FormControl();
  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  filteredCustomerPersonNameOptions: Observable<CustomerPersonModels[]>;
  public CustomerPersonList?: CustomerPersonModels[] = [];

  image: any;
  fileUploadEl: any;
  customerPersonName: any;
  correspondingOption: DriverDropDown;
  driverID: any;
  saveDisabled: boolean = true;
  customerID: any;
  approverID: any;
  customerGroupID: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: CustomerPersonApproverService,
    private fb: FormBuilder,
    private el: ElementRef,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Customer person Approver for';
      this.advanceTable = data.advanceTable;
      console.log(data);
      this.customerGroupID = data.CustomerGroupID || this.advanceTable.customerGroupID;

      if (!this.customerGroupID) {
        console.warn('CustomerGroupID is missing!');
      }


      if (!this.customerGroupID) {
        console.warn('CustomerGroupID is missing!');
      }
      this.customerGroupID = data.CustomerGroupID
      let startDate = moment(this.advanceTable.startDate).format('DD/MM/yyyy');
      //let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
      this.onBlurStartDateEdit(startDate);
      //this.onBlurSEZToDateEdit(endDate);
      //this.searchTerm.setValue(this.advanceTable.driver);
      if (this.advanceTable.endDate) {
        const endDate = moment(this.advanceTable.endDate).format('DD/MM/YYYY');
        this.onBlurSEZToDateEdit(endDate);
      }
    } else {
      this.dialogTitle = 'Customer person Approver for';
      this.advanceTable = new CustomerPersonApprover({});
      this.advanceTable.customerPersonApproverStatus = true;
    }
    this.advanceTableForm = this.createContactForm();
    this.customerPersonName = data.CustomerPersonName;
  }
  public ngOnInit(): void {
    //this.InitCustomerPerson(this.data.customerGroupID);
    if (this.data && this.data.customerGroupID) {
      this.InitCustomerPerson(this.data.customerGroupID);
    } else {
      console.warn("customerGroupID is undefined! Cannot load CustomerPerson.");
    }


  }
  InitDriver() {
    this._generalService.GetDriver().subscribe
      (
        data => {
          this.DriverList = data;
          this.advanceTableForm?.controls['driver'].setValidators([Validators.required,
          this.driverValidator(this.DriverList)
          ]);
          this.advanceTableForm?.controls['driver'].updateValueAndValidity();
          this.filteredOptions = this.advanceTableForm.controls['driver'].valueChanges.pipe(
            startWith(""),
            map(value => this._filter(value || ''))
          );
        }
      );
  }

  getTitle(driverID: any) {
    this.driverID = driverID;
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];
    }
    return this.DriverList.filter(
      customer => {
        return customer.driverName.toLowerCase().includes(filterValue);
      });
  }
  OnDriverSelect(selectedDriver: string) {
    const DriverName = this.DriverList.find(
      data => data.driverName === selectedDriver
    );
    if (selectedDriver) {
      this.getTitle(DriverName.driverID);
    }
  }
  driverValidator(DriverList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = DriverList.some(group => group.driverName.toLowerCase() === value);
      return match ? null : { driverNameInvalid: true };
    };
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
        customerPersonApproverID: [this.advanceTable.customerPersonApproverID],
        customerPersonID: [this.advanceTable.customerPersonID],
        approverName: [this.advanceTable.approverName],
        approverID: [this.advanceTable.approverID],
        startDate: [this.advanceTable.startDate],
        endDate: [this.advanceTable.endDate],
        customerPersonApproverStatus: [this.advanceTable.customerPersonApproverStatus]
        // driverID: [this.advanceTable.driverID],
        // driver:[this.advanceTable.driver],
        // remark: [this.advanceTable.remark],
        // activationStatus: [this.advanceTable.activationStatus]
      });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() {
    // emppty stuff
  }
  reset(): void {
    this.advanceTableForm.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public Post(): void {
    this.advanceTableForm?.patchValue({ driverID: this.driverID });
    this.advanceTableForm?.patchValue({ customerPersonID: this.data.CustomerPersonID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerPersonApproverCreate:CustomerPersonApproverView:Success');//To Send Updates 
          this.saveDisabled = true;

        },
        error => {
          this._generalService.sendUpdate('CustomerPersonApproverAll:CustomerPersonApproverView:Failure');//To Send Updates
          this.saveDisabled = true;
        }
      )
  }
  public Put(): void {
    //this.advanceTableForm.patchValue({driverID:this.driverID || this.advanceTable.driverID});
    this.advanceTableForm?.patchValue({ customerPersonID: this.advanceTable.customerPersonID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerPersonApproverUpdate:CustomerPersonApproverView:Success');//To Send Updates 
          this.saveDisabled = true;

        },
        error => {
          this._generalService.sendUpdate('CustomerPersonApproverAll:CustomerPersonApproverView:Failure');//To Send Updates 
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

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm?.patchValue({ image: this.ImagePath })
  }

  // public fileChanged(event?: UIEvent): void {
  //   const files: FileList = this.fileUploadEl.nativeElement.files;

  //   const file = files[0];
  //   const reader = new FileReader();
  //   const loaded = (el) => {
  //     const contents = el.target.result;
  //     this.contents = contents;
  //   }
  //   reader.onload = loaded;
  //   reader.readAsText(file, 'UTF-8');
  //   this.name = file.name;
  // }

  // onSelectFile(event) {
  //   const files = event.target.files;
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         if (file.type.indexOf('image') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'img',
  //           });
  //         } else if (file.type.indexOf('video') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'video',
  //           });
  //         } else if (file.type.indexOf('pdf') > -1) {
  //           this.mydata.push({
  //             url: e.target.result,
  //             type: 'pdf',
  //           });
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

  /////////////////for Image Upload ends////////////////////////////

  // Only Numbers with Decimals
  // keyPressNumbersDecimal(event) {
  //   var charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode != 46 && charCode > 31
  //     && (charCode < 48 || charCode > 57)) {
  //     event.preventDefault();
  //     return false;
  //   }
  //   return true;
  // }

  // Only AlphaNumeric
  // keyPressAlphaNumeric(event) {

  //   var inp = String.fromCharCode(event.keyCode);

  //   if (/[a-zA-Z]/.customerPersonApprover(inp)) {
  //     return true;
  //   } else {
  //     event.preventDefault();
  //     return false;
  //   }
  // }

  //----------- Customer Name Validation --------------
  customerNameValidator(CustomerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerList.some(employee => employee.customerName.toLowerCase() === value);
      return match ? null : { customerNameInvalid: true };
    };
  }

  InitCustomer() {
    this._generalService.GetCustomers().subscribe(
      data => {
        this.CustomerList = data;
        this.advanceTableForm?.controls['customerName']?.setValidators([Validators.required,
        this.customerNameValidator(this.CustomerList)]);
        this.advanceTableForm?.controls['customerName']?.updateValueAndValidity();
        this.filteredCustomerOptions = this.advanceTableForm?.controls['customerName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomer(value || ''))
        );
      },
      error => { }
    );
  }
  private _filterCustomer(value: string): any {
    const filterValue = value.toLowerCase();
    // Only show results if 3 or more characters are typed
    if (filterValue.length < 3) {
      return [];
    }
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
    this.advanceTableForm?.patchValue({ customerID: this.customerID });
  }

  //start date
  onBlurSEZStartDate(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm?.get('startDate')?.setValue(formattedDate);
    }
    else {
      this.advanceTableForm?.get('startDate')?.setErrors({ invalidDate: true });
    }
  }

  onBlurStartDateEdit(value: string): void {
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if (this.action === 'edit') {
        this.advanceTable.startDate = formattedDate
      }
      else {
        this.advanceTableForm?.get('customerConfigurationSEZStartDate')?.setValue(formattedDate);
      }
    }
    else {
      this.advanceTableForm?.get('customerConfigurationSEZStartDate')?.setErrors({ invalidDate: true });
    }
  }

  //to date
  onBlurSEZToDate(value: string): void {
    value = this._generalService.resetDateiflessthan12(value);
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm?.get('endDate')?.setValue(formattedDate);
    }
    else {
      this.advanceTableForm?.get('endDate')?.setErrors({ invalidDate: true });
    }
  }

  onBlurSEZToDateEdit(value: string): void {
    const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
    if (validDate) {
      const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      if (this.action === 'edit') {
        this.advanceTable.endDate = formattedDate
      }
      else {
        this.advanceTableForm?.get('endDate')?.setValue(formattedDate);
      }
    } else {
      this.advanceTableForm?.get('endDate')?.setErrors({ invalidDate: true });
    }
  }


  CustomerPersonValidator(CustomerPersonList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerPersonList.some(group => group.approverName.toLowerCase() === value);
      return match ? null : { CustomerPersonInvalid: true };
    };
  }
  InitCustomerPerson(customerGroupID: number) {
    if (!customerGroupID) return; // undefined hone par call mat karo

    this.advanceTableService.getCustomerPersonForApproval(customerGroupID).subscribe(
      data => {
        this.CustomerPersonList = data || [];

        // Set validators
        this.advanceTableForm.controls['approverName'].setValidators([
          Validators.required,
          this.CustomerPersonValidator(this.CustomerPersonList)
        ]);
        this.advanceTableForm.controls['approverName'].updateValueAndValidity();

        // Setup autocomplete for typing
        this.filteredCustomerPersonNameOptions = this.advanceTableForm.controls['approverName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterCustomerPerson(value || ''))
        );
      }
    );
  }

  private _filterCustomerPerson(value: string): any {
    if (!this.CustomerPersonList) return [];

    const filterValue = value.toLowerCase().trim();

    // Use includes instead of indexOf===0 for better matching
    return this.CustomerPersonList.filter(
      data => data.approverName?.toLowerCase().includes(filterValue)
    );
  }

  OnCustomerPerson(selectedCustomerPerson: string) {
    const CustomerPerson = this.CustomerPersonList.find(
      data => data.approverName === selectedCustomerPerson
    );
    console.log(CustomerPerson);
    if (CustomerPerson) {
      this.getCustomerPersonID(CustomerPerson.approverID);
    }
  }

  getCustomerPersonID(approverID: any) {
    this.approverID = approverID;
    this.advanceTableForm.patchValue({ approverID: this.approverID });
  }

}



