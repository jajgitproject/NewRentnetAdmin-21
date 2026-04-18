// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SpecialInstructionService } from '../../specialInstruction.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { SpecialInstruction } from '../../specialInstruction.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-special-instruction-dialog',
  templateUrl: './special-instruction-dialog.component.html',
  styleUrls: ['./special-instruction-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class SpecialInstructionDialogComponent 
{
  saveDisabled:boolean=true;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: SpecialInstruction;
  reservationID: any;
  status:any;
  buttonDisabled:boolean=false;
  constructor(
  public dialogRef: MatDialogRef<SpecialInstructionDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public advanceTableService: SpecialInstructionService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Special Instruction';
          this.dialogTitle ='Special Instruction/Itenary';
          this.advanceTable = data.advanceTable;
          this.advanceTable.activationStatus=true;
          this.ImagePath = this.advanceTable.specialInstructionAttachment;
        } else 
        {
         // this.dialogTitle = 'Create Special Instruction';
         this.dialogTitle = 'Special Instruction/Itenary';
          this.advanceTable = new SpecialInstruction({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        
        // Extract reservationID - prioritize the direct reservationID from data
        if(data?.reservationID !== undefined && data.reservationID !== null) {
          this.reservationID = data.reservationID;
        } else if(data?.advanceTable?.reservationID !== undefined && data.advanceTable.reservationID !== null) {
          this.reservationID = data.advanceTable.reservationID;
        } else {
          console.error('No valid reservationID found in dialog data:', data);
          this.reservationID = null;
        }
        this.status=data?.status?.status || data?.status || data;
        // if(this.status!='Changes allow'){
        //   // this.saveDisabled=true;
        //   // this.advanceTableForm.disable();
        //   this.buttonDisabled=true;
        // }
        if(this.status === 'Changes allow'){
    this.buttonDisabled = false;  // Save button enable
} else {
    this.buttonDisabled = true;   // Save button disable
}
       
        console.log('Status set to:', this.status);
        
        console.log('ReservationID set to:', this.reservationID);
        console.log('Full dialog data:', data);
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationSpecialInstructionID: [this.advanceTable.reservationSpecialInstructionID],
      reservationID: [this.advanceTable.reservationID],
      activationStatus: [this.advanceTable.activationStatus, Validators.required],
      specialInstruction: [this.advanceTable.specialInstruction, [Validators.required, this.noWhitespaceValidator]],
      specialInstructionBy: [this.advanceTable.specialInstructionBy],
      specialInstructionAttachment: [this.advanceTable.specialInstructionAttachment]
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
    // Ensure we have a valid reservationID (allow 0 as it might be a valid ID)
    if (this.reservationID === null || this.reservationID === undefined) {
      this.showNotification(
        'snackbar-danger',
        'Invalid Reservation ID. Please try again.',
        'bottom',
        'center'
      );
      return;
    }

    this.advanceTableForm.patchValue({reservationID:this.reservationID});
    
    // Log the form data for debugging
    console.log('Form data being sent:', this.advanceTableForm.getRawValue());
    
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
        console.log('Special instruction created successfully:', response);
          this.showNotification(
            'snackbar-success',
            'Special Instrucation Create...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
          this.dialogRef.close(true);
         //this._generalService.sendUpdate('AdditionalSMSEmailWhatsappUpdate:AdditionalSMSEmailWhatsappUpdate:Success');//To Send Updates  
         
      },
      error =>
      {
       console.error('Error creating special instruction:', error);
       //this._generalService.sendUpdate('AdditionalSMSEmailWhatsappUpdate:AdditionalSMSEmailWhatsappUpdate:Failure');//To Send Updates 
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
  public Put(): void
  {
    this.advanceTableForm.patchValue({reservationID:this.reservationID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
      {
        
          this.showNotification(
            'snackbar-success',
            'Special Instrucation Update...!!!',
            'bottom',
            'center'
          );
          this.saveDisabled = true;
          this.dialogRef.close(true);
         //this._generalService.sendUpdate('SpecialInstrucationUpdate:SpecialInstrucationUpdate:Success');//To Send Updates  
         
      },
      error =>
      {
        
       //this._generalService.sendUpdate('SpecialInstrucationUpdate:SpecialInstrucationUpdate:Failure');//To Send Updates 
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

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({ specialInstructionAttachment: this.ImagePath })
  }
}


