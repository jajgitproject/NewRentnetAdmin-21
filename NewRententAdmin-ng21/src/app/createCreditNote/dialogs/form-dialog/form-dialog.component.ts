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
import { CreateCreditNote } from '../../createCreditNote.model';
import { CreateCreditNoteService } from '../../createCreditNote.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  advanceTable: CreateCreditNote;
  fName = '';
  contents: any[];
  mydata = [];
  name = '';
 
  searchTerm:  FormControl = new FormControl();
  filteredOptions: Observable<CustomerGroupDropDown[]>;
  public customerGroupList?: CustomerGroupDropDown[] = [];
  
  searchTypeTerm:  FormControl = new FormControl();
  filteredTypeOptions: Observable<CustomerTypeDropDown[]>;
  public CustomerTypeList?: CustomerTypeDropDown[] = [];
  image: any;
  fileUploadEl: any;
  customerGroupID: any;
  customerTypeID: any;
  geoPointID: any;
  organizationalEntityID: any;
  customerCategoryID: any;
  customerID: any;
  CustomerID: any[];
  companyID: any;
  saveDisabled:boolean= true;
  IGSTPercentage: any;
  CGSTPercentage: any;
  SGSTPercentage: any;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
     private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CreateCreditNoteService,
    private fb: FormBuilder,
    private el: ElementRef,
    public router: Router,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Create/Edit Credit Note';       
          this.advanceTable = data.advanceTable;
          this.IGSTPercentage = data.advanceTable.igstPercentage || 0;
          this.CGSTPercentage = data.advanceTable.cgstPercentage || 0;
          this.SGSTPercentage = data.advanceTable.sgstPercentage || 0;
          console.log(this.advanceTable)
        } else 
        {
          this.dialogTitle = 'Create/Edit Credit Note';
          this.advanceTable = data.advanceTable;
          this.IGSTPercentage = data.advanceTable.igstPercentage || 0;
          this.CGSTPercentage = data.advanceTable.cgstPercentage || 0;
          this.SGSTPercentage = data.advanceTable.sgstPercentage || 0;
          console.log(this.advanceTable)  
          //this.advanceTable = new CreateCreditNote({});
          this.advanceTable.requiresReBilling=true;
        }
       this.advanceTableForm = this.createContactForm();
     
  }
  public ngOnInit(): void
  {
    
  }

  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
    } else {
      this.dialogRef.close();
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

 

  countryNameValidator(CountriesList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = CountriesList.some(group => group.geoPointName.toLowerCase() === value);
      return match ? null : { countryNameInvalid: true };
    };
  }


  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      invoiceID: [this.advanceTable.invoiceID],
      invoiceCreditNoteID: [this.advanceTable.invoiceCreditNoteID],
      invoiceNumber: [this.advanceTable.invoiceNumber],
      invoiceNumberWithPrefix:[this.advanceTable.invoiceNumberWithPrefix],
      branchName: [this.advanceTable.branchName],
      branchID: [this.advanceTable.branchID],
      customerName: [this.advanceTable.customerName],
      customerID: [this.advanceTable.customerID],
      invoiceTotalAmountAfterGST: [this.advanceTable.invoiceTotalAmountAfterGST],
      creditNoteAmount: [this.advanceTable.creditNoteAmount],
      cgstAmount: [this.advanceTable.cgstAmount],
      cgstPercentage :[this.advanceTable.cgstPercentage],
      igstAmount: [this.advanceTable.igstAmount],
      igstPercentage: [this.advanceTable.igstPercentage],
      sgstAmount :[this.advanceTable.sgstAmount],
      sgstPercentage: [this.advanceTable.sgstPercentage],
      creditNoteReason:[this.advanceTable.creditNoteReason],
      requiresReBilling: [this.advanceTable.requiresReBilling],
       year: [this.advanceTable.year],
       baseAmount: [this.advanceTable.baseAmount],
      monthName:[this.advanceTable.monthName],
      monthID: [this.advanceTable.monthID],
     invoiceFinancialYearName:[this.advanceTable.invoiceFinancialYearName],
      invoiceFinancialYearID: [this.advanceTable.invoiceFinancialYearID],

    });
  }
  calculateTax() {
  const creditNoteAmount = parseFloat(this.advanceTableForm.get('creditNoteAmount')?.value) || 0;
  const sgst_rate = parseFloat(this.advanceTableForm.get('sgstPercentage')?.value) || 0;
  const cgst_rate = parseFloat(this.advanceTableForm.get('cgstPercentage')?.value) || 0;
  const igst_rate = parseFloat(this.advanceTableForm.get('igstPercentage')?.value) || 0;

  if (creditNoteAmount > 0) {
    // Add all GST percentages together
    const total_tax_rate = sgst_rate + cgst_rate + igst_rate;
    const baseAmount = creditNoteAmount / (1 + total_tax_rate / 100); 
    // Calculate individual GST amounts from base amount
    const sgst_amount = (baseAmount * sgst_rate) / 100;
    const cgst_amount = (baseAmount * cgst_rate) / 100;
    const igst_amount = (baseAmount * igst_rate) / 100;

    this.advanceTableForm.patchValue({
      baseAmount: parseFloat(baseAmount.toFixed(2)),
      sgstAmount: parseFloat(sgst_amount.toFixed(2)),
      cgstAmount: parseFloat(cgst_amount.toFixed(2)),
      igstAmount: parseFloat(igst_amount.toFixed(2)),
    });
  } else {
    this.resetTaxes();
  }
}

resetTaxes() {
  this.advanceTableForm.patchValue({
    baseAmount: 0,
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

  // GetStateBasedOnCity(){
  //    
  //   this._generalService.GetStateAgainstCity(this.advanceTableForm.value.registrationCityID).subscribe(
  //     data=>{
  //       this.StatesLists=data;
  //       this.advanceTableForm.patchValue({registrationStateID:this.StateList[0].geoPointID})
  //     }
  //   );
  // }

  public Post(): void
  { 
     
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       Swal.fire({
                 title: `Create Credit Note Created ...!!!`,
                 icon: 'success',
                 confirmButtonText: 'Ok'
                 }).then(result => {
                   if (result.isConfirmed) 
                   {
                     const url = this.router.serializeUrl(
                       this.router.createUrlTree(['/creditNoteHome'])
                     );
                     window.open(this._generalService.FormURL + url, '_blank');
                   }
                 }); 
       this.saveDisabled = true; 
    
    },
    error =>
    {
       this._generalService.sendUpdate('CreateCreditNoteAll:CreateCreditNoteView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  { 
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
        {
            this.dialogRef.close(true);
            this.showNotification(
              'snackbar-success',
              'Create Credit Note Updated...!!!',
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
    }
  )
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
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }

  GetCustomerIDForTarrif()
  {
    this._generalService.GetCustomerID().subscribe(
      data=>
      {
        this.CustomerID=data;
        this.advanceTableForm.patchValue({corporateCompanyID:this.CustomerID});
      }
    );
  }

}

