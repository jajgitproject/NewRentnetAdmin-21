// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { CustomerReservationFields } from 'src/app/reservation/customerReservationField.model';
import { CustomerSpecificDetailsService } from '../../customerSpecificDetails.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class FormDialogComponentCSD 
{
  buttonDisabled:boolean=false;
  status: any;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  public CustomerExtraFieldList?:CustomerReservationFields[]=[];
  // Declare form group
  dynamicForm: FormGroup;
  formFields: any;
  arr:any[]=[];
  arr1:any[]=[];
  arr2:any[]=[];


  constructor(
  public dialogRef: MatDialogRef<FormDialogComponentCSD>,   
  @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private el: ElementRef,
    private snackBar: MatSnackBar,
    private advanceTableService:CustomerSpecificDetailsService,
  public _generalService:GeneralService)
  {       
    
        this.advanceTableForm=this.createContactForm();
        this.status=data?.status?.status || data?.status || data;
        // if(this.status!='Changes allow'){
        //   this.buttonDisabled=true;
        // }
             if(this.status === 'Changes allow'){
    this.buttonDisabled = false;  // Save button enable
} else {
    this.buttonDisabled = true;   // Save button disable
}
  }
  public ngOnInit(): void
  {
    debugger;
    this.InitProjectCode();
    if(this.data.action==='edit')
    {
      // Initialize the dynamic form with form fields
      this.dynamicForm = this.fb.group({});
      this.data?.dataSource[0]?.customerSpecificFieldList?.forEach(field => {
        const control = this.fb.control(field.fieldValue, [Validators.required]);
        this.dynamicForm.addControl(field.fieldName, control);
      });
    }
  }

  InitProjectCode()
  {
    this._generalService.GetCustomerRentNetFieldsBasedOnCustomerID(this.data.customerID).subscribe(
      data=>
      {
        this.CustomerExtraFieldList=data;
      }
    );
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerReservationFieldID:[''],
      fieldName:[''],
      fieldValue:[''],
      reservationID:['']
    });
  }
  
  onSubmit() {
  }

  bindValues()
  {
    this.arr2.push(Object.values(this.dynamicForm.value));
    this.data.dataSource[0].customerSpecificFieldList.forEach((ele)=>
    {
      this.arr.push(ele.customerReservationFieldID);
      this.arr1.push(ele.fieldName);
    });
  }


  public Put(): void
  {
    this.bindValues();
    this.advanceTableForm.patchValue({customerReservationFieldID:this.arr});
    this.advanceTableForm.patchValue({fieldName:this.arr1});
    this.advanceTableForm.patchValue({fieldValue:this.arr2[0]});
    this.advanceTableForm.patchValue({reservationID:this.data.dataSource[0].reservationID});
    this.advanceTableService.update(this.advanceTableForm.value)  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
        this.showNotification(
          'snackbar-success',
          'Customer Specific Field Updated ...!!!',
          'bottom',
          'center'
        );    
    
  },
    error =>
    {
      this.showNotification(
        'snackbar-danger',
        'Operation Failed ...!!!',
        'bottom',
        'center'
      );
    }
  )
  }

}


