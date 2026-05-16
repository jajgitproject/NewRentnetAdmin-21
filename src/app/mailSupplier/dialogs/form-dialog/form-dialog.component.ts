import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MailSupplierService } from '../../mailSupplier.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MailToSupplier } from '../../mailSupplier.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailInfoService } from 'src/app/EmailInfo/EmailInfo.service';
import { EmailInfoModel } from 'src/app/EmailInfo/EmailInfo.model';

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
  emailList: EmailInfoModel[] = [];

  @ViewChild('mailBodyContainer') mailBodyContainer!: ElementRef;
  
  constructor(
  public dialogRef: MatDialogRef<MTSFormDialogComponent>, 
  @Inject(MAT_DIALOG_DATA) public data: any,
  public advanceTableService: MailSupplierService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public emailInfoService: EmailInfoService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  public _generalService:GeneralService)
  {
        // Set the defaults
        this.reservationID = data.reservationID;
        this.dialogTitle ='Mail To Supplier';
        this.advanceTableForm = this.createContactForm();
  }
  
  ngOnInit(): void {
    this.loadData();
  }

  // public mailToSupplierLoadData() {
  //   this.advanceTableService.getmailToSupplier(this.reservationID).subscribe(
  //     data => {
  //         this.dataSource = data;
  //         this.advanceTableForm.patchValue({supplierEmail : this.dataSource.supplierEmail});
  //     },
  //     (error: HttpErrorResponse) => {
  //       this.dataSource = null;
  //     }
  //   );
  // }
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
  }
  onNoClick(): void 
  {
      this.dialogRef.close();
  }

 public Post(): void {

  const mailBody =
    this.mailBodyContainer.nativeElement.innerHTML;

  const payload = {
    ...this.advanceTableForm.getRawValue(),
    emailContent: mailBody
  };

  this.advanceTableService.add(payload)
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

  public loadData() 
  {
    this.emailInfoService.getDataByID(Number(this.reservationID)).subscribe(
    data =>   
    {
      let list: any = data;
      if (list && !Array.isArray(list)) {
        if (Array.isArray(list.data)) list = list.data;
        else if (Array.isArray(list.reservationDetails)) list = list.reservationDetails;
        else if (Array.isArray(list.emailList)) list = list.emailList;
        else if (list.reservationID !== undefined) list = [list];
        else list = [];
      }
      // Defer the state mutation to the next microtask so bindings that
      // already read 'N/A' during the in-flight change-detection pass do
      // not collide with the new value (NG0100).
      this.ngZone.run(() => {
        setTimeout(() => {
          this.emailList = list || [];
          this.cdr.detectChanges();
        }, 0);
      });
    },
    (error: HttpErrorResponse) => 
    { 
      console.error('[EmailInfo] Failed to load email details:', error);
      this.emailList = [];
      this.cdr.detectChanges();
    });
  }
}


