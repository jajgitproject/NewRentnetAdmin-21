// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChangeVendorModel } from 'src/app/changeVendor/changeVendor.model';
import { ChangeVendorService } from 'src/app/changeVendor/changeVendor.service';
import { GeneralService } from 'src/app/general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierDropDown } from 'src/app/supplier/supplierDropDown.model';
import {
  filterSuppliersByDisplay,
  formatSupplierDisplay,
  supplierMatchesDisplay,
} from 'src/app/supplier/supplier-display.util';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class ChangeVendorFormDialogComponent 
{
  showError?:string;
  action?:string;
  dialogTitle:string;
  advanceTableForm:FormGroup;
  advanceTable?:ChangeVendorModel;
  saveDisabled:boolean=true;

  public VendorList?:SupplierDropDown[] = [];
  filteredVendorOptions?:Observable<SupplierDropDown[]>;
  VendorID:any;
  formatSupplierDisplay = formatSupplierDisplay;

  ReservationID:any;

    constructor(
      public dialogRef: MatDialogRef<ChangeVendorFormDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) public data:any,
      public advanceTableService:ChangeVendorService,
      private fb:FormBuilder,
      public _generalService:GeneralService,
      private snackBar:MatSnackBar)
    {
      this.dialogTitle = 'Change Vendor';
      this.ReservationID = data?.advanceTable;
      this.advanceTableForm = this.createContactForm();
    }

    public ngOnInit(): void
    {
      this.InitVendor();
    }
  
    createContactForm(): FormGroup 
    {
      return this.fb.group(
      {
        reservationID:[this.ReservationID],
        changeType:['Vendor'],
        newRecordID:[this.advanceTable?.newRecordID || 0],
        newRecordName:[this.advanceTable?.newRecordName || null],
        reason:[this.advanceTable?.reason || ''],
      });
    }


    submit(){}
  
    showNotification(colorName: any, text: string, placementFrom: any, placementAlign: any) 
    {
      this.snackBar.open(text, '', {
        duration: 2000,
        verticalPosition: placementFrom,
        horizontalPosition: placementAlign,
        panelClass: colorName
      });
    }

    public Post(): void
    {    
      this.saveDisabled = false;
      this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      response => 
      {
        if (response && response?.message === "Data not found") 
        {
          this.showNotification(
            'snackbar-danger',
            'Vendor change failed...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
          return;
        }
        this.showNotification(
          'snackbar-success',
          'Vendor Changed Successfully...!!!',
          'bottom',
          'center'
        );
        this.dialogRef.close(true); 
        this.saveDisabled = true;        
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
      })
    }
  
    //---------- Vendor (SupplierName + OldRentnetCode, same as closingOne Change Supplier) ----------
    InitVendor()
    {
      this._generalService.GetAllSuppliers().subscribe(
      data=>
      {
        this.VendorList=data;
        this.advanceTableForm.controls['newRecordName'].setValidators([
          Validators.required,
          this.VendorValidator(this.VendorList)
        ]);
        this.advanceTableForm.controls['newRecordName'].updateValueAndValidity();
        this.filteredVendorOptions = this.advanceTableForm.controls['newRecordName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterVendor(value || ''))
        ); 
      });
    }

    private _filterVendor(value: string)
    {
      if (!value || value.length < 3) 
      {
        return [];
      }
      return filterSuppliersByDisplay(this.VendorList, value);
    }

    VendorValidator(VendorList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const match = VendorList.some(data => supplierMatchesDisplay(data, control.value));
        return match ? null : { vendorNameInvalid: true };
      };
    } 

    OnVendorSelect(selectedVendor: string)
    {
      const vendor = this.VendorList?.find(data => supplierMatchesDisplay(data, selectedVendor));
      if (vendor) 
      {
        this.getVendorID(vendor.supplierID, vendor.supplierName);
      }
    }

    getVendorID(VendorID:any, _supplierName?: string)
    {
      this.VendorID=VendorID;
      this.advanceTableForm.patchValue({
        newRecordID: this.VendorID
      });
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
}
