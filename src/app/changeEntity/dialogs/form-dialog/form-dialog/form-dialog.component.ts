// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { Observable } from 'rxjs';
import { CustomerCustomerGroupDropDown } from 'src/app/customer/customerCustomerGroupDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { ChangeEntityModel } from 'src/app/changeEntity/changeEntity.model';
import { ChangeEntityService } from 'src/app/changeEntity/changeEntity.service';
import { GeneralService } from 'src/app/general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class MessageBoxFormDialogComponent {
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: ChangeEntityModel[];
  saveDisabled: boolean = true;

  filteredCustomerOptions: Observable<CustomerCustomerGroupDropDown[]>;
  CustomerList: CustomerCustomerGroupDropDown[] = [];
  customerID: any;

  constructor(
    public dialogRef: MatDialogRef<MessageBoxFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: ChangeEntityService,
    private fb: FormBuilder,
    public _generalService: GeneralService,
    private snackBar: MatSnackBar,) {
    // Set the defaults
    this.dialogTitle = 'Select Entity to be assigned';
    this.advanceTable = data?.advanceTable;
    // this.advanceTable.userID = data.userID;
    this.advanceTableForm = this.createContactForm();
  }

  public ngOnInit(): void {
    this.InitCustomerForMessage();
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        customerName: [],
        customerID: [],
      });
  }


  submit() { }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public Put(): void {
    this.saveDisabled = false;
    this.advanceTableService.update(this.advanceTable, this.customerID).subscribe(
      {
        next: (response) => {
          debugger
          if (!response.isSuccess) {
            const errors = response.Errors || ['Operation Failed'];


            Swal.fire({
              title: 'Validation Errors',
              icon: 'error',
              html: `<b><div style="text-align:left;">
              ${errors.map((e: string) => `• ${e}`).join('<br>')}
             </div></b>`,
              confirmButtonText: 'OK',
              width: '800px'
            })


            this.saveDisabled = true;
            return;
          }

          // ✅ SUCCESS CASE
          if (response.successMessages?.length) {
            const formattedMessages = response.successMessages.map((msg: string) => {
            const parts = msg.replace('Success:', '').trim().split(' ');
            const reservationNo = parts[0];
            const dutySlipNo = parts[1];
            return `ReservationNo: ${reservationNo} , DutySlipNo: ${dutySlipNo}`;
          });

            Swal.fire({
              icon: 'success',
              title: 'Entity updated successfully!',
              html: `<div style="text-align:left;">
              ${formattedMessages.map((m: string) => `• ${m}`).join('<br>')}
             </div>`,
              confirmButtonText: 'OK'
            });
          }


          this.dialogRef.close(true);
          this.saveDisabled = true;
        },

        error: (error) => {
          this.showNotification(
            'snackbar-danger',
            'Operation Failed',
            'bottom',
            'center'
          );

          this.saveDisabled = true;
        },
      });
  }

  InitCustomerForMessage() {
    this.advanceTableService.getCustomersForMessage().subscribe(
      data => {
        this.CustomerList = data;
        this.advanceTableForm.controls['customerName'].setValidators([Validators.required, this.customerValidator(this.CustomerList)]);
        this.advanceTableForm.controls['customerName'].updateValueAndValidity();
        this.filteredCustomerOptions = this.advanceTableForm.controls['customerName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterRD(value || ''))
        );
      });
  }

  private _filterRD(value: string): any[] {
    const filterValue = (value || '').toString().trim().toLowerCase();
    if (!value || value.length < 3) {
      return [];
    }
    return this.CustomerList?.filter(customer => {
      const name = (customer.customerName || '').toString().toLowerCase();
      const groupname = (customer.customerGroup || '').toString().toLowerCase();
      const tally = (customer.tallyCustomerID || '').toString().toLowerCase();
      const state = (customer.stateName || '').toString().toLowerCase();
      const city = (customer.cityName || '').toString().toLowerCase();

      // Return true if typed value matches name OR tally OR state
      return name.includes(filterValue) || groupname.includes(filterValue) || tally.includes(filterValue) || state.includes(filterValue) || city.includes(filterValue);
    }) || [];
  }


  onCustomerSelected(selectedCustomerName: string) {
    const selectedCustomer = this.CustomerList.find(
      data => data.customerName + '-' + data.customerGroup + '-' + data.tallyCustomerID + '-' + data.stateName + '-' + data.cityName === selectedCustomerName);
    if (selectedCustomer) {
      this.getCustomerID(selectedCustomer.customerID);
    }
  }

  getCustomerID(customerID: any) {
    this.customerID = customerID;
    this.advanceTableForm.patchValue({ customerID: this.customerID });
  }

  customerValidator(CustomerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CustomerList.some(data => ((data.customerName + '-' + data.customerGroup + '-' + data.tallyCustomerID + '-' + data.stateName + '-' + data.cityName).toLowerCase()) === value);
      return match ? null : { customerInvalid: true };
    };
  }

}


