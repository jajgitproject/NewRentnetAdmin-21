// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from 'src/app/general/general.service';
import { MOPModel } from '../../mopDetailsShow.model';
import { MOPDetailsService } from '../../mopDetailsShow.service';
import { ModeOfPaymentDropDown } from 'src/app/supplierContract/modeOfPaymentDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from 'ng2-charts';

@Component({
  standalone: false,
  selector: 'app-mopDetails',
  templateUrl: './mopDetails.component.html',
  styleUrls: ['./mopDetails.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  buttonDisabled:boolean=false;
  status: any;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: MOPModel;
  public PaymentModeList?:ModeOfPaymentDropDown[]=[];
  filteredPaymentModeOptions: Observable<ModeOfPaymentDropDown[]>;
  paymentModeID: any;
  reservationID: any;
  previousModeOfPaymentID: number;
  previousModeOfPayment: string;
  
  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: MOPDetailsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.action = data.action;
        if (this.action === 'edit') 
        {
          //this.dialogTitle ='Edit Mode Of Payment';       
          this.dialogTitle ='Mode Of Payment';
          this.advanceTable = data.advanceTable;
          this.previousModeOfPaymentID=this.advanceTable?.modeOfPaymentID || null;
          this.previousModeOfPayment = this.advanceTable?.modeOfPayment || '';
        } else 
        {
          //this.dialogTitle = 'Create Mode Of Payment';
          this.dialogTitle = 'Mode Of Payment';
          this.advanceTable = new MOPModel({});
          this.advanceTable.activationStatus=true;
        }
        this.advanceTableForm = this.createContactForm();
        this.reservationID=data.reservationID;
        this.status= data.verifyDutyStatusAndCacellationStatus || data?.status?.status || data?.status;
        // if(this.status !== 'Changes allow'){
        //   this.buttonDisabled=true;
        // }
             if(this.status === 'Changes allow'){
    this.buttonDisabled = false;  // Save button enable
} else {
    this.buttonDisabled = true;   // Save button disable
}

  }

  ngOnInit()
  {
    this.InitPaymentMode();
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      modeOfPaymentID: [this.advanceTable?.modeOfPaymentID || null],
      modeOfPayment: [this.advanceTable?.modeOfPayment || '',[this.noWhitespaceValidator]],
      reservationID:[this.advanceTable?.reservationID || null],
      modeOfPaymentChangeReason: [this.advanceTable?.modeOfPaymentChangeReason || ''],
      previousModeOfPaymentID: [this.previousModeOfPaymentID || null],
      previousModeOfPayment: [this.previousModeOfPayment || '']
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}


//-------------Mode of Payment ------------------
InitPaymentMode(){
  this._generalService.GetModeOfPayment().subscribe(
    data=>
    {
      this.PaymentModeList=data;
      this.advanceTableForm.controls['modeOfPayment'].setValidators([Validators.required,this.MOPValidator(this.PaymentModeList)]);
      this.advanceTableForm.controls['modeOfPayment'].updateValueAndValidity();
      this.filteredPaymentModeOptions = this.advanceTableForm.controls['modeOfPayment'].valueChanges.pipe(
        startWith(""),
        map(value => this._filterPaymentMode(value || ''))
      ); 
    });
}

private _filterPaymentMode(value: string): any {
  const filterValue = value.toLowerCase();
  return this.PaymentModeList?.filter(
    customer => 
    {
      return customer.modeOfPayment.toLowerCase().indexOf(filterValue)===0;
    }
  );
}

  MOPValidator(PaymentModeList: any[]): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value?.toLowerCase();
        const match = PaymentModeList.some(data => (data.modeOfPayment.toLowerCase()) === value );
        return match ? null : { modeOfPaymentInvalid: true };
      };
    }

  MOPSelected(selectedMOP: string) 
  {
    const MOP = this.PaymentModeList.find(
      data => data.modeOfPayment === selectedMOP);
    if (selectedMOP) 
    {
      this.getPaymentModeID(MOP.modeOfPaymentID);
    }
  }

getPaymentModeID(paymentModeID: any)
{
  this.paymentModeID=paymentModeID;
  this.advanceTableForm.patchValue({modeOfPaymentID:this.paymentModeID});
}

  submit() {}
  
  onNoClick(): void 
  {
    if(this.action==='add')
    {
      this.advanceTableForm.reset();
    }
    else if(this.action==='edit')
    {
      this.dialogRef.close();
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

  public Put(): void
  {
    
    this.advanceTableForm.patchValue({reservationID:this.reservationID});
    this.advanceTableForm.patchValue({previousModeOfPaymentID:this.previousModeOfPaymentID})
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
      response => 
        {
          this.dialogRef.close();
          this.showNotification(
            'snackbar-success',
            'Mode Of Payment Updated...!!!',
            'bottom',
            'center'
          );  
        },
    error =>
    {
     this._generalService.sendUpdate('ModeOfPaymentAll:ModeOfPaymentView:Failure');//To Send Updates  
    })
  }

  public confirmAdd(): void 
  {
       if(this.action=="edit")
       {
          this.Put();
       }
  }
}


