// @ts-nocheck
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { SendEmsAndEmailService } from '../../sendEmsAndEmail.service';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import {
  ConfigurationMessaging,
  SendEmsAndEmail
} from '../../sendEmsAndEmail.model';
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
export class FormDialogSendEmsComponent {
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
  permissionData: ConfigurationMessaging[] | any;
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
  previousData: SendEmsAndEmail[];
  dispatchCurrentData: SendEmsAndEmail[];
  dispatchNextData: SendEmsAndEmail[];
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
    public dialogRef: MatDialogRef<FormDialogSendEmsComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: SendEmsAndEmailService,
    public sendEmsAndEmailService: SendEmsAndEmailService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public _generalService: GeneralService
  ) {
    // Set the defaults
    this.action = data.action;

    // this.advanceTable = data.advanceTable;

    this.advanceTable = new SendEmsAndEmail({});
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
        this.permissionData = data;
      },
      (error: HttpErrorResponse) => {
        this.permissionData = null;
      }
    );
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
            type: element.type
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
            type: element.type
          });
        } else if (element.customerPersonName.numberMobile) {
          const mobileParts = element.primaryMobile.split('-');
          const emailParts = element.primaryEmail.split('-');
          const name = element.customerPersonName.name;
          const number = mobileParts[0];
          const email = emailParts[0];
          this.permissionData.push({
            primaryMobile: '91-' + number,
            primaryEmail: email,
            customerPersonName: name,
            reachedSMSToBooker: true,
            reachedSMSToPassenger: true,
            sendSMSWhatsApp: true,
            type: element.type
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
          'SendEmsAndEmailCreate:SendEmsAndEmailView:Success'
        ); //To Send Updates
      },
      (error) => {
        this._generalService.sendUpdate(
          'SendEmsAndEmailAll:SendEmsAndEmailView:Failure'
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
            'SendEmsAndEmailUpdate:SendEmsAndEmailView:Success'
          ); //To Send Updates
          this.showNotification(
            'snackbar-success',
            'SendEmsAndEmail Updated...!!!',
            'bottom',
            'center'
          );
        },
        (error) => {
          this._generalService.sendUpdate(
            'SendEmsAndEmailAll:SendEmsAndEmailView:Failure'
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
    this.permissionData?.forEach((element) => {
      apiRequestData.push({
        //ID: parseInt(element.customerPersonID),
        // "EmployeeID": element?.employeeID || null,
        // "CustomerPersonID": element?.customerPersonID || null,
        // "NumberMobileID": null,
        ID: element?.employeeID ?? element?.customerPersonID ?? element?.numberMobileID ?? null,
        Name: element.customerPersonName.toString(),
        Mobile: element.primaryMobile.toString(),
        Email: element.primaryEmail.toString(),
        Type:
          (element.isPassenger && element.isBooker === true) ||
          element?.type?.toLowerCase() === 'customerPerson'
            ? 'Customer Person'
            : element?.type?.toLowerCase() === 'employee'
            ? 'Employee'
            : 'Not Registered',
        IsCustomerNotificationsAllowed:
          element.reachedSMSToBooker === true
            ? true
            : false || element.reachedSMSToPassenger === true
            ? true
            : false,
        IsCustomerPersonNotificationsAllowed:
          element.sendSMSWhatsApp === true ? true : true,
        SendSMSWhatsApp: element.sendSMSWhatsApp === true ? true : false
      });
    });
    this.notificationloadData(this.ReservationID, apiRequestData,this.pickupDate);
  }

  notificationloadData(ReservationID, additionalData: any,pickupDate:any) {
    this.sendEmsAndEmailService
      .getTableNotificationData(ReservationID, additionalData,pickupDate)
      .subscribe(
        (data: any) => {
          this.dialogRef.close();
          if (data === '"OK"') 
          {
            this.showNotification(
              'snackbar-success',
              'Sent SMS And Email...!!!',
              'bottom',
              'center'
            );
          } 
          else if (data === '"Do not send notification"' || data === 'Do not send notification') 
          {
            Swal.fire({
                        title: '',
                        icon: 'warning',
                        html: `<b>You cannot send a notification for a booking date earlier than today.</b>`,
                        customClass: {
                            container: 'swal2-popup-high-zindex'
                            }
                          })
                      return false;
          }          
          else {
            this.showNotification(
              'snackbar-danger',
              'Failed to send SMS and Email...!!!',
              'bottom',
              'center'
            );
          }
        },
      );
    return true;
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



