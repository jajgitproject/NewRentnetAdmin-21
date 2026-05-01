// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { DisputeService } from '../../dispute.service';
import { Observable } from 'rxjs';
import { DisputeTypeDropDown } from '../../disputeTypeDropDown.model';
import { map, startWith } from 'rxjs/operators';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogDisputeComponent 
{
  saveDisabled:boolean=true;
  advanceTableForm: FormGroup;
  DutySlipID: any;
  ReservationID:any;
  dutySlipForBillingID: any;
  dutyTypeID: any;
  tableRecord: any;
  public EmployeeList?: EmployeeDropDown[]=[];

  filteredDisputeTypeOptions: Observable<DisputeTypeDropDown[]>;
  public DisputeTypeList?: DisputeTypeDropDown[] = [];
  disputeTypeID: any;
  reservationID: any;
  verifyDutyStatusAndCacellationStatus: any;
  isSaveAllowed: boolean = false;
  
  constructor(
  public dialogRef: MatDialogRef<FormDialogDisputeComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  private snackBar: MatSnackBar,
  public clossingScreenService: DisputeService,
  private fb: FormBuilder,
  private route:ActivatedRoute,
  public _generalService:GeneralService)
  {
    this.verifyDutyStatusAndCacellationStatus = data.verifyDutyStatusAndCacellationStatus;
        this.DutySlipID=data.dutySlipID;
        this.dutySlipForBillingID=data.dutySlipForBillingID;
        this.dutyTypeID=data.dutyTypeID;
        this.reservationID=data.reservationID;

        // this.tableRecord = data?.record[0];
        this.tableRecord = data?.record?.length ? data.record[0] : null;

        // this.tableRecord.activationStatus=true;
        this.tableRecord = {
          activationStatus: true,
          ...data?.record?.[0]   // spread in existing values if present
        };
        
        this.advanceTableForm = this.createContactForm();
      if (this.verifyDutyStatusAndCacellationStatus !== 'Changes allow') 
      {
        this.isSaveAllowed = true;
      } 
      else
      {
        this.isSaveAllowed = false;
      }

  }

  public ngOnInit(): void
  {
    this.route.queryParams.subscribe(paramsData =>{
      const encryptedDutySlipID = paramsData.dutySlipID;
      this.DutySlipID = this._generalService.decrypt(decodeURIComponent(encryptedDutySlipID));          
    });
    this.advanceTableForm.reset();
    this.advanceTableForm.controls['activationStatus'].setValue(true);
    this.InitApprovedBy();
    this.InitDisputeType();
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      disputeID: [this.tableRecord?.disputeID],
      disputeByID: [this.tableRecord?.disputeByID],
      dutySlipID: [this.DutySlipID],
      dutySlipForBillingID: [this.tableRecord?.dutySlipForBillingID],
      disputeKM: [this.tableRecord?.disputeKM || ''],
      disputeMinutes: [this.tableRecord?.disputeMinutes || ''],
      disputeDetails: [this.tableRecord?.disputeDetails || ''],
      // disputeApprovedBy:[this.tableRecord?.firstName+' '+this.tableRecord?.lastName || ''],
      // disputeApprovedByID: [this.tableRecord?.disputeApprovedByID || ''],
      disputeTypeID: [this.tableRecord?.disputeTypeID ],
      disputeDate: [this.tableRecord?.disputeDate || ''],
      disputeTime: [this.tableRecord?.disputeTime || ''],
      disputeType: [this.tableRecord?.disputeType || ''],
      disputeSupportingDoc: [this.tableRecord?.disputeSupportingDoc || ''],
      activationStatus: [this.tableRecord?.activationStatus],
    });
  }

  // =============== Dispute Type ===============
  InitDisputeType(){
    this._generalService.GetDisputeType().subscribe
    (
      data=>{
        this.DisputeTypeList=data;
        this.advanceTableForm.controls['disputeType']?.setValidators([Validators.required,
          this.disputeTypeValidator(this.DisputeTypeList)
        ]);
        this.advanceTableForm.controls['disputeType']?.updateValueAndValidity();
        this.filteredDisputeTypeOptions = this.advanceTableForm.controls['disputeType'].valueChanges.pipe(
          startWith(""),
          map(value => this._filterDisputeType(value || ''))
        ); 
      }
    );
  }
  private _filterDisputeType(value: string): any {
    const filterValue = value.toLowerCase();
    return this.DisputeTypeList.filter(
      data => 
      {
        return data.disputeType.toLowerCase().includes(filterValue);
      }
    );
  }
  OnDisputeTypeSelect(selectedDisputeType: string)
  {
    const DisputeTypeName = this.DisputeTypeList.find(
      data => data.disputeType === selectedDisputeType
    );
    if (selectedDisputeType) 
    {
      this.getDisputeTypeID(DisputeTypeName.disputeTypeID);
    }
  }
  disputeTypeValidator(DisputeTypeList: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toLowerCase();
      const match = DisputeTypeList.some(group => group.disputeType?.toLowerCase() === value);
      return match ? null : { disputeTypeInvalid: true };
    };
  }

  getDisputeTypeID(disputeTypeID:any) 
  {
    this.disputeTypeID=disputeTypeID;
    this.advanceTableForm.patchValue({disputeTypeID:this.disputeTypeID});
  }

  InitApprovedBy()
  {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data=>
      {
        this.EmployeeList=data
        this.advanceTableForm.patchValue({disputeByID: this.EmployeeList[0].employeeID});
        this.advanceTableForm.patchValue({disputeBy: this.EmployeeList[0].firstName +" "+this.EmployeeList[0].lastName});
      }
    );
  }

  onNoClick(): void 
  {
    this.advanceTableForm.reset();
    this.dialogRef.close();
  }

   /////////////////for Image Upload////////////////////////////
   public response: { dbPath: '' };
   public ImagePath: string = "";
   public ImagePath1: string = "";
   public ImagePath2: string = "";
   
   public DisputeSupportingDoc = (event) => 
   {
     this.response = event;
     this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
     this.advanceTableForm.patchValue({disputeSupportingDoc:this.ImagePath})
   }
 
  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  //  public confirmAdd(): void 
  // {
  //   this.saveDisabled = false;
  //      if(this.action=="edit")
  //      {
  //         this.Put();
  //      }
  //      else
  //      {
  //         this.Post();
  //      }

  // }

  public Post(): void
  {
    this.saveDisabled=false;
    this.advanceTableForm.patchValue({dutySlipID:this.DutySlipID});
    this.advanceTableForm.patchValue({disputeID: -1});
    this.advanceTableForm.patchValue({dutySlipForBillingID:this.dutySlipForBillingID});
    // this.advanceTableForm.patchValue({disputeTypeID:this.disputeTypeID});
    this.clossingScreenService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
    
        this.showNotification(
          'snackbar-success',
          'Dispute Create...!!!',
          'bottom',
          'center'
        );
        this.saveDisabled=true;
       this.clossingScreenService.getDisputeInfo(this.DutySlipID).subscribe(updatedDisputes => {
        this.clossingScreenService.updateDisputeData(updatedDisputes); // 🔁 Push updated data to all subscribers
        this.dialogRef.close(true); // To inform closingOne to handle UI
      });
    },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed...!!!',
        'bottom',
        'center'
      );
      this.saveDisabled=true;
    }
  )
  }

  //start date
  onBlurdateOfLeaving(value: string): void {
    
    value= this._generalService.resetDateiflessthan12(value);
  
  const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
  if (validDate) {
    const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
      this.advanceTableForm.get('disputeDate')?.setValue(formattedDate);    
  } else {
    if(value===""){
    this.advanceTableForm.controls['disputeDate'].setValue('');
    }
    else{
      this.advanceTableForm?.get('disputeDate')?.setErrors({ invalidDate: true });
    }
    
  }

}

onTimeInput(event: any): void {
  const inputValue = event.target.value;

  // Attempt to parse the input as a valid time
  const parsedTime = new Date(`1970-01-01T${inputValue}`);

  // Check if the parsedTime is valid
  if (!isNaN(parsedTime.getTime())) {
      this.advanceTableForm.get('disputeTime').setValue(parsedTime);
  }
}
onBlurTime(value: string): void {
  const validTime = moment(value, 'HH:mm', true).isValid();
  if (validTime) {
    const formattedTime = moment(value, 'HH:mm').toDate();
    this.advanceTableForm.get('disputeTime')?.setValue(formattedTime);
  } else {
    if(value===""){
      this.advanceTableForm.controls['disputeTime'].setValue('');
    }
    else{
      this.advanceTableForm?.get('disputeTime')?.setErrors({ invalidDate: true });
    }
  }
}
}



