// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, HostListener, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GeneralService } from '../../../general/general.service';
import { FormDialogAddPassengersComponent } from 'src/app/addPassengers/dialogs/form-dialog/form-dialog.component';

@Component({
  standalone: false,
  selector: 'app-customer-details-edit',
  templateUrl: './customer-details-edit.component.html',
  styleUrls: ['./customer-details-edit.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class CustomerDetailsEditComponent 
{
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
 
  image: any;
  fileUploadEl: any;
  constructor(
  public dialogRef: MatDialogRef<CustomerDetailsEditComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private el: ElementRef,
  public _generalService:GeneralService)
  {}
  public ngOnInit(): void
  {
    
  }
  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  addPassengers()
  {
    const dialogRef = this.dialog.open(FormDialogAddPassengersComponent, 
      {
        data: 
          {
            // advanceTable: this.advanceTable,
            // action: 'add'
          }
      });
  }

  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
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
    
    this.advanceTableForm.reset();
   
  }


  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({image:this.ImagePath})
  }

}


