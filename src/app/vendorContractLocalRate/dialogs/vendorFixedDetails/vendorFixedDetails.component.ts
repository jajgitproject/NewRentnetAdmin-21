// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { VendorLocalFixedDetailsModel } from '../../vendorContractLocalRate.model';
import { VendorContractLocalRateService } from '../../vendorContractLocalRate.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-vendorFixedDetails',
  templateUrl: './vendorFixedDetails.component.html',
  styleUrls: ['./vendorFixedDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class VendorLocalFixedDetails 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: VendorLocalFixedDetailsModel;
  CustomerContractID: any;
  saveDisabled:boolean = true;
   allNextOptions = [
    { value: 'KM TO Hr', label: 'KM TO Hr' },
    { value: 'Hr to Km', label: 'Hr to Km' },
    { value: 'None', label: 'None' }
  ];
    filteredNextOptions = [...this.allNextOptions];
      disableNoneOption = false;
  VendorContractID: any;
  
  constructor(
  private snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<VendorLocalFixedDetails>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder,
  public _generalService:GeneralService,
  public vendorContractLocalRateService:VendorContractLocalRateService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Vendor Local Fixed Details';       
          this.advanceTable = data.advanceTable;
          
        } else 
        {
          this.dialogTitle = 'Vendor Local Fixed Details';
          this.advanceTable = new VendorLocalFixedDetailsModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.VendorContractID=data.VendorContractID;
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);
  
ngOnInit(): void {
  this.advanceTableForm.get('packageJumpCriteria')?.valueChanges.subscribe(value => {
    if (value === 'None') {
      // Allow only 'None' to be selectable manually
      this.disableNoneOption = false;

      // DO NOT auto-set any value here!
      this.advanceTableForm.get('nextPackageSelectionCriteria')?.reset(); // Clear previous value
    } else {
      // Disable 'None' option
      this.disableNoneOption = true;

      // If previously selected value was 'None', clear it
      if (this.advanceTableForm.get('nextPackageSelectionCriteria')?.value === 'None') {
        this.advanceTableForm.get('nextPackageSelectionCriteria')?.reset();
      }
    }
  });
}
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
      vendorLocalFixedDetailsID: [this.advanceTable?.vendorLocalFixedDetailsID],
      vendorContractID: [this.advanceTable?.vendorContractID],
      billFromTo: [this.advanceTable?.billFromTo],
      packageJumpCriteria: [this.advanceTable?.packageJumpCriteria],
      nextPackageSelectionCriteria: [this.advanceTable?.nextPackageSelectionCriteria],
      packageGraceMinutes: [this.advanceTable?.packageGraceMinutes],
      packageGraceKms: [this.advanceTable?.packageGraceKms],
      activationStatus: [this.advanceTable?.activationStatus],
      showAddtionKMAndHours: [this.advanceTable?.showAddtionKMAndHours],
      addtionalKms: [this.advanceTable?.addtionalKms || 0],
      addtionalMinutes: [this.advanceTable?.addtionalMinutes || 0]
    });
  }

  submit() 
  {
    // emppty stuff
  }

  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
    }
  }

  showNotification(colorName, text, placementFrom, placementAlign) 
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
    this.advanceTableForm.patchValue({vendorContractID:this.VendorContractID});
    this.vendorContractLocalRateService.addFixedRate(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close(response);
      this.showNotification(
          'snackbar-success',
          'Vendor Fixed Rate Created...!!!',
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
    this.advanceTableForm.patchValue({vendorContractID:this.VendorContractID});
    this.vendorContractLocalRateService.updateFixedRate(this.advanceTableForm.getRawValue()).subscribe(
    response => 
    {
      this.dialogRef.close(response);
      this.showNotification(
        'snackbar-success',
        'Vendor Fixed Rate Updated...!!!',
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

}


