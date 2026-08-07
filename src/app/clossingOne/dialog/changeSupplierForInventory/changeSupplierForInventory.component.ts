import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from 'src/app/general/general.service';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ClossingOneService } from '../../clossingOne.service';
import { SupplierDropDown } from 'src/app/supplier/supplierDropDown.model';
import { ChangeSupplierForInventoryModel } from '../../clossingOne.model';
import {
  filterSuppliersByDisplay,
  formatSupplierDisplay,
  supplierMatchesDisplay,
} from 'src/app/supplier/supplier-display.util';

@Component({
  standalone: false,
  selector: 'app-changeSupplierForInventory',
  templateUrl: './changeSupplierForInventory.component.html',
  styleUrls: ['./changeSupplierForInventory.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogChangeSupplierForInventory
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  
  advanceTable : ChangeSupplierForInventoryModel | null;

  public SupplierList?: SupplierDropDown[] = [];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;
  supplierID: any;
  ReservationID: any;  
  AllotmentID: any;
  status: string = '';
  buttonDisabled = false;
  formatSupplierDisplay = formatSupplierDisplay;
  
  constructor(
  public dialogRef: MatDialogRef<FormDialogChangeSupplierForInventory>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public clossingOneService: ClossingOneService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
    // Set the defaults
    this.action = data.action;
    this.ReservationID = data.reservationID;
    this.AllotmentID = data.allotmentID;         
    this.dialogTitle ='Change Supplier';
    this.advanceTable = new ChangeSupplierForInventoryModel({});
    this.advanceTableForm = this.createContactForm();
    this.ReservationID = data.reservationID;
  }

  ngOnInit()
  {
    this.InitSupplier();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      dutySlipID: [this.advanceTable?.dutySlipID || 0],
      supplierID: [this.advanceTable?.supplierID || 0],
      supplierName: [this.advanceTable?. supplierName || null],
      reservationID:[this.ReservationID || 0],
      allotmentID:[this.AllotmentID || 0]
    });
  }

  public noWhitespaceValidator(control: FormControl) 
  {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }


  submit() {}

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

    public Put(): void
    {      
      this.advanceTableForm.patchValue({reservationID:this.ReservationID});
      this.clossingOneService.updateSupplierForInventory(this.advanceTableForm.getRawValue())  
      .subscribe(
        response => 
        {
          this.dialogRef.close();
          this.showNotification(
            'snackbar-success',
            'Supplier Updated...!!!',
            'bottom',
            'center'
          );
        },
      error =>
      {
        console.error('Save Error:', error);
        this.showNotification(
          'snackbar-danger',
          'Operation Failed...!!!',
          'bottom',
          'center'
        );
      })
    }


  //---------- Supplier ----------
  InitSupplier() 
  {
    this._generalService.GetAllSuppliers().subscribe(
    data => {
      this.SupplierList = data;
      this.advanceTableForm.controls['supplierName'].setValidators([
        Validators.required,
        this.SupplierValidator(this.SupplierList)
      ]);
      this.advanceTableForm.controls['supplierName'].updateValueAndValidity();
      this.filteredSupplierOptions = this.advanceTableForm.controls['supplierName'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterSupplier(value || ''))
      );
    });
  }

  SupplierValidator(SupplierList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const match = SupplierList.some(data => supplierMatchesDisplay(data, control.value));
      return match ? null : { pickupCityInvalid: true };
    };
  }

  private _filterSupplier(value: string): any {
    if (!value || value.length < 3) {
      return [];
    }
    return filterSuppliersByDisplay(this.SupplierList, value);
  }

  OnSupplierSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierList.find(
      data => supplierMatchesDisplay(data, selectedSupplier)
    );
    if (SupplierName) 
    {
      this.getSupplierID(SupplierName.supplierID);
    }
  }
  getSupplierID(supplierID: any) 
  {
    this.supplierID = supplierID;
    this.advanceTableForm.patchValue({supplierID: this.supplierID});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
