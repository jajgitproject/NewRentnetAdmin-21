// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from 'src/app/general/general.service';
import { CarAndDriverAllotmentService } from '../CarAndDriverAllotment.service';

@Component({
  standalone: false,
  selector: 'app-allotmentNotificationReply',
  templateUrl: './allotmentNotificationReply.component.html',
  styleUrls: ['./allotmentNotificationReply.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class AllotmentNotificationReplyDialogComponent 
{
  saveDisabled:boolean=true;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  AllotmentID: any;
  AllotmentNotificationID: any;
  ReservationID: any;

  constructor(
  public dialogRef: MatDialogRef<AllotmentNotificationReplyDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public _carAndDriverAllotmentService: CarAndDriverAllotmentService,
  private snackBar: MatSnackBar,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        this.advanceTableForm = this.createContactForm();
        this.AllotmentID=data.allotmentID;
        this.ReservationID=data.reservationID;
  }
  public ngOnInit(): void
  {
   this.GetAllotmentNotificationID();
  }

  GetAllotmentNotificationID()
  {
    this._carAndDriverAllotmentService.GetAllotmentNotificationID(this.AllotmentID).subscribe(
      data=>
      {
        this.AllotmentNotificationID=data;
        this.advanceTableForm.patchValue({driverAllotmentNotificationID:this.AllotmentNotificationID});
      }
    );
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
  
      driverAllotmentNotificationID: [''],  
      allotmentID: [''],
      driverAcceptanceStatus: [''],
      driverAcceptanceRemark: ['']    
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
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public Put(): void
  {
    this.saveDisabled = false;
    this.advanceTableForm.patchValue({allotmentID:this.AllotmentID});
    this._carAndDriverAllotmentService.updateAllotmentNotificationReply(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    { 
      this.showNotification(
        'snackbar-success',
        'Allotment Notification Reply Updated...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
      this.dialogRef.close();
  },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Field...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
    }
  )
  }
 
}


