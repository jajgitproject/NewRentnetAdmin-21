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
import { CountryCodeDropDown } from 'src/app/general/countryCodeDropDown.model';
import { DriverSupplierModel, InvoiceCreditNoteDutySlipAdjustmentModel } from '../../creditNoteDutyAdjustment.model';
import { CreditNoteDutyAdjustmentService } from '../../creditNoteDutyAdjustment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DriverDropDown } from 'src/app/customerPersonDriverRestriction/driverDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';

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
  advanceTable: InvoiceCreditNoteDutySlipAdjustmentModel;
 
  filteredDriverOptions:Observable<DriverDropDown[]>;
  public DriverList?:DriverDropDown[]=[];
  driverID:any;

  public SupplierList?: SupplierDropDown[] = [];
  filteredSupplierOptions: Observable<SupplierDropDown[]>;
  supplierID:any;

  public SupplierForOwnerList?: SupplierDropDown[] = [];
  filteredSupplierForOwnerOptions: Observable<SupplierDropDown[]>;

  saveDisabled:boolean = true;
  IGSTPercentage: any;
  CGSTPercentage: any;
  SGSTPercentage: any;
  activationStatus: boolean = true;
  CreditNoteAmt: any;
  grtThanCNA: boolean = false;
  DutySlipID: any;

  dataSource:DriverSupplierModel | null;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>, 
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public creditNoteDutyAdjustmentService: CreditNoteDutyAdjustmentService,
    private fb: FormBuilder,
    private el: ElementRef,
    public router: Router,
    public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.CreditNoteAmt = data.advanceTable?.creditNoteAmount;
        this.DutySlipID = data.advanceTable?.dutySlipID;
        console.log(this.DutySlipID)
        if (this.action === 'edit') 
        {
          this.loadData();
          this.dialogTitle ='Duty Adjustment';       
          this.advanceTable = data.advanceTable;
          this.IGSTPercentage = data.advanceTable?.igstPercentage || 0;
          this.CGSTPercentage = data.advanceTable?.cgstPercentage || 0;
          this.SGSTPercentage = data.advanceTable?.sgstPercentage || 0;
        } 
        else 
        {
          this.loadData();
          this.dialogTitle = 'Duty Adjustment';
          this.advanceTable = data.advanceTable;
          this.IGSTPercentage = data.advanceTable?.igstPercentage || 0;
          this.CGSTPercentage = data.advanceTable?.cgstPercentage || 0;
          this.SGSTPercentage = data.advanceTable?.sgstPercentage || 0;
          //this.advanceTable = new InvoiceCreditNoteDutySlipAdjustmentModel({});
        }
       this.advanceTableForm = this.createContactForm();
  }
  public ngOnInit(): void
  {
    //this.InitDriver();
    //this.InitSupplier();
    this.InitSupplierForOwner();    
  }

  public loadData() 
  {
    this.creditNoteDutyAdjustmentService.getDriverSupplier(this.DutySlipID).subscribe(
    data => 
    {
      this.dataSource = data;
      if (this.advanceTableForm.value.debitedTo === 'Driver')
      {
        this.advanceTableForm.patchValue({debitedToDriverID:this.dataSource.driverID});
        this.advanceTableForm.patchValue({debitedToDriverName:this.dataSource.driverName});
      }
      else if (this.advanceTableForm.value.debitedTo === 'Supplier')
      {
        this.advanceTableForm.patchValue({debitedToSupplierID:this.dataSource.supplierID});
        this.advanceTableForm.patchValue({debitedToSupplierName:this.dataSource.supplierName});
      }
    },
    (error: HttpErrorResponse) => { this.dataSource = null; });
  }

  changeFields() 
  {
    if (this.advanceTableForm.value.debitedTo === 'Driver')
    {
      // Driver required
      this.advanceTableForm.controls['debitedToDriverName'].setValidators([Validators.required]);
      this.advanceTableForm.controls['debitedToEcoName'].clearValidators();
      this.advanceTableForm.controls['debitedToSupplierName'].clearValidators();

      this.advanceTableForm.controls['debitedToEcoName'].setValue('');
      this.advanceTableForm.controls['debitedToEcoID'].setValue(0);
      this.advanceTableForm.controls['debitedToSupplierName'].setValue('');
      this.advanceTableForm.controls['debitedToSupplierID'].setValue(0);
    }
    else if (this.advanceTableForm.value.debitedTo === 'Eco') 
    {
      // Eco required
      this.advanceTableForm.controls['debitedToEcoName'].setValidators([Validators.required]);
      this.advanceTableForm.controls['debitedToDriverName'].clearValidators();
      this.advanceTableForm.controls['debitedToSupplierName'].clearValidators();

      this.advanceTableForm.controls['debitedToSupplierID'].setValue(0);
      this.advanceTableForm.controls['debitedToSupplierName'].setValue('');
      this.advanceTableForm.controls['debitedToDriverID'].setValue(0);
      this.advanceTableForm.controls['debitedToDriverName'].setValue('');
    }
    else if (this.advanceTableForm.value.debitedTo === 'Supplier') 
    {
      // Supplier required
      this.advanceTableForm.controls['debitedToSupplierName'].setValidators([Validators.required]);
      this.advanceTableForm.controls['debitedToDriverName'].clearValidators();
      this.advanceTableForm.controls['debitedToEcoName'].clearValidators();

      this.advanceTableForm.controls['debitedToDriverID'].setValue(0);
      this.advanceTableForm.controls['debitedToDriverName'].setValue('');
      this.advanceTableForm.controls['debitedToEcoID'].setValue(0);
      this.advanceTableForm.controls['debitedToEcoName'].setValue('');
    }    
    this.advanceTableForm.controls['debitedToDriverName'].updateValueAndValidity();
    this.advanceTableForm.controls['debitedToEcoName'].updateValueAndValidity();
    this.advanceTableForm.controls['debitedToSupplierName'].updateValueAndValidity();
    this.loadData();
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
      invoiceCreditNoteDutySlipAdjustmentID: [this.advanceTable?.invoiceCreditNoteDutySlipAdjustmentID],
      invoiceCreditNoteID:[this.advanceTable?.invoiceCreditNoteID],
      dutySlipID: [this.advanceTable?.dutySlipID],
      invoiceID: [this.advanceTable?.invoiceID],      
      amount: [this.advanceTable?.amount],
      cgstAmount: [this.advanceTable?.cgstAmount],
      cgstPercentage :[this.advanceTable?.cgstPercentage],
      igstAmount: [this.advanceTable?.igstAmount],
      igstPercentage: [this.advanceTable?.igstPercentage],
      sgstAmount :[this.advanceTable?.sgstAmount],
      sgstPercentage: [this.advanceTable?.sgstPercentage],
      debitedTo: [this.advanceTable?.debitedTo],
      debitedToDriverID: [this.advanceTable.debitedToDriverID || 0],
      debitedToDriverName: [this.advanceTable.debitedToDriverName || null],
      debitedToSupplierID: [this.advanceTable.debitedToSupplierID || 0],
      debitedToSupplierName: [this.advanceTable.debitedToSupplierName || null],
      debitedToEcoID: [this.advanceTable.debitedToSupplierID || 0],
      debitedToEcoName: [this.advanceTable.debitedToSupplierName || null],
      reason:[this.advanceTable?.reason],
      details: [this.advanceTable?.details],
      adjustedByID: [this.advanceTable?.adjustedByID],
      activationStatus:[true],
    });
  }

  calculateTax() 
  {
    const amount = this.advanceTableForm.get('amount')?.value || 0;
    const sgst_rate = this.advanceTableForm.get('sgstPercentage')?.value || 0;
    const cgst_rate = this.advanceTableForm.get('cgstPercentage')?.value || 0;
    const igst_rate = this.advanceTableForm.get('igstPercentage')?.value || 0;

    if(amount > this.CreditNoteAmt)
    {
      this.grtThanCNA = true;
    }
    else if (amount > 0) 
    {
      this.grtThanCNA = false;
      const total_tax_rate = (sgst_rate + cgst_rate + igst_rate) + 100;
      const rate_charged = 100 / total_tax_rate;
      const car_hiring = amount * rate_charged;

      const sgst_amount = (car_hiring * sgst_rate) / 100;
      const cgst_amount = (car_hiring * cgst_rate) / 100;
      const igst_amount = (car_hiring * igst_rate) / 100;

      this.advanceTableForm.patchValue({
        sgstAmount: sgst_amount.toFixed(2),
        cgstAmount: cgst_amount.toFixed(2),
        igstAmount: igst_amount.toFixed(2),
      });
    } 
    else 
    {
      this.resetTaxes();
    }
  }

  resetTaxes() 
  {
    this.advanceTableForm.patchValue({
      sgstAmount: 0,
      cgstAmount: 0,
      igstAmount: 0,
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
    this.creditNoteDutyAdjustmentService.add(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close(true);
      this.showNotification(
        'snackbar-success',
        'Duty Adjusted...!!!',
        'bottom',
        'center'
        );
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

  public Put(): void
  { 
    this.creditNoteDutyAdjustmentService.update(this.advanceTableForm.getRawValue())  .subscribe(
    response => 
    {
      this.dialogRef.close(true);
      this.showNotification(
        'snackbar-success',
        'Duty Adjusted...!!!',
        'bottom',
        'center'
        );
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
      this.Put();
    }
    else
    {
      this.Post();
    }
  }
  

  //---------- Driver ----------
  InitDriver()
  {
    this.creditNoteDutyAdjustmentService.getDriver().subscribe
    (
      data =>   
      {
        this.DriverList = data;
        this.advanceTableForm.controls['debitedToDriverName'].setValidators([Validators.required,this.driverValidator(this.DriverList)]);
        this.advanceTableForm.controls['debitedToDriverName'].updateValueAndValidity();
        this.filteredDriverOptions = this.advanceTableForm.controls['debitedToDriverName'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDriver(value || ''))
        );      
      }
    );
  }
  private _filterDriver(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DriverList.filter(
      data => 
      {
        return data.driverName.toLowerCase().includes(filterValue);
      });
  }
  getDriverID(driverID:any) 
  {
    this.driverID=driverID;
    this.advanceTableForm.patchValue({debitedToDriverID:this.driverID});
  }
  driverValidator(DriverList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = DriverList.some(group => group.driverName.toLowerCase() === value);
      return match ? null : {driverTypeInvalid: true };
    };
  }
  OnDriverSelect(selectedDriver: string)
  {
    const DriverName = this.DriverList.find(
      data => data.driverName === selectedDriver
    );
    if (selectedDriver) 
    {
      this.getDriverID(DriverName.driverID);
    }
  }

  //---------- Supplier ----------
  InitSupplier()
  {
    this._generalService.getSupplierOfOE().subscribe(
    data=>
    {
      this.SupplierList=data;
      this.advanceTableForm.controls['debitedToSupplierName'].setValidators([Validators.required,this.supplierNameValidator(this.SupplierList)]);
      this.advanceTableForm.controls['debitedToSupplierName'].updateValueAndValidity();
      this.filteredSupplierOptions = this.advanceTableForm.controls['debitedToSupplierName'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterSupplier(value || ''))
      ); 
    });
  }
  private _filterSupplier(value: string): any {
    const filterValue = value.toLowerCase();
    return this.SupplierList.filter(
      data => 
      {
        return data.supplierName.toLowerCase().includes(filterValue);
      });
  }
  OnSupplierSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierList.find(
      data => data.supplierName === selectedSupplier
    );
    if (selectedSupplier) 
    {
      this.getsupplierID(SupplierName.supplierID);
    }
  }
  getsupplierID(supplierID: any)
  {
    this.supplierID=supplierID;
    this.advanceTableForm.patchValue({debitedToSupplierID:this.supplierID || this.advanceTable.debitedToSupplierID});
  }
  supplierNameValidator(SupplierList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = SupplierList.some(group => group.supplierName.toLowerCase() === value);
      return match ? null : { supplierInvalid: true };
    };
  }

  //---------- Eco ----------
  supplierNameValidatorForOwner(SupplierForOwnerList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = SupplierForOwnerList.some(group => group.supplierName.toLowerCase() === value);
      return match ? null : { supplierForOwnerInvalid: true };
    };
  }
  InitSupplierForOwner()
  {
    this._generalService.SupplierForOwnershipOfOE().subscribe(
    data=>
    {
      this.SupplierForOwnerList=data;
      this.advanceTableForm.controls['debitedToEcoName'].setValidators([Validators.required,this.supplierNameValidatorForOwner(this.SupplierForOwnerList)]);
      this.advanceTableForm.controls['debitedToEcoName'].updateValueAndValidity();
      this.filteredSupplierForOwnerOptions = this.advanceTableForm.controls['debitedToEcoName'].valueChanges.pipe(
        startWith(""),
        map(value => this._filtersearchSupplierForOwner(value || ''))
      ); 
    });
  }
  private _filtersearchSupplierForOwner(value: string): any {
    const filterValue = value.toLowerCase();
    if (!value || value.length < 3) {
      return [];   
    }
    return this.SupplierForOwnerList.filter(
      data => 
      {
        return data.supplierName.toLowerCase().includes(filterValue);
      });
  }
  OnSupplierForOwnerSelect(selectedSupplier: string)
  {
    const SupplierName = this.SupplierForOwnerList.find(
      data => data.supplierName === selectedSupplier
    );
    if (selectedSupplier) 
    {
      this.getsupplierIDForOwnerID(SupplierName.supplierID);
    }
  }
  getsupplierIDForOwnerID(supplierID: any)
  {
    this.supplierID=supplierID;
    this.advanceTableForm.patchValue({debitedToEcoID:this.supplierID || this.advanceTable.debitedToEcoID});
  }

}

