// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { DutySlipQualityCheckService } from '../../dutySlipQualityCheck.service';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
//import { AllotmentDetails, DutySlipDetials, DutySlipQualityCheck } from '../../dutySlipQualityCheck.model';
import { AllotmentDetails, DutyAmenitieModel, DutySlipQualityCheck } from '../../dutySlipQualityCheck.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AmenitieDropDown } from 'src/app/amenitie/amenitieDropDown.model';

@Component({
  standalone: false,
  selector: 'app-dutyAmenitie-dialog',
  templateUrl: './dutyAmenitie-dialog.component.html',
  styleUrls: ['./dutyAmenitie-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class DutyAmenitieDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DutyAmenitieModel | null;
  saveDisabled:boolean=true;
  status:any; // raw status value passed from parent
  buttonDisabled:boolean=false; // gating flag derived from status

  image: any;
  fileUploadEl: any;
  dutySlipID:any;

  public AmenitieList?: AmenitieDropDown[] = [];
  filteredDutyAmenitiesOptions: Observable<AmenitieDropDown[]>;
  amenitieID: any;
 

  constructor(
  public dialogRef: MatDialogRef<DutyAmenitieDialogComponent>, 
  private snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: DutySlipQualityCheckService,
    private fb: FormBuilder,
    private el: ElementRef,
  public _generalService:GeneralService)
  {
    console.log(data);
        // Set the defaults
        this.action = data.action;
        // this.status = this.extractStatus(data?.status);
        // console.log('Duty Amenitie Dialog received status:', this.status);
        // this.buttonDisabled = this.status?.toLowerCase?.() !== 'changes allow';
        this.status = this.extractStatus(data?.status);

const normalized = (this.status || '').trim().toLowerCase();

// button disable logic
this.buttonDisabled = normalized !== 'changes allow';
        if (this.action === 'edit') 
        {
          this.dialogTitle ='Duty Amenitie';   
          this.advanceTable = data.advanceTable;       
          this.ImagePath=this.advanceTable.amenitieImage;
          
        } else 
        {
          this.dialogTitle = 'Duty Amenitie';
          this.advanceTable = new DutyAmenitieModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.dutySlipID=data.dutySlipID;
  }
  public ngOnInit(): void
  { 
   this.InitAmenities(); 
  }

  InitAmenities() {
      this._generalService.GetAmenities().subscribe(
        data =>
        {
           ;
          this.AmenitieList = data;
          this.advanceTableForm.controls['amenitie'].setValidators([Validators.required,
            this.amenitieTypeValidator(this.AmenitieList)
          ]);
          this.advanceTableForm.controls['amenitie'].updateValueAndValidity();
  
          this.filteredDutyAmenitiesOptions = this.advanceTableForm.controls['amenitie'].valueChanges.pipe(
            startWith(""),
            map(value => this._filter(value || ''))
          );
        },
        error =>
        {
         
        }
      );
     }
  
     private _filter(value: string): any {
      const filterValue = value.toLowerCase();
      return this.AmenitieList.filter(
        customer => 
        {
          return customer.amenitie.toLowerCase().includes(filterValue);
        }
      );
    }
    onAmenitieSelected(selectedAmenitieName: string) {
      debugger
      const selectedAmenitie = this.AmenitieList.find(
        data => data.amenitie === selectedAmenitieName
      );
    
      if (selectedAmenitie) {
        this.getAmenitieID(selectedAmenitie.amenitieID);
      }
    }
    getAmenitieID(amenitieID: any) {
      debugger;
      this.amenitieID=amenitieID;
      this.advanceTableForm.patchValue({amenitieID : this.amenitieID});
    }
    amenitieTypeValidator(AmenitieList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = AmenitieList.some(group => group.amenitie?.toLowerCase() === value);
        return match ? null : { amenitieInvalid: true };
      };
    }

    onDutyAmenitieChanges(event:any)
  {
    if(event.keyCode===8)
    {
      this.advanceTableForm.controls['amenitieID'].setValue('');
      this.advanceTableForm.controls['amenitie'].setValue('');
    }
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
    this.advanceTableService.updateDutyAmenitie(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close(response);
       //this._generalService.sendUpdate('DutySlipQualityCheckUpdate:DutySlipQualityCheckView:Success');//To Send Updates  
       this.showNotification(
        'snackbar-success',
        'Duty Slip Quality Check Updated...!!!',
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
    if (this.buttonDisabled) {
      console.log('Save blocked due to status not allowing changes:', this.status);
      return;
    }
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
  
  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({amenitieImage:this.ImagePath})
  }

  private extractStatus(input: any): string | null {
    if (input === undefined || input === null) return null;
    try {
      if (typeof input === 'string') return input;
      if (input?.status) {
        if (typeof input.status === 'string') return input.status;
        if (input.status?.status) return input.status.status;
      }
      return input?.toString?.() || null;
    } catch (e) {
      console.log('Status extraction error (AmenitieDialog):', e);
      return null;
    }
  }

}


