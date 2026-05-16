// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { RoleService } from '../../role.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Role } from '../../role.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from 'src/app/general/general.service';

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
  advanceTable: Role;
  
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: RoleService,
  private fb: FormBuilder,
  public _generalService:GeneralService) 
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Role';       
          this.advanceTable = data.advanceTable;
          this.advanceTableForm?.controls['canCreateReservation'].setValue(this.advanceTable.canCreateReservation);
        } else 
        {
          this.dialogTitle = 'Role';
          this.advanceTable = new Role({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
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
      roleID: [this.advanceTable.roleID],
      role: [this.advanceTable.role,Validators.required],
      roleFor: [this.advanceTable.roleFor,Validators.required],
      remark : [this.advanceTable.remark],
      canCreateReservation: [this.advanceTable.canCreateReservation,Validators.required],
      activationStatus: [this.advanceTable.activationStatus],
      isThisAKeyAccountManagerRole: [this.advanceTable.isThisAKeyAccountManagerRole],
      canThisRoleCreateBackDateBooking: [this.advanceTable.canThisRoleCreateBackDateBooking]
    });
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
      this.dialogRef.close();
      this._generalService.sendUpdate('RoleCreate:RoleView:Success');//To Send Updates  
    },
    error =>
    {
      this._generalService.sendUpdate('RoleAll:RoleView:Failure');//To Send Updates       
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
      this._generalService.sendUpdate('RoleUpdate:RoleView:Success');//To Send Updates
    },
    error =>
    {
      this._generalService.sendUpdate('RoleAll:RoleView:Failure');//To Send Updates   
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


