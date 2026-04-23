// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DriverRemarkService } from '../../driverRemark.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { DriverRemark } from '../../driverRemark.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogdriverRemarkComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DriverRemark;
  ReservationID: any;
  AllotmentID: any;
  DriverName: any;
  dutySlipID: any;
  dataSource: any[] | [];
  DutySlipID: number;
  DriverRemark: any;
  activationStatus: any;
  saveDisabled:boolean=true;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogdriverRemarkComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DriverRemarkService,

    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;

        if (this.action === 'edit') 
        {
          this.dialogTitle ='Driver Remark'; 
           
          this.advanceTable = data.advanceTable;
          this.ReservationID = data.reservationID;
          this.AllotmentID = data.allotmentID;
          this.DriverRemark = data.driverRemark;
          this.dutySlipID=data.dutySlipID;
          // this.populateForm();
         
       
        } else 
        {
          this.dialogTitle = 'Driver Remark';
          this.advanceTable = new DriverRemark({});
           this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.dutySlipID=data.dutySlipID;
        // if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
        // {
        //   this.isSaveAllowed = true;
        // } 
        // else
        // {
        //   this.isSaveAllowed = false;
        // }
                 const status = (this.verifyDutyStatusAndCacellationStatus ?? '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z\s]/g, ''); // 👈 ye line important hai

this.isSaveAllowed = status === 'changes allow';
  }

  ngOnInit() {
    this.loadData();
    this.populateForm();
  }

  public loadData() 
  {
     this.advanceTableService.getDriverRemarkDetails(this.dutySlipID).subscribe
     (
       data =>   
       {
         this.dataSource = data;
         this.dataSource.forEach((ele)=>{
           // if(ele.activationStatus===true){
           //  this.activation="Active"
           // }
           // if(ele.activationStatus===false){
           //   this.activation="Deleted"
           //  }
         })
        
       },
       (error: HttpErrorResponse) => { this.dataSource = null;}
     );
 }

 populateForm() {
  this.advanceTableForm?.patchValue({
    dutySlipID: this.dutySlipID,
    driverRemark: this.DriverRemark,
    activationStatus: this.activationStatus,
    // Patch other form controls as needed
  });
}

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
       dutySlipID: [this.advanceTable?.dutySlipID],
      driverRemark: [this.advanceTable?.driverRemark],
      activationStatus: [this.advanceTable?.activationStatus],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
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
  
  public Put(): void
  {
    this.advanceTableService.update(this.advanceTableForm.getRawValue())    
    .subscribe(
      response => {
        
        this.showNotification(
          'snackbar-success',
          'Driver Remark Updated...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
        this.dialogRef.close(response);
      },
      error => {

        this.showNotification(
          'snackbar-danger',
          'Operation Failed.....!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
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
    this.saveDisabled=false;
       if(this.action=="edit")
       {
          this.Put();
       }
      //  else
      //  {
      //     this.Post();
      //  }
  }
}


