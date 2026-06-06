//@ts-nocheck
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Address } from '@compat/google-places-shim-objects/address';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import moment from 'moment';
import {
  FormDialogPassengerEmsComponent,
  FormDialogPassengerEmsComponent as a
} from '../../passenger-dialog/passenger-dialog.component';
import { AddPeopleComponent } from '../../add-people/add-people.component';
import { ConfigurationMessaging, SendSmsWhatsappMail } from '../../sendSmsWhatsappMail.model';
import { SendSmsWhatsappMailService } from '../../sendSmsWhatsappMail.service';
import Swal from 'sweetalert2';
import {
  isValidEmail,
  normalizeMobileForMessaging
} from '../../../shared/messaging-validation.util';
//import { CustomerConfigurationMessaging } from 'src/app/sendSMS/sendSMS.model';
//import { passengerMobileDataDialogComponent } from '../../passenger-Mobile-and-email/passenger-Mobile-and-email.component';

@Component({
  standalone: false,
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class FormDialogSendSmsWhatsappMailComponent {
  displayedColumns: string[] = [
    'name',
    'mobileNo',
    'primaryEmail',
    'reservationSMSToBooker',
    'reservationSMSToPassenger',
    'sendSMSWhatsApp',
    'type',
    'action'
  ];
  dataSource: any;
  // Start as an empty array so the template's *ngIf="!permissionData" does
  // not transition from true -> false once data arrives (NG0100).
  permissionData: ConfigurationMessaging[] | any = [];
  @ViewChild(MatTable) table: MatTable<any>;
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: any;
  newRecords = [];
  showNoRecordsFoundMessage: boolean = false;
  //address: string;
  options: any = {
    componentRestrictions: { country: 'IN' }
  };

  addressString: string;
  public EmployeeList?: EmployeeDropDown[] = [];

  //dataSource: SendEmsAndEmail[] | null;
  previousData: SendSmsWhatsappMail[];
  dispatchCurrentData: SendSmsWhatsappMail[];
  dispatchNextData: SendSmsWhatsappMail[];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  filteredOrganizationalEntityOptions: Observable<
    OrganizationalEntityDropDown[]
  >;
  //public sendEmsAndEmailService: SendEmsAndEmailService
  driverName: any;
  driverPhone: any;
  RegistrationNumber: any;
  AllotmentID: any;
  ReservationID: any;
  LocationOutEntryExecutiveID: any;
  locationOutLocationOrHubID: any;
  pickupDate: string;
  pickupTime: string;
  vehicle: any;
  registrationNumber: any;
  customerPersonName: any;
  city: any;
  primaryMobile: any;
  primaryEmail: any;
  customerDetails: any;
  customerPersonDetails = [];
  customerPersonID: any;
  isBooker: any;
  isPassenger: any;
  additionalData = [];
  // apiRequestData: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogSendSmsWhatsappMailComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: SendSmsWhatsappMailService,
    public sendSmsWhatsappMailService:SendSmsWhatsappMailService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.action = data.action;

    // this.advanceTable = data.advanceTable;

    this.advanceTable = new SendSmsWhatsappMail({});
    //this.advanceTable.activationStatus=true;

    this.advanceTableForm = this.createContactForm();

    this.ReservationID = data.reservationID;
    this.isBooker = data.isbooker;
    this.isPassenger = data.isPassenger;
    this.customerPersonID = data.customerPersonID;
    this.vehicle = data.vehicle;
    this.pickupDate = data.pickupDate;
    this.pickupTime = data.pickupTime;
    this.registrationNumber = data.registrationNumber ?? data?.item?.registrationNumber;
    this.driverName = data.driverName ?? data?.item?.driverName ?? data?.item?.driver?.driverName;
    this.driverPhone =
      data.driverPhone ??
      data?.item?.driverPhone ??
      data?.item?.driverMobile ??
      data?.item?.driver?.mobile1;
    this.customerPersonName = data.customerPersonName;
    this.city = this.pickText(
      data?.item?.reservationHeaderDetails?.[0]?.pickupCity,
      data?.item?.reservationDetails?.[0]?.pickupCity,
      data?.item?.reservationDetails?.[0]?.city,
      data?.item?.pickupCity,
      data?.item?.city,
      data?.pickupCity,
      data?.item?.pickup?.pickupCity,
      data?.item?.pickup?.city,
      data?.item?.pickupLocation?.cityName,
      data?.item?.pickupLocation?.city,
      data?.item?.stopsDetails?.[0]?.pickupCity,
      data?.item?.stopsDetails?.[0]?.city,
      data?.city
    );
    this.primaryMobile = data.primaryMobile;

    this.primaryEmail = data.primaryEmail;
    this.customerDetails = data?.item?.customerPerson;
    this.dataSource = data?.item?.passengerDetails;
    this.customerPersonDetails.push(data?.item?.customerPerson);
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      mailID: [this.advanceTable.mailID],
      mobileno: [this.advanceTable.customerPerson?.primaryMobile],
      reservationStatusText: [this.advanceTable.reservationStatusText],
      reservationsend: [this.advanceTable.reservationsend],
      additionNo: [this.advanceTable.additionNo]
    });
  }

  private pickText(...values: any[]): string | null {
    for (const value of values) {
      const text = (value ?? '').toString().trim();
      if (text && text.toLowerCase() !== 'n/a') {
        return text;
      }
    }
    return null;
  }

  public loadData() {
    this._generalService.GetPermission(this.ReservationID).subscribe(
      (data) => {
        const normalizedRows = this.normalizePermissionRows(data);
        console.log(normalizedRows);
        this.permissionData = this.ensureBookerRowPresent(normalizedRows);
        this.cdr.detectChanges();
      },
      (error: HttpErrorResponse) => {
        this.permissionData = [];
      }
    );
  }

  private normalizePermissionRows(rows: any[]): any[] {
    if (!Array.isArray(rows)) {
      return [];
    }
    return rows.map((row) => ({
      ...row,
      type: this.resolveRecipientType(row)
    }));
  }

  private resolveRecipientType(element: any): string {
    const personTypeLower = (element?.personType ?? '').toString().toLowerCase();
    if (personTypeLower === 'booker') {
      return 'Booker';
    }
    if (personTypeLower === 'passenger') {
      return 'Passenger';
    }

    const typeLower = (element?.type ?? '').toString().toLowerCase();
    if (typeLower === 'employee') {
      return 'Employee';
    }
    if (typeLower === 'booker') {
      return 'Booker';
    }
    if (typeLower === 'passenger') {
      return 'Passenger';
    }
    if (element?.isBooker === true) {
      return 'Booker';
    }
    if (element?.isPassenger === true) {
      return 'Passenger';
    }
    if (typeLower === 'customer person' || typeLower === 'customerperson' || element?.customerPersonID) {
      if (element?.isBooker === true || element?.reachedSMSToBooker === true) {
        return 'Booker';
      }
      if (element?.isPassenger === true || element?.reachedSMSToPassenger === true) {
        return 'Passenger';
      }
      return 'Booker';
    }
    if (typeLower === 'number') {
      return 'Not Registered';
    }
    return 'Not Registered';
  }

  private ensureBookerRowPresent(rows: any[]): any[] {
    const normalizedRows = Array.isArray(rows) ? [...rows] : [];
    const bookerId = this.customerDetails?.customerPersonID ?? this.data?.item?.primaryBookerID;
    const hasBooker = normalizedRows.some((row) => {
      const rowType = this.resolveRecipientType(row);
      const sameId = bookerId && row?.customerPersonID && Number(row.customerPersonID) === Number(bookerId);
      return rowType === 'Booker' || sameId;
    });

    if (hasBooker) {
      return normalizedRows;
    }

    const bookerName = this.pickText(
      this.customerDetails?.customerPersonName,
      this.data?.item?.bookerName,
      this.data?.item?.customerPerson?.customerPersonName
    );
    const bookerMobile = this.pickText(
      this.customerDetails?.primaryMobile,
      this.data?.item?.bookerMobile,
      this.data?.item?.customerPerson?.primaryMobile
    );
    const bookerEmail = this.pickText(
      this.customerDetails?.primaryEmail,
      this.data?.item?.bookerEmail,
      this.data?.item?.customerPerson?.primaryEmail
    );

    if (!bookerName && !bookerMobile && !bookerEmail) {
      return normalizedRows;
    }

    normalizedRows.push({
      customerPersonName: bookerName || 'Booker',
      primaryMobile: bookerMobile || '',
      primaryEmail: bookerEmail || '',
      customerPersonID: bookerId || 0,
      isBooker: true,
      isPassenger: false,
      reachedSMSToBooker: true,
      reachedSMSToPassenger: false,
      sendSMSWhatsApp: true,
      type: 'Booker'
    });

    return normalizedRows;
  }

  saveData() {
    const dialogRef = this.dialog.open(AddPeopleComponent, {
      width: '500px',
      data: {
        ReservationID: this.ReservationID
        // advanceTable: filtered
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result?.length) {
        return;
      }
      const newRows: any[] = [];
      const existing = Array.isArray(this.permissionData) ? this.permissionData : [];
      result.forEach((element) => {
        if (element.customerPersonName?.customer) {
          const mobileParts = element.primaryMobile.split('-');
          const emailParts = element.primaryEmail.split('-');
          const nameParts = element.customerPersonName.customer.split('-');
          const id = element.customerPersonID;
          const permissionRow = element.data?.[0];
          const bookerParts = permissionRow?.reachedSMSToBooker;
          const passengerParts = permissionRow?.reachedSMSToPassenger;
          const sendSMSWhatsAppParts = permissionRow?.sendSMSWhatsApp;
          const number = mobileParts[0];
          const email = emailParts[0];
          const name = nameParts[1];
          newRows.push({
            primaryMobile: '91-' + number,
            primaryEmail: email,
            customerPersonName: name,
            customerPersonID: id,
            isBooker: element.isBooker,
            reachedSMSToBooker: bookerParts,
            reachedSMSToPassenger: passengerParts,
            sendSMSWhatsApp: sendSMSWhatsAppParts,
            isPassenger: element.isPassenger,
            type: this.resolveRecipientType(element)
          });
        } else if (element.customerPersonName?.employee) {
          const mobileParts = element.primaryMobile.split('-');
          const emailParts = element.primaryEmail.split('-');
          const nameParts = element.customerPersonName.employee.split('-');
          const number = mobileParts[0];
          const email = emailParts[0];
          const id = element.employeeID;
          const name = nameParts[1];
          newRows.push({
            primaryMobile: '91-' + number,
            primaryEmail: email,
            customerPersonName: name,
            employeeID:id,
            reachedSMSToBooker: true,
            reachedSMSToPassenger: true,
            sendSMSWhatsApp: true,
            type: this.resolveRecipientType(element)
          });
        } else if (element.type === 'number') {
          const code = (element.countryCode || '91')
            .toString()
            .replace(/^\+/, '')
            .trim();
          const number = (element.primaryMobile || '').toString().trim();
          const email = (element.primaryEmail || '').toString().trim();
          const name = (element.customerPersonName || '').toString().trim();
          if (!number) {
            return;
          }
          newRows.push({
            primaryMobile: code + '-' + number,
            primaryEmail: email,
            customerPersonName: name || number,
            reachedSMSToBooker: true,
            reachedSMSToPassenger: true,
            sendSMSWhatsApp: true,
            type: this.resolveRecipientType(element)
          });
        }
      });

      if (newRows.length > 0) {
        this.permissionData = [...existing, ...newRows];
        this.showNoRecordsFoundMessage = false;
        this.cdr.detectChanges();
        this.table?.renderRows();
      }
    });
  }

  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.loadData();
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  AddressChange(address: Address) {
    this.addressString = address.formatted_address;
    this.advanceTableForm.patchValue({
      locationOutAddressString: this.addressString
    });
    this.advanceTableForm.patchValue({
      locationOutLatitude: address.geometry.location.lat()
    });
    this.advanceTableForm.patchValue({
      locationOutLongitude: address.geometry.location.lng()
    });
  }

  submit() {
  }
  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();
    } else if (this.action === 'edit') {
      this.dialogRef.close();
    }
  }

  copyPopupData(): void {
    const formatted = [
      `Booking No: ${this.ReservationID ? this.ReservationID : 'N/A'}`,
      `City: ${this.city ? this.city : 'N/A'}`,
      `Date: ${this.pickupDate ? formatDate(this.pickupDate, 'dd-MMM-yy', 'en-GB') : 'N/A'}`,
      `Car No: ${this.registrationNumber ? this.registrationNumber : 'N/A'}`,
      `Time: ${this.pickupTime ? formatDate(this.pickupTime, 'h:mm a', 'en-GB') : 'N/A'}`,
      `Car Send: ${this.vehicle ? this.vehicle : 'N/A'}`,
      `Driver Name: ${this.driverName ? this.driverName : 'N/A'}`,
      `Driver Mobile No: ${this.driverPhone ? this.driverPhone : 'N/A'}`
    ].join('\n');

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(formatted)
        .then(() => {
          this.showNotification(
            'snackbar-success',
            'Popup details copied.',
            'bottom',
            'center'
          );
        })
        .catch(() => this.copyUsingTextareaFallback(formatted));
      return;
    }

    this.copyUsingTextareaFallback(formatted);
  }

  private copyUsingTextareaFallback(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
      this.showNotification(
        'snackbar-success',
        'Popup details copied.',
        'bottom',
        'center'
      );
    } catch {
      this.showNotification(
        'snackbar-danger',
        'Failed to copy popup details.',
        'bottom',
        'center'
      );
    } finally {
      document.body.removeChild(textarea);
    }
  }
  reset() {
    this.advanceTableForm.reset();
  }
  public Post(): void {
    this.advanceTableService.add(this.advanceTableForm.getRawValue()).subscribe(
      (response) => {
        this.dialogRef.close();
        this._generalService.sendUpdate(
          'SendSmsWhatsappMailCreate:SendSmsWhatsappMailView:Success'
        ); //To Send Updates
      },
      (error) => {
        this._generalService.sendUpdate(
          'SendSmsWhatsappMailAll:SendSmsWhatsappMailView:Failure'
        ); //To Send Updates
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
  public Put(): void {
    this.advanceTableForm.patchValue({
      locationOutLatLong:
        this.advanceTableForm.value.locationOutLatitude +
        ',' +
        this.advanceTableForm.value.locationOutLongitude
    });
    this.advanceTableService
      .update(this.advanceTableForm.getRawValue())
      .subscribe(
        (response) => {
          this.dialogRef.close();
          this._generalService.sendUpdate(
            'SendSmsWhatsappMailUpdate:SendSmsWhatsappMailView:Success'
          ); //To Send Updates
          this.showNotification(
            'snackbar-success',
            'SendSmsWhatsappMail Updated...!!!',
            'bottom',
            'center'
          );
        },
        (error) => {
          this._generalService.sendUpdate(
            'SendSmsWhatsappMailAll:SendSmsWhatsappMailView:Failure'
          ); //To Send Updates
        }
      );
  }
  public confirmAdd(): void {
    if (this.action == 'edit') {
      this.Put();
    } else {
      this.Post();
    }
  }

  sendNotification() {
    const apiRequestData = [];
    const skippedEmailRecipients: string[] = [];
    const skippedMobileRecipients: string[] = [];
    this.permissionData?.forEach((element) => {
      const rawEmail = (element.primaryEmail ?? '').toString().trim();
      const email = isValidEmail(rawEmail) ? rawEmail : '';
      const mobile = normalizeMobileForMessaging(element?.primaryMobile);
      const displayName =
        (element.customerPersonName ?? element.primaryMobile ?? '').toString().trim();
      if (rawEmail && !email) {
        skippedEmailRecipients.push(displayName || 'recipient');
      }
      if (element.sendSMSWhatsApp !== false && !mobile) {
        skippedMobileRecipients.push(displayName || 'recipient');
      }
      const recipientType = this.resolveRecipientType(element);
      const allowCustomerNotifications =
        element.reachedSMSToBooker === true ||
        element.reachedSMSToPassenger === true;
      const canSendSmsWhatsApp = element.sendSMSWhatsApp !== false && !!mobile;

      // Name is the recipient (for logs/skips). API uses reservation passenger in body for Booker / Not Registered.
      apiRequestData.push({
        ID: element?.employeeID ?? element?.customerPersonID ?? element?.numberMobileID ?? 0,
        AllotmentID: element?.allotmentID || 0,
        Name: displayName,
        Mobile: mobile ?? '',
        Email: email,
        Type: recipientType,
        IsCustomerNotificationsAllowed: allowCustomerNotifications,
        IsCustomerPersonNotificationsAllowed: canSendSmsWhatsApp,
        SendSMSWhatsApp: canSendSmsWhatsApp
      });
    });
    if (skippedEmailRecipients.length > 0) {
      this.snackBar.open(
        `Email skipped (no address): ${skippedEmailRecipients.join(', ')}. SMS/WhatsApp will still be sent.`,
        'OK',
        { duration: 4500 }
      );
    }
    if (skippedMobileRecipients.length > 0) {
      this.snackBar.open(
        `SMS/WhatsApp skipped (invalid mobile): ${skippedMobileRecipients.join(', ')}.`,
        'OK',
        { duration: 4500 }
      );
    }
    this.notificationloadData(this.ReservationID, apiRequestData, this.pickupDate);
  }

  notificationloadData(ReservationID, additionalData: any,pickDate:any) {
    this.sendSmsWhatsappMailService
      .getTableNotificationData(ReservationID, additionalData,pickDate)
      .subscribe(
        (data: any) => {
          this.dialogRef.close();
          const normalizedMessage = this.normalizeNotificationResponse(data);
          const lowerMessage = normalizedMessage.toLowerCase();
          if (lowerMessage === 'ok' || lowerMessage.startsWith('ok warnings:')) {
            if (lowerMessage.startsWith('ok warnings:')) {
              this.snackBar.open(normalizedMessage, 'OK', { duration: 6000 });
            }
            this.showNotification(
              'snackbar-success',
              'Sent SMS And Email...!!!',
              'bottom',
              'center'
            );
          } 
          else if (normalizedMessage.toLowerCase() === 'do not send notification') 
          {
            Swal.fire({
                      title: '',
                      icon: 'warning',
                      html: `<b>You cannot send a notification for a booking date earlier than today.</b>`
                    })
                    return false;
          }  
          else {
            this.showNotification(
              'snackbar-danger',
              normalizedMessage
                ? `Failed to send SMS and Email... ${normalizedMessage}`
                : 'Failed to send SMS and Email...!!!',
              'bottom',
              'center'
            );
          }
        },
        (error: HttpErrorResponse) => {
          const apiMessage =
            this.normalizeNotificationResponse(error?.error) ||
            error?.message ||
            'Failed to send SMS and Email...!!!';
          this.showNotification(
            'snackbar-danger',
            `Failed to send SMS and Email... ${apiMessage}`,
            'bottom',
            'center'
          );
        }
      );
  }

  private normalizeNotificationResponse(response: any): string {
    if (response == null || response === undefined) {
      return '';
    }
    if (typeof response === 'string') {
      return response.replace(/^"+|"+$/g, '').trim();
    }
    if (typeof response === 'object') {
      if (typeof response.message === 'string') {
        return response.message.replace(/^"+|"+$/g, '').trim();
      }
      if (typeof response.result === 'string') {
        return response.result.replace(/^"+|"+$/g, '').trim();
      }
    }
    return String(response).replace(/^"+|"+$/g, '').trim();
  }

  // deleteRecord(row: any) {
  //   const recordIndex = this.dataSource.findIndex((object) => object.primaryMobile === row.primaryMobile);
  //   // this.dataSource.pop(recordIndex);
  //   this.dataSource.splice(recordIndex,1);
  //   this.table.renderRows();
  // }

  deleteRecord(row: any) {
    const recordIndex = this.permissionData.findIndex(
      (object) => object.primaryMobile === row.primaryMobile
    );
    this.permissionData.splice(recordIndex, 1);
    this.table.renderRows();
    if (this.permissionData.length === 0) {
      this.showNoRecordsFoundMessage = true;
    }
  }
}



