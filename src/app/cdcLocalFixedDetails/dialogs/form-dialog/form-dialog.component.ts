// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CDCLocalFixedDetailsService } from '../../cdcLocalFixedDetails.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CDCLocalFixedDetails } from '../../cdcLocalFixedDetails.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';

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
  advanceTable: CDCLocalFixedDetails;
  CustomerContractID: any;
  saveDisabled:boolean = true;
   allNextOptions = [
    { value: 'KM TO Hr', label: 'KM TO Hr' },
    { value: 'Hr to Km', label: 'Hr to Km' },
    { value: 'None', label: 'None' }
  ];
    filteredNextOptions = [...this.allNextOptions];
      disableNoneOption = false;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CDCLocalFixedDetailsService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='CDC Local Fixed Details';       
          this.advanceTable = data.advanceTable;
          console.log("Advance Table Data:", this.advanceTable);
          
        } else 
        {
          this.dialogTitle = 'CDC Local Fixed Details';
          this.advanceTable = new CDCLocalFixedDetails({});
          this.advanceTable.activationStatus=true;
          // this.advanceTable.showAddtionKMAndHours=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.CustomerContractID=data.CustomerContractID;
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
      cdcLocalFixedDetailsID: [this.advanceTable?.cdcLocalFixedDetailsID],
      customerContractID: [this.advanceTable?.customerContractID],
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
    if(this.action==='add'){
      this.advanceTableForm.reset();

    }
    else if(this.action==='edit'){
      this.dialogRef.close();
    }
  }
  public Post(): void
  {
    this.advanceTableForm.patchValue({customerContractID:this.CustomerContractID});
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {  
  
          this.dialogRef.close();
         this._generalService.sendUpdate('CDCLocalFixedDetailsCreate:CDCLocalFixedDetailsView:Success');//To Send Updates  
         this.saveDisabled = true;
    },
    error =>
    {
       this._generalService.sendUpdate('CDCLocalFixedDetailsAll:CDCLocalFixedDetailsView:Failure');//To Send Updates 
       this.saveDisabled = true; 
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({customerContractID:this.CustomerContractID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
      
          this.dialogRef.close();
         this._generalService.sendUpdate('CDCLocalFixedDetailsUpdate:CDCLocalFixedDetailsView:Success');//To Send Updates  
         this.saveDisabled = true;
    },
    error =>
    {
     this._generalService.sendUpdate('CDCLocalFixedDetailsAll:CDCLocalFixedDetailsView:Failure');//To Send Updates
     this.saveDisabled = true;  
    }
  )
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


