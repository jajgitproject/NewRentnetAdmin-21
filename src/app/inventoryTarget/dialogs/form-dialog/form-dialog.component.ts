// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { InventoryTargetService } from '../../inventoryTarget.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { InventoryTarget } from '../../inventoryTarget.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { InventoryTargetDropDown } from '../../inventoryTargetDropDown.model';
import moment from 'moment';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: InventoryTarget;
  public InventoryTargetList?: InventoryTargetDropDown[] = [];
  InventoryID!: number;
  RegistrationNumber!: string;
  saveDisabled: boolean = true;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: InventoryTargetService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
    this.InventoryID = data.inventoryID;
    this.RegistrationNumber = data.registrationNumber;
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Inventory Target';       
      this.advanceTable = data.advanceTable;
      //this.ImagePath=this.advanceTable.inventoryTargetImage;
      let startDate=moment(this.advanceTable.startDate).format('DD/MM/yyyy');
      let endDate=moment(this.advanceTable.endDate).format('DD/MM/yyyy');
      this.onBlurUpdateDateEdit(startDate);
      this.onBlurUpdateEndDateEdit(endDate);
    } else 
    {
      this.dialogTitle = 'Inventory Target';
      this.advanceTable = new InventoryTarget({});
      this.advanceTable.activationStatus=true;
    }
    this.advanceTableForm = this.createContactForm();
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
  
  public ngOnInit(): void
  {
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      inventoryTargetID: [this.advanceTable.inventoryTargetID],
      inventoryID: [this.advanceTable.inventoryID],
      registrationNumber:[this.advanceTable.registrationNumber,],
      monthlyTarget: [this.advanceTable.monthlyTarget],
      dailyTarget: [this.advanceTable.dailyTarget],
      startDate: [this.advanceTable.startDate],
      endDate: [this.advanceTable.endDate],
      activationStatus: [this.advanceTable.activationStatus]
    });
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control && control.value && control.value.toString() || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  submit() 
  {
    // emppty stuff
  }
  reset(){
    this.advanceTableForm.reset();
    //this.ImagePath="";
  }
  onNoClick()
  {
    this.ImagePath="";
    this.dialogRef.close();
  }
  public Post(): void
  {
    this.advanceTableForm.value.startDate=moment(this.advanceTableForm.value.startDate).format('DD-MM-YYYY');
    this.advanceTableForm.value.endDate=moment(this.advanceTableForm.value.endDate).format('DD-MMM-YYYY');
    this.advanceTableForm.patchValue({ inventoryID:this.data.inventoryID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
       this.dialogRef.close();
       this._generalService.sendUpdate('InventoryTargetCreate:InventoryTargetView:Success');//To Send Updates  
       this.saveDisabled = true;
  },
    error =>
    {
       this._generalService.sendUpdate('InventoryTargetAll:InventoryTargetView:Failure');//To Send Updates  
       this.saveDisabled = true;
    }
  )
  }
  public Put(): void
  {
    this.advanceTableForm.value.startDate=moment(this.advanceTableForm.value.startDate).format('DD-MM-YYYY');
    this.advanceTableForm.value.endDate=moment(this.advanceTableForm.value.endDate).format('DD-MMM-YYYY');
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
       this.dialogRef.close();
       this._generalService.sendUpdate('InventoryTargetUpdate:InventoryTargetView:Success');//To Send Updates 
       this.saveDisabled = true;
       
    },
    error =>
    {
     this._generalService.sendUpdate('InventoryTargetAll:InventoryTargetView:Failure');//To Send Updates  
     this.saveDisabled = true;
    }
  )
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyPressNumbersDecimal(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
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



  //start date
onBlurUpdateDate(value: string): void {
  value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
    this.advanceTableForm.get('startDate')?.setValue(formattedDate);    
} else {
  this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
}
}


onBlurUpdateDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
  const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  if(this.action==='edit')
  {
    this.advanceTable.startDate=formattedDate
  }
  else{
    this.advanceTableForm.get('startDate')?.setValue(formattedDate);
  }
  
} else {
  this.advanceTableForm.get('startDate')?.setErrors({ invalidDate: true });
}
}


//end date
onBlurUpdateEndDate(value: string): void {
value= this._generalService.resetDateiflessthan12(value);

const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
  this.advanceTableForm.get('endDate')?.setValue(formattedDate);    
} else {
this.advanceTableForm.get('endDate')?.setErrors({ invalidDate: true });
}
}

onBlurUpdateEndDateEdit(value: string): void {  
const validDate = moment(value, 'DD/MM/YYYY', true).isValid();
if (validDate) {
const formattedDate = moment(value, 'DD/MM/YYYY').toDate();
if(this.action==='edit')
{
  this.advanceTable.endDate=formattedDate
}
else{
  this.advanceTableForm.get('endDate')?.setValue(formattedDate);
}

} else {
this.advanceTableForm.get('endDate')?.setErrors({ invalidDate: true });
}

}




 /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({inventoryTargetImage:this.ImagePath})
  }
/////////////////for Image Upload ends////////////////////////////
}



