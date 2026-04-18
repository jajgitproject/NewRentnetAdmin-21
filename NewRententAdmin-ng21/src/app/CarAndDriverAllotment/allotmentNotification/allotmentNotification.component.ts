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
  selector: 'app-allotmentNotification',
  templateUrl: './allotmentNotification.component.html',
  styleUrls: ['./allotmentNotification.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class AllotmentNotificationDialogComponent 
{
  saveDisabled:boolean=true;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  AllotmentID: any;
  DriverName: any;
  reservationID: any;

  constructor(
  public dialogRef: MatDialogRef<AllotmentNotificationDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public _carAndDriverAllotmentService: CarAndDriverAllotmentService,
  private snackBar: MatSnackBar,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
        this.advanceTableForm = this.createContactForm();
        this.AllotmentID=data.allotmentID;
        this.DriverName=data.driverName;
        this.reservationID=data.reservationID;
  }
  public ngOnInit(): void
  {
   
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
  
      driverAllotmentNotificationID: [''],  
      allotmentID: [''],
      acceptanceNotificationSentToDriverRemark: ['']
      
    });
  }

  submit() 
  {
    // emppty stuff
  }
  onNoClick(): void 
  {
    this.advanceTableForm.reset();
  }
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
  public Post(): void
  {
    this.saveDisabled = false;
    this.advanceTableForm.patchValue({allotmentID:this.AllotmentID});
    this._carAndDriverAllotmentService.addAllotmentNotification(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    { 
      this.showNotification(
        'snackbar-success',
        'Allotment Notification Created...!!!',
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


