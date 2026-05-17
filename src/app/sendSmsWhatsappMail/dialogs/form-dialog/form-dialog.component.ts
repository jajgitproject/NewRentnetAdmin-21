// @ts-nocheck
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
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
  DriverName: any;
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
    this.registrationNumber = data.registrationNumber;
    this.customerPersonName = data.customerPersonName;
    this.city = data.city;
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

  public loadData() {
    this._generalService.GetPermission(this.ReservationID).subscribe(
      (data) => {
        this.permissionData = this.normalizePermissionRows(data);
      },
      (error: HttpErrorResponse) => {
        this.permissionData = null;
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
    const typeLower = (element?.type ?? '').toString().toLowerCase();
    if (typeLower === 'employee') {
      return 'Employee';
    }
    if (element?.isPassenger === true) {
      return 'Passenger';
    }
    if (element?.isBooker === true) {
      return 'Booker';
    }
    if (typeLower === 'booker') {
      return 'Booker';
    }
    if (typeLower === 'passenger') {
      return 'Passenger';
    }
    if (typeLower === 'number') {
      return 'Not Registered';
    }
    return 'Not Registered';
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
      result?.forEach((element) => {
        if (element.customerPersonName.customer) {
          const mobileParts = element.primaryMobile.split('-');
          const emailParts = element.primaryEmail.split('-');
          const nameParts = element.customerPersonName.customer.split('-');
          const id = element.customerPersonID;
          const bookerParts = element.data[0]?.reachedSMSToBooker;
          const passengerParts = element.data[0]?.reachedSMSToPassenger;
          const sendSMSWhatsAppParts = element.data[0]?.sendSMSWhatsApp;
          const number = mobileParts[0];
          const email = emailParts[0];
          const name = nameParts[1];
          this.permissionData?.push({
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
        } else if (element.customerPersonName.employee) {
          const mobileParts = element.primaryMobile.split('-');
          const emailParts = element.primaryEmail.split('-');
          const nameParts = element.customerPersonName.employee.split('-');
          const number = mobileParts[0];
          const email = emailParts[0];
          const id = element.employeeID;
          const name = nameParts[1];
          this.permissionData.push({
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
          this.permissionData.push({
            primaryMobile: code + '-' + number,
            primaryEmail: email,
            customerPersonName: name || number,
            reachedSMSToBooker: true,
            reachedSMSToPassenger: true,
            sendSMSWhatsApp: true,
            type: this.resolveRecipientType(element)
          });
        }
        this.table?.renderRows();
        if (this.permissionData?.length > 0) {
          this.showNoRecordsFoundMessage = false;
        }
      });
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
    this.permissionData?.forEach((element) => {
      const email = (element.primaryEmail ?? '').toString().trim();
      const displayName =
        (element.customerPersonName ?? element.primaryMobile ?? '').toString().trim();
      if (!email) {
        skippedEmailRecipients.push(displayName || 'recipient');
      }
      const recipientType = this.resolveRecipientType(element);

      apiRequestData.push({
        ID: element?.employeeID ?? element?.customerPersonID ?? element?.numberMobileID ?? null,
        AllotmentID: element?.allotmentID || 0,
        Name: displayName,
        Mobile: element.primaryMobile.toString(),
        Email: email,
        Type: recipientType,
        IsCustomerNotificationsAllowed:
          element.reachedSMSToBooker === true ||
          element.reachedSMSToPassenger === true,
        IsCustomerPersonNotificationsAllowed: element.sendSMSWhatsApp !== false,
        SendSMSWhatsApp: element.sendSMSWhatsApp !== false
      });
    });
    if (skippedEmailRecipients.length > 0) {
      this.snackBar.open(
        `Email skipped (no address): ${skippedEmailRecipients.join(', ')}. SMS/WhatsApp will still be sent.`,
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
          if (normalizedMessage.toLowerCase() === 'ok') {
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



