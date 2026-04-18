// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { AdvanceService } from '../../advance.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Advance } from '../../advance.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';

@Component({
  standalone: false,
  selector: 'app-advance-dialog',
  templateUrl: './advance-dialog.component.html',
  styleUrls: ['./advance-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class AdvanceDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: Advance;
  constructor(
  public dialogRef: MatDialogRef<AdvanceDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: AdvanceService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Advance';       
          this.advanceTable = data.advanceTable;
        } else 
        {
          this.dialogTitle = 'Advance';
          this.advanceTable = new Advance({});
          this.advanceTable.activationStatus="Active";
        }
        this.advanceTableForm = this.createContactForm();
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      advanceID: [this.advanceTable.advanceID],
      advance: [this.advanceTable.advance,[this.noWhitespaceValidator]],
      activationStatus: [this.advanceTable.activationStatus],
      updatedBy: [this.advanceTable.updatedBy],
      updateDateTime: [this.advanceTable.updateDateTime]
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
  onNoClick(): void 
  {
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    { 
     
      console.log(response);
       if(response.activationStatus.indexOf("Duplicate") !== -1)
       {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
       }
       else 
       {
        this.dialogRef.close();
       this._generalService.sendUpdate('AdvanceCreate:AdvanceView:Success');//To Send Updates  
    }
  },
    error =>
    {
       this._generalService.sendUpdate('AdvanceAll:AdvanceView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
     
      console.log(response);
       if(response.activationStatus.indexOf("Duplicate") !== -1)
       {
        this._generalService.sendUpdate('DataNotFound:DuplicacyError:Failure');
       }
       else 
       {
        this.dialogRef.close();
       this._generalService.sendUpdate('AdvanceUpdate:AdvanceView:Success');//To Send Updates   
       }
    },
    error =>
    {
     this._generalService.sendUpdate('AdvanceAll:AdvanceView:Failure');//To Send Updates  
    }
  )
  }
  public confirmAdd(): void 
  {
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


