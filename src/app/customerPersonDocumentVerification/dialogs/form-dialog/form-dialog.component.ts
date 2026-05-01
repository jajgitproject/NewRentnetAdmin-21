// @ts-nocheck
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';
import { CustomerPersonDocumentVerificationService } from '../../customerPersonDocumentVerification.service';
import { FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { CustomerPersonDocumentVerification } from '../../customerPersonDocumentVerification.model';
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

export class FormDialogVerificationComponentHolder 
{
  employeeID:number;
  action: string;
  dialogTitle: string;
  searchTerm : FormControl = new FormControl();
  advanceTableForm: FormGroup;
  public EmployeeList?: EmployeeDropDown[] = [];
  public CityList?: CityDropDown[] = [];
  filteredOptions: Observable<CityDropDown[]>;
  saveDisabled :boolean= true;
  public DocumentList?: DocumentDropDown[] = [];
  image: any;
  advanceTable: CustomerPersonDocumentVerification;
  applicableFrom: any;
  applicableTo: any;
  customerName: any;
  CustomerID:any;
  addressCityID:any;
  customerPersonName: any;
  CustomerPersonID:any;
  customerPersonID: any;
 // DesginationList: import("f:/NewRentnetAdmin/NewRentnetAdmin/RentnetAdmin/src/app/general/designationDropDown.model").DesignationDropDown[];
  constructor(
    public documentVerification: MatDialog,
    public dialogRef: MatDialogRef<FormDialogVerificationComponentHolder>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public advanceTableService: CustomerPersonDocumentVerificationService,
    private fb: FormBuilder,
    public _generalService: GeneralService) {
    // Set the defaults
    this.action = data.action;

    this.dialogTitle = ' Document Verification';
    this.advanceTable = data.advanceTable;
    if (this.advanceTable.activationStatus === true) {
      this.advanceTable.status = "Active"
    }
    if (this.advanceTable.activationStatus === false) {
      this.advanceTable.status = "Deleted"
    }
    this.advanceTable.activationStatus = true;
    this.uploadedByName();
    this.advanceTable.documentVerifiedDate = new Date();
    this.advanceTableForm = this.createContactForm();
    this.customerPersonName = data.CustomerPersonName;
    this.customerPersonID = data.CustomerPersonID;


  }

  public ngOnInit(): void
  {
   
  }

  formControl = new FormControl('', 
  [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() 
  {
      return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  
  createContactForm(): FormGroup 
  {
    return this.fb.group(
    {
      customerPersonDocumentID: [this.advanceTable.customerPersonDocumentID],
      customerPersonID: [this.advanceTable.customerPersonID],
      documentName:[this.advanceTable.documentName],
      addressCity:[this.advanceTable.addressCity],
      documentNumber: [this.advanceTable.documentNumber],
      documentIssuingAuthority: [this.advanceTable.documentIssuingAuthority],
      documentImage: [this.advanceTable.documentImage,],
      documentImageNonAvailabilityReason: [this.advanceTable.documentImageNonAvailabilityReason,],
      addressCityID: [this.advanceTable.addressCityID],
      address: [this.advanceTable.address],
      pin: [this.advanceTable.pin],
      status:[this.advanceTable.status],
      documentVerified:[this.advanceTable.verified],
      documentVerifiedBy:[this.advanceTable.documentVerifiedBy],
      documentVerifiedRemark:[this.advanceTable.documentVerifiedRemark],
      documentVerifiedDate:[this.advanceTable.documentVerifiedDate],
      documentExpiry: [this.advanceTable.documentExpiry],
      activationStatus: [this.advanceTable.activationStatus],
    });
  }
  uploadedByName(){
    this._generalService.getEmployeeID(this._generalService.getUserID()).subscribe(
      data=>{
        this.EmployeeList=data;
        this.advanceTableForm.patchValue({uploadedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
        this.advanceTableForm.patchValue({documentVerifiedBy:this.EmployeeList[0].firstName+' '+this.EmployeeList[0].lastName});
      }
    );
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
    this.dialogRef.close();
  }

  public Put(): void
  {
    this.saveDisabled=false;
    
    this.advanceTableForm.patchValue({customerPersonID:this.advanceTable.customerPersonID});
    this.advanceTableService.update(this.advanceTableForm.getRawValue())  
    .subscribe(
    response => 
    {
        this.dialogRef.close();
       this._generalService.sendUpdate('CustomerPersonDocumentVerificationUpdate:CustomerPersonDocumentVerificationView:Success');//To Send Updates 
       this.saveDisabled = true;
       this.showNotification(
        'snackbar-success',
        'Customer Person Document Updated Successfully...!!!',
        'bottom',
        'center'
      );
    },
    error =>
    {
     this._generalService.sendUpdate('CustomerPersonDocumentVerificationAll:CustomerPersonDocumentVerificationView:Failure');//To Send Updates 
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
  MessageArray:string[]=[];
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
  
  public uploadFinished = (event) => 
  {
    this.response = event;
    this.ImagePath = this._generalService.getImageURL() + this.response.dbPath;
    this.advanceTableForm.patchValue({documentImage:this.ImagePath})
  }
 
}


