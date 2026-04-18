// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CustomerGroupService } from '../../customerGroup.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerGroup } from '../../customerGroup.model';
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
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CustomerGroup;
  saveDisabled:boolean=true;
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CustomerGroupService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Customer Group';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Customer Group';
          this.advanceTable = new CustomerGroup({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerGroupID: [this.advanceTable.customerGroupID],
      customerGroup: [this.advanceTable.customerGroup,[this.noWhitespaceValidator]],
      createBookingBeforeMinutes: [this.advanceTable.createBookingBeforeMinutes],
      editBookingBeforeMinutes: [this.advanceTable.editBookingBeforeMinutes],
      cancelBookingBeforeMinutes: [this.advanceTable.cancelBookingBeforeMinutes],
      activationStatus: [this.advanceTable.activationStatus],
      updatedBy: [this.advanceTable.updatedBy],
      updateDateTime: [this.advanceTable.updateDateTime],
      isGSTMandatoryWithReservation: [this.advanceTable.isGSTMandatoryWithReservation],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}


onCustomerGroupChange(): void 
{
  this.checkDuplicateCustomerGroup();
}

//-------- Check Duplicate Customer Group -----------------
checkDuplicateCustomerGroup() 
{
  const customerGroup = this.advanceTableForm.get('customerGroup').value;
  if (customerGroup) 
  {
    this.advanceTableService.DuplicateCustomerGroup(customerGroup).subscribe(response => {
      if (response.isDuplicate) 
      {
        this.advanceTableForm.get('customerGroup').setErrors({ duplicate: true });
      }
      else 
      {
        if (this.advanceTableForm.get('customerGroup').hasError('duplicate')) 
        {
          this.advanceTableForm.get('customerGroup').setErrors(null);
        }
      }
    });
  }
}


  submit() {}
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
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerGroupCreate:CustomerGroupView:Success');//To Send Updates  
       this.saveDisabled = true;
    
  },
    error =>
    {
       this._generalService.sendUpdate('CustomerGroupAll:CustomerGroupView:Failure');//To Send Updates 
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
    
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerGroupUpdate:CustomerGroupView:Success');//To Send Updates  
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerGroupAll:CustomerGroupView:Failure');//To Send Updates  
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


