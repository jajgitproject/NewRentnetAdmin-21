// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { CurrencyDropDown } from 'src/app/general/currencyDropDown.model';
import { QualificationDropDown } from 'src/app/general/qualificationDropDown.model';
import { VehicleCategoryDropDown } from 'src/app/vehicleCategory/vehicleCategoryDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntity/organizationalEntityDropDown.model';
import { SupplierDropDown } from 'src/app/supplier/supplierDropDown.model';
import { CitiesDropDown } from 'src/app/organizationalEntity/citiesDropDown.model';
import { ColorDropDown } from 'src/app/color/colorDropDown.model';
import { FuelTypeDropDown } from 'src/app/fuelType/fuelTypeDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { CustomerGroupDropDown } from 'src/app/customerGroup/customerGroupDropDown.model';
import { CustomerTypeDropDown } from 'src/app/customerType/customerTypeDropDown.model';
import { CustomerCategoryDropDown } from 'src/app/customerCategory/customerCategoryDropDown.model';
import { CountryDropDown } from 'src/app/general/countryDropDown.model';
import { StatesDropDown } from 'src/app/organizationalEntity/stateDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DriverDropDown } from 'src/app/customerPersonDriverRestriction/driverDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicEInvoiceService } from '../../dynamicEInvoice.service';
import { DynamicEInvoiceModel } from '../../dynamicEInvoice.model';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DynamicEInvoiceModel;

  saveDisabled:boolean = true;
  IGSTPercentage: any;
  CGSTPercentage: any;
  SGSTPercentage: any;
  activationStatus: boolean = true;
  CreditNoteAmt: any;
  grtThanCNA: boolean = false;
  DutySlipID: any;

  dataSource:DynamicEInvoiceModel | null;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>, 
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dynamicEInvoiceService: DynamicEInvoiceService,
    private fb: FormBuilder,
    private el: ElementRef,
    public router: Router,
    public _generalService:GeneralService)
  {
        // Set the defaults
        this.data = data.data;
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Cancel E - Invoice';       
          this.advanceTable = data.advanceTable;
        } 
        else 
        {
          this.dialogTitle = 'Cancel E - Invoice';
          this.advanceTable = data.advanceTable;
          //this.advanceTable = new DynamicEInvoiceModel({});
        }
       this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {   
  }

  onNoClick(action: string) 
  {
    if(action === 'add') 
    {
      this.advanceTableForm.reset();
    }
    else
    {
      this.dialogRef.close();
    }
  }

  formControl = new FormControl('', 
  [
    Validators.required
  ]);
  
  getErrorMessage() 
  {
    return this.formControl.hasError('required') ? 'Required field'  : '';
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      invoiceNumber: [this.advanceTable?.invoiceNumber || this.data?.invoiceNumberWithPrefix],
      // irn: [this.advanceTable?.irn || this.data?.irn],
      // ecoGSTNo: [this.advanceTable?.ecoGSTNo || "27AAACW3775F007"],
      cancelReason:[this.advanceTable?.cancelReason],
      cancelRemark: [this.advanceTable?.cancelRemark]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}


  submit() 
  {
    // emppty stuff
  }
  reset(): void 
  {
    this.advanceTableForm.reset();
  }

  public Post(): void
  {      
    this.dynamicEInvoiceService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      if (!response?.result)  // swapped logic here
      {
        this.showNotification(
          'snackbar-success',
          'E - Invoice Cancelled...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
        this.dialogRef.close(true);
      } 
      else 
      {
        Swal.fire({
          title: response.result,
          // icon: 'error'
        });
        this.dialogRef.close(true);
      }
    },
    error =>
    {
      const errorMessage = error || 'Operation Failed.....!!!';
      Swal.fire({
                 title: errorMessage,
                 icon: 'error'
                });
      this.saveDisabled = true;
    })
  }

  // public Put(): void
  // { 
  //   this.creditNoteDutyAdjustmentService.update(this.advanceTableForm.getRawValue())  .subscribe(
  //   response => 
  //   {
  //     this.dialogRef.close(true);
  //     this.showNotification(
  //       'snackbar-success',
  //       'Duty Adjusted...!!!',
  //       'bottom',
  //       'center'
  //       );
  //     this.saveDisabled = true;
  //     },
  //     error =>
  //     {
  //       this.showNotification(
  //         'snackbar-danger',
  //         'Operation Failed...!!!',
  //         'bottom',
  //         'center'
  //       );
  //     this.saveDisabled = true;
  //   })
  // }

   
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  public confirmAdd(): void 
  {
    this.saveDisabled = false;
    if(this.action=="edit")
    {
      //this.Put();
    }
    else
    {
      this.Post();
    }
  }


}


