// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { DispatchFetchDataService } from '../../dispatchFetchData.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DispatchFetchData } from '../../dispatchFetchData.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { DispatchFetchDataDropDown } from '../../dispatchFetchDataDropDown.model';
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizationalEntityDropDown } from 'src/app/organizationalEntityMessage/organizationalEntityDropDown.model';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';


@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogFetchComponent {
  displayedColumns = [
    'pickupAddressString',
    'pickupKM',
    'pickupLatitude',
    'pickupLongitude',
    'select'
  ];
  showError: string;
  action: string;
  dialogTitle: string;
  advanceTableForm: FormGroup;
  advanceTable: DispatchFetchData;
  //address: string;
  options: any = {
    componentRestrictions: { country: 'IN' }
  }
  addressString: string;
  public EmployeeList?: EmployeeDropDown[] = [];
  public dispatchList?: DispatchFetchDataDropDown[] = [];
  dataSource: DispatchFetchData[] | null;
  previousData: DispatchFetchData[];
  dispatchCurrentData: DispatchFetchData[];
  dispatchNextData: DispatchFetchData[];
  public OrganizationalEntitiesList?: OrganizationalEntityDropDown[] = [];
  filteredOrganizationalEntityOptions: Observable<OrganizationalEntityDropDown[]>;
  //public dispatchFetchDataService: DispatchFetchDataService
  DriverName: any;
  RegistrationNumber: any;
  AllotmentID: any;
  ReservationID: any;
  LocationOutEntryExecutiveID: any;
  locationOutLocationOrHubID: any;
  pickupDate: string;
  pickupTime: string;
  constructor(
    public dialogRef: MatDialogRef<FormDialogFetchComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any,
    public advanceTableService: DispatchFetchDataService,
    public dispatchFetchDataService: DispatchFetchDataService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;


    this.advanceTable = data.advanceTable;

    this.advanceTable = new DispatchFetchData({});
    //this.advanceTable.activationStatus=true;

    this.advanceTableForm = this.createContactForm();

    this.ReservationID = data.reservationID;
    this.AllotmentID = data.allotmentID;
    this.RegistrationNumber = data.registrationNumber;
    this.DriverName = data.driverName;

  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        pickupDate: [this.advanceTable.pickupDate],
        pickupTime: [this.advanceTable.pickupTime],


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

  locationTimeSet(event) {
    if (this.action === 'edit') {
      let time = this.advanceTableForm.value.pickupTime;
      let minutes = 90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({ locationOutTime: newDate });
    }
    else {
      let time = event.getTime();
      let minutes = 90;
      let millisecondsToSubtract = minutes * 60 * 1000;
      let newDate = new Date(time - millisecondsToSubtract);
      this.advanceTableForm.patchValue({ locationOutTime: newDate });
    }
  }
  fetchData() {
    var pickupDate = moment(this.advanceTableForm.value.pickupDate).format('yyyy-MM-DD');
    var pickupTime = moment(this.advanceTableForm.value.pickupTime).format('HH:mm');
    this.dispatchFetchDataService.getDispatchCurrentData(pickupDate, pickupTime).subscribe
      (
        (data: DispatchFetchData[]) => {
          this.dispatchCurrentData = data;
          console.log(this.dispatchCurrentData);
        },
        (error: HttpErrorResponse) => { this.dispatchCurrentData = null; }
      );

    this.dispatchFetchDataService.GetDispatchPreviousData(pickupDate, pickupTime).subscribe
      (
        (data: DispatchFetchData[]) => {
          this.previousData = data;
          console.log(this.previousData);
        },
        (error: HttpErrorResponse) => { this.previousData = null; }
      );

    this.dispatchFetchDataService.GetNextDispatchData(pickupDate, pickupTime).subscribe
      (
        (data: DispatchFetchData[]) => {
          this.dispatchNextData = data;
          console.log(this.dispatchNextData);
        },
        (error: HttpErrorResponse) => { this.dispatchNextData = null; }
      );

  }




  onCurrent(item: any) {
    console.log(this.dispatchCurrentData[item])
    this.dialogRef.close({ data: this.dispatchCurrentData[item] });
  }

  onPrevious(item: any) {
    console.log(this.previousData[item])
    this.dialogRef.close({ data: this.previousData[item] });
  }

  onNext(item: any) {
    console.log(this.dispatchNextData[item])
    this.dialogRef.close({ data: this.dispatchNextData[item] });
  }




  //   public fetchData() 
  //   {
  //     var pickupDate = moment(this.advanceTableForm.value.pickupDate).format('yyyy-MM-DD');
  //     var pickupTime = moment(this.advanceTableForm.value.pickupTime).format('HH:mm:ss');
  //      this.dispatchFetchDataService.getDispatchFetchData(pickupDate,pickupTime).subscribe
  //      (
  //        data =>   
  //        {
  //         console.log(data);
  //          this.dataSource = data;
  //          console.log(this.dataSource)


  //        },
  //        (error: HttpErrorResponse) => { this.dataSource = null;}
  //      );
  //  }
  submit() {
    console.log(this.advanceTableForm.value);
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
  public Post(): void {

    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {


          this.dialogRef.close();
          this._generalService.sendUpdate('DispatchFetchDataCreate:DispatchFetchDataView:Success');//To Send Updates  

        },
        error => {
          this._generalService.sendUpdate('DispatchFetchDataAll:DispatchFetchDataView:Failure');//To Send Updates  
        }
      )
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
      locationOutLatLong: this.advanceTableForm.value.locationOutLatitude
        +
        ',' +
        this.advanceTableForm.value.locationOutLongitude
    });
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {


          this.dialogRef.close();
          this._generalService.sendUpdate('DispatchFetchDataUpdate:DispatchFetchDataView:Success');//To Send Updates  
          this.showNotification(
            'snackbar-success',
            'DispatchFetchData Updated...!!!',
            'bottom',
            'center'
          );
        },
        error => {
          this._generalService.sendUpdate('DispatchFetchDataAll:DispatchFetchDataView:Failure');//To Send Updates  
        }
      )
  }
  public confirmAdd(): void {
    if (this.action == "edit") {
      this.Put();
    }
    else {
      this.Post();
    }
  }
}



