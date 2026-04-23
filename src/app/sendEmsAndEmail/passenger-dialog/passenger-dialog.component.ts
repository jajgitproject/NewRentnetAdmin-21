// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { Address } from '@compat/google-places-shim-objects/address';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import moment from 'moment';
import { GeneralService } from 'src/app/general/general.service';
import { SendEmsAndEmail } from '../sendEmsAndEmail.model';
//import { passengerMobileDataDialogComponent } from '../../passenger-Mobile-and-email/passenger-Mobile-and-email.component';

@Component({
  standalone: false,
    selector: 'app-ems-email-passenger-dialog',
    templateUrl: './passenger-dialog.component.html',
    styleUrls: ['./passenger-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogPassengerEmsComponent   {
  
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: any;
  //address: string;
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  
  addressString: string;
  public EmployeeList?: EmployeeDropDown[] = [];

  dataSource: SendEmsAndEmail[] | null;
  previousData: SendEmsAndEmail[];
  dispatchCurrentData: SendEmsAndEmail[];
  dispatchNextData: SendEmsAndEmail[];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
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
  formsData: any;
  mobileNumber: string;
  email: string;
  formDataArray = [];
  constructor(
    public dialogRef: MatDialogRef<FormDialogPassengerEmsComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
    // public advanceTableService: SendEmsAndEmailService,
    // public sendEmsAndEmailService: SendEmsAndEmailService,
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;
  
    this.advanceTableForm = this.formBuilder.group({
      primarymobile: ['', Validators.required],
      primaryEmail: ['', Validators.required]
    });

    this.advanceTable = data.advanceTable;

    this.advanceTable = new SendEmsAndEmail({});
    //this.advanceTable.activationStatus=true;
      
    this.formsData = data;
    
    this.ReservationID = data.reservationID;
    this.vehicle = data.vehicle;
    this.pickupDate =data.pickupDate;
    this.pickupTime =data.pickupTime
    this.registrationNumber = data.registrationNumber;
    this.customerPersonName =data.customerPersonName;
    this.city=data.city;
    this.advanceTableForm = this.createContactForm();
      
  }
  saveData() {
    if (this.advanceTableForm.valid) {
      const mobile = this.advanceTableForm.get('primarymobile').value;
      const email = this.advanceTableForm.get('primaryEmail').value;
      this.formDataArray.push({
        mobile: mobile,
        email: email
      });
      this.dialogRef.close(this.formDataArray);
    }
  }

  createContactForm(): FormGroup {
    return this.fb.group({
      primaryEmail: [this.formsData?.customerEmail],
      primarymobile: [this.formsData?.customerMobile],
    });
  }

  ngOnInit() {
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  AddressChange(address: Address) {
    this.addressString = address.formatted_address
    this.advanceTableForm.patchValue({ locationOutAddressString: this.addressString });
    this.advanceTableForm.patchValue({ locationOutLatitude: address.geometry.location.lat() });
    this.advanceTableForm.patchValue({ locationOutLongitude: address.geometry.location.lng() });
  }

  submit() {
  }
  onNoClick(): void {
    if (this.action === 'add') {
      this.advanceTableForm.reset();

    }
    else if (this.action === 'edit') {
      this.dialogRef.close();
    }
  }
  reset() {
    this.advanceTableForm.reset();
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



