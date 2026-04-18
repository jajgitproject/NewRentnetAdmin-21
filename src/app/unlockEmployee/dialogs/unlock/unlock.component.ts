// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { GeneralService } from '../../../general/general.service';
import { UnlockEmployeeService } from '../../unlockEmployee.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UnlockEmployee } from '../../unlockEmployee.model';
@Component({
  standalone: false,
  selector: 'app-unlock',
  templateUrl: './unlock.component.html',
  styleUrls: ['./unlock.component.sass']
})
export class UnlockDialogComponent
{
  advanceTableForm: FormGroup;
  advanceTable: UnlockEmployee;
  employeeEntityPasswordID: any;
  constructor(
    public dialogRef: MatDialogRef<UnlockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public advanceTableService: UnlockEmployeeService,
    public _generalService: GeneralService
  )
  {
    this.advanceTable = data;
    this.employeeEntityPasswordID=this.advanceTable?.employeeEntityPasswordID;
    this.advanceTableForm = this.createContactForm();
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      employeeEntityPasswordID: [this.advanceTable?.employeeEntityPasswordID],
      userType:['Employee'],
    },
    
  );
  }
  
  onNoClick(): void
  {
    this.dialogRef.close();
  }
  confirmDelete()
  {
    this.advanceTableForm.patchValue({ employeeEntityPasswordID: this.employeeEntityPasswordID });
    this.advanceTableService.getUnlockData(this.advanceTableForm.getRawValue())  
    .subscribe(
    data => 
    {
       this._generalService.sendUpdate('UnlockEmployee:UnlockEmployeeView:Success');//To Send Updates   
    },
    error =>
    {
      this._generalService.sendUpdate('UnlockEmployeeAll:UnlockEmployeeView:Failure');//To Send Updates  
    }
    )
  }
}


