// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { NextDayInstructionService } from '../../nextDayInstruction.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { NextDayInstruction } from '../../nextDayInstruction.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class NextDayInstructionFormDialogComponent 
{
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: NextDayInstruction;
  saveDisabled:boolean=true;
  
  dataSource: any[] | [];
  ReservationID: any;
  AllotmentID: any;
  nextDayInstructionDate: any;
  nextDayInstructionTime: any;
  nextDayInstruction: any;
  dutySlipID: any;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;
  constructor(
  public dialogRef: MatDialogRef<NextDayInstructionFormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: NextDayInstructionService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Next Day Instruction';       
          this.advanceTable = data.advanceTable;
          this.ReservationID = data.reservationID;
          this.AllotmentID = data.allotmentID;
          this.nextDayInstructionDate = data.nextDayInstructionDate;
          this.nextDayInstructionTime = data.nextDayInstructionTime;
          this.nextDayInstruction = data.nextDayInstruction;
          this.dutySlipID=data.dutySlipID;
          //this.onBlurUpdateDateEdit(this.nextDayInstructionDate);
          
        } else 
        {
          this.dialogTitle = 'Next Day Instruction';
          this.advanceTable = new NextDayInstruction({});
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
         console.log(this.dataSource)
         this.advanceTableForm.controls['nextDayInstruction'].setValue(data?.[0]?.nextDayInstruction)
         this.advanceTableForm.controls['nextDayInstructionDate'].setValue(data?.[0]?.nextDayInstructionDate)
         this.advanceTableForm.controls['nextDayInstructionTime'].setValue(data?.[0]?.nextDayInstructionTime)
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
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
       dutySlipID: [this.advanceTable?.dutySlipID],
      nextDayInstruction: [this.advanceTable?.nextDayInstruction],
      nextDayInstructionDate: [this.advanceTable?.nextDayInstructionDate],
      nextDayInstructionTime: [this.advanceTable?.nextDayInstructionTime],
      activationStatus: [this.advanceTable?.activationStatus],
    });
  }

  populateForm() {
    this.advanceTableForm?.patchValue({
      dutySlipID: this.dutySlipID,
      nextDayInstructionDate: this.nextDayInstructionDate,
      nextDayInstructionTime: this.nextDayInstructionTime,
      nextDayInstruction: this.nextDayInstruction,
      // Patch other form controls as needed
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    //console.log(this.advanceTableForm.value);
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
   
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
       this._generalService.sendUpdate('NextDayInstructionCreate:NextDayInstructionView:Success');//To Send Updates  
       this.saveDisabled = true;
       this.dialogRef.close();
  },
    error =>
    {
       this._generalService.sendUpdate('NextDayInstructionAll:NextDayInstructionView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
      this.advanceTableForm.patchValue({dutySlipID: this.dutySlipID || this.dutySlipID });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    
    .subscribe(
      response => {
        
        this.showNotification(
          'snackbar-success',
          'Next Day Instruction Updated...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
        this.dialogRef.close(response);
      },
      error => {

        this.showNotification(
          'snackbar-danger',
          'Operation Failed.....!!!',
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

  onTimeInput(event: any): void {
    const inputValue = event.target.value;
    const parsedTime = new Date(`1970-01-01T${inputValue}`);
    if (!isNaN(parsedTime.getTime())) {
        this.advanceTableForm.get('nextDayInstructionTime').setValue(parsedTime);
    }
  }

  onBlurUpdateDate(value: string): void {
    value= this._generalService.resetDateiflessthan12(value);
  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('nextDayInstructionDate')?.setValue(formattedDate);    
  } else {
    this.advanceTableForm.get('nextDayInstructionDate')?.setErrors({ invalidDate: true });
  }
  }

  
}



