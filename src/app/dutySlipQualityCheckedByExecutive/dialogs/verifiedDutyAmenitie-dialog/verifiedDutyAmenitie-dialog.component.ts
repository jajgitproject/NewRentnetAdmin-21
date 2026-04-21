// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AmenitieDropDown } from 'src/app/amenitie/amenitieDropDown.model';
import { DutySlipQualityCheckService } from 'src/app/dutySlipQualityCheck/dutySlipQualityCheck.service';
import { DutyAmenitieModel } from 'src/app/dutySlipQualityCheck/dutySlipQualityCheck.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: false,
  selector: 'app-verifiedDutyAmenitie-dialog',
  templateUrl: './verifiedDutyAmenitie-dialog.component.html',
  styleUrls: ['./verifiedDutyAmenitie-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class VerifiedDutyAmenitieDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DutyAmenitieModel | null;
  saveDisabled:boolean=true;

  image: any;
  fileUploadEl: any;
  dutySlipID:any;
 PageNumber: number = 0;
  SearchActivationStatus : boolean=true;
  public AmenitieList?: AmenitieDropDown[] = [];
  filteredDutyAmenitiesOptions: Observable<AmenitieDropDown[]>;
  amenitieID: any; 
 dataSource: DutyAmenitieModel[] | null;
  constructor(
  public dialogRef: MatDialogRef<VerifiedDutyAmenitieDialogComponent>, 
  private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutySlipQualityCheckService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService,
 public dutySlipQualityCheckService: DutySlipQualityCheckService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Verify Duty Amenitie';   
          this.advanceTable = data.advanceTable;       
          this.ImagePath=this.advanceTable.amenitieImage;
          
        } else 
        {
          this.dialogTitle = 'Verify Duty Amenitie';
          this.advanceTable = new DutyAmenitieModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.dutySlipID=data.dutySlipID;
  }
  public ngOnInit(): void
  { 
   this.loadDataForDutyAmenities(); 
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
      dutyAmenitieID: [this.advanceTable.dutyAmenitieID],
      dutySlipID:  [this.advanceTable.dutySlipID],
      amenitieID:  [this.advanceTable.amenitieID],
      amenitie:  [this.advanceTable.amenitie],
      amenitieVerified:  [this.advanceTable.amenitieVerified],
      amenitieRemark:  [this.advanceTable.amenitieRemark],
      amenitieImage: [this.advanceTable.amenitieImage],
      activationStatus: [this.advanceTable.activationStatus]
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


  onNoClick()
  {
    this.dialogRef.close()
  }

  public Post(): void
  {
    this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID});
    this.advanceTableService.addDutyAmenitie(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close(response);
        this.showNotification(
          'snackbar-success',
          'Duty Amenitie Created...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled = true;
    },
    error =>
    {
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

  public Put(): void
  {
    this.advanceTableForm.patchValue({dutySlipID:this.dutySlipID});
    this.advanceTableService.UpdateVerifiedDutyAmenitie(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close(response);
       //this._generalService.sendUpdate('DutySlipQualityCheckUpdate:DutySlipQualityCheckView:Success');//To Send Updates  
       this.showNotification(
        'snackbar-success',
        'Duty Amenitie Verified...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
    },
    error =>
    {
     
      this.showNotification(
        'snackbar-danger',
        'Operation Failed.....!!!',
        'bottom',
        'center'
      );
      this.saveDisabled = true;
     // this._generalService.sendUpdate('DutySlipQualityCheckAll:DutySlipQualityCheckView:Failure');//To Send Updates  
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
          //this.Post();
       }
  }
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({amenitieImage:this.ImagePath})
  }

  public loadDataForDutyAmenities() 
       {
        this.dutySlipQualityCheckService.getDutyAmenities(this.dutySlipID,this.SearchActivationStatus, this.PageNumber).subscribe
        (
          data =>   
          {
              this.dataSource = data;
          },
          (error: HttpErrorResponse) => { this.dataSource = null;}
        );
      }

}


