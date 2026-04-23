// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { VehicleCategoryTargetService } from '../../vehicleCategoryTarget.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { VehicleCategoryTarget } from '../../vehicleCategoryTarget.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { VehicleCategoryTargetDropDown } from '../../vehicleCategoryTargetDropDown.model';
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
  advanceTable: VehicleCategoryTarget;
  public VehicleCategoryTargetList?: VehicleCategoryTargetDropDown[] = [];
  VehicleCategoryID!: number;
  VehicleCategory!: string;
  isLoading = false;

  constructor(
  public dialogRef: MatDialogRef<FormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: VehicleCategoryTargetService,
    private fb: FormBuilder,
  public _generalService:GeneralService)
  {
    this.VehicleCategoryID = data.vehicleCategoryID;
    this.VehicleCategory = data.vehicleCategory;
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') 
    {
      this.dialogTitle ='Vehicle Category Target';       
      this.advanceTable = data.advanceTable;
      //this.ImagePath=this.advanceTable.vehicleCategoryTargetImage;
    } else 
    {
      this.dialogTitle = 'Vehicle Category Target';
      this.advanceTable = new VehicleCategoryTarget({});
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
      vehicleCategoryTargetID: [this.advanceTable.vehicleCategoryTargetID],
      vehicleCategoryID: [this.VehicleCategoryID],
      vehicle:[this.advanceTable.vehicle,],
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
    this.ImagePath="";
    
  }
  onNoClick():void{
    this.dialogRef.close();
  }
  public Post(): void {
    this.isLoading = true;  // Start spinner before API call
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;  // Stop spinner on success
          this.dialogRef.close();
          this._generalService.sendUpdate('VehicleCategoryTargetCreate:VehicleCategoryTargetView:Success');
        },
        error => {
          this.isLoading = false;  // Stop spinner on error
          this._generalService.sendUpdate('VehicleCategoryTargetAll:VehicleCategoryTargetView:Failure');
        }
      );
  }

  public Put(): void {
    this.isLoading = true;  // Start spinner before API cal

    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.isLoading = false;  // Stop spinner on success
          this.dialogRef.close();
          this._generalService.sendUpdate('VehicleCategoryTargetUpdate:VehicleCategoryTargetView:Success');
        },
        error => {
          this.isLoading = false;  // Stop spinner on error
          this._generalService.sendUpdate('VehicleCategoryTargetAll:VehicleCategoryTargetView:Failure');
        }
      );
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
    this.advanceTableForm.patchValue({vehicleCategoryTargetImage:this.ImagePath})
  }
/////////////////for Image Upload ends////////////////////////////
}



