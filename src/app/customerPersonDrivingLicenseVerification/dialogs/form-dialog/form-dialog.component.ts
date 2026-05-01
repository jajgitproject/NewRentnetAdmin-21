// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { CustomerPersonDrivingLicenseVerificationService } from '../../customerPersonDrivingLicenseVerification.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomerPersonDrivingLicenseVerification } from '../../customerPersonDrivingLicenseVerification.model';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { GeneralService } from '../../../general/general.service';
//import { EmployeeDropDown } from 'src/app/general/IEmployees';
import { OrganizationalEntityDropDown } from 'src/app/general/organizationalEntityDropDown.model';
import { DepartmentDropDown } from 'src/app/general/departmentDropDown.model';
import { DesignationDropDown } from 'src/app/general/designationDropDown.model';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeDropDown } from 'src/app/employee/employeeDropDown.model';
import { VehicleDropDown } from 'src/app/vehicle/vehicleDropDown.model';
import { CityDropDown } from 'src/app/city/cityDropDown.model';
import { StateDropDown } from 'src/app/state/stateDropDown.model';
import { map, startWith } from 'rxjs/operators';
import { DocumentDropDown } from 'src/app/document/documentDropDown.model';

@Component({
  standalone: false,
    selector: 'app-form-dialog',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.sass'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
  })

export class FormDialogComponentHolder {
  employeeID: number;
  action: string;
  dialogTitle: string;
  searchTerm: FormControl = new FormControl();
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  public CityList?: CityDropDown[] = [];
  filteredOptions: Observable<CityDropDown[]>;

  public DocumentList?: DocumentDropDown[] = [];
  image: any;
  advanceTable: CustomerPersonDrivingLicenseVerification;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerID: any;
  geoPointID: any;
  customerPersonName: any;
 saveDisabled:boolean = true;
  // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponentHolder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public advanceTableService: CustomerPersonDrivingLicenseVerificationService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    // Set the defaults

    this.dialogTitle = 'Driving License Verification';
    this.advanceTable = data.advanceTable;
    this.advanceTable.verificationDate=new Date();
    if (this.advanceTable.activationStatus === true) {
      this.advanceTable.status = "Active"
    }
    if (this.advanceTable.activationStatus === false) {
      this.advanceTable.status = "Deleted"
    }

    this.advanceTableForm = this.createContactForm();
    this.uploadedByName();
    
    this.customerPersonName = data.CustomerPersonName;
    this.CustomerID = data.CustomerID;

  }
  reset(): void {
    this.advanceTableForm.reset();
  }
  public ngOnInit(): void {

  }

  formControl = new FormControl('',
    [
      Validators.required
      // Validators.email,
    ]);

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  createContactForm(): FormGroup {
    return this.fb.group(
      {
        customerPersonDrivingLicenseID: [this.advanceTable.customerPersonDrivingLicenseID],
        verifiedByID: [this.advanceTable.verifiedByID],
        verificationRemark: [this.advanceTable.verificationRemark,],
        verificationDate: [this.advanceTable.verificationDate],
        licenseVerified: [this.advanceTable.verified],
        customerPersonID: [this.advanceTable.customerPersonID],
        customerPersonAddressCityID: [this.advanceTable.customerPersonAddressCityID],
        permanentAddress: [this.advanceTable.permanentAddress],
        drivingLicenseNo: [this.advanceTable.drivingLicenseNo],
        licenseImage: [this.advanceTable.licenseImage],
        reasonOfLicenseImageNonAvailblity: [this.advanceTable.reasonOfLicenseImageNonAvailblity],
        licenseIssueCityID: [this.advanceTable.licenseIssueCityID],
        licenseAuthorityName: [this.advanceTable.licenseAuthorityName],
        uploadedByID: [this.advanceTable.uploadedByID],
        uploadedBy: [this.advanceTable.uploadedBy],
        status: [this.advanceTable.status],
        uploadEditedDate: [this.advanceTable.uploadEditedDate],
        uploadRemark: [this.advanceTable.uploadRemark],
        activationStatus: [this.advanceTable.activationStatus],

        verifiedBy: [this.advanceTable.verifiedBy],
        addressCity: [this.advanceTable.addressCity],
        issuingCity: [this.advanceTable.issuingCity],

      });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  uploadedByName() {
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data => {
        this.EmployeeList = data;
        this.advanceTableForm.patchValue({ uploadedBy: this.EmployeeList[0].firstName + ' ' + this.EmployeeList[0].lastName });
        this.advanceTableForm.patchValue({ verifiedBy: this.EmployeeList[0].firstName + ' ' + this.EmployeeList[0].lastName });
      }
    );
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public Post(): void {
    this.saveDisabled=false;
    this.advanceTableForm.patchValue({ customerPersonID: this.data.CustomerPersonID });
    this.advanceTableService.add(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();

          this._generalService.sendUpdate('CustomerPersonDrivingLicenseVerificationCreate:CustomerPersonDrivingLicenseVerificationView:Success');//To Send Updates
          this.saveDisabled = true;  
        },
        error => {
          this._generalService.sendUpdate('CustomerPersonDrivingLicenseVerificationAll:CustomerPersonDrivingLicenseVerificationView:Failure');//To Send Updates
          this.saveDisabled = true;  
        }
      )
  }
  public Put(): void {
    
    this.saveDisabled=false;
    //this.advanceTableForm.patchValue({customerPersonID:this.advanceTable.customerPersonID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())
      .subscribe(
        response => {
          this.dialogRef.close();
          this._generalService.sendUpdate('CustomerPersonDrivingLicenseVerificationUpdate:CustomerPersonDrivingLicenseVerificationView:Success');//To Send Updates 
          this.saveDisabled = true;
          this.showNotification(
            'snackbar-success',
            'Customer Person Driving License Updated Successfully...!!!',
            'bottom',
            'center'
          );
        },
        error => {
          this._generalService.sendUpdate('CustomerPersonDrivingLicenseVerificationAll:CustomerPersonDrivingLicenseVerificationView:Failure');//To Send Updates
          this.saveDisabled = true; 
          this.showNotification(
            'snackbar-danger',
            'Operation Failed.....!!!',
            'bottom',
            'center'
          ); 
        }
      )
  }
  messageReceived: string;
  MessageArray: string[] = [];
  private subscriptionName: Subscription; //important to create a subscription

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }

  /////////////////for Image Upload////////////////////////////
  public response: { dbPath: '' };
  public ImagePath: string = "";

  public uploadFinished = (event) => {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({ documentImage: this.ImagePath })
  }

}


