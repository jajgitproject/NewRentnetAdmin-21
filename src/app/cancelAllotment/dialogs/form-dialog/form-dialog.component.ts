// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelAllotmentService } from '../../cancelAllotment.service';
import { FormControl, Validators, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CancelAllotment } from '../../cancelAllotment.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogCAComponent 
{
  saveDisabled:boolean=true;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: CancelAllotment;
  AllotmentID: any;
  AllotmentStatus: any;
   status: string = '';
  buttonDisabled: boolean = false;
  normalizedStatus: string = '';
  constructor(
    private snackBar: MatSnackBar,
  public dialogRef: MatDialogRef<FormDialogCAComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: CancelAllotmentService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
         // status gating
    // this.status = data?.status;
    // this.buttonDisabled = this.status ? this.status.toLowerCase() !== 'changes allow' : false;
      // `status` is not always passed by caller (e.g. detach flow).
      // Only enforce the "changes allow" gate when a status is explicitly available.
      this.status = data?.status ?? data?.allotmentStatus ?? '';
      this.normalizedStatus = (this.status || '').toLowerCase().trim();
      // Allow cancellation for active allotment states.
      // Keep strict gating only for explicit non-editable statuses.
      const allowedStatuses = ['changes allow', 'alloted', 'allotted'];
      this.buttonDisabled = this.normalizedStatus
        ? !allowedStatuses.includes(this.normalizedStatus)
        : false;


        if (this.action === 'edit') 
        {
          this.dialogTitle ='Cancel Allotment';       
          this.advanceTable = data.advanceTable;
          //this.ImagePath=this.advanceTable.cancelAllotmentSign;
        } else 
        {
          this.dialogTitle = 'Cancel Allotment';
          this.advanceTable = new CancelAllotment({});
          //this.advanceTable.activationStatus=true;
        }
        
        this.advanceTableForm = this.createContactForm();
        this.AllotmentID=data.allotmentID;
        this.AllotmentStatus=data.allotmentStatus
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
      allotmentID: [this.advanceTable.allotmentID],
      dateOfCancellation: [this.advanceTable.dateOfCancellation],
      timeOfCancellation: [this.advanceTable.timeOfCancellation],
      cancellationByEmployeeID: [this.advanceTable.cancellationByEmployeeID],
      cancellationRemark: [
        this.advanceTable.cancellationRemark,
        [Validators.required, this.noWhitespaceValidator]
      ],
      allotmentStatus: [this.advanceTable.allotmentStatus],

    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  isSaveButtonDisabled(): boolean {
    if (this.buttonDisabled) {
      return true;
    }
    const remark = (this.advanceTableForm?.get('cancellationRemark')?.value || '').toString().trim();
    return remark.length === 0;
  }

  submit() 
  {
    // emppty stuff
  }
  onNoClick(action: string) {
    if(action === 'add') {
      this.advanceTableForm.reset();
      this.ImagePath="";
    } else {
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
       this._generalService.sendUpdate('CancelAllotmentCreate:CancelAllotmentView:Success');//To Send Updates  
    
  },
    error =>
    {
       this._generalService.sendUpdate('CancelAllotmentAll:CancelAllotmentView:Failure');//To Send Updates  
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.patchValue({allotmentID: this.AllotmentID});
    this.advanceTableForm.patchValue({allotmentStatus:this.AllotmentStatus});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
      
      this._generalService.sendUpdate('CancelAllotmentUpdate:CancelAllotmentView:Success');//To Send Updates 
      this.showNotification(
        'snackbar-success',
        'CancelAllotment Updated...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
      this.dialogRef.close({isClose:false});
    },
    error =>
    {
     this._generalService.sendUpdate('CancelAllotmentAll:CancelAllotmentView:Failure');//To Send Updates  
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
    this.Put();
  }
   /////////////////for Image Upload////////////////////////////
   public response: { dbPath: '' };
   public ImagePath: string = "";
   public uploadFinished = (event) => 
   {
     this.response = event;
     this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
     this.advanceTableForm.patchValue({cancelAllotmentSign:this.ImagePath})
   }
 /////////////////for Image Upload ends////////////////////////////
 
}


