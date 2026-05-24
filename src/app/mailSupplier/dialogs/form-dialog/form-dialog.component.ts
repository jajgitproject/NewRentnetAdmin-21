import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { MailSupplierService } from '../../mailSupplier.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { MailToSupplier } from '../../mailSupplier.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
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
  loggedInUserName = '';
  isSendingMail = false;

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
    this.loggedInUserName = this.getLoggedInUserDisplayName();
    this.advanceTableForm.patchValue({
      userID: this._generalService.getUserID()
    });
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
  if (this.isSendingMail) {
    return;
  }

  this.isSendingMail = true;
  const tableHtml = this.mailBodyContainer.nativeElement.innerHTML;
  const mailBody = this.buildSupplierEmailHtml(tableHtml);

  const payload = {
    ...this.advanceTableForm.getRawValue(),
    emailContent: mailBody
  };

  this.advanceTableService.add(payload)
    .subscribe(
      response => {
        this.isSendingMail = false;
        this.dialogRef.close();

        this.showNotification(
          'snackbar-success',
          'Mail Sent Successfully...!!!',
          'bottom',
          'center'
        );
      },
      error => {
        this.isSendingMail = false;
        const stringError = typeof error === 'string' ? error.trim() : '';
        const backendMessage =
          stringError ||
          error?.error?.message ||
          (typeof error?.error === 'string' ? error.error : '') ||
          error?.message ||
          'Operation Failed.....!!!';
        this.showNotification(
          'snackbar-danger',
          backendMessage,
          'bottom',
          'center'
        );
      }
    );
}

  private buildSupplierEmailHtml(tableHtml: string): string {
    const senderName = this.safeString(this.loggedInUserName) || '{User Name who login into the rentnet}';
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email To Supplier</title>
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: Arial, sans-serif;
      color: #111111;
      background: #ffffff;
      line-height: 1.4;
    }
    .mail-wrap {
      max-width: 1000px;
      margin: 0 auto;
    }
    .lead {
      margin: 0 0 24px 0;
      font-size: 22px;
      font-weight: 700;
      color: #2f80c4;
    }
    .intro {
      margin: 0 0 22px 0;
      font-size: 14px;
    }
    .signoff {
      margin-top: 28px;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .mail-signature {
      margin: 0 0 24px 0;
      font-size: 14px;
    }
    .eco-logo {
      margin: 8px 0 14px 0;
      width: 160px;
      height: auto;
      display: block;
    }
    .company-name {
      margin-top: 10px;
      font-size: 20px;
      font-weight: 700;
      color: #2f80c4;
    }
    .contact-line {
      margin-top: 12px;
      font-size: 14px;
    }
    .contact-line a {
      color: #2f80c4;
      text-decoration: underline;
    }
    .tagline {
      margin-top: 14px;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.35;
    }
  </style>
</head>
<body>
  <div class="mail-wrap">
    <p class="lead">Dear ASSOCIATE</p>
    <p class="intro">Please confirm the following reservation:</p>
    ${tableHtml}
    <div class="signoff">
      <p><u>Thanks</u> and Regards</p>
    </div>
    <p class="mail-signature">${senderName}</p>
    <img class="eco-logo" src="https://prodapi.ecoserp.in/StaticFiles/Images/logoeco1.png" alt="ECO Rent A Car Logo" />
    <div class="company-name">ECO Mobility</div>
    <div class="contact-line">
      <strong>24x7 Reservations:</strong> T: +91-11-4079-4079 |
      E: <a href="mailto:cars@ecosmobility.com">cars@ecosmobility.com</a> |
      W: <a href="https://www.ecosmobility.com" target="_blank" rel="noopener noreferrer">www.ecosmobility.com</a>
    </div>
    <div class="tagline">
      Ground Transportation in 100+ cities in India and 30+ countries worldwide<br>
      Chauffeured Car Rental | Employee Transportation Service | Self Drive
    </div>
  </div>
</body>
</html>`;
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
          this.emailList = this.normalizeEmailInfoList(list || []);
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

  private normalizeEmailInfoList(list: EmailInfoModel[]): EmailInfoModel[] {
    return (list || []).map((item) => ({
      ...item,
      city: this.safeString(item?.city) || 'N/A',
      pickup: {
        ...item?.pickup,
        pickupAddressDetails: this.safeString(item?.pickup?.pickupAddressDetails),
        pickupAddress: this.safeString(item?.pickup?.pickupAddress) || 'N/A'
      },
      drop: {
        ...item?.drop,
        dropOffAddressDetails: this.safeString(item?.drop?.dropOffAddressDetails),
        dropOffAddress: this.safeString(item?.drop?.dropOffAddress) || 'N/A'
      },
      passenger: {
        ...item?.passenger,
        customerPersonName: this.safeString(item?.passenger?.customerPersonName) || 'N/A',
        primaryMobile: this.safeString(item?.passenger?.primaryMobile) || 'N/A'
      },
      vehicle: {
        ...item?.vehicle,
        vehicle: this.safeString(item?.vehicle?.vehicle) || 'N/A'
      },
      package: {
        ...item?.package,
        package: this.safeString(item?.package?.package) || 'N/A'
      }
    }));
  }

  private safeString(value: string | null | undefined): string {
    return (value || '').trim();
  }

  getPickupAddressDisplay(info: EmailInfoModel): string {
    const details = this.safeString(info?.pickup?.pickupAddressDetails);
    const address = this.safeString(info?.pickup?.pickupAddress);
    return this.joinAddressParts(details, address);
  }

  getDropAddressDisplay(info: EmailInfoModel): string {
    const details = this.safeString(info?.drop?.dropOffAddressDetails);
    const address = this.safeString(info?.drop?.dropOffAddress);
    return this.joinAddressParts(details, address);
  }

  private joinAddressParts(firstPart: string, secondPart: string): string {
    const merged = [firstPart, secondPart]
      .filter((value) => !!value && value.toUpperCase() !== 'N/A')
      .join(' ')
      .trim();
    return merged || 'N/A';
  }

  private getLoggedInUserDisplayName(): string {
    try {
      const rawCurrentUser = localStorage.getItem('currentUser');
      if (rawCurrentUser) {
        const parsed = JSON.parse(rawCurrentUser);
        const employee = parsed?.employee ?? parsed?.Employee;
        const firstName = this.safeString(employee?.FirstName ?? employee?.firstName);
        const lastName = this.safeString(employee?.LastName ?? employee?.lastName);
        const fullName = `${firstName} ${lastName}`.trim();
        if (fullName) {
          return fullName;
        }
      }
    } catch {
      // Fall back to existing helper/default when parsing currentUser fails.
    }

    return this.safeString(this._generalService.getUserName()) || '{User Name who login into the rentnet}';
  }
}


