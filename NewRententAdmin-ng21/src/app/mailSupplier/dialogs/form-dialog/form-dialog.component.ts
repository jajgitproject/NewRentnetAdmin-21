// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MailSupplierService } from '../../mailSupplier.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MailToSupplier } from '../../mailSupplier.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})

export class MTSFormDialogComponent implements OnInit
{
  showError: string;
  reservationID: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: MailToSupplier;
  saveDisabled:boolean=true;
  dataSource: MailToSupplier | null;

  constructor(
  public dialogRef: MatDialogRef<MTSFormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: MailSupplierService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.reservationID = data.reservationID;
        this.dialogTitle ='Mail To Supplier';
        this.advanceTableForm = this.createContactForm();
  }
  
  ngOnInit(): void {
    this.mailToSupplierLoadData();
  }

  public mailToSupplierLoadData() {
    this.advanceTableService.getmailToSupplier(this.reservationID).subscribe(
      data => {
          this.dataSource = data;
          this.advanceTableForm.patchValue({supplierEmail : this.dataSource.supplierEmail});
      },
      (error: HttpErrorResponse) => {
        this.dataSource = null;
      }
    );
  }
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      reservationID : [this.reservationID],
      userID : [''],
      supplierEmail : [''],
      cc : [''],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  submit() 
  {
    //console.log(this.advanceTableForm.value);
  }
  onNoClick(): void 
  {
      this.dialogRef.close();
  }

  public Post(): void {
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this.showNotification(
                'snackbar-success',
                'Mail Sent Successfully...!!!',
                'bottom',
                'center'
              );
        },
        error => {
           this.showNotification(
                'snackbar-danger',
                'Operation Failed.....!!!',
                'bottom',
                'center'
              );
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
}


